---
created: 2024-07-23 17:04
updated: 2024-11-06 10:18
tags:
  - 리액트
  - React
  - JSX
  - JS
---
# JSX란
JSX는 JavaScript XML의 약자로 JavaScript 내에서 XML 또는 HTML과 유사한 구문을 사용하게 해준다.
```jsx
const element = <h1>Hello, World!</h1>;
```
JSX는 템플릿 언어처럼 보이지만 자바스크립트를 기반으로 하고 있으며, 리액트와 함께 사용하여 UI가 실제로 어떻게 보일지 설명하기를 권장한다. JSX는 리액트 요소를 만들며, 이 요소가 DOM에 렌더링 된다.
# JSX 문법
## 자바스크립트 표현식 사용
JSX 안에 중괄호를 사용해 자바스크립트 표현식을 포함시킬 수 있다.
JSX를 여러 줄로 나눈다면 괄호로 묶어 자동 세미콜론 삽입을 피할 수 있다.
```jsx
function formatName(user) {
	return user.firstName + ' ' + user.lastName;
}

const user = {
	firstName: 'Harper',
	lastName: 'Perez'
};

const element = (
	<h1>
		Hello, {formatName(user)}!
	</h1>
)
```
## if 문이나 for 반복 내에서 사용하기
JSX는 트랜스파일링이 끝나면 정규 자바스크립트 호출이 되고 자바스크립트 객체로 인식된다.
따라서 if 문이나 for 반복 내에서 JSX를 사용하거나, 변수에 할당하거나, 매개 변수로 전달하거나, 함수에서 반환할 수 있다.
```jsx
function getGreeting(user) {
	if (user) {
		return <h1>Hello, {formatName(user)}!</h1>;
	}
	return <h1>Hello, Stranger.</h1>;
}
```
## 속성에 리터럴 할당
속성에 따옴표를 이용해 문자열 리터럴을 정의할 수 있다.
```jsx
const element = <div tabIndex="0"></div>
```
## 속성에 자바스크립트 표현식 할당
속성에 중괄호를 이용해 자바스크립트 표현식을 포함할 수 있다.
```jsx
const element = <img src={user.avatarUrl}></img>;
```

> [!attention] 
> JSX는 HTML보다 자바스크립트에 가깝기 때문에 React DOM은 HTML 속성 이름 대신 ==camelCase== 속성 이름 컨벤션을 사용한다. 예를 들어 JSX에서 class는 className이 되며, tabindex는 tabIndex가 된다.
## 빈 태그는 닫아주기
태그가 비어있다면 `/>`를 이용해 닫아줘야 한다.
```jsx
const element = <img src={user.avatarUrl} />;
```
# JSX 이스케이프 처리
JSX 태그는 자식을 가질 수 있으며 인젝션 공격에 안전하다. 이는 리액트 돔이 렌더링 되기 전에 JSX 내에 포함된 모든 값을 이스케이프 처리하기 때문이다.

[[바벨(Babel)|Babel]]은 JSX를 React.createElement() 호출로 트랜스파일링한다. 아래 두 코드는 동일하다.
```jsx
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
```

```jsx
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```

React.createElement()는 결과적으로 아래와 같은 코드를 생성한다.
```jsx
// Note: this structure is simplified
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world'
  }
};
```
이 객체는 리액트 엘리먼츠라고 부르며 화면에서 볼 수 있는 내용에 대한 설명이라고 보면된다. 리액트는 이 객체를 읽어들이고 사용하여 DOM을 구성하고 최신 상태를 유지한다.
# 용도
리액트 컴포넌트를 작성할 때 주로 사용된다. 브라우저는 JSX를 이해하지 못하므로 Babel 같은 트랜스파일러를 사용하여 JSX를 일반 JavaScript로 변환해야 한다. 보통 이 변환 과정에서 JSX는 React.createElement 호출로 변환된다.
```js
import React from 'react';
import ReactDOM from 'react-dom';

// HelloWorld라는 간단한 컴포넌트를 정의, JSX 반환
function HelloWorld() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>This is a simple React component using JSX.</p>
    </div>
  );
}

// 정의한 컴포넌트를 HTML의 root 요소에 렌더링
ReactDOM.render(<HelloWorld />, document.getElementById('root'));
```

CPA를 사용할 경우 자동으로 바벨과 웹팩을 설정해주며, Next.js 같은 프레임워크도 내부적으로 바벨을 사용해 JSX를 처리한다.
Vite 같은 빌드 도구를 쓰는 경우에도 내부적으로 JSX를 처리할 수 있는 설정이 제공되므로 이런 도구들을 사용할 때는 개발자가 직접 바벨을 설정하지 않아도 된다.ㅅ