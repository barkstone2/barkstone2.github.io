---
created: 2024-05-06 17:25
updated: 2024-08-17 15:20
tags:
  - JPA
  - Hibernate
  - ORM
  - Auditing
---
기존에는 조작 방법을 몰라서 nativeQuery를 사용했는데, 이렇게 할 경우 엔티티를 반환받지 못한다는 문제가 있다. 심지어 엔티티 ID 값조차 알수가 없어 처리가 곤란한 순간이 많다.
이때 다음 방법을 사용하면 Auditing에 사용되는 날짜값을 조작할 수 있다.
```kotlin
@SpykBean  
lateinit var auditingHandler: AuditingHandler
fun test() {
	val manipulatedDate = LocalDateTime.of(2020, 12, 12, 12, 0)  
	auditingHandler.setDateTimeProvider { Optional.of(manipulatedDate) }
}
```
auditorAware도 setting 할 수 있기 때문에 작성자나 수정자도 조작할 수 있다.