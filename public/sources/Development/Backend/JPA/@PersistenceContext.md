---
created: 2024-05-19 13:55
updated: 2024-08-17 15:19
tags:
  - JPA
  - Hibernate
  - ORM
---
`@PersistenceContext`는 `jakarta.persistence` 패키지에서 제공되는 애노테이션으로 Hibernate 구현체에서 영속성 컨텍스트를 주입하는 용도로 사용되는 애노테이션이다.
당연하지만 컨테이너 기반의 애플리케이션에서만 해당 애노테이션에 대한 주입이 지원되며, 세부 사항은 컨테이너 프레임워크에 따라 다르다.
스프링 프레임워크 역시 해당 애노테이션에 대해 지원하고 있다. 하지만 스프링 프레임워크에서는 해당 애노테이션을 사용하지 않고 스프링 프레임워크의 빈 주입 방법을 사용해도 된다.

해당 애노테이션을 사용해서 주입받으면 프록시 객체가 주입되므로 동시성 문제를 예방할 수 있다.
스프링부트 사용 시에는 @Autowired로 주입해도 프록시 객체가 주입되므로 이 애노테이션을 사용할 필요가 없다.