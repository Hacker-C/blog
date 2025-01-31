---
title: '《重拾 React 》——re-render 虐我千百遍，我仍待你如初恋（下）'
tags:
  - React
layout: post
date: '2025-01-31'
description: '最近想复习一下 React，同时整理一下曾经踩过的那些坑，于是想着不如写文章记录下来，就有了《重拾 React 》这个系列。'
---

# 《重拾 React 》——re-render 虐我千百遍，我仍待你如初恋（下）

最近想复习一下 React，同时整理一下曾经踩过的那些坑，于是想着不如写文章记录下来，就有了《重拾 React 》这个系列。本文是此系列的第一章：⌈re-render 虐我千百遍，我仍待你如初恋（下）⌋。

## 问题引入

小光这天接到了个新需求，要求在一个可滑动阅读窗口内添加一个进度展示，实时展示当前阅读进度，效果如下。

![image.png](/img/2025-01-31-react-re-render-2-1.png)

小光一想，这简单啊，监听页面的 `onScroll` 事件，然后已经划过页面的 `scrollY` 的值，再计算出当前内容的实际高度，再将两者一除不就有了。下面是小光的代码：

```jsx
export default function App() {
  const [progress, setProgress] = useState(0)

  const scrollHandler = (e) => {
    setProgress(e.target.scrollTop / 1000 * 100).toFixed(2))
  }

  return (<div className='container'>
    <div className='scroll' onScroll={scrollHandler}>
      <span className='backTop'>阅读进度：{progress}%</span>
      <SomeSlowComponent />
    </div>
  </div>)
}

// 模拟慢组件
function SomeSlowComponent() {
  waitSync(1000)
  console.log('SomeSlowComponent')
  const texts = Array(100).fill('Some Slow Component')
  return <>
    {texts.map(text => <p>{text}</p>)}
  </>
}

function waitSync(ms) {
  const start = Date.now()
  let cur = start
  while (cur - start < ms) {
    cur = Date.now()
  }
}
```

但是没过几天用户又来投诉了，说你们这个页面怎么这么卡顿！那么小光的问题出在哪呢？有了第一章的铺垫，我们很容易知道这里频繁的触发了 `re-render`，由于页面中有 `<SomeSlowComponent />` 这种原有的渲染很慢的组件，导致页面渲染很卡顿。之前讲过优化思路是组合状态下移，但是目前这种情况没办法将组件抽出，因为被监听的元素在我们要避免 re-render 的组件的外层，单向数据流特性使得 SomeSlowComponent 始终会重新渲染！

那只能使用 `memo` 和 hooks 的来优化了？不，不需要！只需要将组件抽出来一层，将原有的组件变成组件的 `props` 传入，这样 progress 的更新不会导致 SomeSlowComponent 的重新渲染。代码如下：

```jsx
export default function App() {
  return <ProgressWrapper content={<SomeSlowComponent />}/>
}

function ProgressWrapper({ content }) {
  const [progress, setProgress] = useState(0)

  const scrollHandler = (e) => {
    setProgress((e.target.scrollTop / 3000 * 100).toFixed(2))
  }

  return (<div className='container'>
    <div className='scroll' onScroll={scrollHandler}>
      <span className='backTop'>阅读进度：{progress}%</span>
      { content }
    </div>
  </div>)
}
```

到这里有人会发现，ProgressWrapper 组件中的状态 progress 更新了，触发 re-render，居然没有触发 `content` 中的组件也就是 SomeSlowComponent 组件的重新渲染，不是说组件自上而下会依次重新渲染吗？说的不错，但这里其实还漏了一个很重要的概念，那就是 React 中的 `reconciliation` 和 `diif` 机制，简单而言就是对于 re-render 时，对于前后没有变化的组件，会跳过渲染，从而提高性能。这里先简单介绍，**详细的会在本《重拾 React》系列后续章节会作为讲到**。

## Elements vs Components

在介绍 reconciliation 之前，我们先来解释下 React 中的元素和组件。

React 中的 Elements 就是页面元素，也可以理解为一个包含了元素的属性、样式、事件方法的对象。Elements 使用 JSX 的 `<标签>` 来表示，也可以使用 `React.createElement()` 来创建。

```jsx
const element = <h1>Hello, React!</h1>
```

React 中的 Components 就是函数组件，一个返回 Elements 的函数。

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>
}
```

## 再谈 re-render —— 初识 reconciliation

**Reconciliation（协调）** 是 React 更新虚拟 DOM 和真实 DOM 以保持 UI 和状态同步的过程。它是 React 提供高效 UI 渲染的核心机制，能够通过最小化 DOM 操作来提升性能。**也就是说，re-render 自上而下传播的过程中，并不是只要一遇到 Elements 就重新渲染，而是会根据相应元素假定重新渲染前后的值进行对比（浅对比），如果变了就要重新渲染，否则不触发。** 而且这个对比是浅对比，类似于 `Object.is(ElementBeforeRerender,
ElementAfterRerender) `，不会深度对比各个节点的属性和值。

拿这个例子来讲，状态更新是从 ProgressWrapper 组件中触发的，执行到 `{ content }` 的时候，这个 props 是外界传入的元素，在 re-render 前后，这个值始终是父组件传入的同一个元素，那么根据 re-render 原理，这一段元素不会触发重新渲染，恍然大悟！

```jsx
export default function App() {
  return <ProgressWrapper content={<SomeSlowComponent />}/>
}

function ProgressWrapper({ content }) {
  const [progress, setProgress] = useState(0)

  const scrollHandler = (e) => {
    setProgress((e.target.scrollTop / 3000 * 100).toFixed(2))
  }

  return (<div className='container'>
    <div className='scroll' onScroll={scrollHandler}>
      <span className='backTop'>阅读进度：{progress}%</span>
      { content }
    </div>
  </div>)
}
```

这样也能解释之前的问题了，为什么传入子组件 props 没有变化甚至是当没有传入任何 props 时，react 总是会重新渲染这些子组件。因为  react 认为每次 return 返回的都是一个新的值，可以简单理解为 `Object.is(ElementBeforeRerender, ElementAfterRerender)` 总是返回 `false`，react 认为都需要重新渲染。因此优化思路是使用 memo 缓存组件或者直接更简单，那就是像上面这样将其作为 props 传入，让 react 知道始终都是同一个元素，避免非必要重新渲染。

![image.png](/img/2025-01-31-react-re-render-2-2.png)

Tip: 使用 children 作为 props，在 React 中，将 props 命名为 children，默认可以使用 JSX 的结构语法将元素作为 props 传入。例如上述 ProgressWrapper 组件使用 children props，则调用时，代码可以写为：

```jsx
export default function App() {
  return <ProgressWrapper>
    <SomeSlowComponent />
  </ProgressWrapper>
}

function ProgressWrapper({ children }) {
  // ...
}
```

## 总结

*   React Elements 是描述 UI 的，本质是一个**普通的 JavaScript 对象**，通过 `React.createElement` 或 JSX 语法创建，描述了一个 DOM 节点或组件实例。
*   React Components 是可复用的代码块，用来定义 UI 的逻辑和结构，可以返回一个或多个 React 元素。
*   **当 React 元素作为 props 传递给组件时，即使组件因状态更新而 re-render，这些作为 props 传递的元素也不会重新渲染，因为数据源没变。**


