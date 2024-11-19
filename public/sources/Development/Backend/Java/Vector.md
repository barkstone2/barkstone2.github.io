---
created: 2024-09-12 10:11
updated: 2024-09-12 10:34
tags:
  - Java/DataStructure
references:
  - https://stackoverflow.com/questions/1386275/why-is-java-vector-and-stack-class-considered-obsolete-or-deprecated
---
# Vector의 정의
자바에서 제공하는 Array 구현체 중 하나로 동기화를 지원하는 동적 배열이다.
대부분의 메서드가 아래와 같이 동기화 되어 있다.
```java
public synchronized void addElement(E obj) {}
public synchronized E elementAt(int index) {}
public synchronized void removeElementAt(int index) {}
public synchronized int lastIndexOf(Object o) {}
public synchronized int size() {}
```

동적 배열이기 때문에 용량이 초과될 때마다 `grow` 연산이 발생한다.
# 레거시 클래스
`Vector`는 구 버전과의 호환을 위해 남아있기는 하지만 사용이 권장되지는 않는다.
동기화가 필요하지 않은 경우에는 `Vector`를 대신 `ArrayList`를 사용하는 것이 좋다.

심지어 동기화가 필요할 때도 `Vector`보다는 `Collections.synchronizedList()`로 `ArrayList`를 래핑하는 것이 낫다.

`Vector`의 동기화는 일련의 작업을 동기화하는 대신 각각의 작업을 동기화한다. 쉽게 말해 자료구조 자체에 대한 동기화가 제공되지 않는다.
대부분의 경우 리스트 자체에 대한 동기화가 필요하기 때문에, 별도의 잠금이 필요해진다. 뿐만 아니라 각각의 작업에 대한 잠금을 수행하느라 속도도 더 느리다.

반면 `Collections.synchronizedList()`는 아래와 같이 컬렉션 자체에 대한 뮤텍스를 제공한다.
```java
static class SynchronizedCollection<E> implements Collection<E>, Serializable {  
    final Collection<E> c;
	final Object mutex;
	public boolean add(E e) {  
	    synchronized (mutex) {return c.add(e);}  
	}  
	public boolean remove(Object o) {  
	    synchronized (mutex) {return c.remove(o);}  
	}
}
```

따라서 `Vector` 대신 `ArrayList`나 `Collections.synchronizedList()`를 사용하고, `Stack` 대신 `ArrayDeque`를 사용하자.