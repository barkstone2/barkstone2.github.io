---
created: 2024-09-27 11:30
updated: 2024-09-27 11:37
tags:
  - PS
  - LeetCode
"\bDifficulty": Medium
---

> 문제 : https://leetcode.com/problems/binary-tree-level-order-traversal/

# 풀이
푸는데 10분 걸렸다.

이진 트리를 Level-order로 순회해 출력하는 문제다.
2차원 리스트를 정답으로 출력해야하며, 같은 레벨의 노드를 같은 리스트로 묶어야 한다.
## 구현
큐를 두개 사용해서 현재 레벨에 대한 순회와 다음 레벨에 대한 순회를 분리했다.
현재 레벨을 순회하면서 현재 레벨의 노드의 값을 출력하기 위한 값을 레벨별 리스트에 담았다.
다음 레벨의 노드는 다음 레벨을 위한 큐에 담고, 현재 레벨에 대한 순회가 끝나면 큐를 교체하는 방식으로 다음 레벨에 대한 탐색을 이어갈 수 있도록 했다.
# 코드
```java
class Solution {  
    public List<List<Integer>> levelOrder(TreeNode root) {  
        List<List<Integer>> result = new LinkedList<>();  
        Queue<TreeNode> levelQueue = new LinkedList<>();  
        Queue<TreeNode> nextLevelQueue = new LinkedList<>();  
        if (root != null) levelQueue.add(root);  
  
        while (!levelQueue.isEmpty() || !nextLevelQueue.isEmpty()) {  
            List<Integer> levelList = new LinkedList<>();  
  
            while (!levelQueue.isEmpty()) {  
                TreeNode node = levelQueue.poll();  
                levelList.add(node.val);  
                if (node.left != null) nextLevelQueue.add(node.left);  
                if (node.right != null) nextLevelQueue.add(node.right);  
            }  
            result.add(levelList);  
  
            Queue<TreeNode> temp = levelQueue;  
            levelQueue = nextLevelQueue;  
            nextLevelQueue = temp;  
        }  
        return result;  
    }  
}
```