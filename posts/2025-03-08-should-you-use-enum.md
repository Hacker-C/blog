---
title: 'TypeScript 官方宣布弃用 Enum？Enum 何罪之有？'
tags:
  - React
layout: post
date: '2025-03-08'
description: '官方真的不推荐 Enum 了吗？ 甲级战犯 Enum 出列！起因是看到 科技爱好者周刊里面推荐了一篇文章，说是官方不再推荐使用 enum 语法，Enum 是老问题了，莫非这次官方真的要优化掉了？'
---

## 1. 官方真的不推荐 Enum 了吗？

### 1.1 事情的起因

起因是看到 [科技爱好者周刊（第 340 期）](https://www.ruanyifeng.com/blog/2025/03/weekly-issue-340.html#:~:text=2%E3%80%81%E4%B8%8D%E8%A6%81%E7%94%A8%20TypeScript%20%E6%9E%9A%E4%B8%BE%EF%BC%88%E8%8B%B1%E6%96%87%EF%BC%89) 里面推荐了一篇文章，说是官方不再推荐使用 enum 语法，原文链接在 [An ode to TypeScript enums](https://blog.disintegrator.dev/posts/ode-to-typescript-enums/)，大致是说 TS 新出了一个 `--erasableSyntaxOnly` 配置，只允许使用可擦除语法，但是 enum 不可擦除，因此推断官方已不再推荐使用 enum 了。官方并没有直接表达不推荐使用，那官方为什么要出这个配置项呢？

![image.png](/img/2025-03-08-should-you-use-enum-01.webp)

### 1.2 什么是可擦除语法

就在上周，TypeScript 发布了 5.8 版本，其中有一个改动是**添加了 `--erasableSyntaxOnly` 配置选项，开启后仅允许使用可擦除语法，否则会报错**。`enum` 就是一个不可擦除语法，开启 `erasableSyntaxOnly` 配置后，使用 `enum` 会报错。

例如，如果在 tsconfig 文件中配置 `"erasableSyntaxOnly": true`（只允许可擦除语法），此时使用不可擦除语法，将会得到报错：
![image.png](/img/2025-03-08-should-you-use-enum-02.webp)

**可擦除语法就是可以直接去掉的、仅在编译时存在、不会生成额外运行时代码的语法，例如 `type`。不可擦除语法就是不能直接去掉的、需要编译为JS且会生成额外运行时代码的语法，例如 `enum`。** 具体举例如下：

可擦除语法，不生成额外运行时代码，比如 `type`、`let n: number`、`interface`、`as number` 等：
![image.png](/img/2025-03-08-should-you-use-enum-03.webp)

不可擦除语法，生成额外运行时代码，比如 `enum`、`namespace`、类属性参数构造语法糖（Class Parameter properties）等：

```ts
// 枚举类型
enum METHOD {
  ADD = 'add'
}

// 类属性参数构造
class A {
  constructor(public x: number) {}
}
let a: number = 1
console.log(a)
```

![image.png](/img/2025-03-08-should-you-use-enum-04.webp)

### 1.3 TS 官方为什么要出 erasableSyntaxOnly？

官方既然没有直接表达不推荐 enum，那为什么要出 `erasableSyntaxOnly` 配置来排除 `enum` 呢？

我找到了 TS 官方文档（[The --erasableSyntaxOnly Option](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html#the---erasablesyntaxonly-option)）说明：

![image.png](/img/2025-03-08-should-you-use-enum-05.webp)

大致意思是说之前 Node 新版本中支持了执行 TS 代码的能力，可以直接运行包含可擦除语法的 TypeScript 文件。Node 将用空格替换 TypeScript 语法，并且不执行类型检查。总结下来就是：

在 Node 22 版本：

*   需要配置 `--experimental-transform-types` 执行支持 TS 文件
*   要禁用 Node 这种特性，使用参数 `--no-experimental-strip-types`

在 Node 23.6.0 版本：

*   默认支持直接运行**可擦除语法**的 TS 文件，删除参数 `--no-experimental-strip-types`
*   对于**不可擦除语法**，使用参数 `--experimental-transform-types`

综上所述，TS 官方为了配合 Node.js 这次改动（即默认允许直接执行不可擦除语法的 TS 代码），才添加了一个配置项 `erasableSyntaxOnly`，只允许可擦除语法。

## 2. Enum 的三大罪行

### 2.1 枚举默认值

自 enum 从诞生以来，它一直是前端界最具争议的特性之一，许多前端开发者乃至不少大佬都对其颇有微词，纷纷发起了 **DO NOT USE TypeScript Enum** 的吐槽。那么`enum` 真的有那么难用吗？

`enum` 默认的枚举值从 `0` 开始，这还不是最关键的，你传入了默认枚举值时，居然是合法的，这无形之中带来了类型安全问题。

```ts
enum METHOD {
    ADD
}

function doAction(method: METHOD) {
  // some code
}

doAction(METHOD.ADD) // ✅ 可以
doAction(0) // ✅ 可以
```

### 2.2 不支持枚举值字面量

还有一种场景，我要求既可以传入枚举类型，又要求传入枚举值字面量，如下所示，但是他又不合法了？（有人说你定义传枚举类型就要传相应的枚举，这没问题，但是上面提到的问题又是怎么回事呢？这何尝不是 Enum 的双标？）

```ts
enum METHOD {
    ADD = 'add'
}

function doAction(method: METHOD) {
  // some code
}

doAction(METHOD.ADD) // ✅ 可以
doAction('add') // ❌ 不行	
```

### 2.3 增加运行时开销

TypeScript 的 `enum` 在编译后会生成额外的 JavaScript 双向映射数据，这会增加运行时的开销。

![image.png](/img/2025-03-08-should-you-use-enum-06.webp)

## 3. Enum 的替代方案

众所周知，TS 一大特性是类型变换，我们可以通过类型操作组合不同类型来达到目标类型，又称为类型体操。下面的四种解决方案，可以根据实际需求来选择。

### 3.1 `const enum`

`const enum` 是解决产生额外生成的代码和额外的间接成本有效且快捷的方法，也是官方推荐的。

```ts
const enum METHOD {
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
  QUERY = 'query',
}

function doAction(method: METHOD) {
    // some code
}

doAction(METHOD.ADD) // ✅ 可行
doAction('delete') // ❌ 不行
```

`const enum` 解析后的代码中引用 enum 的地方将直接被替换为对应的枚举值：

![image.png](/img/2025-03-08-should-you-use-enum-07.webp)

### 3.2 模板字面量类型

将枚举类型包装为模板字面量类型（Template Literal Types），从而即支持枚举类型，又支持枚举值字面量，但是没有解决运行时开销问题。

```ts
enum METHOD {
  ADD = 'add',
  DELETE = 'delete',
  UPDATE = 'update',
  QUERY = 'query',
}

type METHOD_STRING = `${METHOD}`

function doAction(method: METHOD_STRING) {
    // some code
}

doAction(METHOD.ADD) // ✅ 可行
doAction('delete') // ✅ 可行
doAction('remove') // ❌ 不行

```

![image.png](/img/2025-03-08-should-you-use-enum-08.webp)

### 3.3 联合类型（Union Types）

使用联合类型，引用时可匹配的值限定为指定的枚举值了，但同时也没有一个地方可以统一维护枚举值，如果一旦枚举值有调整，其他地方都需要改。

```ts
type METHOD =
  | 'add'
  /**
   * @deprecated 不再支持删除
   */
  | 'delete'
  | 'update'
  | 'query'


function doAction(method: METHOD) {
    // some code
}

doAction('delete') // ✅ 可行，没有 TSDoc 提示
doAction('remove') // ❌ 不行

```

![image.png](/img/2025-03-08-should-you-use-enum-09.webp)

### 3.4 类型字面量 + as const

类型字面量就是一个对象，将一个对象断言（Type Assertion）为一个 `const`，此时这个对象的类型就是对象字面量类型，然后通过类型变换，达到即可以传入枚举值，又可以传入枚举类型的目的。

```ts
const METHOD = {
  ADD:'add',
  /**
  * @deprecated 不再支持删除
  */
  DELETE:'delete',
  UPDATE: 'update',
  QUERY: 'query'
} as const

type METHOD_TYPE = typeof METHOD[keyof typeof METHOD]

function doAction(method: METHOD_TYPE) {
  // some code
}

doAction(METHOD.DELETE) // ✅ 可行，没有 TSDoc 提示
doAction('delete') // ✅ 可行
doAction('remove') // ❌ 不行
```

![image.png](/img/2025-03-08-should-you-use-enum-10.webp)

## 4. 总结

*   TS **可擦除语法** 是指 `type`、`interface`、`n:number` 等可以直接去掉的、仅在编译时存在、不会生成额外运行时代码的语法
*   TS **不可擦除语法** 是指 `enum`、`constructor(public x: number) {}` 等不可直接去除且会生成额外运行时代码的语法
*   Node.js 23.6.0 版本开始 **默认支持直接执行可擦除语法** 的 TS 文件
*   `enum` 的替代方案有多种，取决于实际需求。用字面量类型 + `as const` 是比较常用的一种方案。

TS 官方为了兼容 Node.js 23.6.0 这种可执行 TS 文件特性，出了 `erasableSyntaxOnly` 配置禁用不可擦除语法，反映了 TypeScript 官方对减少运行时开销和优化编译输出的关注，而不是要放弃 `enum`。

但或许未来就是要朝着这个方向把 enum 优化掉也说不定呢？

## 5. 参考链接

*   [Node.js type-stripping](https://nodejs.org/api/typescript.html#type-stripping)
*   [Node.js --experimental-strip-types](https://nodejs.org/en/blog/release/v23.6.0#unflagging---experimental-strip-types)
*   [TypeScript --erasablesyntaxonly-option](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html#the---erasablesyntaxonly-option)
*   [An ode to typescript enums](https://blog.disintegrator.dev/posts/ode-to-typescript-enums/)

