---
title: 计算机图形学复习
date: 2022-01-11 13:03:00
tags:
  - 计算机图形学
layout: post
description: "计算机图形学期末复习，自己总结的假重点。"
author: "MurphyChen"
---

# 计算机图形学复习

说明：

- 只记录了可能会考的计算题和一些简答题。
- 在线文档：https://blog.mphy.top/2022/01/11/ComputerGraphics-Review/
- 离线文档：[https://github.com/Hacker-C/myblog/wiki/Offline-Documents-Download](https://github.com/Hacker-C/myblog/wiki/Offline-Documents-Download)
- 几套题（参考）
  - https://www.docin.com/p-381747970.html
  - https://www.docin.com/p-381747972.html
  - https://www.docin.com/p-381747971.html
  - https://www.docin.com/p-381747973.html

## 0. 重点

1. Bresenham 画线算法
2. 直线反走样
3. 帧缓冲器与分辨率计算
4. 多边形扫描转换——有效边表 AET、NET
5. Cohen-Sutherland 算法（编码裁剪算法）
6. 二维变换（平移、旋转、缩放）中齐次坐标和变换矩阵的计算
7. Bezier 曲线曲面

## 1. 概论

### 1.1 帧缓冲器与分辨率计算（⭐）

- 计算公式
  帧缓存容量（bit） = 分辨率 * 灰度等级所占比特；

  灰度等级要取2的指数幂的幂指数，不足的按进一位计算。 

- 单位换算

  $1MB=2^{10}KB=2^{20}B$

  $1B=8bit$

- 举例

  【例题】灰度等级为256级，分辨率为1024*1024的显示器，至少需要的帧缓存容量为（）

  A  512KB
  B  1MB
  C  2MB
  D  4MB

  正确答案：B

  灰度是用来衡量像素颜色的指标，黑白色，非0即1，灰度等级为256级，即2^8是256，所以需要8位，而每8bit是1B，所以帧缓存容量 = $1024 * 1024 * 8 = 2^{20}B=1MB$。

### 1.2 图形和图像的区别（⭐）

图形和图像的区别（位图和矢量图的区别）

- 基本概念

  - **图像** 是由数码相机、扫描仪、摄像机等输入设备捕捉实际的画面产生的数字图像，是由像素点阵构成的 **位图**，图片格式有png,bmp,jpg,jpeg,gif。

    **位图** 位图又叫点阵图或像素图，计算机屏幕上的图是由屏幕上的像素构成的，每个点用二进制数据来描述其颜色与亮度等信息。

  - **图形** 是由计算机绘制的直线、圆、矩形、曲线、图表等。是指由外部轮廓线条构成的 **矢量图**。

    **矢量图** ,也称为面向对象的图形或绘图图形，是用数学方式描述的曲线及曲线围成的色块制作的图形矢量文件中的图形元素称为对象。每个对象都是一个自成一体的实体，它具有颜色、形状、轮廓、大小和屏幕位置等属性

- 数据描述 

  - 图像：用数字任意描述像素点、强度和颜色。描述信息文件存储量较大，所描述对象在缩放过程中会损失细节或产生锯齿。
  - 图形：用一组指令集合来描述图形的内容，如描述构成该图的各种图元位置维数、形状等。描述对象可任意缩放不会失真。 

- 屏幕显示
   - 图像：是将对象以一定的分辨率分辨以后将每个点的信息以数字化方式呈现，可直接快速在屏幕上显示。
   - 图形：使用专门软件将描述图形的指令转换成屏幕上的形状和颜色。 

- 适用场合
   - 图像：表现含有大量细节（如明暗变化、场景复杂、轮廓色彩丰富）的对象，如：照片、绘图等，通过图像软件可进行复杂图像的处理以得到更清晰的图像或产生特殊效果。
   - 图形：描述轮廓不很复杂，色彩不是很丰富的对象，如：几何图形、工程图纸、CAD、3D造型软件等。 
   
- 存储格式

   - 位图（点阵图)存储格式：BMP、TIFF、GIF 、JPEG、PNG
   - 矢量图存储格式：DXF (Data exchange File）、svG (Scalable Vector Graphics)、EPS、WMF、EMF

### 1.3 图形（像）的构成属性

从广义的概念，一般分为几何属性和非几何属性

- 几何属性：刻画对象的轮廓、形状，也称几何要素。
  包括点、线、面、体等。
- 非几何属性：视觉属性，刻画对象的颜色、材质等。
  比如明暗、色彩、纹理、透明性、线型、线宽

### 1.4 图形处理和图像处理的区别和联系（⭐）

- 图形处理：是三维的，对三维数据进行处理
- 图像处理：存储方式本来就是二维的，直接对每一个像素点进行处理（加强）
- 联系：图形处理的显示方式是二维的

### 1.5 图形学的定义和主要研究什么？

- 图形学定义：计算机图形学(Computer Graphics，简称CG)是一种使用数学算法将二维或三维图形转化为计算机显示器的栅格形式的科学。 
- 主要研究：计算机图形学的主要研究内容就是研究如何在计算机中表示图形、以及利用计算机进行图形的计算、处理和显示的相关原理与算法
- 研究内容：非常广泛，如图形硬件、图形标准、图形交互技术、光栅图形生成算法、曲线曲面造型、实体造型、真实感图形计算与显示算法，以及科学计算可视化、计算机动画、自然景物仿真、虚拟现实等

### 1.6 图形学在什么行业领域最有潜力？

- 游戏引擎：物理引擎，图形引擎可以快速且真实的仿真场景发生的效果，常用的引擎有虚幻4，unity3D,一般游戏引擎招收人员需要了解且使用过这两个引擎，而且要求有一定的物理数学，已经编程基础。

- 虚拟现实：利用电脑模拟产生一个三维空间的虚拟世界，提供感官模拟，让使用者身临其境。

- 三维重建：常见的三维重建，比如建筑的3D重建，根据图纸重建房子，应用在无人驾驶中还有周围场景的3D重建，现在阿里等一些公司也有在做家装的AI设计。

- 3D打印：3D打印主要的应用有金属打印，应用于金属件，航空航天，以及DLP打印技术，应用于齿科数字化，医疗，定制化鞋，其他打印技术还没有成规模应用起来。需要的技术主要是几何相关，以及对代码能力的要求。

### 1.7 二维观察

二维场景中要显示的部分称为裁剪窗口，所有在此区域之外的场景均要裁去。只有在裁剪窗口内部的场景才能显示在屏幕上。裁剪窗口有时暗指世界窗口或观察窗口。对象在裁剪窗口内的部分映射到显示窗口中指定位置的视口中。窗口选择要看什么，而视口指定在输出设备的什么位置进行观察。

通过改变视口的位置，可以在输出设备显示区域的不同位置观察物体。

场景的描述从二维世界坐标系到设备坐标系的映射称为**二维观察变换**。有时将二维观察变换简单地称为窗口到视口地变换或窗口变换。

## 2. 直线段画线算法

直线扫描转换画线算法有三种：

- DDA 画像算法（数值微分法）
- 中点画线算法
- Bresenham 画线算法

基本思想：在光栅显示器上使用离散的像素点来逼近所要画的直线段，都使用了增量的思想。

### 2.1 DDA 画线算法

- 直线方程
  - 斜距式：$y=kx+b$

- 基本思想：
  
  ​	选定x2－x1和y2－y1中较大者作为步进方向(假设x2－x1较大)，取该方向上的增量为一个象素单位，然后计算另一个方向的增量通过递推公式，把每次计算出的(xi+1，yi+1)经取整后送到显示器输出，则得到扫描转换后的直线。

  - 离散像素点逼近
  - 增量思想
  
- 创新和优化：
  - 将原来的乘法转换为加法，提高效率。

- 算法推导过程：

  ![image-20220111124238304](https://s2.loli.net/2022/01/11/xdMEFDlHcpAW8JZ.png)

- 例题：

  ![image-20220111124340937](https://s2.loli.net/2022/01/11/JH6xkXE5If7rAW1.png)

- 扩展：
![image-20220111134436871](https://s2.loli.net/2022/01/11/Rdo6EC4qI3QtYs1.png)

### 2.2 中点画线算法

- 直线方程
  - 一般式方程：$Ax+By+C=0$

- 基本思想
  
  ​	每次在最大位移方向上走一步，而另一个方向是走步还是不走步需要取决中点误差项的判断。
  
  - 离散像素点逼近
  - 增量思想
  - 每次在最大位移方向上走一步，而另一个方向是走步还是不走步需要取决中点误差项的判断。
  
- 创新和优化
  - 将之前的浮点数加法提高到整数加法，提高效率。
  
- 算法公式

  ![image-20220111124532404](https://s2.loli.net/2022/01/11/xhQu2d6JDqr5oXc.png)



![image-20220111124558728](https://s2.loli.net/2022/01/11/DIpYf74GQKcWZ3q.png)

- 例题

  $a=-2,b=5,a+b=3$

  $d_0=2a+b=1$

  d:

  $d=d+6,d<0$

  $d=d-4, d\ge0,$

  y:

  $y=y+1, d<0$

  $y=y, d\ge0$

  根据当前 $d$，判断下一个$y$。

![image-20220111124634007](https://s2.loli.net/2022/01/11/mcq96SMwvzTuldH.png)

### 2.3 Bresenham 画线算法（⭐）

- 基本思想

  - 该算法的思想是通过各行、各列像素中心构造一组虚拟网格线，按照直线起点到终点的顺序，计算直线与各垂直网格线的交点,然后根据误差项的符号确定该列象素中与此交点最近的象素。

- 算法步骤：①直线端点②计算初值③绘制点x,y④更新步骤⑤重复

- 推导公式

  - 初始值

    $d_0=2Δy-Δx$

  - 推导式
    
    $d_{i+1}=d_i+2Δy-2Δx$，当  $y_{i+1}=y_i+1$
    $d_{i+1}=d_i+2Δy$，当  $y_{i+1}=y_i$
    
    $x_{i+1}=x_i+1$
    
    $y_{i+1}=y_i$，当 $d<0$
    $y_{i+1}=y_i+1$，当 $d\ge0$

- 例题

  【例】用**Bresenham**画线法在起点A(0，0)和终点B(5，2)之间生成一段直线a。

  - 初始值：$Δx=5,Δy=2,d_0=2Δy-Δx=-1$

  - x, y, d推导式

    $x_{i+1}=x_i+1$

    $d_{i+1}=d_i+2Δy-2Δx=d_i-6$，当  $y_{i+1}=y_i+1$
    $d_{i+1}=d_i+2Δy=d_i+4$，当  $y_{i+1}=y_i$

    $y_{i+1}=y_i$，当 $d<0$   

    $y_{i+1}=y_i+1$，当 $d\ge0$

  - 当前行的d值决定下一行的y。

    | x    | y    | d    |
    | ---- | ---- | ---- |
    | 0    | 0    | -1   |
    | 1    | 0    | 3    |
    | 2    | 1    | -3   |
    | 3    | 1    | 1    |
    | 4    | 2    | -5   |
    | 5    | 2    | -1   |


### 2.4 三种画线算法总结

- DDA把算法效率提高到每步只做一个加法。
- 中点算法进一步把效率提高到每步只做一个整数加法
- Bresenham提供了一个更一般的算法。该算法不仅有好的效率,而且有更广泛的适用范围

## 3. 多边形扫描转换和区域填充

### 3.1 多边形扫描转换

多边形的两种表示：

- 顶点表示（直观，几何意义强，占内存少，但不能用于光栅显示器）
- 点阵表示（丢失了边界、顶点信息，但适用于光栅显示器）

**多边形的扫描转换**：光栅图形的一个基本问题是把多边形的顶点表示转换为点阵表示。这种转换称为多边形的扫描转换

多边形分为：凸多边形、凹多边形、含内环多边形。

### 3.2 X-扫描线算法（⭐）

**基本思想**：X-扫描线算法填充多边形的基本思想是按扫描线顺序，计算扫描线与多边形的相交区间，再用要求的颜色显示这些区间的像素，即完成填充工作。

对一条扫描线填充的步骤：求交、排序、交点配对、区间填色。

**关键问题一**：交点的取舍问题，交点要保证为偶数个。

- 若共享顶点的两条边分别 **落在扫描线的两边，交点只算一个**。

- 若共享顶点的两条边在扫描线的同一边，这时交点作为零个或两个。

  - 该点为极大值点，计数  0
  - 该点为极小值点，计数 2

  ![image-20220111124706481](https://s2.loli.net/2022/01/11/IK75lMP6fkxtyzp.png)

**关键问题二：**大量求交运算效率低，采用增量法。

引进一套特殊数据结构。

#### 活性边表 AET（⭐）

![image-20220111124739170](https://s2.loli.net/2022/01/11/aS7AI9M8gUHB3ph.png)

![image-20220111124755470](https://s2.loli.net/2022/01/11/j1rIzOb7YGhfQUq.png)

其中，$Δx=1/k$ 。

- 举例

  ![image-20220111124813543](https://s2.loli.net/2022/01/11/UV81XasjwTfLZtr.png)

![image-20220111124841159](https://s2.loli.net/2022/01/11/ETAvMCqWzwuFcel.png)

#### 新边表 NET（⭐）

为了方便活性边表的建立与更新，为每一条扫描线建立一个新边表NET，存放在该扫描线第一次出现的边。也就是说，若某边的较低端点为Ymin,则该边就放在扫描线Ymin的新边表中。

**关键：多边形的各条边的最低处**。

节点内容

![image-20220111124904142](https://s2.loli.net/2022/01/11/Noey6FjRWzqnZma.png)

- 举例

  ![image-20220111124922515](https://s2.loli.net/2022/01/11/L61sCMcEVkh92HW.png)

  各扫描线的新边表：

  ![image-20220111125008407](https://s2.loli.net/2022/01/11/b8cu25j7ZQgxdD1.png)

- 算法小结
  - 优点：对每个像素只访问一次。

  - 缺点：数据结构复杂，表的维护排序开销大。

### 3.2 多边形扫描转换算法小结

基本思想：扫描线法可以实现已知任意多边形域边界的填充。该填充算法是按扫描线的顺序，计算扫描线与待填充区域的相交区间，再用要求的颜色显示这些区间的像素，即完成填充工作。
为了提高算法效率:

- 增量的思想
- 连贯性思想
- 构建了一套特殊的数据结构

### 3.3 边缘填充算法

其基本思想是按任意顺序处理多边形的每条边。在处理每条边时，首先求出该边与扫描线的交点，然后将每一条扫描线上交点右方的所有像素取补。多边形的所有边处理完毕之后，填充即完成。

### 3.4 栅栏填充算法

栅栏指的是一条过多边形顶点且与扫描线垂直的直线。它把多边形分为两半。在处理每条边与扫描线的交点时，将交点与栅栏之间的像素取补。

### 3.5 边界标志算法

帧缓冲器中对多边形的每条边进行直线扫描转换，亦即对多边形边界所经过的象素打上标志
然后再采用和扫描线算法类似的方法将位于多边形内的各个区段着上所需颜色
由于边界标志算法不必建立维护边表以及对它进行排序，所以边界标志算法更适合硬件实现,这时它的执行速度比有序边表算法快一至两个数量级。

### 3.6 反走样技术

- 走样与反走样

  - 由于采样不充分重建后造成的信息失真，就叫走样 (aliasing)。

  - 用于减少或消除这种效果的技术，就称为反走样 (antialiasing)。

- 两种走样现象

  - 一是光栅图形产生的阶梯形（锯齿形)
  - 二是图形中包含相对微小的物体时,这些物体在静态图形中容易被丢弃或忽略
    小物体由于“走样”而消失

- 反走样技术

  ① 采用分辨率更高的显示设备,对解决走样现象有所帮助，因为可以使锯齿相对物体会更小一些，但是该反走样方法是以4倍的存储器代价和扫描转换时间获得的，不太推荐。

  ② 介绍两种反走样方法:

  - 非加权区域采样方法

    根据物体的覆盖率(coverage）计算像素的颜色。覆盖率是指某个像素区域被物体覆盖的比例

  - 加权区域采样方法

- 反走样是图形学中的一个根本问题，走样不可能避免。这是图形学中的一个永恒问题。

## 4. 直线裁剪算法

- Cohen-Sutherland 算法（编码裁剪算法，重点）
- 中点分割法（了解）
- Liang-Barsky 算法（了解）

- 裁剪

  使用计算机处理图形信息时，计算机内部存储的图形往往比较大,而屏幕显示的只是图形的一部分。因此需要确定图形哪些部分落在显示区之内，哪些落在显示区之外。这个选择的过程就称为裁剪。

  - 点裁剪：判断图形中每个点是否在窗口内，太费时，一般 **不可取**。

  - 直线段裁剪算法

    直线段与裁剪窗口的关系：

    - 完全落在窗口内
    - 完全落在窗口外
    - 与窗口边界相交



### 4.1 Cohen-Sutherland 算法（编码裁剪算法，⭐）

- 基本思想

  又称为编码裁剪算法，使用二编码的思想，对直线段分三种情况处理：

  - （1）若点 p1 和 p2 完全在裁剪窗口内，“简取之”。
  - ![image-20220111125113641](https://s2.loli.net/2022/01/11/g4XyR5Ios8uqpQ7.png)
  - ![image-20220111125133538](https://s2.loli.net/2022/01/11/kawiG6Q8Kqbcuoh.png)

- 编码过程

  每条线段的端点都赋以四位二进制码 $D_3D_2D_1D_0$：
  
  ![image-20220111125157167](https://s2.loli.net/2022/01/11/Ox2T3UMpbvwQDHR.png)

​	使用二进制计算判断是“简取”还是“简弃”：

​	![image-20220111125228100](https://s2.loli.net/2022/01/11/4oMdjGAru2cUChg.png)

- 【例题】

  ​	![image-20220111125302935](https://s2.loli.net/2022/01/11/Nl1fmn8JItjCrA3.png)

  ![image-20220111125317322](https://s2.loli.net/2022/01/11/S6kFZKrC5Rco3p1.png)

### 4.2 中点分割法（了解）

和上面讲到的Cohen-Sutherland算法一样,首先对直线段的端点进行编码。
把线段和窗口的关系分成三种情况:

- 完全在窗口内
- 完全在窗口外
- 和窗口有交点

中点分割算法的核心思想是通过二分逼近来确定直线段与窗口的交点。

### 4.3 Liang-Barsky直线段裁剪算法（了解）

在Cohen-Sutherland算法提出后，梁友栋和Barsky又针对标准矩形窗口提出了更快的Liang-Barsky直线段裁剪算法。

## 5. 多边形裁剪和字符裁剪

### 5.1 Sutherland-Hodgeman多边形裁剪

该算法的基本思想是将多边形边界作为一个整体，每次用窗口的一条边对要裁剪的多边形和中间结果多边形进行裁剪，体现一种分而治之的思想。

![image-20220111125340467](https://s2.loli.net/2022/01/11/ysdFGXSOoPjvi7U.png)

### 5.2 字符裁剪

- 串精度裁剪
  当字符串中的所有字符都在裁剪窗口内时，就全部保留它，否则舍弃整个字符串
- 字符精度裁剪
  在进行裁剪时,任何与窗口有重叠或落在窗口边界以外的字符都被裁剪掉
- 笔画/象素精度裁剪
  将笔划分解成直线段对窗口作裁剪。需判断字符串中各字符的哪些像素、笔划的哪一部分在窗口内，保留窗口内部分,裁剪掉窗口外的部分

## 6. 消隐算法

当我们观察空间任何一个不透明的物体时，只能看到该物体朝向我们的那些表面，其余的表面由于被物体所遮挡我们看不到。
**消隐**：如果把可见和不可见的线都画出来,对视觉会造成多义性。要消除二义性，就必须在绘制时消除被遮挡的不可见的线或面，习惯上称作消除隐藏线和隐藏面，简称为消隐。

### 6.1 消隐的分类

1. 按消隐对象分类
   - 线消隐
   	 消隐对象是物体上的边，消除的是物体上不可见的边
   - 面消隐
     消隐对象是物体上的面,消除的是物体上不可见的面，通常做真实感图形消隐时用面消隐
2. 按消隐空间分类
   - 物体空间的消隐算法（在物体空间里典型的消隐算法有两个: Roberts算法和光线投射法）
   - 图像空间的消隐算法（主流）

### 6.2 Z缓冲区算法（Z-Buffer，⭐）

Z缓冲器算法也叫深度缓冲器算法，属于图像空间消隐算法

该算法有 **帧缓冲器** 和 **深度缓冲器**。对应两个数组：

- intensity（x，y）——属性数组（帧缓冲器）

  存储图像空间每个可见像素的光强或颜色

- depth（x，y）——深度数组（z-buffer）

  存放图像空间每个可见像素的z坐标

z一Buffer算法的优点:

- Z-Buffer算法比较简单,也很直观
- 在象素级上以近物取代远物。与物体在屏幕上的出现
  顺序是无关紧要的，有利于硬件实现

z一Buffer算法的缺点:(1）占用空间大

- 没有利用图形的相关性与连续性,这是z-buffer算法
  的严重缺陷
- 更为严重的是，该算法是在像素级上的消隐算法

### 6.3 区间扫描线算法

了解。

### 6.4 Warnock 算法

Warnock算法是图像空间中非常经典的一个算法
Warnock算法的重要性不在于它的效率比别的算法高，而在于采用了分而治之的思想，利用了堆栈的数据结构
把物体投影到全屏幕窗口上，然后递归分割窗口，直到窗口内目标足够简单，可以显示为止。

## 7. 二维图形变换

### 7.1 向量运算基础

请自行复习线性代数。

### 7.2 图标坐标系

图形学两大基本工具：

- 向量分析
- 图形变换

计算机图形学中坐标系的分类

- 世界坐标系（程序员）
- 建模坐标系（物体自身）
- 观察坐标系（观察窗口角度）
- 设备坐标系（例如屏幕坐标系）
- 规范化坐标系

### 7.3 二维图形变换基本概念

- 图形变换用途

  - 图形变换和观察是计算机图形学的基础内容之一，也是图形显示过程中不可缺少的一个环节
  - 一个简单的图形，通过各种变换（如:比例、旋转、镜象、错切、平移等)可以形成一个丰富多彩的图形或图案

- 图形变换原理

  变换图形就是要变换图形的几何关系，即改变顶点的坐标;同时，保持图形的原拓扑关系不变。

  仿射变换(Affine Transformation或 Affine Map）是一种二维坐标到二维坐标之间的线性变换。

  二维仿射变换( affine transformation )，其中坐标x’和y’都是原始坐标x和y的线性函数：
 ![image-20220111134745563](https://s2.loli.net/2022/01/11/OB3fI5GSC8wQuRK.png)

### 7.4 齐次坐标

二维平面中，使用 $(x,y)$ 来表示一个点的位置，也可以说是使用一个向量 $[x,y]$ 来表示。假设变换后点坐标为 $(x', y')$ 。

![image-20220111125415451](https://s2.loli.net/2022/01/11/AacLrMSw9kDQRYv.png)

这种用三维向量表示二维向量,或者一般而言，用一个 **n+1维的向量表示一个n维** 向量的方法称为 **齐次坐标** 表示法。

![image-20220111125436764](https://s2.loli.net/2022/01/11/14G8JqloCmHnbjk.png)

- 采用了齐次坐标的好处

  采用了齐次坐标表示法，就可以统一地把二维线形变换表示如下式所示的规格化形式。对于图形来说，没有实质性的差别，但是却给图形变换中矩阵运算提供了可行性和方便性。

  ![image-20220111125449094](https://s2.loli.net/2022/01/11/xvF7PAheSoutQpy.png)

### 7.5 基本图形变换（⭐）

#### 1. 平移

- 概念：平移是指将p点沿直线路径从一个坐标位置移到另一个坐标位置的重定位过程。

- 齐次坐标计算公式：

  ![image-20220111125509782](https://s2.loli.net/2022/01/11/HFi2h4wscfq5kej.png)

#### 2. 比例变换（缩放）

- 概念：比例变换是指对p点相对于坐标原点沿x方向放缩Sx倍，沿y方向放缩Sy倍。其中Sx和Sy称为比例系数。

- 齐次坐标计算公式

  ![image-20220111125543279](https://s2.loli.net/2022/01/11/lbwIMxUKAzN5Wn2.png)

#### 3. 对称变换

对称变换也称为反射变换或镜像变换，变换后的图形是原图形关于某一轴线或原点的镜像。

齐次坐标计算公式：

- 关于 x 轴对称

  ![image-20220111125607512](https://s2.loli.net/2022/01/11/D2U34CaNjZm7Vwu.png)

- 关于 y 轴对称

  ![image-20220111125617987](https://s2.loli.net/2022/01/11/XUo4GlHzKtQTfeP.png)

#### 4. 旋转变换

二维旋转是指将P点绕 **坐标原点** 转动某个角度日（逆时针为正，顺时针为负）得到新的点 P* 的重定位过程。

![image-20220111125635254](https://s2.loli.net/2022/01/11/W8hp4s371N2EjKU.png)

顺时针旋转公式将 $\theta$ 改为 $-\theta$ 即可。

#### 5. 错切变换

应该不会考。。。

#### 6. 复合变换（⭐）

复合变换是指图形作一次以上的几何变换，变换结果是每次的 **变换矩阵相乘**。
从另一方面看，任何一个复杂的几何变换都可以看作基本几何变换的组合形式。

![image-20220111125648464](https://s2.loli.net/2022/01/11/9tYqXWMiHOobF48.png)

### 7.6 二维图形几何变换计算

几何变换均可表示成：$P*=P·T$ 的形式，其中，P为变换前二维图形的规范化齐次坐标，P*为变换后的 **规范化齐次坐标**，**T为变换矩阵**。

#### 1. 点的变换

![image-20220111125659394](https://s2.loli.net/2022/01/11/FfQeMcNhPG9lLST.png)

#### 2. 直线的变换

直线的变换可以通过 **对直线两端点进行变换**，从而改变直线的位置和方向。

![image-20220111125711451](https://s2.loli.net/2022/01/11/FpO8TkAS3LZyzN9.png)

#### 3. 多边形的变换

多边形变换是将变换矩阵作用到每个顶点的坐标位置，并按新的顶点坐标值和当前属性设置来生成新的多边形。

![image-20220111125729342](https://s2.loli.net/2022/01/11/W289NVq7JuvsFlB.png)

【例题】

![image-20220111125757184](https://s2.loli.net/2022/01/11/wC3SIhlN8fbWGuP.png)

![image-20220111125811222](https://s2.loli.net/2022/01/11/zFtWdGU2wQpMs4A.png)

（最好计算结果可能有误，体会思路，请自己演算。）

## 8. Bezier 曲线（⭐）

这里的曲线方程都是关于 t 的参数方程形式。

### 8.0 伯恩斯坦基函数

Forest证明了Bezier曲线的基函数可以简化成伯恩斯坦基函数。

![image-20220111204149978](https://s2.loli.net/2022/01/11/7NU81FMQxPuCm4e.png)

### 8.1 一次 Bezier 曲线

当 $n=1$ 时，有两个控制点 $P_0$ 和 $P_1$，Bezier多项式是一次多项式。

![image-20220111125834628](https://s2.loli.net/2022/01/11/OFSDz4fArxhEBnR.png)

### 8.2 二次 Bezier 曲线

当 $n=2$ 时，有 3 个控制点 $P_0$、$P_1$ 和 $P_2$，Bezier多项式是二次多项式。

![image-20220111125846853](https://s2.loli.net/2022/01/11/MxKJWO497dgz5Sy.png)

### 8.3  三次 Bezier 曲线

三次Bezier曲线由 4 个控制点生成，这时 $n=3$，有4个控制点 $P_0$、$P_1$、 $P_2$ 和 $P_3$，Bezier多项式是三次多项式。

![image-20220111125958002](https://s2.loli.net/2022/01/11/OIGz4FKiYNrh9sd.png)

【例题1】

![image-20220111130012592](https://s2.loli.net/2022/01/11/Pq3i1LE8kh5dasI.png)

【解答1】

![image-20220111130024832](https://s2.loli.net/2022/01/11/nMwyjudmZo4g8IV.png)

###  8.4 基函数性质

![image-20220112103641938](https://s2.loli.net/2022/01/12/Z4WVo1z3YdncOih.png)

### 8.5 积分

![image-20220112103710872](https://s2.loli.net/2022/01/12/lysQubzUjE1V479.png)

## 9. 基本算法的代码

### 9.1 画线算法

1. DDA画线算法

   ```c
   void DDADrawLine::DDALine(int xa, int ya, int xb, int yb)
   {
       GLfloat delta_x, delta_y, x, y;
       int dx, dy, steps;
       dx = xb - xa;
       dy = yb - ya;
       if (abs(dx)>abs(dy))
       {
           steps = abs(dx);
       }
       else
       {
           steps = abs(dy);
       }
       delta_x = (GLfloat)dx / (GLfloat)steps;
       delta_y = (GLfloat)dy / (GLfloat)steps;
       x = xa;
       y = ya;
   //  glClear(GL_COLOR_BUFFER_BIT);
       glBegin(GL_POINTS);
       glVertex3f(x, y, 0);
       for (int i = 1; i <= steps; i++)
       {
           x += delta_x;
           y += delta_y;
           glBegin(GL_POINTS);
           glVertex3f(x, y, 0);
           glEnd();
       }
   }
   ```

2. 中点画线算法

   ```c
   
   void MidpointLine(int x0,int y0,int x1,int y1,int color)
   {
   	int dx = abs(x1 - x0);int sx = x0<x1: 1: -1;
   	int dy = abs(y1 - y0);int sy = y0<y1: 1: -1;
   	int a = -sy*dy,b=sx*dx;
   	int p = 2*a + b;
   	 
   	while(putpixle(x0,y0),x0 != x1 || y0 !=y1){
   		if(dx > dy){
   			x0+=sx;
   			if(p < 0) {p +=2*(a+b);y+=sy;}
   			else	  {p+=2*a;}
   		}				
   		else{
   			y0+=sy;
   			if(p < 0) {p +=2*(a+b);x +=sx;}
   			else	  {p+=2*a;}
   		}	
   	}
   }
   ```

3. Bresenham 算法

   ```c
   void line2(int x1,int y1,int x2,int y2){
          int x,y,dx,dy,d;
          y=y1;               
          dx=x2-x1;         
          dy=y2-y1;     
          d=2*dy-dx;        //增量d的初始值
          for(x=x1;x<=x2;x++){
           putpixel(x,y,GREEN);   //打亮
         if(d<0){
             d+=2*dy;
         }else{
           y++;
             d+=2*dy-2*dx;
           }
          }
       }
   ```

### 9.2 中点画圆算法

基本思想：中点圆算法是一种用于确定绘制一个圆所需的像素点的算法。 该算法的目标是找到一个通过使用像素网格的使得每个像素点尽可能接近x ^ 2 + y ^ 2 = r ^ 2的路径。 由于圆具有对称性，所以我们只要考虑1/8个圆即可。

```c
void drawEightPoints(int xc,int yc,int addx,int addy)
{
    drawPixel(xc+addx, yc+addy);
    drawPixel(xc-addx, yc+addy);
    drawPixel(xc+addx, yc-addy);
    drawPixel(xc-addx, yc-addy);
    drawPixel(xc+addy, yc+addx);
    drawPixel(xc-addy, yc+addx);
    drawPixel(xc+addy, yc-addx);
    drawPixel(xc-addy, yc-addx);
}
void drawCircle(int xc,int yc,int r)
{
    int p,addx,addy;
    p=1-r;
    addx=0;
    addy=r;
    drawEightPoints(xc, yc, addx, addy);
    while(addx<addy){
        addx++;
        if(p<0){
            p+=2*addx+1;
        }
        else{
            addy--;
            p+=2*(addx-addy)+1;
        }
        drawEightPoints(xc, yc, addx, addy);
    }
}
```

### 9.3 五角星

```c
const GLfloat PI = 3.14159265357f;
void myDisplay(void) {
    GLfloat a = 1 / (2 - 2 * cos(72 * PI / 180));
    GLfloat bx = a*cos(18 * PI / 180);
    GLfloat by = a*sin(18 * PI / 180);
    GLfloat cy = -a*cos(18 * PI / 180);
    GLfloat pointB[2] = { bx, by },
        pointC[2] = { 0.5, cy },
        pointD[2] = { -0.5, cy },
        pointE[2] = { -bx, by },
        pointA[2] = { 0,a };
    glClear(GL_COLOR_BUFFER_BIT);
    //按照A->C->E->B->D->A的顺序一笔画出五角星
    glBegin(GL_LINE_LOOP);
    glVertex2fv(pointA);
    glVertex2fv(pointC);
    glVertex2fv(pointE);
    glVertex2fv(pointB);
    glVertex2fv(pointD);
    glVertex2fv(pointA);
    glEnd();
    glFlush();
}
int main(int argc, char *argv[]) {
    glutInit(&argc, argv);
    glutInitDisplayMode(GLUT_RGB | GLUT_SINGLE);
    glutInitWindowPosition(100, 100);
    glutInitWindowSize(500, 500);
    glutCreateWindow("OpenGL画圆程序");
    glutDisplayFunc(&myDisplay);
    glutMainLoop();
    return 0;
}
```

### 9.4 贝塞尔曲线

```
struct point  //控制点的坐标{
	double x;
	double y;
}point[N];
void init()  //输入控制点的坐标{
	int i;
    printf("please input the number of the points: ");
	scanf("%d",&n);
	printf("please input the location of the points\n");
	for(i=0;i<n;i++)
	scanf("%lf %lf",&point[i].x,&point[i].y);
}
void sol1()  //绘制控制多边形的轮廓{
    int i;
	setcolor(RED);
	for(i=0;i<n-1;i++)
	line((int)point[i].x,(int)point[i].y,(int)point[i+1].x,(int)point[i+1].y);
}
double sol2(int nn,int k)  //计算多项式的系数C(nn,k){
	int i;
	double sum=1;
    for(i=1;i<=nn;i++)
	sum*=i;
	for(i=1;i<=k;i++)
	sum/=i;
	for(i=1;i<=nn-k;i++)
	sum/=i;
	return sum;
}
void sol3(double t)  //计算Bezier曲线上点的坐标{
    double x=0,y=0,Ber;
	int k;
	for(k=0;k<n;k++)
	{
		Ber=sol2(n-1,k)*pow(t,k)*pow(1-t,n-1-k);
		x+=point[k].x*Ber;
		y+=point[k].y*Ber;
	}
	putpixel((int)x,(int)y,GREEN);
}
void sol4()  //根据控制点，求曲线上的m个点{
	int m=500,i;
	for(i=0;i<=m;i++)
	sol3((double)i/(double)m);
}
```

### 9.5 openGL 交互

通过glutMouseFunc(&OnMouse)注册鼠标事件，OnMouse是鼠标事件的响应，函数格式是

void OnMouse(int button,int state,int x,int y)；

通过glutKeyboardFunc(&KeyBoards)注册键盘事件，KeyBoards是键盘事件的响应，函数格式是
void KeyBoards(unsigned char key,int x,int y)；

```c
glutMouseFunc(myMouse):利用按下或释放鼠标按钮时发生的事件来注册myMouse
glutMotionFunc(myMovedMouse):利用按下按钮同时移动鼠标的事件来注册myMovedMouse
glutKeyboardFunc(myKeyboard):利用按下和松开键盘按键的事件来注册myKeyboard
```

### 9.6 绘制立方体

```
// 将立方体的八个顶点保存到一个数组里面
static const GLfloat vertex_list[][3] = {
    -0.5f, -0.5f, -0.5f,
     0.5f, -0.5f, -0.5f,
    -0.5f,  0.5f, -0.5f,
     0.5f,  0.5f, -0.5f,
    -0.5f, -0.5f,  0.5f,
     0.5f, -0.5f,  0.5f,
    -0.5f,  0.5f,  0.5f,
     0.5f,  0.5f,  0.5f,
};
glBegin(GL_QUADS);
    glVertex3fv(vertex_list[0]);
    glVertex3fv(vertex_list[2]);
    glVertex3fv(vertex_list[3]);
    glVertex3fv(vertex_list[1]);

    // ...
glEnd();
static const GLint index_list[][4] = {
    0, 2, 3, 1,
    0, 4, 6, 2,
    0, 1, 5, 4,
    4, 5, 7, 6,
    1, 3, 7, 5,
    2, 6, 7, 3,
};
 绘制的时候代码很简单
 glBegin(GL_QUADS);
 for(int i=0; i<6; ++i)         // 有六个面，循环六次
     for(int j=0; j<4; ++j)     // 每个面有四个顶点，循环四次
         glVertex3fv(vertex_list[index_list[i][j]]);
 glEnd();
```

