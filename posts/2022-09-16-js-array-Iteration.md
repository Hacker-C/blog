---
title: 关于 JS 数组遍历的一些细节
date: 2022-09-16 14:20:00
tags:
  - JavaScript
layout: post
description: '被忽略的 JS 数组技巧。'
author: 'MurphyChen'
header-img: /img/js.png
---

## 1. 空位处理规则

ES6 新增的数组扩展至有这么一项，对于数组空位统一处理为 `undefined`。这意味着 ES5 的一些数组方法，不会去处理数组空位项，下面是个典型例子：

```js
let arr = Array(5) // <5 empty items>
let res = arr.map(e => e + 1) // <5 empty items>
```

ES5 中的数组方法包括：`map`、`filter`、`forEach`、`reduce`，还有 `for ... in` 等语法，这些方法执行的时候遇到空位，会直接跳过。

```js
// ES5 及以前，不会处理空位
const a = Array(5)
console.log(a) // [ <5 empty items> ]
console.log(a.map(_ => 1)) // 无效，[ <5 empty items> ]
// console.log(a.reduce((p, c)=> p+c)) // 报错
console.log(a.filter(x => true)) // []
a.forEach(e => {
  console.log(e)
}) // 无任何输出
console.log(a+'') // ,,,,
console.log(a.indexOf(undefined)) // -1
console.log(a.lastIndexOf(undefined)) // -1
for (let k in a) {
  console.log(k) // 无任何输出
}
```

ES6 之后，将数组空位视为 undefined。
```js
console.log([...a]) // [ undefined x 5 ]
console.log(Array.from(a)) // [ undefined x 5 ]
console.log(a.includes(undefined)) // true
console.log(a.find(x => x === undefined)) // undefined
console.log(a.findIndex(x => x === undefined)) // 0
for (let k of a) {
  console.log(k) // 输出5个undefined
}
```

## 2. 是否修改原数组

请看以下代码，遍历过程中，试图修改遍历的每一项。
```js
const arr = [1, 2, 3]
let res = arr.filter(item => {
  item++
  return item >= 3
})
console.log(arr) // [ 1, 2, 3 ]
console.log(res) // [ 2, 3 ]
```

`filter` 里的 item 自增了，所以最后有两项符合过滤规则，但是原数组并没有变。这说明这里的 item 只是原数组项的一个值拷贝，数组遍历是按值传递的。

再看一段代码，这次我们遍历引用数据类型的数组。
```js
const brr = [
  {count: 1},
  {count: 1},
  {count: 1}
]
const res2 = brr.map(item => {
  item.count++
  return item.count
})
console.log(brr) // [ { count: 2 }, { count: 2 }, { count: 2 } ]
console.log(res2) // [ 2, 2, 2 ]
```

这里的修改改变了原数组，那之前说的按值传递有问题？其实还没问题的，数组函数方法说到底也是一个函数，JS 的函数总是按值传递的：
- **基本数据类型（包含变量、函数参数等）存储在栈（stack）中，传递参数会复制一份值**
- **引用数据类型的引用（指针）存储在栈中，指向的值存储在堆（heap）中，传递参数会复制一份对象的引用地址，复制的引用地址和原引用地址指向堆中同一个对象（因此修改参数，也修改了原对象）**

## 3. 附一下数组遍历的几种方法

### 3.1 索引访问

```js
const arr = [1, 2, 3]
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i])
}
```

### 3.2 for ... of

```js
const arr = [1, 2, 3]
for (let e of arr) {
  console.log(e)
}
```

### 3.3 forEach

注意：`return` 和 `break` 无法中断遍历。
- return 可以跳过本次遍历，但剩余元素仍然会继续遍历下去。
- break 只能中断 for 和 while 循环，forEach 函数中使用会报错

```js
const arr = [1, 2, 3]
arr.forEach((e, i, a) => {
  console.log(e)
})
```

### 3.4 for ... in

`for ... in` 是用来遍历对象（plain object）的，也可以用来遍历数组，但不建议。
```js
const arr = [1, 2, 3]
for (let i in arr) {
  console.log(arr[i])
}
```

### 3.5 map、filter、reduce

这三类都是为了对数组进行一个操作，然后得到目标结果的数组方法，从功能和语义上来讲，和 forEach 有区别的，不建议混用，尤其是 map 和 forEach。但是也能对数组进行遍历，详细看 MDN。