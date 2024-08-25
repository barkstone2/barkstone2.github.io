---
created: 2024-07-27 11:41
updated: 2024-08-17 14:54
tags:
  - 리액트
  - React
  - JS
---
# 정의
- useRef는 DOM 요소나 변수의 변화를 감지하지 않고 유지하고 싶을 때 사용하며 DOM 요소 접근이나 상태 변수 유지 목적으로 사용한다.
- useRef를 사용하면 DOM 요소에 접근할 수 있다.
- useRef로 저장된 값은 컴포넌트가 다시 렌더링될 때에도 값이 유지된다. 컴포넌트 내부에 선언된 일반 변수는 컴포넌트가 리렌더링되면 초기값으로 초기화된다.
- useRef로 저장된 값이 변경되더라도 컴포넌트는 다시 렌더링되지 않는다.
# DOM 요소 접근
- document.querySelector 같은 DOM 접근 메서드를 대체할 수 있다.
- 리액트 방식으로 DOM 요소에 접근할 수 있어 코드의 일관성이 유지된다.
- 또한 리액트의 렌더링 사이클과 잘 통합되어, 컴포넌트가 렌더링된 후에 안전하게 DOM 요소에 접근할 수 있다.
```jsx
import { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Focus the input</button>
    </div>
  );
}
```
# 상태 변수 유지
- 컴포넌트가 렌더링 되어도 유지되는 값이 필요할 때 사용한다. 컴포넌트 선언 내부에서 정의한다.
```jsx
import { useRef, useState } from 'react';

function Timer() {
  const timerIdRef = useRef(null);
  const [count, setCount] = useState(0);

  const startTimer = () => {
    timerIdRef.current = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerIdRef.current);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

> [!question] 왜 전역 변수 대신 useRef를 사용할까?
> JSX 파일 내부에 선언된 전역 변수도 컴포넌트의 렌더링과 독립적으로 값을 유지할 수 있다.
> 그렇다면 왜 이런 전역 변수를 사용하는 대신 useRef를 사용하는 것일까?
> 먼저 전역 변수로 선언된 변수는 해당 파일 내에 정의된 여러 컴포넌트 인스턴스가 공유할 수 있다. 이때 각 컴포넌트 인스턴스가 변수의 값을 동시에 변경할 수 있고 이로 인해 동시성 문제가 발생하게 된다.
> 그 뿐만 아니라 전역으로 선언된 변수를 관리하는 데도 어려움이 있다. 어떤 변수가 어떤 컴포넌트에서 사용되는 것인지 쉽게 알기 힘들다.
> 반면 useRef를 사용하면 각 컴포넌트 인스턴스에서 독립된 참조를 가지고, 컴포넌트 선언 내부에 필요한 상태가 정의되어 있으므로 가독성이 증대된다.