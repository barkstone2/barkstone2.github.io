---
created: 2024-09-12 11:27
updated: 2024-09-12 11:45
tags:
  - Java/DataStructure
---
# ArrayList의 정의
`ArrayList`는 자바에서 제공하는 동적으로 크기가 변경될 수 있는 [[Array]] 구현체다.
배열에 접근하기 위한 다양한 유틸 메서드들을 제공하며 내부에서 배열을 사용해 데이터를 관리한다.
내부에서 배열을 사용하기 때문에 배열의 특성을 그대로 가진다.
## 동기화 미지원
동기화를 지원하지 않으며 동기화가 필요한 경우 `Collections.sychronizedList` 함수로 래핑해야 한다.
## 동적 크기 변경
`ArrayList`는 크기 확장이 필요할 때 아래 로직을 통해 크기를 확장한다. 비트 연산자를 통해 50% 크기를 확장한다.
```java
private Object[] grow(int minCapacity) {  
    int oldCapacity = elementData.length;  
    if (oldCapacity > 0 || elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {  
        int newCapacity = ArraysSupport.newLength(oldCapacity,  
                minCapacity - oldCapacity, /* minimum growth */  
                oldCapacity >> 1           /* preferred growth */);  
        return elementData = Arrays.copyOf(elementData, newCapacity);  
    } else {  
        return elementData = new Object[Math.max(DEFAULT_CAPACITY, minCapacity)];  
    }  
}
```
## 최초 크기 지정
grow 연산에는 오버헤드가 발생하기 때문에 배열의 최대 크기를 예측할 수 있다면 처음부터 특정 크기의 `ArrayList`를 선언할 수 있다.
```java
public ArrayList(int initialCapacity) {}
```