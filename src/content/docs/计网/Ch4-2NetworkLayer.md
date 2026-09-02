---
title: 网络层控制平面 Network Layer:Control Plane
date: 2024-04-27
excerpt: 介绍网络层的控制平面，包括路由算法，较为详细介绍了Dijkstra算法(链路状态选路算法)Distance-Vector Routing Algorithms(距离向量算法)以及层次选路三种选路算法。并介绍因特网中的选路协议（内部网关协议：RIP、OSPF、IGRP；外部网关协议：BGP），介绍SDN的概念，用途，架构
categories: [Dev, Network]
tags: [Network]
cover: https://assets.vluv.space/cover/Networks/network_layer2.webp
---

## Introduction

网络层的工作可以拆成两部分：**数据平面**决定「一个分组到达路由器后该从哪个端口出去」，**控制平面**决定「转发表里的内容从何而来」。转发表是连接两者的接口——控制平面里的路由算法算出它，数据平面查询它。本文讨论的就是转发表是如何被计算和维护的。

控制平面有两种组织方式：

- **每路由器控制 Per-router control**：每台路由器内部都运行一个路由选择组件，它们互相通信、交换信息，各自算出自己的转发表。传统的 RIP、OSPF、BGP 都属于这一类。

  ![每台路由器各自运行路由算法，计算自己的转发表](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-11-17-28.webp)

- **逻辑集中式控制 Logically centralized control**：路由器不再自己计算，而是由一个逻辑上集中的控制器统一算出所有转发表，再下发给每台路由器执行。SDN 走的就是这条路线。

  ![集中式控制器计算并下发转发表](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-11-17-38.webp)

## Routing Algorithms

**路由的基本概念**

- 默认路由器：与主机直接相连的路由器，又叫第一跳路由器。主机发出的每个分组都先交给它。
  - 源路由器：源主机的默认路由器。
  - 目的路由器：目的主机的默认路由器。
  - 因此「主机到主机的选路」可以简化为「源路由器到目的路由器的选路」。
- 路由算法：确定一个分组从源路由器到目的路由器所经路径的算法。
- 路由算法要解决的问题：在给定的一组路由器以及连接它们的链路中，找出一条从源路由器到目的路由器的「好」路径——通常指开销最小的那条。

**网络的抽象图模型**

选路问题可以抽象成图论问题。图 $G = (N, E)$ 由 N 个节点和 E 条边组成，每条边是来自 N 的一对节点：

- **节点 Node**：路由器，即做出分组转发判决的点，如 $u, v, w, x, y, z$；
- **边 Edge**：连接节点的线段，代表路由器之间的物理链路，如 $(u,v), (u,x), (u,w)$。

![示例网络的抽象图模型，边上的数字为链路费用](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-13-50-15.webp)

每条边都带有一个费用 $c(x,y)$，表示从节点 x 到节点 y 的链路费用。费用取什么含义由网络管理员决定：可以是链路的物理长度，可以与链路速率挂钩（速率越高、费用越低），也可以是使用这条链路的经济成本。若节点 x 与节点 y 不直接相连，则规定 $c(x,y)=\infty$。一条路径的费用是路径上所有链路费用之和，**最低费用路径**就是费用之和最小的那条路径。

### Routing Algorithms Classification

按「计算时掌握多少全局信息」划分：

- **集中式路由选择算法 Centralized Routing Algorithm**：用完整、全局性的网络知识计算出从源到目的地的最低开销路径。这类算法必须知道网络中每条链路的开销，因此常被称作**链路状态（Link State，LS）算法**。
- **分散式路由算法 Decentralized Routing Algorithm**：没有任何一个节点掌握全网链路开销的完整信息，路由器以迭代、分布式计算的方式逐步逼近最低开销路径。典型代表是**距离向量（Distance-Vector，DV）算法**，每个节点维护一个到网络中所有其他节点的开销估计向量。

按「是否随网络状态变化」划分：

- **静态路由算法**：路由一旦确定基本不再变化，只有人工干预调整时才可能改变。
- **动态路由算法**：当网络的流量负载或拓扑发生变化时，路径随之改变。可以周期性地运行，也可以直接响应拓扑或链路费用的变化；代价是容易受选路循环、路由振荡之类问题的影响。

### Link State Routing Algorithms

**链路状态选路算法**

LS 算法要求每个节点都掌握全网拓扑，这一点在实践中由**链路状态广播（link state broadcast）**[^1]完成。下面介绍的链路状态路由选择算法是 Dijkstra's algorithm。

**Dijkstra's Alogorithm**

- 前提：所有节点知道网络拓扑以及每条链路的费用信息
  - 通过链路状态广播来实现
  - 所有节点拥有相同的信息，因此各自独立计算也能得到一致的结果
- 目标：计算某一个节点（源节点）到所有其他节点的最低费用路径，从而得出该节点的转发表
- 迭代：k 次迭代后可以知道到达 k 个目的节点的最低费用路径
- 基本思想：以源节点为起点，每次从尚未确定的节点中挑出一个到源节点费用最低的，把它「敲定」下来，直到所有目的节点都被敲定为止。

定义以下符号

- `c(x,y)`: 表示从节点 x 到节点 y 的链路费用，规定若节点 x 与节点 y 不直接相连则 `c(x,y)=∞`
- `D(v)`：到算法的本次迭代为止，从源节点到目的节点 v 的最低开销（是一个会不断被修正的估计值）
- `p(v)`：从源节点到 v 的当前最低开销路径上，v 的前一个节点（即 v 的某个邻居）
- `N'`：已经确定了最低开销路径的节点子集；一旦从源到 v 的最低开销路径确定，v 就被放进 `N'`
- `u`：源节点

#### Link-State (LS) Algorithm for Source Node u

```wikitext
Initialization:
  N' = {u}                   # 已确定最低费用路径的节点集合，初始只有源节点
  for all nodes v
    if v is a neighbor of u:
      then D(v) = c(u,v)     # u 的邻居：初值为直连链路的费用
    else  D(v) = ∞           # 非邻居：暂时视为不可达

while N' != N:
  # 从 N' 的补集中找一个到源节点费用最低的节点 w
  find w not in N' such that D(w) is a minimum
    add w to N'              # w 的最低费用路径至此确定，不会再变
    # 借助刚敲定的 w，看看能否让它的邻居走得更便宜
    update D(v) for each neighbor v of w and not in N':
      D(v) = min(D(v),D(w)+c(w,v))
```

以下图为例，计算从 u 到所有可能目的节点的最低费用路径

![示例网络的抽象图模型，边上的数字为链路费用](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-13-50-15.webp)

算法迭代过程如下，每一行是一次迭代，加粗项表示该轮被选中并加入 `N'` 的节点

![Dijkstra 算法在示例网络上的逐轮迭代结果](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-15-30-57.webp)

> [!example]
>
> Dijkstra 例题 2 基于 Dijkstra 算法计算路由器 A 的算法表
> ![例题 2 的网络拓扑](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-10-20-04-16.webp)
>
> | Step | N'       | D(B),p(B) | D(C),p(C) | D(D),p(D) | D(E),p(E) | D(F),p(F) | D(G),p(G) | D(H),p(H) |
> | ---- | -------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
> | 1    | A        | 4,A       | $\infty$  | $\infty$  | 1,A       | 3,A       | $\infty$  | $\infty$  |
> | 2    | AE       | 4,A       | $\infty$  | $\infty$  |           | 3,A       | $\infty$  | $\infty$  |
> | 3    | AEF      | 4,A       | $\infty$  | 8,F       |           |           | 6,F       | $\infty$  |
> | 4    | AEFB     |           | 7,B       | 8,F       |           |           | 5,B       | $\infty$  |
> | 5    | AEFBG    |           | 6,G       | 8,F       |           |           |           | 7,G       |
> | 6    | AEFBGC   |           |           | 8,F       |           |           |           | 7,G       |
> | 7    | AEFBGCH  |           |           | 8,F       |           |           |           |           |
> | 8    | AEFBGCHD |           |           |           |           |           |           |           |

**构建从源节点到所有目的节点的路径**

算法只记录了每个节点的前驱 `p(v)`，完整路径要靠沿前驱指针回溯得到：对目的节点 z，`p(z)=y`，`p(y)=x`，`p(x)=u`，把回溯序列反过来就是路径 `u→x→y→z`，费用为 4。

对所有目的节点都回溯一遍，就能画出以源节点 u 为根的**最低费用路径树**

![以 u 为根的最低费用路径树](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-15-44-55.webp)

有了这棵树就可以生成源节点的转发表。转发表并不存放完整路径，只存放**下一跳**：对于发往某个目的节点的分组，从本节点发出后应该交给哪个邻居。

> 默认路由 `*` ：表示所有具有相同「下一跳」的表项。即将「下一跳」相同的项合并为一项，目的节点用 `*` 表示。它的优先级最低，只有当分组在转发表中找不到对应表项时才会使用。

**Dijkstra's Algorithm 复杂度**

设网络中有 n 个节点（不含源节点），最坏情况下需要多少次计算才能找出源节点到所有目的节点的最低费用路径？每一轮迭代都要在尚未加入 `N'` 的节点里扫描一遍以找出最小值：第一次迭代搜索 n 个节点，第二次检查 n-1 个，第三次检查 n-2 个，依次类推。所有迭代中搜寻的节点总数为 $\frac{n(n+1)}{2}$，因此算法复杂度为 $O(n^2)$。

此外，如果链路费用与链路上的流量、拥塞程度挂钩，LS 算法还会产生**路由震荡 Routing Oscillations**[^2]。

### The Distance-Vector（DV）Routing Algorithm

与 LS「每个节点掌握全局、独立算出全部路径」相反，DV 算法中每个节点只和直接邻居打交道，靠反复交换各自的估计值逐步收敛到正确结果。它有以下特征

- **迭代 Iterative**：计算过程一直持续到邻居之间无更多信息交换为止。
- **分布式 Distributed**：每个节点只从其直接相连的邻居接收信息，进行计算，再把结果分发给邻居。
- **异步 Asynchronous**：不要求所有节点相互之间步伐一致地操作。
- **自我终结 Self-termination**：没有新信息可交换时算法自行停止，无需外部信号。

**Bellman-Ford 方程**

DV 算法的理论基础是 Bellman-Ford 方程，它把「x 到 y 的最短路」拆解成「先走一跳到邻居 v，再由 v 走最短路到 y」，从而可以递归求解：

$$d_x(y)=\min_{v}\{c(x,v)+d_v(y)\}$$

- $d_x(y)$：节点 x 到节点 y 的最低开销路径的 cost
- $v$：节点 x 的邻居节点
- $c(x,v)+d_v(y)$：x 与邻居 v 之间的直接链路费用，加上邻居 v 到 y 的最小费用，即「x 经 v 到 y」的最小路径费用
- $\min_{v}$：在所有邻居中取最小，即从所有「经某个直接相连邻居到 y」的方案里挑最便宜的那个

#### Distance-Vector (DV) Algorithm

![距离向量算法的节点状态与处理流程](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-19-17-16.webp)

对每个节点 x：

1. 初始化
2. 等待（收到本地链路代价变化，或收到邻居发来的距离矢量更新）
3. 用 Bellman-Ford 方程重新计算距离矢量
4. 如果到任何目的节点的距离矢量发生变化，通知邻居
5. goto 2

仍以下图为例，计算源节点 u 到目的节点 z 的最低费用路径

![示例网络的抽象图模型，边上的数字为链路费用](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-13-50-15.webp)

u 有 v、w、x 三个邻居，它们各自已经算出了到 z 的最低费用：

- 邻居 v：$d_v(z) = 5, c(u,v) = 2$
- 邻居 w：$d_w(z) = 3, c(u,w) = 5$
- 邻居 x：$d_x(z) = 3, c(u,x) = 1$

代入 Bellman-Ford 方程

$$
\begin{aligned}
d_u(z) &= \min\{c(u,v)+d_v(z),\ c(u,w)+d_w(z),\ c(u,x)+d_x(z)\} \\
       &= \min\{2+5,\ 5+3,\ 1+3\} = 4
\end{aligned}
$$

即源节点 u 经相邻节点 x 到目的节点 z 的路径费用最低，为 4。

**节点的距离向量表**

每个节点维护一张表，其中

- 行：本节点的距离向量 $D_x$，以及它从各个邻居处收到的距离向量 $D_v$
- 列：所有目的节点

节点 x 的距离向量 $D_x = [D_x(y) \mid y \in N]$，即 x 到每个目的节点 y 的**估计**费用；
节点 x 保存的邻居 v 的距离向量 $D_v = [D_v(y) \mid y \in N]$，即 v 到每个目的节点 y 的估计费用。

如何更新距离向量？

- 每个节点不断把自己距离向量的副本发送给邻居；
- 当节点 x 收到邻居 v 的新距离向量时，先保存下来，再用 B-F 方程更新自己的距离向量
  $D_x(y)=\min_{v}\{c(x,v)+D_v(y)\}$
  即从所有「经邻居 v 到达 y」的方案中选取最小路径费用；
- 若更新后自己的距离向量发生改变，就把新向量通知给邻居；
- 重复「接收邻居更新 → 重算自己的表项 → 向邻居发送更新」的过程，直到没有更新报文为止；
- 此时估计值 $D_x(y)$ 收敛到真实的最低费用 $d_x(y)$，算法进入静止状态，直到某条链路费用发生改变才被再次唤醒。

![三节点网络中距离向量表的逐轮收敛过程](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-19-35-25.webp)

> [!example]
>
> **练习**
> 考虑如图所示的子网，该子网使用了距离-向量算法，下面的向量刚刚到达路由器 C：
> 来自 B 的向量为（5，0，8，12，6，2）；
> 来自 D 的向量为（16，12，6，0，9，10）；
> 来自 E 的向量为（7，6，3，9，0，4）；
> 经过测量，C 到 B、D 和 E 的延迟分别为 6，3 和 5，那么 C 到达所有结点的最短路径是？
>
> ![练习的子网拓扑](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-10-16-10-53.webp)
>
> 向量中的 6 个元素依次对应目的节点 (A,B,C,D,E,F)，表示该路由器到各目的节点的延迟。C 把每个邻居的向量整体加上自己到该邻居的延迟，就得到「C 经这个邻居到各目的节点」的延迟；再逐列取最小值即可：
>
> | 方案           | A      | B     | C   | D     | E     | F     |
> | -------------- | ------ | ----- | --- | ----- | ----- | ----- |
> | 经 B（+6）     | 11     | 6     | 14  | 18    | 12    | 8     |
> | 经 D（+3）     | 19     | 15    | 9   | 3     | 12    | 13    |
> | 经 E（+5）     | 12     | 11    | 8   | 14    | 5     | 9     |
> | **C 的新向量** | **11** | **6** | 0   | **3** | **5** | **8** |
> | 对应下一跳     | B      | B     | —   | D     | E     | B     |
>
> 注意 C 到自身的延迟恒为 0，不参与取最小值。最终 C 的距离向量为（11，6，0，3，5，8）。

---

#### Distance-Vector Algorithm: Link-Cost Changes and Link Failure

当一个节点检测到它与某个邻居之间的链路费用发生变化时，就重新计算距离向量；如果最低费用发生了改变，再通知它的邻居。

- **链路费用减少**

  如图所示，y 到 x 的链路费用从 4 变为 1

  - `t0`：y 检测到 x 的链路费用从 4 变为 1，更新其距离向量，并通知邻居 z；
  - `t1`：z 收到来自 y 的更新报文，更新自己的距离表，此时它到 x 的最低费用从 5 减为 2，于是通知邻居 y；
  - `t2`：y 收到来自 z 的更新报文，更新自己的距离表，到 x 的最低费用仍为 1 没有变化，不再发送更新报文，算法静止。

  链路费用减少时，DV 算法只需两轮迭代就达到静止状态。也就是说，链路费用变小这类「好消息」在网络中传播得很快，即 _good news travels fast_

  ![链路费用减少时 y、z 的更新过程](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-08-19-44-30.webp)

- **链路费用增加**

  仍是上图的拓扑，但这次 x 与 y 之间的链路费用从 4 增加到 60。变化前 $D_y(x)=4,\ D_y(z)=1,\ D_z(y)=1,\ D_z(x)=5$

  - `t0`：y 检测到链路费用从 4 变为 60，重新计算到 x 的最低费用
    $D_y(x)=\min\{c(y,x)+D_x(x),\ c(y,z)+D_z(x)\}=\min\{60+0,\ 1+5\}=6$
    y 于是认为「经 z 到 x 只要 6」，并把这个结果告诉 z。但这个值是错的——z 到 x 的那条费用为 5 的路径，本身就是经过 y 的
  - `t1`：z 收到 y 的新费用，重新计算
    $D_z(x)=\min\{c(z,x)+D_x(x),\ c(z,y)+D_y(x)\}=\min\{50+0,\ 1+6\}=7$
    z 认为经 y 到 x 要 7，比直连的 50 便宜，于是把 7 告诉 y
  - `t2`：y 收到 z 的新费用，再次计算
    $D_y(x)=\min\{60+0,\ 1+7\}=8$，又把 8 告诉 z
  - ……如此往复，两个节点的估计值每轮各加 1，缓慢地往上爬

  这就产生了**选路回环 routing loop**：y 为到达 x 而把分组交给 z，z 为到达 x 又把分组交回 y。目的地为 x 的分组到达 y 或 z 后，会在这两个节点之间来回反复，直到转发表改变为止。上述循环会持续 44 次迭代（即 y 与 z 之间的报文交换），直到 z 算出的「经由 y 的路径费用」超过 50，它才会改用直连链路。最终 z 到 x 的最低费用路径为 `z→x`（费用 50），y 到 x 的最低费用路径为 `y→z→x`（费用 51）。

  可见链路费用增加这类「坏消息」传播得很慢，即 _bad news travels slow_。当链路费用增加的幅度很大时，这个爬升过程会长得离谱，即**无穷计数 count-to-infinity** 问题：例如 `c(y,x)` 变为 10000、`c(z,x)` 变为 9999 时，两个节点要一路数到 9999 才能收敛。

#### Distance-Vector Algorithm: Adding Poisoned Reverse

针对上面的问题，可以引入**毒性逆转（poisoned reverse）**：如果 z 是经过 y 才能到达 x 的，那么 z 在向 y 通告时就谎称自己到 x 的距离是无穷大，即通告 $D_z(x)=\infty$。既然 y 认为 z 根本到不了 x，它就不会再打算把分组绕给 z，y 与 z 之间的兜圈子也就不会发生。

毒性逆转能完全解决计数到无穷的问题吗？不能。它只能拆掉两个节点之间的环路，如果环路涉及三个以上的节点，毒性逆转就检测不到了。

### A Comparison of LS and DV Routing Algorithms

| 比较维度       | LS 算法                                                                                           | DV 算法                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **消息复杂度** | 每个节点都要知道全网每条链路的费用，需发送 $O(nE)$ 个报文；任何一条链路费用变化都必须通知所有节点 | 迭代时仅在直接相连的邻居之间交换报文；只有当某链路费用的改变影响到相连节点的最低费用路径时，才会把变化继续传播出去         |
| **收敛速度**   | 需要 $O(nE)$ 个报文和 $O(n^2)$ 的搜寻；当链路费用与流量相关时可能振荡                             | 收敛较慢，且可能遇到选路回环或计数到无穷的问题                                                                             |
| **健壮性**     | 路由器只会就自己直连的链路广播出错误的费用，且每个节点独立计算自己的转发表，错误影响相对局限      | 一个节点可以向任意目的节点发布错误的最低费用路径，而且它的计算结果会传给邻居、再间接传给邻居的邻居，一个错误值会扩散到全网 |

## Intra-AS Routing in the Internet: OSPF

前面讨论路由算法时做了两个理想化假设：所有路由器都是同质的，整个网络是「平面的」——任何一台路由器都可以与其余所有路由器交换链路状态或距离向量。现实中这两条都不成立：

- **规模**：因特网的规模是数以亿计的节点，转发表里根本存不下所有节点，路由更新报文的交换也会把链路淹没；
- **管理自治**：每个机构都希望自主决定内部网络如何运行、对外暴露多少信息。

解决办法是分层：把路由器组织进**自治系统（Autonomous System，AS）**[^3]。在一个自治系统内部运行的路由算法叫做**自治系统内部路由选择协议（intra-autonomous system routing protocol）**。各个 AS 内部用什么协议是自己的事，不同 AS 可以运行不同的域内路由协议。

**网关路由器**（gateway router）

- 和其他自治系统内的路由器直接相连的路由器。运行域间路由协议，与其他网关路由器交互
- 同自治系统内的所有其他路由器一样，它也运行域内路由协议

域（自治系统）内路由选择

- 使用域内路由协议，也被称作内部网关协议 (IGP)
- 标准的域内路由协议:
  - RIP: 路由信息协议
  - OSPF: 开放式最短路径优先
  - IGRP: 内部网关路由协议 (Cisco 所有)

### RIP ( Routing Information Protocol)

- 属于距离向量算法，包含在 1982 年发布的 BSD-UNIX 版本中。
- 距离衡量：跳数[^4]（max = 15 hops），因此 RIP 只适用于规模不大的 AS
- RIP 通告
  - 每隔 30 秒，通过响应报文在邻居间交换距离向量（也被称为 RIP 通告，advertisement）
  - 每个通告包含了多达 25 个 AS 内的目的子网的列表
- RIP 链路失败及恢复
  若 180 秒后没有收到通告，则认为邻居死机或链路中断：
  - 经过该邻居的路由全部失效
  - 重新计算后把新的通告发送给其他邻居
  - 邻居收到后如果自己的转发表也发生变化，再继续发出新的通告
  - 链路故障信息就这样快速传播到整个网络
  - 用毒性逆转防止乒乓循环（以 16 跳表示「无穷远」）

### OSPF (Open Shortest Path First)

OSPF 是一种链路状态协议，它使用洪泛链路状态信息和 Dijkstra 最低开销路径算法。使用 OSPF 时，每台路由器都构建出一幅关于整个自治系统的完整拓扑图，然后在本地运行 Dijkstra 算法，算出一棵以自身为根、到所有子网的最短路径树。

与 DV 类协议只告诉邻居不同，OSPF 路由器把路由选择信息广播给自治系统内的所有其他路由器；每当一条链路的状态发生变化，就重新广播一次。

- 属于链路状态算法
  - 分发 LS 分组
  - 每个节点具有拓扑图
  - 路由计算使用 Dijkstra 算法
- 每个 router 都广播 OSPF 通告，通告里为每个邻居路由器设一个表项（记录该邻居的链路特征和费用）
- 通告会通过洪泛法散布到整个自治系统
  - OSPF 报文直接封装在 IP 之上传输（不经过 TCP 或 UDP）

**OSPF 相比 RIP 的优点**

- 安全：所有 OSPF 报文都要经过认证（防止恶意入侵）
- 允许存在多条开销相同的路径（RIP 中只能保留一条），可以做负载均衡
- 每条链路可以针对不同的服务类型 TOS[^5] 设置多个费用值（例如卫星链路在尽力而为转发时费用设为「低」，对实时应用则设为「高」）
- 对单播与多播路由选择的综合支持（Integrated support for unicast and multicast routing）
- 在大的区域中可使用层次 OSPF

**层次 OSPF**

当一个 AS 规模很大时，把它整个当作一张拓扑图来洪泛和计算依然吃力，于是 OSPF 允许在 AS 内部再分一层。

- 两级层次：本地区域、主干区域（这些区域都在同一个自治系统内）
  - 链路状态通告只在区域内部发送
  - 每个节点掌握本区域的详细拓扑；对于其他区域内的网络，它只知道去往那里的方向（即最短路径）
- 区域边界路由器（同时属于本地区域和主干区域）：把到本区域内部各网络的路径「汇总」成少量条目，通告给其他区域边界路由器
- 主干路由器：只在主干区域内运行 OSPF 路由协议（本身不是区域边界路由器）
- 边界路由器：连接到其他自治系统

![层次 OSPF 中的区域划分与四类路由器](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-10-17-41-40.webp)

## Routing Among the ISPs:BGP

当分组要跨越多个 AS 进行路由时，就需要一个**自治系统间路由协议（inter-autonomous system routing protocol）**。域内协议可以各家用各家的，域间协议却必须统一：因特网上所有的 AS 都运行同一个 AS 间路由选择协议，即**边界网关协议（Border Gateway Protocol，BGP）**。

### The Role of BGP

BGP 是事实上的标准，它为每个 AS 提供了两种能力

- **获取并传播可达性信息**：从相邻 AS 获取子网的可达性信息（obtain prefix reachability information from neighboring ASs），并把这些信息传播给本 AS 内部的所有路由器（advertising BGP route information）
- **选路**：基于这些可达性信息和本 AS 的策略，决定到达各子网的「最好」路由（determine the "best" routes to the prefixes）

BGP 通告的目的地不是某台主机，而是**前缀**[^6]

> In BGP, packets are not routed to a specific destination address, but instead to CIDRized prefixes, with each prefix representing a subnet or a collection of subnets.

BGP 是 AS 外部路由协议，负责本自治区域与外部自治区域之间**可达信息的交换**，因此它关心的拓扑结构是 AS 之间的拓扑，而不是单台路由器之间的拓扑。路由器的转发表由域内和域间两套选路算法共同配置：目的端在域内的表项由域内协议生成，目的端在域外的表项则要靠域间协议提供的可达性信息来生成。

假设 AS1 中的某台路由器收到一个目的地在 AS1 之外的分组，它必须把分组转发给某个网关路由器——可是该选哪一个？为此 AS1 需要知道：

- 通过 AS2 和 AS3 分别可以到达哪些目的端
- 并把这些可达信息传播给 AS1 内的所有路由器

这就是**域间选路**的任务。

### Advertising BGP Route Information

对于每个 AS，路由器可以分为两类：网关路由器（gateway router）和内部路由器（internal router）。网关路由器负责与其他 AS 建立 BGP 连接，而内部路由器主要负责在 AS 内传播路由信息。

在 BGP 中，路由器之间通过使用 `179` 端口的半永久 TCP 连接[^7]（semi-permanent TCP connection）交换路由选择信息，也会见到有人称之为 BGP Connection。根据连接两端是否属于同一个 AS，可以分为：

- **eBGP（external BGP）**：连接不同 AS 中的两台路由器，通常用于网关路由器之间交换路由信息
- **iBGP（internal BGP）**：连接同一个 AS 中的两台路由器，用于在 AS 内部传播从其他 AS 学到的路由信息

![eBGP 与 iBGP 协作传播前缀可达性信息](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-10-18-44-42.webp)

以上图为例，具体传播过程如下：当需要将前缀 x 的可达性信息传播至 AS1 和 AS2 的所有路由器时，首先，AS3 的网关路由器 3a 通过 eBGP 发送消息 `AS3 x` 给 AS2 的网关路由器 2c。接着，路由器 2c 利用 iBGP 将此消息 `AS3 x` 转发给 AS2 内的所有其他路由器，包括路由器 2a。然后，路由器 2a 通过 eBGP 发出更新的消息 `AS2 AS3 x` 至 AS1 的网关路由器 1c。最后，路由器 1c 使用 iBGP 将这条包含路径信息的消息 `AS2 AS3 x` 广播给 AS1 内的所有路由器。完成这一过程后，AS1 和 AS2 中的每一台路由器都知晓了前缀 x 的存在及其可达的 AS 路径。

可达性信息就这样通过 iBGP 和 eBGP 的协作在自治系统内外传播，确保网络中的每个关键节点都能了解到目标前缀的存在及其可达路径。

### Determining the Best Routes

通告一个前缀时，通告里还携带了若干 **BGP 属性（BGP attribute）**，`前缀 + 属性` 合称为一条**路由（route）**。其中两个最重要的属性：

- **AS-PATH**：该前缀的通告一路上经过了哪些 AS，如 `AS 67 AS 17`。路由器如果在 AS-PATH 中发现了自己所属的 AS，说明通告绕了回来，据此可以检测并避免循环通告
- **NEXT-HOP**：具体应该把分组交给下一个 AS 的哪台边界路由器（从当前 AS 到达下一个 AS 可能存在多条链路，需要指明是哪一条）

网关路由器收到路由通告后，先用**输入策略**决定接收还是舍弃它——策略上不接受的路由（比如来自不愿意为其转发流量的邻居）在这一步就被丢掉了。

#### Hot potato routing

热土豆（烫手山芋）路由选择的基本思想是：在多个可选的 NEXT-HOP 路由器中，挑选**本 AS 内部**到该 NEXT-HOP 开销最低的那一个。

之所以叫「烫手山芋」，是因为它只想尽可能快地把分组丢出自己的 AS（域内开销最低），至于分组离开本 AS 之后还要走多远，它并不关心——这是一种贪心策略。

在路由器转发表中增加 AS 外部目的地的步骤：

![热土豆路由选择下向转发表加入域外目的地的步骤](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-11-19-26-10.webp)

#### Route-Selection Algorithm

一台路由器可能同时知道通往同一个前缀的多条路由，此时需要从中选出一条。BGP 依次使用下列规则逐条淘汰，直到只剩一条为止

1. 每条路由都有一个**本地偏好（local preference）**[^8]属性，选择本地偏好值最高的路由；
2. 若本地偏好值相同，则选择 AS-PATH 最短的路由（即经过的 AS 数量最少）；
3. 若 AS-PATH 也相同，则选择离 NEXT-HOP 路由器最近的路由，即域内开销最小的那条（Hot potato routing）；
4. 若仍未分出胜负，则根据 BGP 标识符（BGP identifiers）等其他标准来决定。

#### IP-Anycast

除了作为因特网的 AS 间路由协议外，BGP 还经常被用来实现 IP 任播（anycast）服务，该服务通常用于 DNS。

常见的应用场景可抽象为：把相同的内容复制到分散在不同地理位置的多台服务器上，并让每个用户都从离自己最近的那台获取内容。具体的例子包括：CDN 在不同国家/地区的服务器上复制视频和其他对象；DNS 系统在世界各地的 DNS 服务器上复制 DNS 记录。

实现方式是让这些服务器使用**同一个 IP 地址**，各自所在的 AS 都用 BGP 通告这个前缀。于是不同地区的路由器会按照 BGP 的选路规则各自选出「最近」的那份通告，用户的请求便被送到就近的服务器。

> [!info]
> **How does Anycast work?**
> Anycast network routing is able to route incoming connection requests across multiple data centers. When requests come into a single IP address associated with the Anycast network, the network distributes the data based on some prioritization methodology. The selection process behind choosing a particular data center will typically be optimized to reduce latency by selecting the data center with the shortest distance from the requester. Anycast is characterized by a 1-to-1 of many association, and is one of the 5 main network protocol methods used in the Internet protocol.
>
> **What is the difference between Anycast and Unicast?**
> Most of the Internet works via a routing scheme called Unicast. Under Unicast, every node on the network gets a unique IP address. Home and office networks use Unicast; when a computer is connected to a wireless network and gets a message saying the IP address is already in use, an IP address conflict has occurred because another computer on the same Unicast network is already using the same IP. In most cases, that isn't allowed.
> Using Anycast means the network can be extremely resilient. Because traffic will find the best path, an entire data center can be taken offline and traffic will automatically flow to a proximal data center.
>
> [What is Anycast? | How does Anycast work?](https://www.cloudflare.com/learning/cdn/glossary/anycast-network/)

#### Routing Policy

BGP 的选路结果往往不取决于「哪条路更短」，而取决于「谁该为这段流量买单」。下面是一个典型例子：X 是一个**多宿主接入 ISP（multi-homed access ISP）**，它同时接入了 B、C 两个提供商

![图中 A、B、C、W、X、Y 均表示 AS，而非单台路由器](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-11-20-01-40.webp)

- A 把到达 W 的路径 `AW` 通告给 B
- B 把 `BAW` 通告给 X：X 是 B 的客户，B 愿意为它承载流量
- 那么 B 会把 `BAW` 也通告给 C 吗？不会。W 和 C 都不是 B 的客户，一旦通告出去，C 发往 W 的流量就会白白穿过 B 的骨干网。B 希望 C 自己走 `CAW`，自己只负责为客户转发流量

> ISP 遵循的法则：任何穿越某 ISP 主干网的流量，其源或者目的必须位于该 ISP 的某个客户网络中。

**为什么 AS 内选路和 AS 间选路采用不同的协议?**

- **策略 Policy**:
  - AS 间：管理员想控制本 AS 产生的流量怎样选路，以及允许哪些流量穿过自己的网络
  - AS 内：整个 AS 归单个管理者所有，不存在互相博弈，因此不需要策略
- **规模 Scale**:
  - 层次路由节省了转发表的存储空间，也减少了路由更新的流量
- **性能 Performance**:
  - AS 内：可以集中精力优化性能
  - AS 间：策略往往比性能更重要

## The SDN Control Plane

软件定义网络（SDN，Software Defined Network）源自美国斯坦福大学 Clean Slate 研究组提出的一种新型网络创新架构，其特点是控制平面与转发平面分离、且开放可编程，网络可以通过软件来定义和控制。

![SDN 的分层架构](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-11-20-47-27.webp)

SDN 的核心理念是让应用软件能够参与对网络的控制管理，从而满足上层业务需求、通过自动化部署简化网络运维。如果把现有的网络比作手机，那 SDN 的目标就是做出一个网络界的 Android 系统：系统本身可以升级，还能在上面安装各种更强大的 APP。

SDN 并不是一项具体的技术，它是一种网络设计理念，规划了网络的各个组成部分（软件、硬件、转发面和控制面）以及它们之间的互动关系。

> [!info]
> 过去几十年里，IP 网络一直是全分布式的，战功卓著，解决了各种客户需求。今天 SDN 是为了未来更好更快的实现用户需求。并不是有什么需求通过传统方法不能做到，只是 SDN 做得更快、更好、更简单。
>
> IP 网络的生存能力很强，得益于其分布式架构。当年美国军方希望在遭受核打击后，整个网络能够自主恢复，这样就不能允许网络集中控制，不能存在中心结点，否则在这个中心节点丢一颗核弹，整个网络就瘫痪了，由此才导致了互联网的研究和诞生。
>
> 但正是这种全分布式架构导致了许多问题：看看现在的 IP 网络管理多复杂，举个运营商部署 VPN 的例子：要配置 MPLS、BFD、IGP、BGP、VPNv4、要绑定接口……且需要在每个 PE[^9] 上配置；当新增加一个 PE 时，还需要回去修改每个涉及到的 PE。现在各厂家的网络设备都太复杂了。如果您准备成为某个厂商设备的百事通，你需要掌握的命令行超过 10000 条，而其数量还在增加。如果你准备成为 IP 骨灰级专家，你需要阅读网络设备相关 RFC 2500 篇，如果一天阅读一篇，你知道要看多久能看完？6 年多！而这只是整个 RFC 的 1/3，其数量还在增加。
>
> 此外，这些协议标准都是在解决各种各样的控制面需求，而这些需求都要经过需求提出、定义标准、互通测试、现网设备升级才能完成部署，一般要 3~5 年。这样的速度，已经 Hold 不住网络上运营业务的 OTT[^10] 们的各种快速网络调整需求，必须想办法解决这个问题。
>
> ![Google 的数据中心内部网络与骨干网](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-11-20-46-59.webp)
>
> Google 的网络分为数据中心内部网络（IDC Network）和骨干网（Backbone Network，也称 WAN 网）。其中 WAN 网按流量方向又分为两张骨干网：一张是连接 Google 分布在世界各地的数据中心的 Inter-DC WAN（即 G-scale Network，属于内部网络），另一张是面向因特网的对外网络。Google 用 SDN 改造的正是前者。
>
> 促使 Google 这么做的最大原因是 WAN 网链路的带宽利用率很低：出口设备有上百条对外链路，被分成很多个 ECMP[^11] 负载均衡组，而组内多条链路之间用的是基于静态 Hash 的负载均衡方式，无法感知实际流量分布。改造后最主要的应用是流量工程，最主要的控制手段是软件应用程序。

**SDN 的发展驱动力和优势**

驱动力：

- **计算虚拟化**：网络从静态走向动态。虚拟机迁移打破了原有的静态网络部署模式，要求网络能力对外开放，与虚拟化业务联动、随需而动地调整网络策略
- **云计算对资源的垂直整合**：从各自独立演进走向协同。网络作为一种资源被云计算整合进基础架构，需要提供快速的连接服务
- **业务迭代速度**：云计算时代 IT 业务变化飞快，驱动网络从固定配置转向可编程
- **数据中心资源整合**：资源需要随业务跨地域整合，数据中心之间的广域流量因此增大；而现状是数据中心资源分散、广域链路成本高且利用率低

优势：

- 统一便捷的管理，解决网络中设备越来越多样化的问题
- 无缝的版本升级，减少设备升级对业务的影响
- 网络数据可视化
- 整体的流量调度

![SDN 的驱动力与体系结构](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-11-20-51-15.webp)

SDN 体系结构具有四个关键特征：

- **基于流的转发（Flow-based forwarding）**：转发规则不再只看目的 IP 地址，而是可以匹配传输层、网络层、链路层的多个首部字段
- **数据平面与控制平面分离（Separation of data plane and control plane）**：交换机只负责按表转发，不再自己参与路由计算
- **网络控制功能位于数据平面交换机外部（Network control functions: external to data-plane switches）**：控制逻辑集中在远程控制器上
- **可编程网络（A programmable network）**：控制器向上提供 API，网络行为由运行在控制器之上的应用程序来定义

SDN 的核心思想是建立一个通用转发体系：每台交换设备只保留一个**流表（flow table）**[^12]，流表由逻辑上集中的远程控制器统一计算并分发。

![SDN 控制器计算并下发流表](https://assets.vluv.space/UESTC/Network/Ch4-2NetworkLayer/Ch4-2NetworkLayer-2024-06-11-20-56-23.webp)

[^1]: 链路状态广播：每台路由器把「自己有哪些邻居、每条链路费用是多少」打包成链路状态分组，通过洪泛（flooding）发给网络中所有其他路由器。收齐之后，每台路由器手上就都有了一份相同的全网拓扑图。

[^2]: 路由振荡：当链路费用与链路上的流量挂钩时，所有路由器可能同时把流量切换到当前较空闲的链路上，使其立刻变得拥塞；下一轮又一起切回去，如此来回摆动。常见的缓解办法是让各路由器错开发送链路状态通告的时刻，避免它们同步动作。

[^3]: AS 可以理解为由一个组织统一管理、采用统一路由策略的一组网络和路由器。例如一所大学的校园网络即可作为一个 AS。每个 AS 有一个全球唯一的编号 ASN。

[^4]: 跳数指分组从源子网到目的子网所经过的子网数量（即途经的路由器数量）。RIP 中 16 跳被定义为「无穷远」，即目的不可达，因此一条 RIP 路径最长只能有 15 跳。

[^5]: TOS（Type of Service，服务类型）是 IPv4 首部中的一个字段，用来标识分组期望获得的服务质量，例如低时延、高吞吐量或高可靠性。

[^6]: 前缀（prefix）即 CIDR 形式的网络地址，如 `138.16.68/22`，代表一个子网或一组子网。BGP 通告的是前缀而不是具体的主机地址，这样一条通告就能覆盖大量地址，极大压缩了域间路由表的规模。

[^7]: 「半永久」是指这条 TCP 连接一旦建立就长期保持，而不是每次交换路由信息都新建一次。连接建立后先交换整张路由表，之后只在路由发生变化时发送增量更新；连接一旦中断，对端就认为经由它学到的路由全部失效。

[^8]: 本地偏好值由本 AS 的网络管理员按照自身策略配置（例如「优先走费用便宜的那家提供商」），值越大越优先。它只在本 AS 内部通过 iBGP 传递，不会通告给其他 AS，因此叫「本地」偏好。

[^9]: PE（Provider Edge，运营商边缘路由器）是运营商网络中直接连接客户站点的那一圈路由器，VPN 业务的绝大部分配置都落在它们身上。

[^10]: OTT（Over The Top）指越过运营商、直接在其网络之上向用户提供业务的互联网服务商，如各类视频、社交、云服务厂商。它们的业务迭代速度远快于传统电信网络的部署速度。

[^11]: ECMP（Equal-Cost Multi-Path，等价多路径）指当到达同一目的地存在多条开销相同的路径时，把流量分摊到这些路径上。静态 Hash 方式只按分组首部字段计算散列来选路，不感知各条链路的实际负载，因此容易出现有的链路挤爆、有的链路闲置。

[^12]: 流表由若干「匹配 + 动作」表项组成：匹配部分指定分组首部字段应满足的条件，动作部分指定命中后的处理方式（转发到某端口、丢弃、修改首部、送给控制器等）。它是 OpenFlow 等南向协议中交换机的统一抽象。
