---
created: 2024-08-27 13:10
updated: 2024-09-11 16:13
tags:
  - JPA
  - Hibernate
  - Spring/Data/JPA
references:
  - https://techblog.woowahan.com/2695/
---
`@OneToMany`와 같은 연관관계 엔티티를 동시에 수정하거나, 동시에 삽입하는 경우에는 쿼리가 여러번에 걸쳐 질의된다.
이는 Spring Data JPA의 saveAll() 메서드를 사용할 때도 동일하며, 인자로 넘어온 컬렉션을 순회하면서 각각의 엔티티에 대해 save()를 호출하는 방식을 사용한다.
```java
// SimpleJpaRepository#saveAll
@Transactional  
public <S extends T> List<S> saveAll(Iterable<S> entities) {  
    Assert.notNull(entities, "Entities must not be null");  
    List<S> result = new ArrayList();  
    Iterator var3 = entities.iterator();  
  
    while(var3.hasNext()) {  
        S entity = var3.next();  
        result.add(this.save(entity));  
    }  
  
    return result;  
}
```

이는 꽤나 비효율적이며 이를 개선하기 위해 하이버네이트에서 제공하는 JDBC 배치 기능을 사용할 수 있다.
# Hibernate JDBC Batch
하이버네이트의 JDBC배치 기능은 JDBC에서 제공하는 배치 기능을 활용한다.
우선 설정한 배치 개수에 도달할 때까지 `PreparedStatement.addBatch()`를 호출하여 실행할 쿼리를 추가한다. 설정한 배치 개수에 도달하면 `PreparedStatement.executeBatch()`를 통해 추가된 쿼리를 한 번에 DB로 전송한다.
여러개의 쿼리를 모아서 한 번에 처리하기 때문에 단건씩 처리할 때보다 DB와의 통신 횟수가 줄어들고, DB에서 락을 잡는 횟수도 줄어들게 된다.

하이버네이트 배치를 활성화하려면 아래의 설정을 활성화 하면 된다.
```properties
spring.jpa.properties.hibernate.jdbc.batch_size=20
```

이 설정은 하이버네이트 배치의 개수를 설정하는 것으로, 여기에 설정된 횟수만큼 배치 insert를 수행하게 된다. 

다만 하나 주의해야할 점이 있는데 AUTO_INCREMENT 키를 사용하는 경우에는 배치 insert가 수행되지 않는다. 이는 AUTO_INCREMENT 키를 사용하는 경우에는 배치 insert 시에 엔티티에 id 값을 할당하지 못하기 때문이다.

해당 설정이 활성화되면 saveAll() 메서드를 호출하더라도 호출된 쿼리들을 설정된 횟수만큼 모아서 batch insert 한다.
콘솔에 출력되는 로그에는 한 건씩 처리되는 것으로 보일 수 있다. 제대로 처리되는지 확인하기 위해서는 JDBC URL에 다음과 같은 파라미터를 추가하면 된다.
```yaml
jdbc:mysql://localhost:3306/database?rewriteBatchedStatements=true&profileSQL=true&logger=Slf4JLogger&maxQuerySizeToLog=999999
```

- `profileSQL=true` : Driver 에서 전송하는 쿼리를 출력합니다.
- `logger=Slf4JLogger` : Driver 에서 쿼리 출력시 사용할 로거를 설정합니다.
- `maxQuerySizeToLog=999999` : 출력할 쿼리 길이

하이버네이트 배치를 활성화한 경우에는 배치 삽입뿐만 아니라 업데이트 시에도 배치 업데이트를 수행한다.
이때는 이미 ID가 엔티티에 할당되어 있기 때문에 자동 증가 ID를 사용하더라도 배치 업데이트가 가능하다.
## `hibernate.jdbc.batch_versioned_data`
JPA에서 낙관적 잠금을 사용하는 경우에는 업데이트 시에 `@Version` 애노테이션이 선언된 필드의 값을 쿼리의 조건문에 추가 해야한다.
이 옵션을 true로 설정하면 한 번에 배치로 update를 실행한 후에 반환된 개수와 변경된 엔티티의 개수를 비교한다.

다만 해당 옵션을 사용했을 때 일부 드라이버에서 update 쿼리 실행 개수를 잘못 계산하는 경우가 있다. 이런 경우에는 해당 옵션을 반드시 false로 설정해야 한다.
해당 옵션이 비활성화된 경우에는 update를 한 건씩 실행한 후 반환된 결과값이 0이 아닌지를 한 건씩 비교하게 된다.
즉, 업데이트 쿼리가 변경된 엔티티의 개수만큼 실행된다.

하이버네이트 5버전 부터는 이 옵션의 기본값이 true이므로 필요한 경우에 명시적으로 false로 변경해야 한다.
## `hibernate.order_inserts`
이 속성은 엔티티에 대한 삽입 작업 시 배치 작업의 순서를 정렬시킨다. 기본값은 false이며 일대다 엔티티에 대한 배치 삽입을 활성화하려면 해당 속성을 true로 설정해야 한다.

하이버네이트는 insert/update/delete와 같은 엔티티 변경 작업을 실행할 때 ActionQueue라는 곳에 변경 작업을 추가해두고, flush() 호출 시 ActionQueue에 추가되어 있는 작업들을 순차적으로 실행한다.
이 속성이 false일 때는 ActionQueue 내부의 작업들을 따로 정렬하지 않기 때문에, ActionQueue에 추가된 순서대로 배치 작업이 번갈아가면서 호출된다.

이는 하이버네이트가 배치 작업을 처리할 때 BatchKey 단위로 수행하기 때문인데, BatchKey는 엔티티의 이름을 입력받아 생성하게 된다. 이전과 다른 BatchKey가 입력되면 이전 BatchKey에 대해 PreparedStatement에 추가해둔 쿼리들을 실행하게 된다.

하지만 이 속성을 true로 설정한다면 ActionQueue 내부에 추가된 삽입 작업들을 먼저 엔티티 별로 정렬하고, 정렬된 순서대로 삽입 작업을 호출하기 때문에 이런 동작을 방지할 수 있다.
## `hibernate.order_updates`
이 속성 역시 기본값은 false로 설정되어 있다. 앞선 속성과 유사하지만 변경 작업 시의 배치 작업 순서를 정렬한다는 차이를 가진다.
이 속성을 사용하지 않으면 이전 속성과 동일하게 ActionQueue에 담긴 변경 작업이 순차적으로 실행된다.
지연 로딩을 사용하는 경우에는 자식 엔티티들이 나중에 조회되고 변경되므로 제대로 된 순서로 처리되는 것처럼 보일 수 있지만, 페치 조인을 사용하는 경우에는 예상치 못하게 동작할 수 있다.

마찬가지로 이 속성을 활성화하면 엔티티 별로 정렬하고 작업을 처리하므로 잘못된 동작을 방지할 수 있다.
변경 작업에는 UPDATE 쿼리뿐만 아니라 DELETE 쿼리도 포함되며, DELETE 쿼리도 배치 처리된다.
## 실제 성능 향상이 있을까?
이론적으로 생각했을 때 여러 건에 나눠서 처리되던 쿼리가 한 건으로 감소한 만큼 오버헤드도 감소할 것이라고 예측할 수 있다.
하지만 실제로 어느 정도의 성능 향상이 있을까?

아래는 개인 프로젝트에서 하이버네이트 배치를 도입하는 과정에서 테스트를 수행한 결과다.
초당 200개의 스레드, 총 1000개의 스레드로 10번 씩 반복해서 테스트를 수행했으며 각 요청은 고유한 엔티티에 대해 요청하도록 구성했다. 각 요청은 10개씩의 연관관계 엔티티를 삭제하고 다시 삽입하게 된다.
![[hibernate performance.png]]

결과적으로 약 10% 정도의 초당 처리량 향상을 확인할 수 있으며 꽤나 유의미한 수준의 성능 향상이라고 생각한다.
다만 하이버네이트 배치를 사용했을 때의 트레이드 오프도 있다고 생각한다. 예를 들어 배치 처리를 위해 쿼리를 저장하는 과정에서 메모리 사용량이 늘어날 수 있고, 여러 레코드에 대한 변경 작업을 한 번에 처리하는 과정에서 여러 레코드에 동시에 락이 걸릴 수 있다.
따라서 하이버네이트 배치를 도입하기 전, 도입하려는 목적과 데이터의 사용 패턴, 트레이드 오프 등을 잘 고려해서 선택할 필요가 있어 보인다.
# 스프링 부트에서의 설정
스프링 부트를 사용할 때는 `spring.jap.properties.hibernate.*`에 각 속성을 정의하면 된다. 