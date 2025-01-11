---
created: 2025-01-11 20:06
updated: 2025-01-11 22:19
tags:
  - AWS/CloudFront
  - AWS/ElasticLoadBalancer
  - AWS/ELB
  - AWS/VPC
---
# Elastic Load Balancer는 프리티어에서 무료일까?
AWS 프리티어는 아래와 같이 ELB를 무료로 제공하고 있다.
![[Screenshot 2025-01-11 at 20.29.19.png|200]]
매월 750시간, 15LCU의 사용량을 제공하므로 한 달 내내 중단 없이 로드밸런서를 무료로 사용할 수 있는 셈이다. 그런데 여기에는 보이지 않는 함정이 있다.

2024년 2월 1일부터 AWS는 모든 퍼블릭 IPv4 주소에 대해 시간당 0.005 USD의 요금을 부과하고 있다.([공식 블로그](https://aws.amazon.com/ko/blogs/korea/new-aws-public-ipv4-address-charge-public-ip-insights/))
그리고 아래처럼 ALB를 Internet-facing 스키마로 생성할 때 IPv4, 혹은 듀얼스택을 사용하면 로드 밸런서에 할당한 AZ 수만큼 Public IPv4가 자동으로 할당된다.
![[Screenshot 2025-01-11 at 20.40.25.png|500]]

예를 들어 아래와 같이 ap-northeast-2b와 ap-northeast-2c AZ를 선택하는 경우, 서브넷 아래에 IPv4 주소가 AWS에 의해 할당된다는 문구를 확인할 수 있다.
![[Screenshot 2025-01-11 at 20.41.19.png|200]]

ALB 생성 시 최소 두 개의 AZ를 선택해야 하므로, 두 개의 Public IPv4 주소 사용이 필수이며, 각 IP에 대해 시간당 0.005USD, 한 달에 약 4달러의 요금이 과금된다.
# Public IPv4를 사용하지 않으려면 어떻게 해야할까?
결론적으로 요금이 발생하지 않게하려면 Public IPv4 주소를 사용하지 않으면 된다. 그럼 Public IPv4 주소를 사용하지 않으려면 어떻게 해야할까?
## IPv6 주소만 사용하기
처음 생각한 방법은 로드 밸런서의 IP 주소 타입으로 아래 타입을 사용하는 방법이었다.
![[Screenshot 2025-01-11 at 21.23.59.png]]
설명 그대로 Public IPv4 주소가 할당되지 않고, 오직 Public IPv6 주소만 할당되므로 IPv4 주소에 대한 과금을 피할 수는 있다. 문제는 IPv4만 사용하는 클라이언트가 ALB에 요청을 보낼 수 없게 된다.

대표적으로 ISP 중 KT는 IPv6를 지원하지 않으며 [여기](https://test-ipv6.com/index.html.ko_KR)에서 현재 장치에서 IPv6 주소를 사용한 통신이 가능한 지 확인할 수 있다.

결론적으로 ALB을 진입점으로 사용하는 경우라면 클라이언트가 IPv6 통신이 가능하다고 확신할 수 없기에, 해당 IP 주소 타입 사용은 불가능하다.
## CloudFront를 ALB의 프록시로 쓰기
IPv6만 사용할 수 없는 이유는 결국 클라이언트가 IPv6 통신이 불가능할 수 있다는 점 때문이다.
그렇다면 듀얼스택을 지원하는 진입점을 ALB 앞단에 두고, 해당 노드가 ALB와 IPv6로 통신하게 하면 된다고 생각했다.

먼저 AWS에서 ALB 앞단에 둘 수 있는 서비스들을 생각해봤다. 대표적으로 CloudFront, API Gateway 정도가 떠올랐다.
둘 중에는 CloudFront가 좀 더 익숙했기에 먼저 CloudFront를 ALB의 앞단에 두는 방법을 시도해봤다.

결론부터 말하자면 이 시도는 실패했다. 원인은 생각보다 단순했는데, CloudFront가 Origin 서버 연결에 IPv4만 지원하기 때문이다.

공식 문서나 더 명확한 언급은 찾지 못했지만 2016년에 올라온 [공식 블로그](https://aws.amazon.com/ko/blogs/korea/ipv6-support-update-cloudfront-waf-and-s3-transfer-acceleration/) 게시글의 CloudFront IPv6 지원 부분과, [AWS VPC 공식문서](https://docs.aws.amazon.com/vpc/latest/userguide/aws-ipv6-support.html#ipv6-service-support)의 IPv6 지원 서비스 목록을 보면 거의 확실하다.

CloudFront의 경우 IPv6만 사용하는 경우를 지원하지 않으므로, 내부 동작에 IPv4가 반드시 필요함을 알 수 있다.

앞서 확인한 AWS VPC 공식문서를 통해 API Gateway 역시 내부 동작에 IPv4가 반드시 필요하다는 것을 알수 있었고, API Gateway를 사용하는 방법은 시도하기도 전에 결론이 났다.
## VPC 안에서 사용 가능한 진입점은 없을까?
CloudFront와 API Gateway는 VPC 외부에 위치한 완전 관리형 서비스다. 이 때문에 VPC 내부의 서비스와 통신하기 위해서는 퍼블릭 주소가 반드시 필요하다.

다시 말해 VPC 내부의 서비스를 진입점으로 사용한다면, Private 주소로 VPC 내부 통신이 가능해지고, 진입점에 할당할 오직 하나의 퍼블릭 IP만 있으면 충분하다는 결론에 이르렀다.

문제는 어떤 서비스를 유일한 진입점으로 사용하느냐였다.
가장 먼저 떠오른건 EC2를 프록시 서버로 만드는 방법이었는데, 이 방법은 프리티어에서 하나의 EC2만 지원하기 때문에 바로 포기했다.

그러다가 발견한 것이 바로 VPC Origins였다.
# VPC Origins 사용하기
VCP Origins은 2024년 11월 25일에 출시된 따끈따끈한 신기능으로 CloudFront에서 VPC 내부의 Private 서비스에 접근할 수 있도록 해주는 기능이다. 심지어 모든 사용자가 완전히 무료로 사용할 수 있는 기능인데다가 사용 방법이 어렵지도 않다.

[공식 블로그](https://aws.amazon.com/ko/blogs/korea/introducing-amazon-cloudfront-vpc-origins-enhanced-security-and-streamlined-operations-for-your-applications/)의 게시글에서 자세히 소개하고 있으니 관심이 있다면 직접 읽어보자. 구체적인 사용법이 정리된 [공식 문서](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-vpc-origins.html)의 내용도 확인해보길 바란다.

여기서는 처음 목표였던 ALB에서 Public IPv4 걷어내기에 집중하겠다.
## Internal ALB로 전환하기
VPC Origins을 사용해 Private Subnet의 리소스에 접근할 수 있다는 것을 알았으니 이제 해야될 일이 명확해졌다.
우선 Internet-facing 스키마를 사용했던 ALB를 Internal 스키마로 다시 생성하자.

Internal ALB를 생성하기 위해서는 할당된 AZ의 서브넷으로 Private Subnet이 필요하니 미리 생성하자.
![[Screenshot 2025-01-11 at 21.51.52.png]]

구체적인 ALB 생성 과정은 글의 주제에서 조금 벗어난 것 같아서 생략하겠다.
## VPC Origin 생성하기
VPC Origin 생성 방법은 아주 간단하다. 표시할 VPC Origin의 이름과, 실제 오리진의 ARN을 입력해주면 된다. 현재는 ELB와 EC2만 지원하지만, 우리는 ALB를 오리진으로 쓸 것이기 때문에 아무 문제가 없다.
프로토콜은 원하는 대로 선택하면 되는데 나는 HTTPS only를 선택했다.
![[Screenshot 2025-01-11 at 22.01.03.png|300]]

ARN에는 생성한 로드 밸런서의 ARN을 입력해주면 된다.
![[Screenshot 2025-01-11 at 21.58.43.png|300]]

생성 버튼을 누르면 VPC Origin 생성 작업이 진행된다. Status가 Deployed로 바뀌면 오리진의 배치가 완료된 것이다. 배치까지는 시간이 좀 걸리니 잠시 대기하자.
![[Screenshot 2025-01-11 at 22.03.37.png|100]]
## CloudFront 배포 생성하기
배포 생성에 관한 세부적인 내용은 다루지 않을 것이다. VPC Origin을 사용하는 방법에 대해서만 여기서 다루니, CloudFront 배포 방법은 직접 찾아보길 바란다.

먼저 Origin domain 필드를 열면 앞서 생성한 VPC Origins 항목이 보인다. 해당 항목을 선택해주자.
![[사각형 5.png|600]]

VPC Origin을 도메인으로 선택하면 VPC origin domain 필드 입력 폼이 추가된다.
여기에는 ALB의 DNS name을 입력하면 된다.
![[Screenshot 2025-01-11 at 22.15.29.png|400]]

이후에는 CloudFront 배포 생성 과정과 모두 동일하다.

CloudFront 배포가 완료되고 나면 이제 CloudFront 주소를 통해 Private Subnet에 위치한 ALB에 접근할 수 있게 된다.
그리고 더 이상 매 달 7~8달러씩 Public IPv4 요금을 지불할 필요도 없다.

단, ALB를 통해 조회하는 데이터가 캐싱되지 않아야 한다면 CloudFront의 캐싱 정책을 주의깊게 설정해야 한다.
또한 CloudFront를 통하는 트래픽이 많아지는 경우 Public IPv4 주소를 사용하는 것이 더 저렴해질 수 있음에도 주의하자.