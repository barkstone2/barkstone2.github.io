---
created: 2024-08-27 09:22
updated: 2024-08-27 17:56
tags:
  - JPA
  - Spring/Data/JPA
  - Hibernate
---
`orphanRemoval` 속성을 사용하면 부모를 잃은 연관관계 엔티티를 자동으로 데이터베이스에서 삭제할 수 있다.
편리한 기능이지만 `@OneToMany` 컬렉션에서 사용할 경우에 주의할 점이 있다.

`orphanRemoval`에 의해 삭제되는 엔티티는 각 엔티티에 대해 개별적인 `DELETE` 쿼리를 생성하고 질의한다.
예를 들어 아래와 같은 비즈니스 로직이 있다고 가정해보자.
```kotlin
@OneToMany(mappedBy = "quest", cascade = [CascadeType.ALL], orphanRemoval = true)  
private val _detailQuests: MutableList<DetailQuest> = mutableListOf()  
val detailQuests : List<DetailQuest>  
    get() = _detailQuests.toList()  
  
fun replaceDetailQuests(detailQuests: List<DetailQuest>) {  
    _detailQuests.clear()  
    _detailQuests.addAll(detailQuests)  
}
```

이때 `_detailQuests.clear()`이 호출되기 전에 컬렉션에 3개의 엔티티가 담겨있었다면, 아래와 같이 3번의 `DELETE` 쿼리가 질의된다.
```sql
delete from detail_quest where detail_quest_id=?;
delete from detail_quest where detail_quest_id=?;
delete from detail_quest where detail_quest_id=?;
```

30개의 엔티티가 담겨있었다면 30개의 DELETE 쿼리가, N개의 엔티티가 담겨있으면 N개의 DELETE 쿼리가 질의된다.
# 벌크 연산을 통한 개선
컬렉션에 담기는 엔티티의 수가 제한적이라면 문제가 없을 수 있지만, 많은 양의 엔티티가 담길 수 있는 경우라면 아래와 같이 벌크 연산을 사용하는 것이 나을 수 있다.
```kotlin
@Modifying(clearAutomatically = true)
@Query("DELETE FROM detail_quest dq WHERE dq.quest_id := questId")
fun deleteAllDetails(questId: Long)
```

다만 벌크 연산을 사용하는 경우에는 관련 로직을 엔티티 내부로 캡슐화하는 것이 불가능하기에 아래와 같이 필요한 로직을 엔티티 외부에서 먼저 호출해야 한다.
```kotlin
detailQuestRepository.deleteAllDetails(questId)
quest.otherWorks() // 엔티티 내부에 캡슐화된 다른 작업 호출
```

이런 문제 없이 처리하려면 [[Hibernate 배치|하이버네이트 배치]]를 사용할 수 있다.