---
created: 2024-08-04 13:28
updated: 2024-08-04 20:11
---
- Node.js 프로젝트에서 npm 설정을 관리하는데 사용되는 파일
- 패키지 설치 경로, 레지스트리, 인증 토큰 등 다양한 설정을 커스터마이즈 할 수 있다.
# 구조 및 설정 항목
- .npmrc 파일은 전역 설정 파일($HOME/.npmrc)과 프로젝트별 설정 파일(프로젝트 루트의 .npmrc)로 존재할 수 있다. 각 설정은 key-value 형태로 작성된다.
```ini
registry=https://registry.npmjs.org/
save-exact=true
package-lock=false
strict-ssl=true
cache=./.npm-cache
always-auth=true
//registry.npmjs.org/:_authToken=your-auth-token
tag-version-prefix=""
```
- registry: npm 패키지를 다운로드할 레지스트리 URL을 지정합니다.
- save-exact: true로 설정 시, package.json에 버전 번호를 설치된 정확한 버전으로 저장합니다.
- package-lock: false로 설정 시, package-lock.json 파일 생성을 방지합니다.
- strict-ssl: true로 설정 시, SSL 인증서를 검증합니다.
- cache: npm 패키지 캐시 디렉토리를 지정합니다.
- always-auth: 인증이 필요한 레지스트리에 항상 인증 정보를 보냅니다.
- `//registry.npmjs.org/:_authToken`: 특정 레지스트리에 대한 인증 토큰을 설정합니다.
