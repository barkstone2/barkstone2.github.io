---
created: 2024-12-25 10:40
updated: 2024-12-25 12:25
tags:
  - AWS
  - IAM
---
AWS에서 사용자 별로 권한을 부여하는 방법을 찾다보니 꽤 복잡한 부분이 있다고 느꼈다. 정리해 놓지 않으면 다음에 고생할 것 같아 관련 내용을 정리하기로 했다.
# 정책
먼저 AWS에서는 정책이라는 객체를 통해 각각의 권한을 정의한다. 사전에 정의된 정책도 많고, 직접 필요한 정책을 구성할 수도 있다.

정책은 아래와 같이 JSON 형태로 구성된다. 아래 정책은 AmazonEC2FullAccess 정책으로 AWS에서 사전 제공되는 정책 중 하나다.
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "ec2:*",
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "elasticloadbalancing:*",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "cloudwatch:*",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "autoscaling:*",
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "iam:CreateServiceLinkedRole",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "iam:AWSServiceName": [
                        "autoscaling.amazonaws.com",
                        "ec2scheduled.amazonaws.com",
                        "elasticloadbalancing.amazonaws.com",
                        "spot.amazonaws.com",
                        "spotfleet.amazonaws.com",
                        "transitgateway.amazonaws.com"
                    ]
                }
            }
        }
    ]
}
```

최근에는 아래와 같이 시각화된 정보로도 정책을 제공하고 있다.
![[Screenshot 2024-12-25 at 11.15.02.png|300]]

정책 등록 시에도 시각화된 방식으로 각 서비스 별로 필요한 권한을 정책에 담을 수 있다.

이렇게 정의된 정책은 사용자, 사용자 그룹, 역할에 할당될 수 있다.
역할은 주로 AWS 서비스 간의 접근 권한을 제어하기 위해 사용되고, 사용자에 대한 정책은 주로 사용자 그룹에 할당된다.
# 사용자 그룹
사용자 그룹은 여러 사용자에게 동일한 정책을 부여하기 위한 객체다. 사전에 정의된 사용자 그룹에 필요한 정책들을 할당하고, 사용자 생성 시 해당 그룹에 배정하면 그룹에 할당된 정책이 사용자에게 적용된다.

개발자들의 IAM 사용자 계정에 동일한 권한을 부여하거나, DevOps, DBA의 계정 권한을 미리 정의해두는 등의 다양한 용도로 사용할 수 있어 보인다.
# 사용자
사용자는 콘솔에 로그인 가능한 IAM 계정을 등록하거나, 외부 애플리케이션에서 AWS 인증을 할 때 사용할 계정을 등록하는 용도로 사용할 수 있다.
계정 등록 시에 콘솔 로그인 여부를 지정할 수 있으며, 계정 별로 액세스 키를 두 개까지 생성할 수 있고, MFA를 추가할 수도 있다.
# 역할
역할은 사용자나 사용자 그룹, AWS 서비스(EC2 인스턴스 등)에 할당될 수 있는 객체다.
AWS 서비스에는 역할만 할당될 수 있으며, 할당된 역할을 통해 다른 AWS 서비스에 대한 접근 권한을 얻을 수 있다.

사용자나 사용자 그룹에 역할을 부여하는 기능은 사용자나 사용자 그룹에 정책을 할당할 수 있기 때문에 사용할 일은 없어 보인다.

외부 시스템에서의 접속을 위한 역할을 생성하는 기능이 추가로 제공되는 것 같은데, 당장 사용할 일이 없어 이 부분에 대해서는 더 알아보지 않았다.
# 권한 경계
권한 경계는 권한의 상한선 역할을 담당한다.
사용자에게 부여된 권한이 권한 경계에도 포함된 경우에만 해당 권한을 가질 수 있다.

예를 들어 특정 사용자에게 다음과 같인 권한과 권한 경계가 부여되었다고 하자.
- 권한 경계 : `s3:PutObject`, `s3:GetObject`
- IAM 정책 : `s3:PutObject`, `s3:DeleteObject`

이때 각 권한의 허용 여부는 아래와 같다.
- `s3:PutObject`는 두 정책에 모두 포함되어 허용된다.
- `s3:GetObject`는 권한 경계에 포함되므로 허용되지만, IAM 정책에 없으면 허용되지 않는다.
- `s3:DeleteObject`는 권한 경계에 없으므로 허용되지 않는다.