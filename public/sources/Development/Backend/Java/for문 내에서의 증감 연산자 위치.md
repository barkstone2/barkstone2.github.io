---
created: 2024-07-22 10:49
updated: 2024-08-17 15:15
tags:
  - Java
---
전위 증감 연산자(`++i`)와 후위 증감 연산자(`i++`)에는 큰 차이가 있지만 for문 내에서는 동작이 다르지 않다.
```java
int N = 3;
for (int i=1; i<=N; i++) {
	System.out.print(i);
}
System.out.println();
for (int i=1; i<=N; ++i) {
	System.out.print(i);
}
// 123
// 123
```
위 두 코드는 모두 아래의 순서대로 동작한다.
1. i값을 비교한다.
2. 블록 내의 코드를 실행한다.
3. i값을 1 증가시킨다.

이는 for문에서 조건식과 증감식이 따로 실행되기 때문이다.
반면 while문의 조건에 증감 연산자를 사용할 때는 다른 결과가 나타난다.
```java
int i = 1;  
int N = 3;  
while (i++ <= N) {  
    System.out.print(i);  
}  
System.out.println();  
i = 1;  
while (++i <= N) {  
    System.out.print(i);  
}
// 123
// 23
```