---
created: 2024-09-10 15:40
updated: 2024-09-10 16:14
tags:
  - JPA
  - Spring
  - Spring/Boot
---
Open Session In View는 Spring Framework에서 제공하는 패턴으로 [Open EntityManager In View](https://docs.spring.io/spring-boot/reference/data/sql.html#data.sql.jpa-and-spring-data.open-entity-manager-in-view)라고도 부른다. 관례상 OSIV라고 부르는 게 일반적이다.

OSIV가 활성화된 경우 트랜잭션이 종료되어도 데이터베이스 커넥션을 반납하지 않고 클라이언트 요청이 종료되고, 뷰 페이지 렌더링이 종료되거나 API 응답이 끝날 때 커넥션을 반납하게 된다.

영속성 컨텍스트 역시 마찬가지로 종료되지 않다가 응답이 모두 반환되고 나면 종료된다.
# 스프링 부트 사용 시 자동 활성화된다.
스프링 부트를 통해 웹 어플리케이션을 실행하는 경우에는 자동으로 `OpenEntityManagerInViewInterceptor` 클래스가 등록되고 OSIV가 활성화 된다.
# 안티 패턴이므로 비활성화 하자.
OSIV를 사용할 경우에는 데이터베이스 커넥션의 반환이 늦어져 예상치 못한 문제를 발생시킬 수 있다. 따라서 특별한 이유가 없는 한 비활성화 하는 것이 좋다.

주로 JSP나 Thymeleaf 같은 SSR 뷰를 사용하는 경우에 뷰 페이지에서 연관 관계 엔티티에 접근하기 위해 OSIV가 사용된다.
하지만 약간의 편의성을 제외하면 별 다른 이점이 없고, 뷰 페이지에서 연관 관계 엔티티에 접근하는 대신 서비스 레이어에서 fetch join을 통해 필요한 데이터를 완성한 뒤 반환하는 것이 낫다.
이렇게 할 경우 OSIV를 사용하지 않고도 동일한 결과를 낼 수 있으며, DB 커넥션 반환이 늦어져 문제를 일으킬 일도 생기지 않는다.

해당 패턴을 비활성화 하기 위해서는 `spring.jpa.open-in-view` 속성을 `false`로 설정하면 된다.
# 관련 클래스
`org.springframework.orm.jpa.support` 패키지의 `OpenEntityManagerInViewInterceptor` 클래스와 `OpenEntityManagerInViewFilter` 클래스가 OSIV를 처리하기 위해 사용된다.
Spring Boot 사용 시에는 `OpenEntityManagerInViewInterceptor`가 자동으로 등록되고 사용되며, 필터는 필요한 경우 직접 등록해서 사용할 수 있다.