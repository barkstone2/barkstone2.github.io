---
created: 2025-01-01 09:01
updated: 2025-01-01 10:14
tags:
  - Next/Router
---
App Router 방식은 기본적으로 모든 컴포넌트를 서버 컴포넌트로 처리한다. 간단히 말해 SSR 방식으로 컴포넌트를 사용하게 된다.
# 탑 레벨 폴더
App Router는 `app` 디렉토리 하위의 폴더 구조를 라우팅 경로로 인식한다.
예를 들어 `app/articles`, `app/users` 와 같은 디렉토리가 있다면 `domain/articles`, `domain/users`에 대한 요청이 각 디렉토리의 컴포넌트를 사용하게 된다.

선택적으로 `src/app` 경로를 사용할 수도 있으며, [[Page Router]]와 동시에 사용할 수도 있다.
![[top-level-folders.avif]]
# 컴포넌트 구조
아래 파일들에 정의된 리액트 컴포넌트들은 계층적인 구조로 렌더링된다.
- layout : 페이지를 이루는 컴포넌트 중 가장 상위 개념이다. 공통 적용 UI로 하위 컴포넌트가 변경되어도 리렌더링되지 않는다.
- template : layout과 비슷하게 공통 UI를 정의할 때 사용되지만, 하위 페이지 상태 변경시 리렌더링이 필요한 UI 요소를 여기에 정의한다.
- error : 페이지 에러 발생시 보여지는 UI를 정의하는 곳이다.
- loading : 로딩 발생 시 보여지는 UI를 정의하는 곳이다.
- not-found : 경로에 존재하는 페이지가 없을 경우 렌더링 되는 UI를 두는 곳이다.
- global-error : app 디렉토리의 root 경로에 추가할 수 있는 파일로 전역 에러 담당 UI를 두는 곳이다.
- page : 해당 라우팅 경로에 대한 기본 페이지다.

![[file-conventions-component-hierarchy.avif]]

중첩 라우팅을 사용하는 경우 아래와 같이 중첩된 구조를 가지게 된다.
![[nested-file-conventions-component-hierarchy.avif]]
# 중첩 라우팅
중첩 라우팅은 단순히 폴더 구조를 중첩으로 정의하면 된다.
`folder/folder` 구조를 사용할 경우 중첩 라우팅이 정의된다.
# 동적 라우팅
동적 라우팅을 사용하려면 아래와 같이 `[파라미터명]` 형태로 디렉토리 구조를 설정하면 된다.
![[동적_라우팅_디렉토리.png|200]]
이후 `domain/board/31`과 같이 요청하게 되면, 해당 디렉토리 아래에 있는 page.tsx 컴포넌트가 반환된다.
## 파라미터 사용
`domain/board/31`처럼 호출된 컴포넌트에서 동적 파라미터를 사용해야하는 경우 아래와 같이 컴포넌트를 구성할 수 있다.
![[동적_라우팅_컴포넌트.png]]

위 코드를 보면 `params`를 사용할 때 `await`를 사용하고 있는 것을 볼 수 있다. 그런데 WebStorm에서 불필요한 `await` 사용이라고 표시되는건 왜일까?

결론부터 말하자면 Next 15버전부터 `params`가 비동기로 변경되었기 때문에 `await` 사용을 하지 않으면 콘솔에 경고가 출력된다.
이외에도 `searchParams`, `cookies()` 등도 비동기로 변경되었으며, 자세한 내용은 [공식문서](https://nextjs.org/docs/messages/sync-dynamic-apis)에서 확인할 수 있다.

다만, 현재는 직접 접근을 허용하고 있기 때문에 `await`를 사용하지 않고 접근해도 경고만 출력될 뿐 정상적으로 동작한다. 웹스톰이 불필요한 `await` 사용이라고 표기하는 이유도 이 때문이다.
공식문서에 따르면 이후 버전에서는 해당 기능들이 완전히 비동기로 전환될 예정이다.
# 라우팅 그룹
`(folder)` 형식은 라우팅 그룹을 정의하는데 사용된다.
라우팅 그룹은 URL 경로에 영향을 미치지 않으면서 라우팅을 구성할 수 있게 해준다.
![[route-group-organisation.avif|500]]
이때  각 `(folder)` 아래에 `layout`을 정의하는 경우, 동일한 URL 구조를 사용하면서 서로 다른 레이아웃을 각 그룹에 사용할 수 있게 된다.
![[route-group-multiple-layouts.avif|500]]
# 비공개 폴더
`_folder` 형식을 사용하면 해당 폴더는 라우팅 대상에서 제외된다.
![[project-organization-private-folders.avif|500]]
# 페이지 간 라우팅
페이지 사이의 라우팅을 처리하는 가장 기본적인 방법은 `<Link>` 컴포넌트를 사용하는 방법이다.
```typescript
import Link from 'next/link'
 
export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

두 번째는 `useRouter`를 사용하는 방법으로 `onClick` 이벤트 등에서 사용할 수 있다.
단, `useRouter`는 클라이언트 컴포넌트에서만 사용할 수 있다.
```typescript
'use client'
 
import { useRouter } from 'next/navigation'
 
export default function Page() {
  const router = useRouter()
 
  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

서버 컴포넌트에서는 `redirect` 함수를 사용해 `useRouter`를 대체할 수 있다.
```ts
import { redirect } from 'next/navigation'
 
async function fetchTeam(id: string) {
  const res = await fetch('https://...')
  if (!res.ok) return undefined
  return res.json()
}
 
export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  if (!id) {
    redirect('/login')
  }
 
  const team = await fetchTeam(id)
  if (!team) {
    redirect('/join')
  }
 
  // ...
}
```