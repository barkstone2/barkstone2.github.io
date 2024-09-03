---
created: 2024-08-28 23:57
updated: 2024-08-29 08:28
tags:
  - JPA
  - Hibernate
---
ActionQueue = 쓰기 지연 저장소
# 쓰기 작업 저장
Insert, Delete, Update 별로 분리해서 저장한다.
```java
private ExecutableList<AbstractEntityInsertAction> insertions;  
private ExecutableList<EntityDeleteAction> deletions;  
private ExecutableList<EntityUpdateAction> updates;
```

뿐만 아니라 컬렉션 타입에 대한 쓰기 작업, 고아 엔티티에 대한 작업도 따로 관리한다.
```java
private ExecutableList<CollectionRecreateAction> collectionCreations;  
private ExecutableList<CollectionUpdateAction> collectionUpdates;  
private ExecutableList<QueuedOperationCollectionAction> collectionQueuedOps;  
private ExecutableList<CollectionRemoveAction> collectionRemovals;  
  
private ExecutableList<OrphanRemovalAction> orphanRemovals;
```

각각의 리스트에 담긴 작업들은 하나의 맵으로 모인다.
```java
private static final LinkedHashMap<Class<? extends Executable>,ListProvider<?>> EXECUTABLE_LISTS_MAP;
```
# 쓰기 작업 실행
이렇게 모인 쓰기 작업은 아래의 함수를 통해 각각 실행된다.
```java
public void executeActions() throws HibernateException {  
    if ( hasUnresolvedEntityInsertActions() ) {  
       throw new IllegalStateException( "About to execute actions, but there are unresolved entity insert actions." );  
    }  
  
    EXECUTABLE_LISTS_MAP.forEach( (k,listProvider) -> {  
       ExecutableList<?> l = listProvider.get( this );  
       if ( l != null && !l.isEmpty() ) {  
          executeActions( l );  
       }  
    } );  
}

private <E extends Executable & Comparable<? super E> & Serializable> void executeActions(ExecutableList<E> list)  
       throws HibernateException {  
    
       for ( E e : list ) {  
          try {  
             e.execute();  
          }
	// ...
	session.getJdbcCoordinator().executeBatch();
}
```

위 함수는 flush가 발생한 시점에 리스너를 통해 호출된다.
```java
// AbstractFlushingEventListener
protected void performExecutions(EventSource session) {  
    LOG.trace( "Executing flush" );  
 
    final JdbcCoordinator jdbcCoordinator = session.getJdbcCoordinator();  
    try {  
       jdbcCoordinator.flushBeginning();  
       persistenceContext.setFlushing( true );  

       actionQueue.prepareActions();  
       actionQueue.executeActions();
	// ...
}
```
# 실행 단위
ExecutableList에 담긴 각 요소는 EntityAction 클래스를 상속한 클래스이며 EntityAction 클래스는 Executable 인터페이스를 구현하고 있다.
타입에 맞는 구현체에서 Executable 인터페이스의 execute 함수를 구현해 타입에 맞는 작업을 처리하고 있다.
```java
// EntityInsertAction
@Override  
public void execute() throws HibernateException {  
    nullifyTransientReferencesIfNotAlready();  
  
    final EntityPersister persister = getPersister();  
    final SharedSessionContractImplementor session = getSession();  
    final Object instance = getInstance();  
    final Object id = getId();  
  
    final boolean veto = preInsert();  
  
    if ( !veto ) {  
       persister.insert( id, getState(), instance, session );
	// ...
}
```

execute() 함수 내부에서는 persister를 통해 insert, delete 등 실제 로직을 호출한다. 구체적인 동작은 AbstractEntityPersister의 구현을 따른다. 여기서는 배치 활성화 여부에 따른 동작의 차이를 정리하는 것이 목적이므로 EntityPersister의 구체적인 동작을 기술하지 않는다.
# 배치 사용에 따른 차이
AbstractEntityPersister 내부의 insert, delete 같은 함수를 살펴보면 아래와 같이 배치 사용 여부에 따라 동작이 달라지는 것을 확인할 수 있다.
```java
if ( useBatch ) {  
    insert = session  
          .getJdbcCoordinator()  
          .getBatch( insertBatchKey )  
          .getBatchStatement( sql, callable );  
}  
else {  
    insert = session  
          .getJdbcCoordinator()  
          .getStatementPreparer()  
          .prepareStatement( sql, callable );  
}
// ...
if ( useBatch ) {  
    session.getJdbcCoordinator().getBatch( insertBatchKey ).addToBatch();  
}  
else {  
    expectation.verifyOutcome(  
          session.getJdbcCoordinator()  
                .getResultSetReturn()  
                .executeUpdate( insert ), insert, -1, sql  
    );  
}
```
# JDBC 호출 차이
하이버네이트는 JDBC 호출을 ResultSetReturn 이라는 객체를 통해 처리하고 있다. executeUpdate() 함수를 간단히 살펴보자면 동작은 특별할 것이 없다. 인자로 넘겨받은 JDBC의 PreparedStatement에 대해 executeUpdate()를 호출할 뿐이다.
```java
@Override  
public int executeUpdate(PreparedStatement statement) {  
    long executeStartNanos = 0;  
    if ( this.sqlStatementLogger.getLogSlowQuery() > 0 ) {  
       executeStartNanos = System.nanoTime();  
    }  
    try {  
       jdbcExecuteStatementStart();  
       return statement.executeUpdate();  
    }  
    catch (SQLException e) {  
       throw sqlExceptionHelper.convert( e, "could not execute statement" );  
    }  
    finally {  
       jdbcExecuteStatementEnd();  
       sqlStatementLogger.logSlowQuery( statement, executeStartNanos );  
    }  
}
```

배치를 사용하지 않을 때, 하나의 액션은 EntityPersister를 통해 각각 실행된다. 즉, JDBC의 executeUpdate()가 각 액션에 대해 호출된다.
반면 배치를 사용할 때는 공유 session 내부에 배치 작업을 저장해둔 후 아래와 같이 ActionQueue에서 배치를 한 번에 처리한다.
```java
private <E extends Executable & Comparable<? super E> & Serializable> void executeActions(ExecutableList<E> list)  
       throws HibernateException {  
    
       for ( E e : list ) {  
          try {  
             e.execute();  
          }
	// ...
	session.getJdbcCoordinator().executeBatch();
}
```

이때 JdbcCoordinator 내부에는 Batch 객체가 존재하며, executeActions에 전달된 ExecutableList에 포함된 작업들이 하나의 배치 작업으로 처리된다.
여러 타입의 ExecutableList가 존재하는 경우 각각에 대해 배치 작업이 호출되며, 다시 말해 쓰기, 삭제, 변경끼리 묶어서 처리한다는 뜻이다.

executeBatch()가 호출되면 Batch 객체 내부의 execute 함수가 호출되고, 이는 여러 함수 호출을 거쳐 PreparedStatement.executeBatch()를 호출하게 된다.
JDBC 드라이버의 구현에 따라 동작이 조금씩 다를 수는 있지만, 최소한 각 Action에 대해 개별적으로 executeUpdate()가 실행될 때처럼 매번 DB와 네트워크 통신이 발생하지는 않는다.