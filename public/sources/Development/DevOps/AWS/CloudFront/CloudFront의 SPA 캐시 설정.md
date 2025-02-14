---
created: 2025-02-09 13:26
updated: 2025-02-09 14:27
tags:
  - AWS/CloudFront
  - SPA
  - React
  - 캐시
---
# SPA의 index.html 캐싱 전략
SPA의 특성 상 번들링된 js나 css 파일 등은 파일 이름에 해시값을 포함하므로 아무리 오래 캐싱되어도 상관이 없다.
해당 파일들을 참조하는 index.html 파일만 항상 최신 상태를 유지한다면, 새로운 해시값을 가진 파일 이름을 참조하기 때문에 최신 상태의 리액트 앱이 동작하도록 보장할 수 있다.

이런 특성을 고려해서 S3에 업로드된 파일 중 index.html 파일에 Cache-Control: no-cache 메타 데이터를 추가했었다.
이렇게 할 경우 해당 파일이 캐싱되지 않고, 항상 최신 파일이 사용되는 것을 보장할 수 있다.

그런데 이렇게 설정했더니 예상치 못한 문제가 발생했다.
의도한 대로 CloudFront의 엣지에서 파일이 캐싱되지 않았는데, 항상 오리진에서 새로운 파일을 조회하다보니 오리진 조회 횟수가 불필요하게 증가했다.

AWS에서 S3 조회 비용은 CloudFront 조회 비용보다 비싸고, 요청이 엣지에서 처리되지 못하는 만큼 응답 속도도 느려질 것이 분명했다.

이 문제에 대해서 곰곰히 생각해보니, index.html은 브라우저에서는 캐싱되어서는 안 되지만, 엣지에서는 캐싱하는 것이 효율적이라는 결론에 도달했다.
엣지에서 캐싱을 사용하는 경우, 엣지는 불필요하게 오리진에 요청을 전달하지 않고 스스로 클라이언트의 요청을 처리할 수 있게 된다.

엣지에서 캐싱을 해도 되는 이유는 간단하다. CloudFront는 캐시 무효화 기능을 제공하고, 이를 사용하면 엣지에 캐싱 중인 내용을 무효화할 수 있다.
반면 브라우저에 캐싱된 내용은 인프라 수준에서 제어할 수 없기 때문에 처음부터 캐싱되지 않도록 지시를 내려줄 필요가 있다.
# 캐시 정책 적용하기
CloudFront는 Behaviors라는 단위를 통해 `특정 오리진`의 `특정 경로`에 대한 요청에 대한 설정을 정의할 수 있도록 한다.

먼저 아래와 같이 index.html 경로에 대한 동작을 생성하자. 배포에 기본 경로가 있는 경우에는 path pattern에 기본 경로도 포함시켜야 한다.
![[behavior_create.png|500]]
[[CloudFront 캐시 정책|캐시 정책]]과 응답 헤더 정책을 사용해서 설정을 적용할 수 있으며, 캐시 정책은 엣지에서 오리진으로부터 받은 응답을 어떻게 캐시할 지를 결정하는데 사용된다.

앞서 얘기한 것처럼 엣지는 `index.html`을 캐싱하면 되므로 기본 정책인 `CachingOptimized`를 사용하자.
더 긴 시간 동안 캐싱하고 싶다면 직접 새로운 정책을 정의할 수도 있다.

다음으로 응답 헤더 정책을 적용해야 한다. 기본 정책에는 CORS나 보안 관련 정책만 존재하므로 새로운 정책을 만들어야 한다.
`Create reponse headers policy`를 클릭하면 아래 화면으로 이동된다.
![[create_response_header_policy.png|500]]
정책 이름과 설명을 입력해주고, Add header 버튼을 눌러 커스텀 헤더를 추가한다.
`Cache-Control: no-cache`를 추가해주면 해당 정책을 사용하는 경로는 응답에 해당 헤더를 포함하게 된다.

브라우저는 `Cache-Control: no-cache` 헤더가 포함된 경우 캐싱된 내용을 사용하기 전 서버에 검증 요청을 보낸다.
쉽게 말해 조건부 요청을 엣지로 전송하고, 엣지는 etag를 검사해 304를 반환하거나 새로운 etag와 파일을 반환하게 된다.

이제 생성한 정책을 적용하고 동작을 등록하면, 브라우저는 항상 index.html에 대해 조건부 요청을 사용하게 된다.

아래처럼 기본 경로에 대한 요청이 우선 순위가 더 낮기 때문에 index.html이 아닌 다른 경로에 대한 요청은 no-cache 헤더가 포함되지 않는다.
![[cloudfront_behaviors.png]]

하지만 Cache-Control 헤더가 자동으로 포함되지는 않기 때문에 브라우저의 디스크 캐시나 메모리 캐시가 반드시 사용되는 것은 아니다.
브라우저가 반드시 캐싱하도록 설정하고 싶다면, 기본 경로에서 Cache-Control: max-age=TTL 형태의 헤더를 반환하도록 설정할 필요가 있다.