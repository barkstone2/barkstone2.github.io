---
created: 2024-08-05 10:47
updated: 2024-08-07 14:15
tags:
  - JS
  - JavaScript
  - ECMAScript
  - ES6
---
ECMAScript의 주요 업데이트 중 하나로 언어에 여러 가지 새로운 기능과 문법을 도입했다.
가독성 및 유지보수성이 향상되고, 비동기 처리가 개선됐으며, 코드의 모듈화를 지원한다.
새로운 자료구조가 도입되고, 향상된 함수 기능을 제공한다.
# 주요 특징
## let과 const
블록 스코프에 대해 정의할 수 있는 let 키워드가 추가되었다. var 키워드와 다르게 블록 내에서만 접근이 가능하다.
```js
var x = 10; 
// x is 10
{
	let x = 2; 
	// x is 2  
}
// x is 10
```

상수 선언을 위해 사용되는 const 키워드가 추가되었다. 선언과 동시에 초기화되어야 하며, 이후 재할당이 불가능하다.
```js
const PI = 3.141592;
PI = 3.14 // 에러
```
## [[함수 선언 방식의 차이|화살표 함수]]
함수 표현을 더 간결하게 작성할 수 있도록 하는 문법이 추가되었다.
function 키워드 대신 `=>` 를 사용하여 짧은 문법을 제공한다.
```js
const x = (x, y) => { return x * y };
```
## 템플릿 문자열
백틱(\`\`)을 사용하여 문자열을 나타내는 기능이 추가되었다.
문자열 내부에서 `${expression}` 형태로 표현식을 포함할 수 있다.
여러 줄 문자열도 지원한다.
## [[비구조화 할당]]
배열이나 객체의 구조를 분해하여 변수에 값을 쉽게 할당할 수 있게 하는 문법이 추가되었다.
## [[스프레드 연산자]]
iterable 객체를 객체에 포함된 요소들로 확장하는 문법이 추가되었다.
## for...of 루프
이터러블 객체(Array, String, Map, Set, NodeList 등)를 순회하는데 사용되는 루프 구문이 추가되었다.
of 앞에 선언되는 변수는 const, let, var로 선언될 수 있다.
```js
const arr = [1, 2, 3];
for (const value of arr) {
	console.log(value);
}
```
## 새로운 자료구조 : Map과 Set
맵과 셋 자료구조가 추가되었다.
```js
const map = new Map();
map.set('key', 'value');

const set = new Set([1, 2, 3, 4]);
set.add(5);
```
## 클래스
JavaScript 오브젝트를 위한 템플릿이 클래스가 추가되었다. `class` 키워드를 사용하면 클래스를 선언할 수 있으며 항상 `constructor()` 메서드를 추가해야 한다.
클래스는 오브젝트가 아니며 오브젝트를 위한 템플릿이다.
```js
class Person {
	constructor(name) {
		this.name = name;
	}
	greet() {
		console.log(`Hello, ${this.name}`)
	}
}
```
## 프로미스(Promise)
비동기 작업을 처리하기 위한 객체가 추가되었다.
프로미스는 생산 코드와 소비 코드를 연결하는 역할을 한다.
생산 코드는 시간을 필요로 하고, 소비 코드는 결과를 기다려야 한다.
```js
const promise = new Promise((resolve, reject) => {
	// 생산 코드
	resolve(); // 성공 했을 때
	reject(); // 실패 했을 때
})

promise.then(
	// 소비 코드
	function(value) {/* 성공 했을 때의 코드 */},
	function(error) {/* 실패 했을 때의 코드 */}
);
```
## 심볼(Symbols)
새로운 원시 데이터 타입이 추가되었다.
다른 코드에서 접근이 불가능한 고유하고 보이지 않는 식별자를 나타낸다.
주로 객체의 프로퍼티 키로 사용된다.
```js
const person = {  
  firstName: "John",  
  lastName: "Doe",  
  age: 50,  
  eyeColor: "blue"  
};  
  
let id = Symbol('id');  
person[id] = 140353;  
// person[id] = 140353  
// person.id는 undefined
```
> [!info] 심볼은 항상 유니크하다.
> 같은 디스크립션을 가진 심볼을 생성하더라도 서로 다른 심볼이다.
> ```js
> Symbol("id") == Symbol("id"); // false
> ```
## Default Parameters
함수의 매개변수에 기본값을 지정할 수게 되었다.
```js
function multiply(a, b = 1) {
	return a * b;
}
```
## 함수 Rest 파라미터
함수 매개변수에서 가변 인자를 배열로 묶어주는 기능이 추가되었다.
```js
function sum(...args) {
	return args.reduce((acc, val) => acc + val, 0);
}
```
## String 메서드 추가
String 프로토타입에 새로운 메서드들이 추가되었다.
- includes(), startsWith(), endsWith()
## Array 메서드 추가
Array 프로토타입에 새로운 메서드들이 추가되었다.
- entries(), from(), keys(), find(), findIndex()
## Math 메서드 추가
Math 객체에 새로운 메서드들이 추가되었다.
- `trunc()`, `sign()`, `cbrt()`, `log2()`, `log10()`
## Number에 새로운 프로퍼티와 메서드 추가
Number에 새로운 프로퍼티와 메서드가 추가되었다.
- `EPSILON`, `MIN_SAFE_INTEGER`, `MAX_SAFE_INTEGER`
- `isInteger()`, `isSafeInteger()`
## 글로벌 메서드 추가
새로운 글로벌 메서드가 추가되었다.
- `isFinite()`, `isNaN()`
## 모듈
import와 export 키워드를 사용하여 모듈을 정의하고 불러올 수 있게 되었다. 이는 코드의 재사용성을 높이고 유지보수를 용이하게 한다.
```js
// 이름이 부여된 export 사용
export const pi 3.14;
import { pi } from './module.js';

// 기본 export 사용
export default const value = 1.5;
import value from './value.js';
```
## 이터레이터 인터페이스
컬렉션을 순회하기 위한 이터레이터 인터페이스가 추가되었다.
## [[제너레이터]]
함수의 중간 결과를 반환하기 위한 제너레이터가 추가되었다.
## Proxy
객체의 기본 작업을 가로챌 수 있는 Proxy 객체가 추가되었다.
속성 읽기, 할당, 삭제 등의 동작을 가로채고 제어할 수 있는 메커니즘을 제공한다.
주로 속성 읽기 및 쓰기 조작, 유효성 검사 및 데이터 무결성 검사, 데이터 로깅 및 디버깅, 동적 속성 생성 등의 목적으로 사용한다.
```js
const target = {
    message1: "hello",
    message2: "everyone",
};

const handler = {
    get: function (target, property) {
        if (property === "message1") {
            return "world";
        }
        return target[property];
    },
};

const proxy = new Proxy(target, handler);

console.log(proxy.message1); // world
console.log(proxy.message2); // everyone
```
## Reflect
기존의 동작을 쉽게 수행할 수 있도록 도와주는 정적 메서드 모음 클래스가 추가되었다.
주로 객체 메서드 단순화, Proxy 트랩과의 결합, 동작의 성공 여부 확인에 사용된다.
```js
const target = {
    message: "hello",
};

// 기존 방식
console.log(target.hasOwnProperty("message")); // true

// Reflect를 사용한 방식
console.log(Reflect.has(target, "message")); // true

// Proxy와 함께 사용
const handler = {
    get: function (target, property) {
        console.log(`Getting ${property}`);
        return Reflect.get(target, property);
    },
};

const proxy = new Proxy(target, handler);
console.log(proxy.message); // Getting message \n hello
```
## 객체 리터럴 기능
### 단축 속성명
객체의 속성을 정의할 때 변수명을 키로, 변수의 값을 값으로 자동 할당할 수 있는 기능이 추가되었다.
```js
const name = 'Alice';
const obj = { name };
```

이는 객체 정의 뿐만 아니라 메서드에서 객체를 반환할 때도 그대로 활용할 수 있다.
```js
function createPerson(name, age) {
	return { name, age };
}
```
### 계산된 속성명
대괄호를 사용하여 동적으로 키를 정의할 수 있는 기능이 추가되었다.
```js
const key = 'greeting';
const obj = {
    [key]: 'Hello',
};

console.log(obj); // { greeting: 'Hello' }
```
### 메서드 축약 표현
메서드를 정의할 때 function 키워드를 생략할 수 있게 되었다.
```js
const obj = {
    sayHello() {
        console.log('Hello');
    },
};

obj.sayHello(); // Hello
```