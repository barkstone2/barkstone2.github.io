---
created: 2024-09-12 13:19
updated: 2024-09-12 16:47
tags:
  - JPA
  - Hibernate
  - Spring/Data/JPA
references:
  - https://docs.jboss.org/hibernate/orm/6.1/userguide/html_single/Hibernate_User_Guide.html#portability-dialectresolver
  - https://docs.spring.io/spring-boot/how-to/data-access.html#howto.data-access.jpa-properties
---
# Dialect란?
Dialect는 하이버네이트에서 특정 데이터베이스와 어떻게 통신해야 하는지를 캡슐화한 객체로 시퀀스 조회, SELECT 쿼리 생성 등의 방법을 정의하고 있다. 하이버네이트는 이를 통해 여러 데이터베이스에 대해 동작할 수 있게 된다.

대부분의 유명한 데이터베이스에 대한 Dialect는 하이버네이트가 기본으로 제공하며, 필요한 경우에는 직접 Dialect를 작성할 수도 있다.
# Dialect 자동 감지
하이버네이트 사용 시 Dialect는 사용자가 직접 지정할 수도 있지만 지정하지 않을 경우 하이버네이트가 자동으로 감지한다.
이때 `java.sql.Connection` 객체의 `DatabaseMetaData` 클래스를 통해 Dialect를 결정하게 된다.

구체적으로는 `org.hibernate.dialect.resolver.DialectResolver` 클래스의 `resolveDialect` 메서드에 `DatabaseMetaData` 정보를 넘겨 Dialect를 결정하게 된다.
버전에 따라 세부적인 사항은 다를 수 있지만 핵심적인 내용은 하이버네이트가 이해할 수 있는 메타 데이터가 전달된 경우, 이에 대응되는 Dialect를 반환하고, 적절한 Dialect를 결정하지 못하는 경우 null을 반환하게 된다.
null이 반환된 경우에는 다음 resolver에서 Dialect 결정을 이어서 진행하게 된다.

DialectResolver는 유저가 커스텀하고 등록할 수도 있다.
이를 통해 하이버네이트의 자동 감지에 손쉽게 통합이 가능하고, 커스텀 dialect를 사용하도록 구성할 수도 있다.
# Dialect 수동 설정
하이버네이트에서 Dialect를 지정하기 위해서는 `hibernate.dialect` 속성에 알맞은 값을 설정하면 된다.
지원되는 Dialect의 목록은 버전 별 [하이버네이트 공식문서](https://docs.jboss.org/hibernate/orm/6.1/userguide/html_single/Hibernate_User_Guide.html#database-dialect)에서 확인할 수 있다. 이 링크는 6.1버전에서 제공되는 Dialect 목록을 나타낸다.
## 스프링 부트 사용 시
스프링 부트를 사용하는 환경에서는 `hibernate.dialect` 대신 다른 방법을 사용해 Dialect를 지정할 수도 있다.
`spring.jpa.database`에 이넘 값을 사용해 Dialect를 지정하거나 `spring.jpa.database-platform`에 문자열로 Dialect를 지정할 수 있다.
이 설정들은 다른 JPA 프로바이더를 사용하는 경우에도 사용할 수 있다.

스프링 부트 사용 시 `hibernate.dialect` 설정을 사용하려면 `spring.jpa.properties.hibernate.dialect`에 설정값을 지정하면 된다.
\
하나 짚고 넘어가자면 스프링 부트는 Dialect 자동 감지와 관련해서 아무런 동작도 수행하지 않는다.
[스프링 부트 공식 문서](https://docs.spring.io/spring-boot/how-to/data-access.html#howto.data-access.jpa-properties)를 봐도 자동 감지는 JPA 프로바이더에 의해 수행된다는 내용을 확인할 수 있다.