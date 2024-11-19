---
created: 2024-07-27 11:18
updated: 2024-08-17 14:56
tags:
  - 리액트
  - React
  - JS
---
# 정의
함수형 컴포넌트에서 상태 관리를 할 수 있게 해주는 훅
클래스형 컴포넌트에서는 상태 관리를 위해 this.state와 this.setState를 사용했지만, 함수형 컴포넌트에서는 useState 훅을 사용하여 상태를 관리할 수 있다.
단일 값뿐만 아니라 객체나 배열도 상태로 선언할 수 있다.
객체나 배열의 내부 요소를 변경하는 것뿐만 아니라 객체, 배열 자체의 참조를 변경하는 경우에도 상태 변경을 감지한다.
# useState 훅의 사용법
```jsx
import { useState } from 'react';
function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p>현재 카운트: {count}</p>
			<button onClick={() => setCount(count+1)}>
				카운트 증가
			</button>
		</div>
	);
}
```

- useState는 초기 상태를 인수로 받는다. 위 예제에서는 `useState(0)`으로 초기 상태를 0으로 설정했다.
- 이 초기 상태는 처음 렌더링될 때만 사용되며, 이후 상태는 업데이트 함수에 의해 변경된다.

- useState는 상태 변수와 해당 상태를 업데이트하는 함수를 배열 형태로 반환한다.
- 배열 비구조화 할당을 통해 각각의 값을 갭려 변수에 할당할 수 있다.

- 상태를 업데이트할 때는 반환된 함수 `setCount`를 사용한다. 이 함수는 새로운 상태 값을 인수로 받는다.
- `setCount(count + 1)` 같이 현재 상태에 1을 더한 값을 새로운 상태로 설정할 수 있다.
- 상태가 업데이트 되면 컴포넌트는 재렌더링된다.
