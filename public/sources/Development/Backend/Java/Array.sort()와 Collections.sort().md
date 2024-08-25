---
created: 2024-08-08 10:34
updated: 2024-08-17 15:15
tags:
  - Java
---
자바에서 원시 타입에 대한 정렬은 dual pivot quicksort 알고리즘으로 수행되는 반면, 비 원시 타입에 대한 정렬은 merge sort 알고리즘을 사용한다.
merge sort 수행시에는 참조 지역성으로 인해 캐시 히트율이 떨어져 퀵소트보다 느린 성능을 가진다.
때문에 원시 타입을 사용한 Array.sort()가 더 빠르다.