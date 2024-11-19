---
created: 2024-09-11 11:45
updated: 2024-09-12 11:25
tags:
  - CS/DataStructure
  - Java/DataStructure
---
# 스택의 정의
LIFO(Last In First Out) 원리에 따라 동작하는 자료 구조로 마지막에 삽입된 요소가 가장 먼저 제거된다.

구현에 따라 고정된 크기의 스택으로 구현할 수도 있으며 동적으로 크기가 변하도록 구현할 수도 있다.
내부 자료 구조로 [[Array]]와 [[LinkedList]]를 사용해 구현할 수 있다.
## 스택의 연산
스택에서 제공되는 주요 연산은 다음과 같다.
### push
스택에 새로운 요소를 삽입하는 연산으로 스택 헤드에 요소를 삽입한다.
O(1)의 시간 복잡도를 가진다.
### pop
스택의 헤드에 있는 요소를 제거하고 반환하는 연산이다.
O(1)의 시간 복잡도를 갖는다.
### peek(top)
스택의 헤드에 있는 요소를 제거하지 않고 반환하기만 하는 연산이다.
O(1)의 시간 복잡도를 갖는다.
### 기타 연산
이외에도 `isEmpty`, `size` 연산 등이 제공될 수 있다.
두 연산 모두 O(1)의 시간 복잡도를 갖는다.
## 스택의 용도
스택은 LIFO 원리가 필요한 곳이라면 어디든 사용될 수 있다.
가장 일반적으로 메서드 호출 관리에 주로 사용되며 이외에도 undo 처리, 메모리 관리에도 사용된다.
# 직접 구현하기
## Array로 구현하기
`Array`로 스택을 구현할 때는 반드시 배열의 끝에 요소가 삽입되고, 제거되도록 구현해야 한다.
아래는 아주 단순한 형태의 `Stack` 구현으로 고정된 크기의 배열을 사용해 스택을 구현한 코드다.
```java
public class ArrayStack<T> {  
    private T[] elements;  
    private int idx;  
  
    public ArrayStack(int size) {  
        elements = (T[]) new Object[size];  
    }  
    public void push(T item) {  
        if (idx == elements.length) {  
            throw new RuntimeException("Stack is full");  
        }  
        elements[idx++] = item;  
    }  
    public T pop() {  
        if (idx == 0) {  
            throw new RuntimeException("Stack is empty");  
        }  
        return elements[--idx];  
    }  
    public T peek() {  
        if (idx == 0) {  
            return null;  
        }  
        return elements[idx-1];  
    }  
}
```

실제 스택 구현은 위 코드에서 더 확장된 형태를 가지는 것이 일반적이다.
예를 들어 아래와 같이 `isEmpty`, `size와` 같은 편의 메서드를 구현할 수 있다.
```java
public boolean isEmpty() {  
    return idx == 0;  
}  
  
public int size() {  
    return idx;  
}
```

또한 스택의 크기를 가변적으로 늘리도록 배열을 확장하는 내부 함수를 구현할 수 있다.
```java
public void push(T item) {  
    if (idx == elements.length) {  
        grow();  
    }  
    elements[idx++] = item;  
}  

private void grow() {  
    T[] newElements = (T[]) new Object[elements.length * 2];  
    System.arraycopy(elements, 0, newElements, 0, elements.length);  
    elements = newElements;  
}
```
### Array로 구현할 때의 장단점
`Array`를 스택의 내부 자료 구조로 사용할 때는 데이터의 공간 지역성으로 인해 캐싱 적합성이 올라간다.
이로 인해 `LinkedList`를 사용한 스택보다 상대적으로 접근 속도가 빠를 수 있다.
메모리 사용 측면에서도 링크를 유지할 필요가 없기에 `LinkedList`보다 효율적이다.

대신 가변 크기의 스택으로 사용할 경우에 `grow` 연산을 수행하는 비용이 발생하므로 스택의 크기가 자주 변하는 상황에서는 `LinkedList`보다 비효율적일 수 있다.
## LinkedList로 구현하기
`LinkedList`로 스택을 구현할 때는 사용하는 `LinkedList` 구현체의 특성에 따라 스택의 구현이 달라질 수 있다.
자바의 경우 두 개의 포인터를 갖는 `DoublyLinkedList`가 기본 구현체로 사용되기 때문에 리스트의 처음이나 끝 중 한 곳에 일관되게 삽입과 삭제를 처리하면 스택을 구현할 수 있다.
```java
public class LinkedListStack<T> {  
    LinkedList<T> elements;  
    public LinkedListStack() {  
        elements = new LinkedList<>();  
    }  
    public void push(T element) {  
        elements.add(element);  
    }  
    public T pop() {  
        return elements.removeLast();  
    }  
    public T peek() {  
        return elements.getLast();  
    }  
    public boolean isEmpty() {  
        return elements.isEmpty();  
    }  
    public int size() {  
        return elements.size();  
    }  
}
```
### LinkedList로 구현할 때의 장단점
`LinkedList`는 링크만 연결하면 무한히 확장될 수 있고, `Array`처럼 `grow` 연산이 필요 없기 때문에 가변 크기의 스택을 구현하기 용이하다.

다만 링크 관리에 메모리 오버헤드가 발생하고, 불연속적인 메모리 공간을 사용하기 때문에 캐싱 효율이 떨어진다는 단점이 존재한다.
# 자바의 스택 구현
## Stack 구현체
자바에서 제공하는 `Stack` 구현체는 [[Vector]]를 기반으로 구현되어 있다.
```java
public class Stack<E> extends Vector<E>{ /* ... */ }
```

`Vector`는 간단하게 설명하면 동기화를 지원하는 가변 크기의 `Array` 구현체다.
이를 확장한 `Stack` 구현체도 마찬가지로 동기화를 지원한다.
```java
public E push(E item) {  
    addElement(item);  
  
    return item;  
}
public synchronized E pop() {}
public synchronized E peek() {}
public boolean empty() {  
    return size() == 0;  
}
public synchronized int search(Object o) {}
```

동기화가 수행되기 때문에 오버헤드가 발생하며, Javadoc에서는 `Stack` 구현체보다 다음에 설명할 구현체를 대신 사용하는 것을 권장하고 있다.

> A more complete and consistent set of LIFO stack operations is provided by the Deque interface and its implementations, which should be used in preference to this class.
## `ArrayDeque`
[[ArrayDeque]] 구현체는 엄밀히 말하자면 `Deque`의 구현체지만, `Deque`의 특성상 `Stack`의 기능도 제공한다.
Stack 구현체와 달리 동기화를 제공하지 않으며 동기화를 제공하지 않기 때문에 `Stack` 구현체보다 더 빠르다.
```java
public class ArrayDeque<E> extends AbstractCollection<E>  
                           implements Deque<E>, Cloneable, Serializable  
{
	public void push(E e) {  
	    addFirst(e);  
	}
	public E pop() {  
	    return removeFirst();  
	}
}
```

배열의 앞에 삽입과 삭제를 수행하지만 원형 버퍼 구조를 사용하기 때문에 쉬프트 연산이 발생하지 않는다.
자세한 내용은 [[ArrayDeque]] 관련 내용을 확인하길 바란다.