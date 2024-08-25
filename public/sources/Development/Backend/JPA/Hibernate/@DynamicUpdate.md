---
created: 2024-05-19 14:57
updated: 2024-08-17 15:19
tags:
  - JPA
  - Hibernate
  - ORM
---
JPA에서 엔티티에 대한 변경이 발생하면 기본적으로 엔티티의 모든 컬럼값을 포함한 업데이트 쿼리를 질의한다.
예를 들어 아래와 같은 엔티티가 있다고 가정하자.
```java
@Entity
public class Person {
	@Column(name = "person_id")
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String firstname;
	private String lastname;
	private Int age;
	// ...
}
```

이때 아래와 같이 엔티티의 상태를 변경하고 트랜잭션을 커밋한다.
```java
Optional<Person> optionalPerson = personRepository.findById(1L);
Person person = optionalPerson.get();                            
person.setAge(50);
personRepository.save(person);
```

그럼 아래와 같이 전체 필드를 대상으로 업데이트 쿼리가 질의된다.
```
Hibernate: update person set age=?, firstname=?, lastname=? where person_id=?
```
# @DynamicUpdate 사용 시
@DynamicUpdate를 사용하면 실제 변경이 발생한 age 필드에 대해서만 업데이트 쿼리가 질의된다.
먼저 엔티티에 아래와 같이 애노테이션을 부여한다.
```java
@DynamicUpdate
@Entity
public class Person {
	//...
}
```

그 다음 아까와 같이 데이터를 변경하면 아래와 같이 쿼리가 질의된다.
```
Hibernate: update person set age=? where person_id=?
```

@DynamicUpdate는 Hibernate 스펙에서 제공하는 애노테이션이므로 다른 구현체를 사용할 때는 사용할 수 없다.
# @DynamicUpdate의 성능 영향
실제 변경된 컬럼에 대해서만 업데이트 쿼리를 질의하는 것이 성능상 더 효율적이라고 생각할 수 있다. 하지만 실제로는 그렇게 간단하지 않다.
기본적으로 JPA 사용 시에는 전체 컬럼에 대한 업데이트 쿼리를 질의하게 된다. 이때는 실제 변경된 컬럼이 어떤 컬럼인지에 관계없이 항상 동일한 PreparedStatement를 사용할 수 있으므로 SQL 구문을 캐시하고, 파라미터만 변경해서 사용할 수 있다.

또한 JPA에서 엔티티의 변경을 추적하는 과정도 더 복잡해진다. 기존에는 단순히 엔티티 전체에 대해 변경을 추적하면 됐지만, @DynamicUpdate를 사용할 경우 필드 별로 변경을 추적해야 한다.

물론 그렇다고 해서 @DynamicUpdate의 효용성이 없지는 않다.
## 테이블에 컬럼이 많거나 컬럼 크기가 클때
컬럼의 수와 크기에 대한 명확한 기준이 없기 때문에 성능 측정을 통해 @DynamicUpdate의 사용 여부를 결정해야 한다. 
## 테이블에 인덱스가 많을 때
인덱스가 걸려있는 컬럼은 변경이 발생하면 인덱스를 재정렬하게 되므로 인덱스가 많을수록 update 쿼리 성능이 떨어지게 된다.
다만 사용하는 DB에 따라 다르고 값이 변경되지 않으면 재정렬되지 않는 DB도 있으므로 주의가 필요하다.
## 개별 컬럼 변경이 동시에 일어날 때
아무런 잠금 정책이 없는 상태로 firstname, lastname, age를 각각 변경하는 API를 동시에 실행할 경우 먼저 실행된 변경이 누락될 수 있다.
이는 모든 컬럼을 동시에 변경하기 때문이며 이때 다이나믹 업데이트를 사용하면 문제가 해결된다.
잠금 정책을 적용해서 문제를 해결할 수도 있겠지만, 성능 저하를 고려하면 다이나믹 업데이트가 더 적절할 것 같긴하다.