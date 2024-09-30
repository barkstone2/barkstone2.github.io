---
created: 2024-09-30 11:41
updated: 2024-09-30 17:00
tags:
  - Algorithm
---
> [!check] 관련 문제
> [가장 긴 증가하는 부분 수열](https://www.acmicpc.net/problem/11053) - DP를 사용한 LIS 길이 구하기
> [가장 긴 증가하는 부분 수열 2](https://www.acmicpc.net/problem/12015) - 이분 탐색을 사용한 LIS 길이 구하기
> [가장 긴 증가하는 부분 수열 4](https://www.acmicpc.net/problem/14002) - DP를 사용한 LIS 구하기
> [가장 긴 증가하는 부분 수열 5](https://www.acmicpc.net/problem/14003) - 이분 탐색을 사용한 LIS 구하기

LIS(Longest Increasing Subsequence)는 최장 증가 부분 수열을 찾는 문제다.
문제에 따라 LIS 길이만 구하는 경우도 있고, 실제 LIS를 구해야 하는 경우도 있다.
# DP로 LIS 길이 구하기
DP로 LIS 길이를 구하기 위해서는 먼저 아래와 같은 재귀 로직을 작성할 수 있다.
```java
int lis(int[] nums) {  
    int result = 0;  
    for (int i = nums.length-1; i >= 0; i--) {  
        result = Math.max(result, lis(nums, i));  
    }  
    return result;  
}  
  
int lis(int[] nums, int idx) {  
    int length = 1;  
    for (int i = idx - 1; i >= 0; i--) {  
        if (nums[i] < nums[idx]) {  
            length = Math.max(length, lis(nums, i) + 1);  
        }  
    }  
    return length;  
}
```

이때 한 눈에 보기에도 불필요한 중복 탐색이 많이 발생한다는 것을 알 수 있으며 메모이제이션을 통해 불필요한 탐색을 줄일 수 있다.

`nums[i]`가 마지막 요소로 사용됐을 때의 LIS 길이를 구하는 과정에서 중복 부분 구조가 발생하므로, 이에 대해 메모이제이션을 수행한다.

```java
int lis(int[] nums) {  
    int result = 0;  
    for (int i = nums.length-1; i >= 0; i--) {  
        result = Math.max(result, lis(nums, i));  
    }  
    return result;  
}  
  
int lis(int[] nums, int idx) {  
    if (dp[idx] != 0) return dp[idx];  
    int length = 1;  
    for (int i = idx - 1; i >= 0; i--) {  
        if (nums[i] < nums[idx]) {  
            length = Math.max(length, lis(nums, i) + 1);  
        }  
    }  
    return dp[idx] = length;  
}
```

이어서 최적 기본 구조를 고려하고 기본 단계를 정의하면 아래와 같이 코드를 작성할 수 있다.
```java
int lis(int[] nums) {  
    int result = 0;  
    for (int i = 0; i < nums.length; i++) {  
        dp[i] = 1;  
        for (int j = 0; j < i; j++) {  
            if (nums[j] < nums[i] && dp[i] < dp[j] + 1) {  
                dp[i] = dp[j] + 1;  
            }  
        }  
        if (result < dp[i]) {
          result = dp[i];
        }
    }  
    return result;  
}
```

다만 DP를 통해 LIS의 길이를 구하는 것에는 한계가 있다.
코드를 보면 알겠지만 `O(N^2)`의 시간 복잡도를 갖기 때문에 N의 값이 1만 정도만 돼도 1억 번의 연산이 필요하다.
# DP로 실제 LIS 구하기
DP 배열은 LIS의 길이만 추적하기 때문에 실제 LIS를 구하기 위해서는 별도의 처리가 필요하다.

먼저 DP 배열의 값이 갱신될 때마다 참조한 요소의 인덱스를 기록한다.
`DP[j]`는 j번째 요소가 마지막으로 사용됐을 때의 LIS 길이를 의미하므로 `DP[j]`를 참조해 `DP[i]`를 갱신했다는 의미는 `nums[j]` 뒤에 `nums[i]`를 사용했다는 것과 동일하다.
따라서 i번째 요소의 이전 요소를 나타내는 `parent[i]`의 값을 `j`로 초기화할 수 있다.

이어서 LIS의 길이가 갱신될 때마다 현재 LIS의 마지막 인덱스도 기록한다.
이 역시 마찬가지로 `i`번째 값이 마지막으로 왔을 때의 LIS가 더 길다는 의미이므로, 마지막 인덱스를 나타내는 `lastIndex`의 값을 `i`로 초기화할 수 있다.

LIS 길이 탐색이 끝났을 때 `lastIndex` 값이 실제 LIS의 마지막 요소를 가리키는 인덱스가 된다.
해당 인덱스부터 시작해 `parent` 배열을 역으로 참조해나가면 실제 LIS를 구할 수 있다.

이를 구현한 코드는 아래와 같다.
```java
parent = new int[N];  
Arrays.fill(parent, -1);

int[] lis(int[] nums) {  
    int size = 0;  
    int lastIndex = 0;  
    for (int i = 0; i < nums.length; i++) {  
        dp[i] = 1;  
        for (int j = 0; j < i; j++) {  
            if (nums[j] < nums[i] && dp[i] < dp[j] + 1) {  
                dp[i] = dp[j] + 1;  
                parent[i] = j;  
            }  
        }  
        if (size < dp[i]) {  
            size = dp[i];  
            lastIndex = i;  
        }  
    }  
  
    int[] result = new int[size];  
    int idx = size - 1;  
    for (int i = lastIndex; i >= 0; i = parent[i]) {  
        result[idx--] = nums[i];  
        if (parent[i] == -1) {  
            break;  
        }  
    }  
  
    return result;  
}
```
# 이분 탐색으로 LIS 길이 구하기
N의 값이 클 때는 이분 탐색으로 LIS의 길이를 구할 수 있다.
다만 주어진 배열 A가 정렬된 상태가 아니고, A를 정렬할 수도 없기 때문에 약간의 응용이 필요하다.

핵심은 LIS가 항상 정렬된 상태를 유지한다는 점이다. 배열 A는 정렬되어 있지 않지만, LIS는 항상 오름차순 정렬된 상태를 유지한다.
이 점에서 착안해 현재 LIS를 나타낼 배열인 SUB을 선언하고, SUB에 대한 이분 탐색을 통해 현재 요소가 삽입될 위치를 결정한다.
현재 요소보다 큰 첫 번째 값을 찾고, 그 위치를 덮어쓰거나 새로운 값을 삽입하게 된다.

대략적인 개념을 이해했다면 이제 코드를 자세히 살펴보자.
```java
int[] sub = new int[N];  
int size = 0;  
for (int num : nums) {  
    int pos = Arrays.binarySearch(sub, 0, size, num);  
    if (pos < 0) pos = -(pos + 1);  
    if (pos == size) {  
        sub[size++] = num;  
    } else {  
        sub[pos] = num;  
    }  
}
```

현재 요소인 num을 sub 배열에서 이분 탐색하면, num보다 큰 첫 번째 값의 위치가 반환된다.

`Arrays.binarySearch` API는 탐색된 키의 인덱스를 반환하며, 탐색된 값이 없는 경우에는 새 값을 `-(삽입 위치 - 1)`을 반환한다.
따라서 반환된 pos 값이 음수인 경우에는 `-(pos + 1)`을 취해 삽입 위치로 변경해준다.

이후 pos 값이 현재 sub 배열의 size와 동일하다면, 새로운 값을 삽입해야 하는 것이므로 sub 배열의 사이즈를 늘려주고 마지막 위치에 새로운 값을 삽입한다.
이외의 경우에는 현재 size보다 작은 인덱스를 가리키므로 기존 값을 대체해준다.

기존 값이 대체되기 때문에 sub 배열의 최종 상태는 LIS를 가리키지 않을 수 있다.
하지만 탐색 방향이 왼쪽에서 오른쪽이고, 현재 요소가 항상 삽입된 값 중 가장 오른쪽 값이기 때문에 sub 배열의 길이가 LIS의 길이와 일치하게 된다.

DP를 사용할 때와 다르게 N개의 요소에 대해 이분탐색을 수행하게 되므로 `O(NlogN)`의 시간 복잡도로 LIS의 길이를 구할 수 있다.
# 이분 탐색으로 실제 LIS 구하기
하지만 단순히 이분탐색만 사용하는 방법으로는 실제 LIS를 구할 수는 없다.
이는 이분탐색을 통해 값을 대체하는 과정에서 나중에 오는 요소를 사용해 SUB의 앞 부분을 갱신할 수 있기 때문이다.

간단한 예를 들자면 배열이 `[2, 3, 7, 8, 1]`로 주어진 경우에 최종 SUB 배열의 상태가 `[1, 3, 7, 8]`이 된다.
이때 1은 가장 마지막 요소기 때문에 절대 `[1, 3, 7, 8]`이 LIS가 될 수 없다.

실제 LIS를 구하기 위해서는 이분 탐색 과정에서 추가적인 처리가 필요하다.
먼저 현재 SUB 배열의 각 요소들이 실제 nums 배열에서 몇 번째 인덱스의 값인 지를 추적해야 한다.
또한 SUB 배열의 각 요소가 삽입, 변경될 때마다 SUB 배열 상에서 새로 변경된 요소의 이전 요소 참조를 기록해야 한다.

코드를 통해 자세히 살펴보자.
```java
int[] sub = new int[N];  
int[] subIndices = new int[N];  
int[] parent = new int[nums.length];  
Arrays.fill(parent, -1);  
int size = 0;  
for (int i = 0; i < nums.length; i++) {  
    int num = nums[i];  
    int pos = Arrays.binarySearch(sub, 0, size, num);  
    if (pos < 0) pos = -(pos + 1);  
    if (pos == size) {  
        sub[size] = num;  
        subIndices[size++] = i;  
    } else {  
        sub[pos] = num;  
        subIndices[pos] = i;  
    }  
    if (pos > 0) {  
        parent[i] = subIndices[pos - 1];  
    }  
}  
  
int[] result = new int[size];  
int k = subIndices[size - 1];  
int idx = size - 1;  
while (k >= 0) {  
    result[idx--] = nums[k];  
    k = parent[k];  
}
```

먼저 SUB 배열의 갱신이 왼쪽에서 오른쪽 방향으로 진행된다는 것이 중요하다.
이는 다시 말해 현재 위치를 결정하려는 요소가 SUB 배열의 다른 요소들보다 원본 배열 상에서 오른쪽에 위치한 것이 보장된다는 의미다.

이 점을 이해했다면 이제 SUB 배열의 마지막 요소가 변경되는 경우를 생각해보자.
기존 값이 변경될 수도 있고 새로운 값이 삽입돼 SUB 배열의 길이가 늘어날 수도 있다.
하지만 이 두 경우 모두 현재 요소가 삽입되거나 기존 값을 대체한다는 것은 명확하다.

즉, 현재 시점의 가장 오른쪽 요소가 가장 마지막 요소를 갱신하게 되므로, SUB 배열의 마지막 요소 갱신은 항상 실제 LIS의 마지막 요소인 것이 보장된다.

이전 요소를 가리키는 참조를 사용할 수 있는 것도 이와 비슷한 이유다.
이전 요소를 갱신하는 시점은 현재 요소가 변경되거나 삽입된 시점이고 앞서 얘기했듯이 현재 요소는 현재 시점의 가장 오른쪽 요소를 가리킨다.
이는 다시 말해 현재 요소 이전에 위치한 모든 요소가 반드시 원본 배열 상에서 현재 요소보다 왼쪽에 위치하게 된다는 것을 의미한다.

즉, 현재 요소에 대해 이전 참조를 구성할 경우, 해당 참조는 유효한 LIS의 일부분임이 보장된다.
이는 모든 위치에서 동일하게 적용되므로 각 위치에서 기록된 이전 참조는 유효한 LIS의 일부분임이 보장된다.

이제 앞서 설명한 두 가지 점들을 조합하면 된다.
SUB의 마지막 요소부터 시작해서, 이전 참조를 타고 역순으로 탐색하면 유효한 LIS를 구할 수 있다.