---
created: 2024-09-27 15:03
updated: 2024-09-28 00:23
tags:
  - PS
  - LeetCode
"\bDifficulty": Medium
---

> 문제 : https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal

# 풀이
푸는데 25분 정도 걸렸다.
preorder와 inorder 결과를 입력으로 받아 트리를 재구축하는 문제다.

두 순회 결과의 성질을 활용해 트리를 재구축 할 수 있다.
자세한 내용은 [[이진 트리의 순회]]와 [[이진 트리의 재구축]]에 따로 정리해뒀으니 참고 바란다.
# 코드
```java
class Solution {  
    public int preIdx;  
    public int[] preOrder;  
    public int[] inOrder;  
    public TreeNode buildTree(int[] preorder, int[] inorder) {  
        this.preOrder = preorder;  
        this.inOrder = inorder;  
        TreeNode root = new TreeNode(preorder[0]);  
        buildTree(0, preorder.length, root);  
        return root;  
    }  
  
    public void buildTree(int start, int end, TreeNode node) {  
        int inIdx = -1;  
        for (int i = start; i < end; i++) {  
            if (inOrder[i] == preOrder[preIdx]) {  
                inIdx = i;  
                break;  
            }  
        }  
        if (start < inIdx) {  
            preIdx++;  
            node.left = new TreeNode(preOrder[preIdx]);  
            buildTree(start, inIdx, node.left);  
        }  
  
        if (inIdx + 1 < end) {  
            preIdx++;  
            node.right = new TreeNode(preOrder[preIdx]);  
            buildTree(inIdx + 1, end, node.right);  
        }  
    }  
}
```