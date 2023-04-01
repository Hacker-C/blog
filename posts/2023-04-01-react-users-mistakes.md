---
title: 'React 新手最容易犯的 7 个错误'
tags:
  - React
layout: post
date: '2023-04-01'
description: '对于刚入门的 React 新手，比较容易犯的错误和忽略的细节'
---

# React 新手最容易犯的 7 个错误

## 前言

最近，React 的官方网站（https://react.dev）正式发布，并将旧的文档地址也重定向到了新的官方网站。但是，如果你需要访问旧的 React 文档，你需要前往存档备份地址（https://legacy.reactjs.org）。在此之前，新的 React 文档一直处于测试阶段，我也阅读了一段时间，新文档对于新手来说非常友好，甚至在文档中特别提示了容易出错的地方。

本文结合了我自己的学习过程，总结出了 React 开发中新手最容易犯的 7 个错误。

## 1. state 的滥用

当我们并不需要在每次变量值发生改变时都监听它，而只需要在状态改变后从中读取值的时候，可以使用 ref 替代 state。每次更新状态都会触发重渲染，而修改 ref.current 不会引起不必要的 rerender，因此可以使用 ref 避免此类问题。

```tsx
export default function StateToRef() {
  const emailRef = useRef()
  const handleSubmit = (evt) => {
    // 只需要点击提交后的值
    evt.preventDefault()
    console.log(emailRef.current.value)
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">email</label>
      <input 
        type="text"
        ref={emailRef}
        name="email"
        id="email"
      />
    </form>
  )
}
```

## 2. 使用过多的 state

很多初学者在组织状态的时候，对于多个有关联的数据，喜欢用多个 useState，这就可能会写出下面这种冗余的代码。

```tsx
export default function Form() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    // 处理表单提交逻辑
  }
  return (
    <form onSubmit={handleSubmit}>...</form>
  )
}
```

但其实使用一个对象就可以组织这些状态了：

```tsx
export default function Form() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    age: ""
  })
  return (
    <form onSubmit={handleSubmit}>...</form>
  )
}
```

## 3. 不使用 useState 的 setter 回调函数形式

在使用 useState 的更新函数 setState 的时候，可能只知道直接传值的方式，而忘了回调函数的形式。以下列代码为例，在点击 async add 后，然后连续点击几次 add，会发现 count 先增后减。

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  const addOne = () => {
    setCount(count + 1)
  }
  const asyncAddOne = () => {
    setTimeout(() => {
      setCount(count + 1)
    }, 2000)
  }
  return (
    <>
    <h1>{count}</h1>
    <button onClick={addOne}>add</button>
    <button onClick={asyncAddOne}>async add</button>
    </>
  )
}
```

这是因为 React 中的 state 经常被描述为 snapshot(快照)，在调用 useState 时，React 会使用这个快照提供该次渲染的状态快照。虽然更新状态会使用新的状态值进行另一个渲染，但不会影响已经运行的事件中的快照中的 count 变量。 在点击 asyncAddOne 后，需要两秒钟才能将该事件添加到异步队列中，当同步任务执行完毕后，异步任务才会执行。 在多次点击 addOne 后，每次都会创建一个新的快照，包括 asyncAddOne 内部的更新，但是它拿到的 count 仍然是最初的值，所以最终的结果只会加一。

解决这个问题的方法是使用 setXxx 传入更新函数的形式，而不是直接传递状态值。使用这种方式，我们可以获得更新后的状态值，并立即执行其他操作。具体来说，我们应该使用 setXxx 的回调函数形式，它可以接受一个函数作为参数，该函数将返回下一个状态的值。

例如，我们可以将代码改为：

```tsx
function Counter() {
  const [count, setCount] = useState(0)

  function addOne() {
    setCount(count + 1)
  }

  function asyncAddOne() {
    setTimeout(() => {
      setCount(prevCount => prevCount + 1)
    }, 2000);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={addOne}>Add One</button>
      <button onClick={asyncAddOne}>Async Add One</button>
    </div>
  )
}
```


## 4. 多余的 useEffect

虽然 useEffect 是 React 中最常用的 Hook 之一，但有时候不一定需要 useEffect。例如下面这段代码：

```jsx
function App() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [fullName, setFullName] = useState('')
  useEffect(() => {
    setFullName(`${firstName} ${lastName}`)
  }, [firstName, lastName] )
  return (
    <div>
      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
      <p>Full name: {fullName}</p>
    </div>
  )
}
```

我们没必要监听 fullName 和 lastName 来更新 fullName，在这里我们可以利用 React 的 rerender（重渲染）特性——即每次状态发生变化，React 会对组件进行比较，并进行必要的 DOM 更新，让组件处于最新状态。数据从上向下流动，代码自上向下执行，那么就可以使用一个 “计算属性” 来更新 fullName。

```jsx
function App() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const fullName = `${firstName} ${lastName}`
  
  return (
    <div>
      <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
      <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
      <p>Full name: {fullName}</p>
    </div>
  )
}
```

## 5. 将引用类型数据作为 useEffect 的依赖参数传入

下面的代码中，传入了一个 JS 对象作为依赖源，每次点击 button 触发 rerender 的时候，这个副作用都会执行，影响性能。

```jsx
function ObjectToUseEffect() {
  const [count, setCount] = useState(0)
  const item = { age: 30 }
  useEffect(() => {
    console.log('age changed')
  }, [item])
  return (<>
    <button onClick={() => setCount(count + 1)}>{count}</button>
  </>)
}
```

这是因为每次都会创建一次新的 object，导致 useEffect 认为每次的都不一样（useEffect 使用 Object.is 比较），从而触发副作用。解决方法是使用 useMemo 保存这个对象，仅当依赖数组中的某项发生变化才执行副作用。

```jsx
function ObjectToUseEffect() {
  const [count, setCount] = useState(0)
  const item = { age: 30 }
  const memoItem = useMemo(() => item, [])
  useEffect(() => {
    console.log('age changed')
  }, [memoItem])
  return (<>
    <button onClick={() => setCount(count + 1)}>{count}</button>
  </>)
}
```

## 6. 混淆 useEffect 依赖参数不写参数和写空数组的区别

现在有一个需求，编写一个计数器，要求每隔一秒计数加一。如果没有注意 useEffect 的依赖参数问题，就有可能写出下面的代码。

```jsx
function TimeCounter() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
  })
  return <h1>{count}</h1>
}
```

上面代码运行的结果是 count 非正常的增加，会越来越快，这是因为 useEffect 没有写参数的时候，是默认每一次组件 render 的时候都会执行，因此内存里就创建了多个 setInterval，来对 count 进行修改。一种解决办法是，在组件每次渲染之前，清除当前的副作用函数，也就是在 useEffect 中 return 一个副作用清理函数，它将在组件销毁或者重新渲染前执行，这样就能保证每次渲染都保持只有一个计时器。

```jsx
function TimeCounter() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  })
  return (<>
    <h1>{count}</h1>
  </>)
}
```

但其实这样优化还不好，因为会频繁的创建和销毁计时器。可以给 useEffect 传入一个空数组作为依赖，这样只会在组件创建的时候执行一次，就能保证只会创建一个计时器了。然后在组件卸载前，清理计时器。

```jsx
function TimeCounter() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count => count + 1)
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  return (<>
    <h1>{count}</h1>
  </>)
}
```

## 7. 对 useState 的 nextState 参数进行修改

useState 的更新函数 setXxx 可以接收一个 nextState 函数作为参数，可以拿到上一次渲染的状态值，返回下一个状态。那么这里拿到的上一个状态值能不能修改呢？先看下的代码：

```jsx
function Counter() {
  const [count, setCount] = useState(0)
  return (<>
    <button onClick={() => {
      setCount(pre => {
        pre = pre + 1
        return pre
      })
    }}>{count}</button>
  </>)
}
```

这段代码看起来似乎没什么问题，也能到达如期效果，但其实 nextState 函数的形参是不能修改的。这里之所以能正常运行，是因为这里的 count 是基本类型，返回一个基本类型，JS 会认为是不同的，因此还是会触发 rerender。但如果是复杂类型，JS 传参会按共享传递，因此相当于直接修改了状态的值，但是返回的是同一个引用，因此 react 不认为状态变化了，也就不会触发重渲染。比如下面这种情况，点击之后，react 内部状态确实改变了，但页面不会更新：

```jsx
function TimeCounter() {
  const [count, setCount] = useState({
    value: 0
  })
  return (<button onClick={() => {
      setCount(pre => {
        pre.value++
        return pre
      })
    }}>{count.value}</button>)
}
```

总结一下 useEffect 的四个执行回调函数而产生副作用的时机：
1. 不提供任何依赖参数：在组件每次 render 执行
    ```jsx
    useEffect(() => {}) 
    ```
2. 提供空数组：仅在组件初次 render 执行
    ```jsx
    useEffect(() => {}, []) 
    ```
3. 提供依赖数组：在组件初次 render 和依赖项变化时执行
    ```jsx
    useEffect(() => {}, deps) 
    ```
4. return 一个回调函数：在组件 rerender 和组件卸载后执行
    ```jsx
    useEffect(return () => {}, []) 
    ```

