---
created: 2024-08-08 10:03
updated: 2024-08-17 15:16
tags:
  - Java
---
해시맵의 삽입 및 조회 연산은 충돌이 발생하지 않는다는 가정하에 O(1)의 시간 복잡도를 가진다.
하지만 실제로는 여러 오버헤드가 있기 때문에 배열 조작에 비해 더 많은 시간이 소요될 수 있다.
Map의 성능에 영향을 미치는 주요 오버헤드는 다음과 같다.
1. 해시 함수 계산
	키를 저장하거나 검색할 때, 해시맵은 먼저 키의 해시 값을 계산해야 한다. 이 해시 함수 계산은 추가적인 오버헤드를 유발한다.
2. 충돌 처리
	충돌이 발생할 경우 충돌 처리 과정에서 오버헤드가 발생한다.
3. 리사이징
	해시맵은 일정 크기가 채워지면 크기를 두 배로 늘리는 작업을 수행한다. 여기서 오버헤드가 발생한다.
4. 메모리 접근 패턴
	연속된 메모리 블록에 저장되는 배열은 CPU 캐시 효율성이 높지만 해시맵은 메모리에서의 위치가 분산되어 있어 캐시 적중률이 낮을 수 있다.
5. 객체 생성
	엔트리 객체를 생성하여 키와 값을 저장하기 때문에 추가적인 오버헤드가 유발된다.

