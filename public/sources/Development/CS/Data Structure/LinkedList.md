---
created: 2024-09-11 11:38
updated: 2024-09-12 11:03
tags:
  - CS/DataStructure
---
# 정의
불연속적인 메모리 공간을 사용하는 자료 구조로 노드 간의 연결을 통해 데이터를 표현한다.
인덱스를 통한 랜덤 액세스가 불가능하다.
# 시간 복잡도
## 조회
노드 간의 연결을 통해 조회할 노드를 검색하는 과정이 필요하다. 이 검색 과정의 시간 복잡도가 O(N)이므로 조회의 시간 복잡도 역시 O(N)이 된다.
## 삽입, 삭제
실제 삽입과 삭제 연산은 노드 간의 링크만 변경하면 되기 때문에 O(1)의 시간 복잡도를 갖는다.
다만 링크를 변경할 노드를 탐색하는 과정이 필요하고, 이 과정이 O(N)의 시간 복잡도를 갖기 때문에 삽입과 삭제 역시 O(N)의 시간 복잡도를 가진다.

연결 리스트의 head에 삽입하는 경우에는 탐색 과정이 불필요하므로 O(1)의 시간 복잡도로 삽입과 삭제를 수행할 수 있다.
구현에 따라 tail에 대한 포인터가 있는 경우에는 tail에 대한 삽입 삭제도 O(1)의 시간 복잡도로 가능하다.
# 특징
- 크기가 가변적으로 변할 수 있는 자료 구조로 메모리 제한만 없다면 링크를 무한히 늘릴 수 있다.
- 링크 유지에 메모리 오버 헤드가 발생할 수 있다.