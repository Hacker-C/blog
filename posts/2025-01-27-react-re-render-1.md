---
title: '《重拾 React 》——re-render 虐我千百遍，我仍待你如初恋（上）'
tags:
  - React
layout: post
date: '2025-01-27'
description: '最近想复习一下 React，同时整理一下曾经踩过的那些坑，于是想着不如写文章记录下来，就有了《重拾 React 》这个系列。'
---

# React: re-render 虐我千百遍，我仍待你如初恋（上）

最近想复习一下 React，同时整理一下曾经踩过的那些坑，于是想着不如写文章记录下来，就有了《重拾 React 》这个系列。本文是此系列的第一章：⌈re-render 虐我千百遍，我仍待你如初恋⌋。

## 问题引入

小光是一名前端搬砖仔，有一天接到了一个需求，要在页面上新增一个按钮，点击按钮打开一个弹窗。原有页面代码如下所示：

```jsx
export default function App() {
  return (<>
    <SomeSlowComponent />
  </>)
}

// 模拟需要一定时间加载的组件
function SomeSlowComponent() {
  waitSync(1000)
  return <p>Some Slow Component</p>
}

function waitSync(ms) {
  const start = Date.now()
  let cur = start
  while (cur - start < ms) {
    cur  = Date.now()
  }
}

```

小光看了后说：什么？这还不简单，然后三下五除二地就写了下面的代码，提测后就去愉快的摸鱼了。

```jsx
import { useState } from 'react'

export default function App() {
  const [open, setOpen] = useState(false)
  return (<>
    <button onClick={() => setOpen(true)}>开启</button>
    <dialog open={open}>
      <p>重拾 React</p>
      <button onClick={() => setOpen(false)}>确认</button>
    </dialog>
    <SomeSlowComponent />
  </>)
}
```

没过多久测试就提了个bug——点击按钮后弹窗给要过一会才打开，页面很卡顿！

## re-render 机制

想要搞清楚为什么，得从 React 组件的更新机制 re-render 讲起。一个 React 组件无非就是三件事——加载（mounting）、更新（updating）、卸载（unmounting），而其中最重要的就是更新机制，组件的更新机制给 React App 带来了页面交互响应式的特性。正如官方文档所说：

> Add interactivity wherever you need it.

React 更新机制靠的就是 re-render，即重新渲染。**Re-render 就是当组件的状态发生变化时，React 会重新调用该组件的渲染函数，计算必要更新以更新用户界面**。常见触发 re-render 的场景：

*   使用 `useState` 或 `this.setState` 更新组件内部状态
*   父组件向子组件传递的 `props` 发生变化
*   使用 `React Context`，且上下文的值发生变化
*   使用 redux/jotai/zustand 等状态管理库触发
*   其他更多。。。

但实际上，**React 最终还是通过状态变化来驱动 UI 的更新，也就是说状态变化是 re-render 触发的根本原因。**

让我们现在回到最初的例子，但点击按钮，改变了 `open` 的值，从而触发了 re-render，组件将自上而下重新渲染，执行到 `<SomeSlowComponent />` 是一个加载比较耗时（请求API/复杂计算）的组件，我们知道 JS 是单线程的，慢组件阻塞了主线程，当慢组件加载完后，主线程才能够渲染页面弹出对话框。

```jsx
export default function App() {
  const [open, setOpen] = useState(false)
  return (<>
    <button onClick={() => setOpen(true)}>开启</button>
    <dialog open={open}>
      <p>重拾 React</p>
      <button onClick={() => setOpen(false)}>确认</button>
    </dialog>
    <SomeSlowComponent />
  </>)
}
```

## 单向数据流

和 Angular/Vue 中的双向绑定机制不同，React 采用单项数据流。 **React 的 re-render 自上而下进行，状态只能从父组件传递到子组件，这也叫做 React 中状态的单向数据流（One-Way Data Flow）**。注意从上而下不是代码中的上下位置，而是组件层级关系，就像树结构中的层级。有人可能会说  React 中的状态也可以是双向的，例如在子组件中调用方法修改父组件中的状态，但这其实也是单向的，通过调用回调函数修改父组件状态，状态还是自上而下传递。

![image.png](/img/2025-01-27-react-re-render-1-1.png)

## React.memo：props 没变我就不变

前面我们提到过：“父组件向子组件传递的 `props` 发生变化” 会触发 re-render，这里其实还有一个前提。我们还是从最初的问题开始：注意我们是没有传递任何 `props` 给 `<SomeSlowComponent />` 的，但还是触发了其重新渲染，这是因为 **props 变化与否 是否会影响组件的 re-render 取决于 是否有 React.memo，只有当有 React.memo 时，props 的变化才会影响子组件 re-render，否则无论 props 变化与否，都会触发 re-render**。

```jsx
export default function App() {
  const [open, setOpen] = useState(false)
  return (<>
    <button onClick={() => setOpen(true)}>开启</button>
    <dialog open={open}>
      <p>重拾 React</p>
      <button onClick={() => setOpen(false)}>确认</button>
    </dialog>
    <SomeSlowComponent />
  </>)
}
```

那么这里就可以用 `React.memo` 解决问题，都没传 props，自然不会触发 re-render。

```jsx
const SomeSlowComponent = React.memo(() => {
  waitSync(1000)
  return <p>Some Slow Component</p>
})
```

## 状态组合下移

但是有时候我们并不需要 memo，需要注意使用细节，例如关于 props 的值比较问题，没用好会可能导致其他问题，具体后面再说。那有没有更简单的方法呢？之前我们提到过 **re-render 是自上而下触发的，这意味着我们可以将当前更新的组件下移，让 re-render 从下个层级开始**，这样就不会触发同层级的重新渲染了。需要注意状态下移不是简单移动代码位置，而是在移动 “状态更新动作” 在 DOM 中的层级。

![image.png](/img/2025-01-27-react-re-render-1-2.png)

代码如下：

```jsx
export default function App() {
  return (<>
    <Dialog />
    <SomeSlowComponent />
  </>)
}

function Dialog() {
  const [open, setOpen] = useState(false)
  return (<>
    <button onClick={() => setOpen(true)}>开启</button>
    <dialog open={open}>
      <p>重拾 React</p>
      <button onClick={() => setOpen(false)}>确认</button>
    </dialog>
  </>)
}
```

## 总结

1.  re-render 机制：当组件的状态发生变化时，组件会重新渲染
2.  re-render 触发的本质原因：状态更新（state update）
3.  props 变化导致 re-render 先决条件：父组件向子组件传递的 `props` 发生变化，子组件才触 re-render，前提是子组件要有 `React.memo`，否则无论如何子组件都会 re-render
4.  单向数据流：指状态变更引起的 re-render，最新的数据自上而下流动
5.  状态组合下移：得益于单向数据流的特性，可以将目标组件的状态更新操作下移一个层级，从而让 React 减少不必要的 re-render

