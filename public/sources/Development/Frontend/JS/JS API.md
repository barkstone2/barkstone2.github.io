---
created: 2024-07-30 16:54
updated: 2024-07-30 17:09
---
# Array
## 배열 생성 및 변환
### isArray()
- 배열인지 아닌지 검사하는 API
```js
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray("hello")); // false
```
### from()
- 유사 배열 객체나 반복 가능한 객체를 배열로 변환한다.
```js
console.log(Array.from("hello")); // ["h", "e", "l", "l", "o"]
```
### of()
- 전달된 인자를 요소로 갖는 새로운 배열을 생성한다.
```js
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
```
## 배열 요소 추가 및 제거
### push()
- 배열의 끝에 하나 이상의 요소를 추가하고, 배열의 새로운 길이를 반환합니다.
```javascript
const arr = [1, 2];
arr.push(3, 4);
console.log(arr); // [1, 2, 3, 4]
```
### pop()
- 배열의 마지막 요소를 제거하고 그 요소를 반환합니다.
```javascript
const arr = [1, 2, 3];
const last = arr.pop();
console.log(arr); // [1, 2]
console.log(last); // 3
```
### unshift()
- 배열의 시작에 하나 이상의 요소를 추가하고, 배열의 새로운 길이를 반환합니다.
```javascript
const arr = [2, 3];
arr.unshift(0, 1);
console.log(arr); // [0, 1, 2, 3]
```
### shift()
- 배열의 첫 번째 요소를 제거하고 그 요소를 반환합니다.
```javascript
const arr = [1, 2, 3];
const first = arr.shift();
console.log(arr); // [2, 3]
console.log(first); // 1
```
### 배열 요소 검색 및 필터링
### indexOf()
- 배열에서 특정 요소를 찾고, 그 첫 번째 인덱스를 반환합니다. 요소가 없으면 -1을 반환합니다.
```javascript
const arr = [1, 2, 3, 2];
console.log(arr.indexOf(2)); // 1
console.log(arr.indexOf(4)); // -1
```
### lastIndexOf()
- 배열에서 특정 요소를 찾고, 그 마지막 인덱스를 반환합니다. 요소가 없으면 -1을 반환합니다.
```javascript
const arr = [1, 2, 3, 2];
console.log(arr.lastIndexOf(2)); // 3
```
### find()
- 제공된 판별 함수를 만족하는 첫 번째 요소의 값을 반환합니다. 그런 요소가 없다면 `undefined`를 반환합니다.
```javascript
const arr = [5, 12, 8, 130, 44];
const found = arr.find(element => element > 10);
console.log(found); // 12
```
### findIndex()
- 제공된 판별 함수를 만족하는 첫 번째 요소의 인덱스를 반환합니다. 그런 요소가 없다면 -1을 반환합니다.
```javascript
const arr = [5, 12, 8, 130, 44];
const index = arr.findIndex(element => element > 10);
console.log(index); // 1
```
### filter()
- 제공된 함수의 테스트를 통과하는 모든 요소를 모아 새로운 배열로 반환합니다.
```javascript
const arr = [1, 2, 3, 4, 5];
const result = arr.filter(number => number > 2);
console.log(result); // [3, 4, 5]
```
### 배열 순회 및 변형
### forEach()
- 배열의 각 요소에 대해 제공된 함수를 한 번씩 실행합니다.
```javascript
const arr = [1, 2, 3];
arr.forEach(element => console.log(element));
// 출력: 1, 2, 3
```
### map()
- 배열의 모든 요소 각각에 대해 제공된 함수를 호출한 결과를 모아 새로운 배열을 생성합니다.
```javascript
const arr = [1, 2, 3];
const result = arr.map(x => x * 2);
console.log(result); // [2, 4, 6]
```
### reduce()
- 배열의 각 요소에 대해 제공된 리듀서 함수를 실행하여 단일 출력 값을 생성합니다.
```javascript
const arr = [1, 2, 3, 4];
const sum = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum); // 10
```
### reduceRight()
- 배열의 각 요소에 대해 제공된 리듀서 함수를 오른쪽에서 왼쪽으로 실행하여 단일 출력 값을 생성합니다.
```javascript
const arr = [1, 2, 3, 4];
const sum = arr.reduceRight((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum); // 10
```
### 배열 병합 및 슬라이싱
### concat()
- 인자로 주어진 배열이나 값들을 기존 배열에 합쳐서 새로운 배열을 반환합니다.
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const result = arr1.concat(arr2);
console.log(result); // [1, 2, 3, 4]
    ```
### slice()
- 배열의 일부를 선택하여 새로운 배열을 반환합니다. 원본 배열은 변경되지 않습니다.
```javascript
const arr = [1, 2, 3, 4, 5];
const sliced = arr.slice(1, 3);
console.log(sliced); // [2, 3]
```
### splice()
- 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경합니다.
```javascript
const arr = [1, 2, 3, 4];
arr.splice(1, 2, 'a', 'b'); // 1번째 인덱스부터 2개의 요소를 삭제하고, 'a', 'b'를 추가
console.log(arr); // [1, 'a', 'b', 4]
```
### 배열 정렬 및 역순
### sort()
- 배열의 요소를 정렬합니다. 기본적으로 요소들을 문자열로 변환하고 유니코드 코드 포인트 순서로 정렬합니다.
```javascript
const arr = [3, 1, 4, 1, 5, 9];
arr.sort();
console.log(arr); // [1, 1, 3, 4, 5, 9]
```
### reverse()
- 배열의 요소 순서를 반대로 뒤집습니다.
```javascript
const arr = [1, 2, 3];
arr.reverse();
console.log(arr); // [3, 2, 1]
```
### 기타 메서드
### join()
- 배열의 모든 요소를 문자열로 결합하여 반환합니다. 기본 구분자는 쉼표(,)입니다.
```javascript
const arr = [1, 2, 3];
const str = arr.join('-');
console.log(str); // "1-2-3"
```
### includes()
- 배열에 특정 요소가 포함되어 있는지 확인하고, 포함되어 있으면 `true`, 아니면 `false`를 반환합니다.
```javascript
const arr = [1, 2, 3];
console.log(arr.includes(2)); // true
console.log(arr.includes(4)); // false
```
### every()
- 배열의 모든 요소가 제공된 함수의 테스트를 통과하는지 확인합니다.
```javascript
const arr = [1, 2, 3, 4];
const allBelowFive = arr.every(x => x < 5);
console.log(allBelowFive); // true
```
### some()
- 배열의 어떤 요소라도 제공된 함수의 테스트를 통과하는지 확인합니다.
```javascript
const arr = [1, 2, 3, 4];
const someBelowTwo = arr.some(x => x < 2);
console.log(someBelowTwo); // true
```