---
created: 2024-08-05 11:50
updated: 2024-08-12 09:41
tags:
  - JS
  - JavaScript
  - ECMAScript
  - ES5
---
ECMAScript의 다섯 번째 에디션으로 더 강력하고 안전하며 유지보수가 쉬운 코드를 작성할 수 있는 도구가 제공되었다.
# 주요 특징
## [[Strict Mode(엄격 모드)]]
더 안전한 코드를 작성할 수 있도록 느슨한 문법을 제한하는 Strict Mode가 추가되었다.
스크립트나 함수의 시작 부분에 `"use strict"`를 추가하면 엄격 모드가 활성화 된다.
## 문자열 개선
### 속성을 통한 문자열 접근
ES5부터는 속성 접근을 통해 특정 인덱스의 문자를 반환 받을 수 있게 되었다.
```js
var str = "HELLO WORLD";
str[0]; // H 반환
```
### 여러 라인에 걸친 문자열 선언
백슬래쉬를 사용해 여러 라인에 걸쳐 문자열을 선언하는 기능이 추가되었다.
```js
"Hello \
World!";
```

> [!caution]+ 주의
> 일부 브라우저에서는 지원되지 않을 수 있다. 아래의 방법이 더 안전하다.
> ```js
> "Hello " +
> "World!";
> ```
## JSON 객체
JSON 데이터를 다루기 위한 네이티브 JSON 객체가 도입되었다.
`JSON.stringify()`와 `JSON.parse()` 메서드가 추가되었다.
## Array 메서드 추가
`isArray()`, `forEach()`, `map()`, `filter()`, `reduce()`, `reduceRight()`, `every()`,  `some()`, `indexOf()`, `lastIndexOf()` 메서드가 추가되었다.
## Date 메서드 추가
`now()`, `toISOString()`, `toJSON()` 메서드가 추가되었다.
## Object 메서드 추가
`Object.create()`, `Object.keys()`, `Object.defineProperty()` 등의 메서드가 추가되었다.
오브젝트 관리 메서드, 오브젝트 보호 메서드가 추가되었다.
## 마지막 콤마 허용
객체와 배열 정의에서 마지막 콤마가 허용되었다.
```js
person = {
	firstName: "John",
	lastName: " Doe",
	age: 46,
}
points = [
	1,
	5,
]
```

> [!warning] 주의
> JSON은 마지막 콤마를 허용하지 않는다.
## 프로퍼티 getter와 setter 추가
객체 메서드로 getter와 setter를 추가할 수 있게 되었다.
```js
var person = {
	firstName: "MinSu",
	lastName: "Kim",
	get fullName() {
		return this.firstName + " " + this.lastName;
	},
	set fullName(name) {
		var parts = name.split(" ");
		this.firstName = parts[0];
		this.lastName = parts[1];
	}
};

console.log(person.fullName); // MinSu Kim
person.fullName = "JuHo Lee";
console.log(person.firstName); // JuHo
console.log(person.lastName); // Lee
```
## Property Attributes
객체 속성의 특성을 정의할 수 있는 기능이 추가되었다.
속성은 데이터 속성과 접근자 속성으로 나뉜다.
이를 통해 객체 속성의 읽기 전용, 열거 가능 여부, 재정의 가능 여부 등을 지정할 수 있다.
데이터 속성에는 value, writable, enumerable, configurable 속성이 있다.

defineProperty로 속성을 정의할 수 있으며 defineProperties 사용 시 여러 속성을 한 번에 정의할 수 있다.
```js
var person = {};
Object.defineProperty(person, "name", {
	value: 'Kim',
	writable: false, // 속성 변경 불가
	enumerable: true, // 속성 열거 가능
	configurable: false // 속성 삭제, 재정의 불가능
});

console.log(person.name); // Kim

// writable이 false라 속성 값 변경 불가
person.name = 'Park';
console.log(person.name); // Kim

// configurable이 false라 속성 삭제 불가능
delete person.name;
console.log(person.name); // Kim

// 객체의 모든 열거 가능한 속성 나열
for (var key in person) {
	console.log(key); // name
}
```