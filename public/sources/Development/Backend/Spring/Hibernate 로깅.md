---
created: 2024-08-19 09:32
updated: 2024-08-19 09:47
tags:
  - Spring
  - JPA
  - Hibernate
  - Spring/Data
---
# 쿼리 로그 출력
```yaml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        format_sql: true
```
- 각각의 역할에 대해 정리

# 통계 로그 출력
```yaml
spring:  
  jpa:  
    properties:  
      hibernate:  
        generate_statistics: true
```
- 어떤 값들이 출력되는 지 정리
# 쿼리 파라미터 로깅
```yaml
logging:  
	level:  
		// before Hibernate 6.0
		org.hibernate.type.descriptor.sql: trace
		// from Hibernate 6.0
		org.hibernate.orm.jdbc.bind: trace
```
Hibernate 6.0 이전 버전을 사용하는 경우 `org.hibernate.type.descriptor.sql` 패키지의 로그 레벨을 trace로 설정하면 바인딩된 쿼리 파라미터 로그를 출력할 수 있다.
Hibernate 6.0 버전부터는 `org.hibernate.orm.jdbc.bind` 패키지에 대한 로그 레벨을 trace로 설정하면 된다.