---
created: 2024-08-29 08:30
updated: 2024-08-31 14:10
tags:
  - JPA
  - Hibernate
  - Spring/Data/JPA
---
Fetch Join은 하이버네이트 Query Language에서 제공하는 최적화 문법이다. 주로 N+1 문제 해결과 쿼리 최적화를 위해 사용된다. inner, outer 조인 모두에 사용할 수 있다.
- `join fetch`, 더 명확하게 `inner join fetch` 구문은 연관 관계 엔티티가 있는 베이스 엔티티만 반환한다.
- `left join fetch` 혹은 `left outer join fetch` 구문은 모든 베이스 엔티티를 연관 관계 엔티티와 함께 반환한다. 이때는 연관 관계 엔티티가 없는 베이스 엔티티도 조회된다.
# 사용 예시
아래는 `phones`라는 이름의 일대다 연관 관계를 가진 `Person` 엔티티에 `join fetch`를 적용한 코드다. 아래 쿼리를 통해 베이스 엔티티인 `Person`을 조회하면서 같은 쿼리 내에서 연관 관계 엔티티인 phones도 함께 조회한다.
```java
List<Person> persons = entityManager.createQuery(
	"select distinct pr " +
	"from Person pr " +
	"left join fetch pr.phones ",
	Person.class)
.getResultList();
```
이 예시에서는 휴대폰이 없는 사람도 조회하기 위해서 left outer join을 사용했다.
# 주의 사항
페치 조인은 단일 쿼리 내에서 여러번 사용될 수 있지만 다음과 같은 주의 사항을 숙지해야 한다.

> [!caution] 주의
> 아래 내용에 대한 해석이 명확하지 않아 오류가 있을 수 있다.
> [하이버네이트 문서](https://docs.jboss.org/hibernate/orm/6.1/userguide/html_single/Hibernate_User_Guide.html#hql-explicit-fetch-join)를 직접 확인하길 바란다.

- XToOne 관계에 대해서는 A->B->C 형태의 연속된 페치 조인, A->B, A->C 형태의 병렬적 페치 조인을 얼마든지 사용할 수 있으며 A->B 형태의 단일 페치 조인도 물론 사용할 수 있다.
- 하지만 여러 컬렉션이나 XToMany 관계에 대한 병렬적인 페치 조인은 데이터베이스에서 카테시안 곱을 발생시킬 수 있으며 이는 성능에 매우 악영향을 미칠 수 있다.

> [!tip] 카테시안 곱
> 두 테이블의 모든 데이터를 곱해서 결과를 생성하는 경우를 의미한다.
> A 테이블에 10개, B테이블에 3개의 데이터가 있다면 총 10 x 3 = 30개의 데이터가 반환된다.
## Alias 사용 자제하기
HQL에서 금지하지는 않지만 `join fetch` 구문에 제약 조건을 부여하는 것은 권장되지 않는다. 제약 조건을 부여하는 경우에는 조회된 컬렉션이 불완전해 질 수 있고, 이 때문에 데이터의 정합성이 훼손될 수 있다.
결론적으로 중첩된 페치 조인(A->B->C)에서 엔티티를 식별하기 위한 용도로만 alias를 부여하는 것이 좋다.

예를 들어 동일한 데이터를 연관 관계 엔티티에 대한 조건만 바꿔서 조회하는 경우에는 1차 캐시에 조회된 데이터가 사용돼 연관 관계 엔티티의 불완전 문제가 발생할 수 있다.
## 페이징 쿼리에서 사용이 힘들다
페치 조인은 대부분의 경우 페이징을 사용하는 쿼리에서 사용이 불가능하다.
하이버네이트 문서의 내용에 따르면 구체적으로 다음과 같은 경우에 페치 조인을 사용할 수 없다.
- 쿼리가 setFirstResult() 혹은 setMaxResults()를 사용해 실행되는 경우
- HQL 쿼리 내부에 limit이나 offset이 정의된 경우
- scroll(), stream() 메서드와 함께 사용한 경우

Spring Data JPA를 사용하는 경우에도 아래와 같이 setFristResult()와 setMaxResults()가 호출 되므로 페이징을 사용하는 쿼리에는 페치 조인을 사용해선 안 된다.
```java
// ParameterBinder
Query bindAndPrepare(Query query, QueryParameterSetter.QueryMetadata metadata, JpaParametersParameterAccessor accessor) {  
    this.bind(query, metadata, accessor);  
    if (this.useJpaForPaging && this.parameters.hasPageableParameter() && !accessor.getPageable().isUnpaged()) {  
	// query = Hibernate QuerySqmImpl
        query.setFirstResult(PageableUtils.getOffsetAsInteger(accessor.getPageable()));  
        query.setMaxResults(accessor.getPageable().getPageSize());  
        return query;  
    } else {  
        return query;  
    }  
}
```

> [!caution] Spring Data JPA 3.1.0 이후에서의 주의 사항
> Spring Data JPA 3.0.9 버전까지는 아래와 같이 페이징 쿼리에 페치 조인을 사용하는 경우 오류가 발생했다.
> ```java
> @Query("select m " +  
>         "from Member m " +  
>         "join fetch m.team")  
> Page<Member> membersWithFetchingAndPaging(Pageable pageable);
> 
> // Count query validation failed for method ...
> // query specified join fetching, but the owner of the fetched association was > not present in the select list ...
> ```
> 이 오류가 3.1.0 버전부터는 표시되지 않게 됐는데, 그렇다고 해서 페이징 쿼리에서 페치 조인을 사용할 수 있다는 의미는 아니므로 주의하자.
# 대안
페이징을 사용하는 쿼리나 여러 컬렉션에 대한 조인이 필요한 경우에는 하이버네이트 배치 페칭 기능을 사용해야 한다.
@BatchSize 애노테이션을 직접 사용하거나 default_batch_fetch_size를 설정해 기본으로 배치 페칭을 활성화할 수 있다.

배치 페칭도 N+1 문제를 해결할 수 있지만 베이스 엔티티 조회와 연관관계 엔티티 조회에 2번의 쿼리가 사용되므로 페치 조인을 사용할 수 있는 곳에는 페치 조인을 사용하는 것이 낫다.