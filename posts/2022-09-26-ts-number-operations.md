---
title: TS 实现四则运算
date: 2022-09-26 18:37:00
tags:
  - TypeScript
layout: post
description: '做操（类型体操）有益健康'
author: 'MurphyChen'
header-img: /img/ts.jpg
---

## 背景

事情起源于一道 TS 类型体操 [IndexOf](https://github.com/type-challenges/type-challenges/blob/main/questions/05153-medium-indexof/README.md)，我的第一思路就是递归遍历每一个元素，然后判断是否为目标元素。但是有个问题，TS 不支持一个数字类型的增减，也就是说 `type n = 2 - 1` 这种操作是不被允许的。

于是我诞生了一个想法，能不能手写一个加法或者减法。

## 思路

TS 不能对一个数字类型进行加减法，例如以下操作是非法的：
```ts
type a = 1
type b = 2
type c = a + b
```

但是 TS 可以对一个数组进行递归，例如下面这个 `Includes` 泛型：
```ts
type Includes<Tuple extends any[], Elem> = 
  Tuple extends [infer F, ...infer Rest]
    ? F extends Elem ? true : Includes<Rest, Elem>
    : false
```

那么基本思路有了，可以将数字的加减法转换为数组的运算。我们从 JS 的角度来思考一下，使用数组运算实现一个加法：
```js
function Add(a, b) {
  let A = Array(a), B = Array(b)
  let C = [...A, ...B]
  return C.length
}
```

## 加法

相同的思路，我们来实现 TS 类型操作的版本（这里涉及的运算都是基于类型的）：

第一步，输入一个数字字面量类型 `N`，要生成一个 N 元组。
```ts
// 递归生成 N 元组
type NTuple<N extends number, Res extends any[]=[]> = 
  Length<Res> extends N ? Res : NTuple<N, Push<Res, any>>

// 向数组中添加元素
type Push<Tuple extends any[], Elem extends number> = 
  Tuple extends [...infer T] ? [...T, Elem] : never

// 获取数组元素个数
type Length<Tuple extends any[]> = Tuple['length']

// 测试
type T = NTuple<5> // type T = [any, any, any, any, any]
```

第二步，合并生成的 A 元组和 B 元组，返回数组长度：
```ts
// 加法
type Add<A extends number, B extends number> = 
  Length< [...NTuple<A>, ...NTuple<B>]>
```

## 减法

类似，利用 TS 的泛型递归特性，再加上前面实现的泛型，我们可以实现减法：
```ts
// 减法
type Sub<A extends number, B extends number> = 
  NTuple<A> extends [...infer Res, ...NTuple<B>] ? Length<Res> : never
```

## 乘法

对于 `Mul<A, B>`，其实就是对 `B` 进行 `A` 次累加，我们可以以此为递归，使用一个 `Res=0` 的泛型参数存储结果，结合前面的泛型，实现如下：
```ts
// 乘法
type Mul<A extends number, B extends number, Res extends number =0> =
  A extends 0 ? Res : Mul<Sub<A, 1>, B, Add<Res, B> & number
 >
```

## 除法

这里只考虑整数的整除除法（6 / 3 = 2），除法其实就是多次减法，对于 `Div<A, B>`（A > B），将 A 减 B 执行 N 次，当结果为 0 的时候，此时 N 就是商。实现如下：
```ts
// 除法
type Div<A extends number, B extends number, Res extends number =0> =
  A extends 0 ? Res : Div<Sub<A, B>, B, Add<Res, 1> & number
 >
```

## 幂运算

有了以上实现的四则运算，幂运算其实也可以分解为乘法和加法，对于 `Pow<A, B>` 就是 A 自乘 B 次：
```ts
// 幂运算
type Pow<A extends number, B extends number, Res extends number =1> =
  B extends 0 ? Res : Pow<A, Sub<B, 1>, Mul<Res, A> & number
 >
```

## 阶乘

```ts
// 阶乘
type Factorial<A extends number, Res extends number =1> =
  A extends 0 ? Res : Factorial<Sub<A, 1>, Mul<Res, A> & number
 >
```

更多运算的实现，可以自己动手试试~

## 类型体操解答

问题链接：[IndexOf](https://github.com/type-challenges/type-challenges/blob/main/questions/05153-medium-indexof/README.md)
```ts
type Res = IndexOf<[1, 2, 3], 2>; // expected to be 1
type Res1 = IndexOf<[2,6, 3,8,4,1,7, 3,9], 3>; // expected to be 2
type Res2 = IndexOf<[0, 0, 0], 2>; // expected to be -1
```

解答：
```ts
type IndexOf<Tuple, Elem, Res extends number = 0> = 
  Tuple extends [infer First, ...infer Rest]
    ? IsAny<Elem> extends true
      ? IsAny<First> extends true
        ? Res
        : IndexOf<Rest, Elem, Add<Res, 1>>
      : Elem extends First
        ? Res
        : IndexOf<Rest, Elem, Add<Res, 1>>
    : -1

type IsAny<T> = 0 extends 1 & T ? true : false

type Add<A extends number, B extends number> =
  Length<[...NTuple<A>, ...NTuple<B>]> & number

type Length<T extends number[]> = T['length']

type NTuple<N extends number, Res extends any[] = []> = 
  Length<Res> extends N
    ? Res
    : NTuple<N, Push<Res, any>>

type Push<Tuple extends any[], Elem> = [...Tuple, Elem]
```