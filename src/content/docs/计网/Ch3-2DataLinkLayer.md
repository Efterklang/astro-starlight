---
title: 数据链路层 Datalink Layer Ⅱ
date: 2024-03-19
excerpt: 介绍数据链路层的 PPP 协议和 MAC 协议
categories: [Dev, Network]
tags: [Network]
thumbnail: https://assets.vluv.space/cover/Networks/datalinker2.webp
cover: https://assets.vluv.space/cover/Networks/datalinker2.webp
---

## Point to Point Protocol

点对点协议 PPP（Point-to-Point Protocol）是目前使用最广泛的点对点数据链路层协议

PPP 协议是因特网工程任务组 IEIF 在 1992 年制定的。经过 1993 年和 1994 年的修订，现在的 PPP 协议已成为因特网的正式标准[RFC1661，RFC1662]

数据链路层使用的一种协议，它的特点是：简单；只检测差错，而不是纠正错；不使用序号，也不进行流量控制；可同时支持多种网络层协议

一般的用户接入互联网的方式: 连接到某个因特网服务提供者 ISP(中国电信,中国移动.etc),用户计算机获取到 ISP 所分配的合法 IP 地址后,才能成为因特网的一员;PPPoE(PPP over Ethernet)协议在家庭和小型企业中被广泛用于连接到互联网服务提供商

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-12-15-55-21.webp" alt="">

PPP（Point-to-Point Protocol）是一种网络协议,通常用于在两点之间建立直接连接,例如计算机和互联网服务提供商（ISP）的连接。PPP 可以在各种类型的物理网络上运行,包括串行线、电话线、同轴电缆、全双工光纤传输线路或无线连接等。

### Components of PPP

**The Link Control Protocol (LCP)**: responsible for establishing, configuring, and testing the link between the two devices. It negotiates link parameters like the maximum frame size and compression type while monitoring the link for errors and drops
**The Authentication Protocol (AP)**: responsible for verifying the identities of the two devices using a range of authentication methods, including passwords, digital certificates, and biometrics
**The Network Control Protocol (NCP)**: responsible for negotiating the network layer protocol used to transmit data over the connection, supporting a variety of network layer protocols such as IP, IPX, and AppleTalk!
[](https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-18-18-55-25.webp)

### PPP 的主要特性和功能

- **封装数据**：PPP 可以封装 IP,IPX 等网络层协议的数据包,使它们可以在点对点链接上传输。
- **身份验证**：PPP 支持 PAP（Password Authentication Protocol）和 CHAP（Challenge Handshake Authentication Protocol）等身份验证协议,这些协议可以在建立连接时验证用户的身份。
- **链接控制**：PPP 使用 LCP（Link Control Protocol）来建立、配置和测试数据链路连接。
- **网络控制**：PPP 使用 NCP（Network Control Protocol）来建立和配置不同的网络层协议。
- **错误检测**：PPP 帧包含一个校验和字段,用于错误检测。
- **多协议支持**：PPP 支持多种网络层协议,这使得它可以在各种不同的网络环境中使用。

PPP 是一种灵活且广泛使用的协议,特别适用于拨号和 DSL 连接。它是许多互联网用户连接到 ISP 的基础。它的特点是：简单；只检测差错,而不是纠正差错；不使用序号,也不进行流量控制；可同时支持多种网络层协议,是目前使用最广泛的点对点数据链路层协议

### PPP 帧格式

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-12-16-44-00.webp" alt="Frame Format">

### PPP 透明传输

面向字节的异步链路：字节填充法(插入转义字符)
<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-18-15-34-56.webp" alt="">
面向比特的同步链路：比特填充法(插入比特 0)
<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-18-15-37-14.webp" alt="">

### 差错检测

能够对接收端收到的帧进行检测,并立即丢弃有差错的帧。因此 PPP 向上层提供的是不可靠传输服务

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-18-15-51-31.webp" alt="">

### 工作状态

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-18-18-43-26.webp" alt="">

- Bob initiates a connection by dialing his ISP’s phone number
- Bob’s modem establishes a physical connection with the ISP’s modem over a phone line
- The two modems exchange LCP packets for negotiating the connection parameters. Parameters are, for instance, the maximum frame size and compression type
- They agree to a maximum frame size of 1500 bytes with no compression
- After the LCP negotiation, Bob’s modem and the ISP’s modem authenticate each other’s identities
- The ISP uses the Challenge-Handshake Authentication Protocol (CHAP) to verify Bob’s identity. Bob, however, employs the Password Authentication Protocol (PAP) to verify the ISP’s identity
- Once authentication is complete, the two modems exchange NCP packets. So, they determine which network layer protocol will be used to transmit data over the connection
- They agree to use the TCP/IP protocol suite
- With the NCP negotiation complete, we can transmit the data between Bob’s computer and the internet using the TCP/IP protocol suite through encapsulated frames transmitted over the PPP connection
- Finally, when Bob finishes using the internet, he can terminate the PPP connection by disconnecting the modem or logging off the ISP’s server
  _PPP 协议已不是纯粹的数据链路层的协议,它还包含了物理层和网络层的内容_

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-19-10-51-14.webp" alt="">

## Multiple Access Links and Protocols

### MAC 引入

**局域网的数据链路层**

- 局域网最主要的**特点**是：
  - 网络为一个单位所拥有；
  - 地理范围和站点数目均有限。
- 局域网具有如下**主要优点**：
  - 具有广播功能,从一个站点可很方便地访问全网。局域网上的主机可共享连接在局域网上的各种硬件和软件资源。
  - 便于系统的扩展和逐渐地演变,各设备的位置可灵活调整和改变。
  - 提高了系统的可靠性、可用性和残存性。

**数据链路层的两个子层**
为了使数据链路层能更好地适应多种局域网标准,IEEE 802 委员会就将局域网的数据链路层拆成**两个子层**：

- **逻辑链路控制** LLC (Logical Link Control)子层；
- **媒体接入控制** MAC (Medium Access Control)子层。

与接入到传输媒体有关的内容都放在 MAC 子层,而 LLC 子层则与传输媒体无关。**不管采用何种协议的局域网,对 LLC 子层来说都是透明的。**

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-19-15-39-34.webp" alt="">

为什么要媒体接入控制（介质访问控制）？
**共享信道带来的问题**
若多个设备在共享信道上同时发送数据,则会造成彼此干扰,导致发送失败。

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-22-22-20-50.webp" alt="">

#### 信道划分协议

**静态信道划分 Static Channel Allocation**
静态信道划分（Static Channel Allocation）是一种通信网络中的资源分配策略,它将可用的频谱资源事先固定地分配给各个用户或者信道。这种方式下,即使某个用户或信道当前没有数据需要传输,其分配的资源也不能被其他用户或信道使用,因此可能导致资源的浪费。谨常在无线网络的物理层中使用

SCA 有三种主要的技术,在这些技术中,每个用户或信道都被分配到一个特定的频率带宽、时间槽或编码。

**频分多址** FDMA,Frequency Division Multiple Access

将总信道带宽 R b/s 划分为 N 个较小信道（频段，带宽为 R/N），分别分配给 N 个节点
避免冲突、公平：N 个节点公平划分带宽；
节点**带宽有限**、效率不高：节点带宽为 R/N。

**时分多址** TDMA,Time Division Multiple Access

其基本思想是将时间划分为时间帧，每个时间帧再划分为 N 个时隙（长度保证发送一个分组），分别分配给 N 个节点。每个节点只在固定分配的时隙中传输

首先，它能避免冲突，将链路资源进行公平分配，每个节点专用速率 R/N b/s。
其次，节点**速率有限**：R/N b/s，当其他节点没有数据要传输时，需要发送数据的节点也不能充分利用链路资源；
因此，TDMA 的效率不高，节点必须等待它的传输时隙才能发送数据。

**码分多址** CDMA,Code Division Multiple Access

每个节点分配一个唯一的编码
每个节点用它唯一的编码来对它发送的数据进行编码
允许多个节点“共存” ，信号可叠加，即可以同时传输数据而无冲突 (如果编码 是“正交化”的)

#### 动态接入控制 Dynamic Access Control

动态接入控制（Dynamic Access Control）是一种网络通信中的资源分配策略,它根据网络的实时需求动态地分配资源。与静态信道划分（如 FDMA、TDMA、CDMA）相比,动态接入控制可以更有效地利用可用资源。在动态接入控制中,如果一个用户没有数据需要传输,其分配的资源可以被其他用户使用,从而避免了资源的浪费。这种方式需要一个接入控制协议来确定哪些用户可以在哪个时刻使用网络资源。

- 受控接入 Controlled Access(已经被淘汰)
  - 集中控制 Centralized Control
  - 分散控制 Distributed Control
- 随机接入 Random Access
  - ALOHA
  - CSMA/CD
  - CSMA/CA

### MAC 定义

**Media access control**, medium access control or simply MAC, is a specific network data transfer policy. It determines how data transmits through a regular network cable. The protocol exists to ease data packets’ transfer between two computers and ensure no collision or simultaneous data transit occurs.

The medium access control – commonly referred to as the MAC protocol – is, effectively, a sublayer or MAC sublayer that controls hardware responsible for the communication with a wired, wireless or optical transmission medium.

The MAC sublayer is part of the two sublayers scheme: data link layer. The other part of the data link layer is the logical link control (LLC) sublayer. The LLC sublayer offers multiplexing and flow control for the logical link, and the MAC sublayer acts as the interface between the LLC sublayer and the physical layer within a transmission medium.
<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/DataLinkLayerPart2-2024-03-19-15-02-02.webp" alt="">

**媒体访问控制（MAC）**是数据通信协议中一种子层,它是数据链路层的一部分。MAC 子层的主要职责是控制设备如何访问网络介质（例如以太网,Wi-Fi）,以便进行有效的信息传输。
MAC 地址是一个设备网络接口的唯一标识符。它通常由六组两位十六进制数字组成,例如：`00:0A:95:9D:68:16`。每个网络设备的 MAC 地址都是全球唯一的,由设备制造商在生产时分配。
MAC 地址在网络通信中起着关键作用。当一个设备需要发送数据包到另一个设备时,它会使用目标设备的 MAC 地址来定位它。这是在同一局域网（LAN）内进行通信的基础。

### Static Channel Allocation

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-03-25-18-53-09.webp" alt="">

**复用 (Multiplexing)** 是通信技术中的一个重要概念。复用就是通过一条物理线路同时传输多路用户的信号。当网络中传输媒体的传输容量大于多条单一信道传输的总通信量时,可利用复用技术在一条物理线路上建立多条通信信道来充分利用传输媒体的带宽。

#### 频分复用 FDM (Frequency Division Multiplexing)

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-03-26-09-41-34.webp" alt="">

将传输线路的频带资源划分成多个子频带,形成多个子信道,各子信道间需要留出隔离频带,以免造成子信道间的十扰。当多路信号输入一个多路复用器时,这个复用器将每一路信号调制到不同频率的载波上。接收端由相应的分用器通过滤波将各路信号分开,将合成的复用信号恢复成原始的多路信号。

#### 时分复用 TDM (Time Division Multiplexing)

- **时分复用**则是将时间划分为一段段等长的时分复用帧（TDM 帧）。每一个时分复用的用户在每一个 TDM 帧中占用固定序号的时隙。
- 每一个用户所占用的时隙是**周期性地出现**（其周期就是 TDM 帧的长度）的。
- TDM 信号也称为**等时** (isochronous) 信号。
- 时分复用的所有用户在不同的时间占用同样的频带宽度。

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-03-26-09-42-39.webp" alt="">

#### 波分复用 WDM (Wavelength Division Multiplexing)

波分复用就是光的频分复用,使用一根光纤来同时传输多个光载波信号;光信号传输一段距离后会衰减,所以要用**掺铒光纤放大器 EDFA(Erbium-Doped Fiber Amplifier)** 放大光信号
<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-03-26-10-07-39.webp" alt="">

#### 码分复用 CDM (Code Division Multiplexing)

**码分复用 CDM** 是另一种共享信道的方法。实际上,由于该技术主要用于多址接入,人们更常用的名词是**码分多址 CDMA(Code Division MuItipIe Access)** 同理,频分复用 FDM 和时分复用 TDM 同样可用于多址接入,相应的名词是频分多址 FDMA(Frequency Division Multiple Access) 和时分多址 TDMA(Time Division Multiple Access);与 FDM 和 TDM 不同,CDM 的每一个用户可以在同样的时间使用同样的频带进行通信。由于各用户使用经过特殊挑选的不同码型,因此各用户之间不会造成干扰。CDM 最初是用于军事通信的,因为这种系统所发送的信号有很强的抗干扰能力,其频谱类似于白噪声,不易被敌人发现。随着技术的进步,CDMA 设备的价格和体积都大幅度下降,因而现在已广泛用于民用的移动通信中

> 复用与多址的概念。可简单理解如下：
>
> - 复用(Multiplexing)是将单一媒体的频带资源划分成很多子信道,这些子信道之间相互独立,互不干扰。从媒体的整体频带资源上看,每个子信道只占用该媒体频带资的一部分。
> - 多址(Multiple Access),更确切地应该称为多点接入,处理的是动态分配信道给用户;这在用户暂时性占用信道(如移动通信)的应用中是必须的。在信道永久性地分配给用户(如无线广播等)的应用中,多址是不需要的
> - 某种程度上,FDMA,TDMAS CDMA 可以分别看成是 FDM,TDM,CDM 的应用

- 在 CDMA 中,每一个比特时间再划分为 m 个短的间隔,称为**码片 (Chip)**;通常 m 的值是 64 或 128 为了简单起见,在后续的举例中,我们假设 m 为 8;
- 使用 CDMA 的每一个站被指派一个唯一的 m bit **码片序列 (Chip Sequence);**
  - 一个站如果要发送比特 1 ,则发送它自己的 m bit 码片序列；
  - 一个站如果要发送比特 0 ,则发送它自己的 m bit 码片序列的二进制反码；
    指派给（ DMA 系统中某个站点的码片序列为 `00011011`
    发送比特 1:发送自己的码片序列 `00011011`
    发送比特 0:发送自己的码片序列的二进制反码 `11100100`
    为了方便，我们按惯例将码片序列中的 0 写为-1, 将 1 写为+ 1 。则该站点的码片序列是`(-1 -1 -1 + 1 + 1 -1 + 1 + 1)`
- 码片序列需要满足的条件

  - 每个站的 Chip Sequence 不能相同,实际上常采用伪随机码片序列,这样可以使得码片序列之间的相关性很小,从而减小干扰；
  - 每个站的 Chip Sequence 必须相互正交,令向量 S 表示站 S 的码片序列，令向量 T 表示其他任何站的码片序列。两个不同站 S 和 T 的码片序列正交，就是向量 S 和 T 的规格化内积为 0 ：
  - 满足的 4 个条件如公式所示
    <div>
    $$
      \begin{array}{ll}
      S \cdot T \equiv \frac{1}{m} \sum_{i=1}^{m} S_{i} T_{i}=0 &
      S \cdot \bar{T} \equiv 0 \\
      S \cdot S \equiv \frac{1}{m} \sum_{i=1}^{m} S_{i} S_{i}=\frac{1}{m} \sum_{i=1}^{m} S_{i}^{2}=\frac{1}{m} \sum_{i=1}^{m}( \pm 1)^{2}=1 &
       S \cdot \bar{S} \equiv-1
       \end{array}
    $$
    </div>

### Random Access Protocols

基本思想：
发送节点以信道全部速率（R b/s）发送；发生冲突时，冲突的每个节点分别等待一个随机时间，再重发，直到帧(分组)发送成功。节点间没有协调者

典型随机访问协议有：

- ALOHA 协议(纯 ALOHA，时隙 ALOHA)
- 载波监听多路访问 CSMA 协议
- 带冲突检测的载波监听多路访问 CSMA/CD
- 带冲突避免的载波监听多路访问 CSMA/CA

#### ALOHA

ALOHA：夏威夷大学研制的一个无线电广播通信网（20 世纪 70 年代初），采用星型拓扑结构，使地理上分散的用户通过无线电来使用中心主机。
中心主机通过下行信道向二级主机广播分组；
二级主机通过上行信道向中心主机发送分组（可能会冲突，无线电信道是一个公用信道）。
ALOHA 有两种形式：时隙 ALOHA 和纯 ALOHA

> [!info]
>
> ALOHA `/ә'lәuhә/`: 夏威夷语，指爱慕、恋慕、同情、怜悯、再见、你好

##### 非时隙 Aloha

简单，不需同步

- 帧一到达，立即传输;
- 如果与其他帧产生冲突，在该冲突帧传完之后：
  - 以概率 p 立即重传该帧；
  - 或等待一个帧的传输时间，再以概率 p 传输该帧，或者以概率 1-p 等待另一个帧的时间。
- 冲突概率:
  在 t0 发送的帧，可能和在 [t0-1,t0+1]的发送的其它帧冲突
  <img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-06-14-20-25-04.webp" style="width:50%;" alt="">

**纯 Aloha 效率**

假设有 N 个节点，每个节点在时隙以概率 p 发送

<div>
$$
\begin{align*}
& P(给定节点成功传送) \\
&                     = p \times P(没有其他节点在[t0-1,t0]内传送) \times P(没有其他节点在[t0,t0 +1]内传送)\\
&                     = p \times (1-p)^{N-1} \times (1-p)^{N-1}\\
&                     = p \times (1-p)^{2(N-1)}\\
& E(p) = Np(1-p)^{2(N-1)}
\end{align*}
$$
</div>

##### 时隙 ALOHA

假设

- 所有帧大小相同
- 时间被划分为相同大小的时隙，一个时隙等于传送一帧的时间
- 节点只能在一个时隙的开始才能传送
- 节点需要同步
- 如果一个时隙有多个节点同时传送，所有节点都能检测到冲突

在每个节点中，时隙 ALOHA 的操作如下

- 当节点要发送新帧，它等到下一时隙开始时传送
- 如果没有碰撞，该节点成功地传输它的帧，从而不需要考虑重传该帧；
- 如果有冲突，节点在随后的时隙以概率 p 重传该帧，直到成功为止。

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-06-14-20-50-37.webp" style="width:80%;" alt="">

- Pros
  - 单个活跃节点可以持续以满速率传送帧
  - 具有高分散性: 只需节点的时隙同步
  - 简单
- Cons
  - 冲突，浪费时隙
  - 空闲时隙
  - 节点只有在传输数据包时才能检测到冲突

**时隙 Aloha 的效率**
假设有 N 个节点，每个节点在时隙以概率 p 发送
一个节点在一个时隙成功传送的概率 为$p(1-p)^{N-1}$
任一节点传送成功的概率 $Np(1-p)^{N-1}$

#### 载波侦听多路访问 CSMA

**载波侦听**：某个节点在发送之前，先监听信道。

- 信道忙：有其他节点正往信道发送帧，该节点随机等待（回退）一段时间，然后再侦听信道。
- 信道空：该节点开始传输整个数据帧。

**CSMA 的特点：**

- 发前监听，可减少冲突。
- 由于传播时延的存在，仍有可能出现冲突，并造成信道浪费,例如
  - 时间 t0：节点 B 侦听到信道空，开始传输帧，沿着媒体传播比特。
  - 时间 t1（t1>t0）：节点 D 有帧要发送。B 的传输信号未到 D，D 检测到信道空，开始传输。很快，B 的传输开始在 D 节点干扰 D 的传输。传播时延越长，节点不能侦听到另一个节点已经开始传输的可能性越大。

#### 带冲突检测的载波监听多路访问 CSMA/CD

- 增加“载波侦听”和“冲突检测”两个规则。
- 基本原理： 传送前侦听
  - 信道忙：延迟传送
  - 信道闲：传送整个帧
- 发送同时进行冲突检测：一旦检测到冲突就立即停止传输，尽快重发。
- 目的：缩短无效传送时间，提高信道的利用率。

## Switched Local Area Networks

**局域网**：Local Area Network ( LAN )
主要特点：网络为一个组织所拥有，且地理范围和站点数目均有限
局域网按拓扑结构进行分类：星形网、环形网、总线网、树形网和网状网

- 多址访问协议广泛应用于局域网
- 基于随机访问的 CSMA/CD 广泛应用于局域网
- 基于令牌传递技术的令牌环和 FDDI 在局域网技术中变得次要或被淘汰
- 链路层技术的发展，使得局域网、城域网、广域网的概念变得越来越模糊和不重要

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-06-14-21-02-04.webp" style="width:100%;" alt="">

计算机与局域网通过网络接口板进行连接，网络接口板又称通信适配器（Adapter）或网络接口卡 NIC（Network Interface Card），通常我们称为“网卡”。
<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-06-14-21-06-57.webp" style="width:50%;" alt="">

### Link-Layer Addressing and ARP

每个节点有网络层地址和链路层地址。

- 网络层地址：节点在网络中分配的一个唯一地址（IP 地址）。用于把分组送到目的 IP 网络。长度为 32 比特（IPv4）。
- 链路层地址：又叫做 MAC 地址或物理地址、局域网地址。用于把数据帧从一个节点传送到另一个节点(同一网络中)。
- MAC 地址（LAN 地址、物理地址）：
  - 节点“网卡”本身所带的地址（唯一）。
  - MAC 地址长度通常为 6 字节(48 比特)，共 248 个。
  - 6 字节地址用 16 进制表示，每个字节表示为一对 16 进制数
  - 网卡的 MAC 地址是永久的（生产时固化在其 ROM 里）

**MAC Address 分配**

由专门机构 IEEE 管理物理地址空间，负责分配六个字节中的前三个字节（高 24 位，地址块）；后三个字节由制造商决定（低 24 位，地址序列）。

- MAC 地址是平面结构，带有同一网卡的节点，在任何网络中都有同样的 MAC 地址。
- IP 地址具有层次结构，当节点移动到不同网络时，节点的 IP 地址发生改变。

**MAC Address 识别**

广播信道的局域网中，一个节点发送的帧，在信道上广播传输，其他节点都可能收到该帧。
大多数情况，一个节点只向某个特定的节点发送。

由“网卡”负责 MAC 地址的封装和识别。

- 发送适配器：将目的 MAC 地址封装到帧中，并发送。所有其他适配器都会收到这个帧。
- 接收适配器：检查帧的目的 MAC 地址是否与自己 MAC 地址相匹配：
  - 匹配：接收该帧，取出数据报，并传递给上层。
  - 不匹配：丢弃该帧。

广播帧：发送给所有节点的帧 `FF-FF-FF-FF-FF-FF`

> [!info] 地址之间的转换
>
> 主机名 - IP 地址 - MAC 地址
>
> - DNS 域名系统：将主机名解析到 IP 地址。
> - ARP 地址解析协议：将 IP 地址解析到 MAC 地址。
>   - ARP 只为在同一个 LAN 上的节点解析 IP 地址。

### Address Resolution Protocol (ARP)

局域网上的每个节点（主机，路由器）都会维护一个 **ARP 表**，这个表中会记录节点当前所知的 IP 地址到 MAC 地址的映射信息

- 为某些局域网节点进行 IP/MAC 地址映射：`< IP address; MAC address; TTL>`
- TTL (存活时间): 地址映射将被删除的时间（通常为 20 分钟）

#### Sending a Datagram in Subnet

假设**同一个局域网**中主机 A 希望发送数据报给主机 B，

- 主机 A 首先查找自己维护的 ARP 表，看是否存在 B 的 MAC 地址
- 假设 B 的 MAC 地址不在 A 的 ARP 映射表中。则主机 A 首先广播 ARP 查询分组,其中包含 B 的 IP 地址，查询分组是个广播帧，即目的 MAC 地址是`FF-FF-FF-FF-FF-FF`
- 因此局域网中所有节点收到 ARP 查询分组，其余主机发现查询的不是本机的 MAC 地址，因此不进行回应。
- 只有主机 B 收到 ARP 查询分组后，返回 B 的 MAC 地址给主机 A，包含有 B 的 MAC 地址的帧发送给主机 A(单播)。
- 于是，主机 A 在自己的 ARP 表中缓存 B 主机的 IP 地址和 MAC 地址。
- 这里需要说明的是，ARP 是即插即用的，即局域网中动态的增加或减少主机，不需要管理员进行额外的手工干预。

#### Sending a Datagram off the Subnet

假设发送数据报到**子网以外**

在整个传输过程中，数据报的源 IP 地址和目的 IP 地址是不会发生改变的，改变的只是数据帧的源和目的 MAC 地址。

- 主机 A 构建 IP 数据报，源地址是 A 的 IP 地址，目的地址是 B 的 IP 地址
- 主机 A 构建链路层数据帧，目的 MAC 地址是自己下一跳（假设为 R）的 MAC 地址，源 MAC 地址是 A 的 MAC 地址
- 数据帧从主机 A 发送到路由器 R,路由器 R 收到数据帧，抽取出数据报递交到 IP 层
- 路由器 R 转发数据报，源地址为 A 的 IP 地址，目的地址为 B 的 IP 地址。源 MAC 为 R 的 MAC 地址，目的 MAC 为下一跳的 MAC 地址。路由器 R 将该数据报封装成链路层帧并发送
- 直至数据报到达目的地址 B，B 接收到数据报，递交到 IP 层

### Ethernet

最初的以太网是采用同轴电缆来连接各个设备的，如今则广泛使用双绞线、光纤等。如今的无线局域网 wifi 也使用了若干以太网的技术和规范

以太网是目前为止，最为成功的一种有线局域网技术。
以太网成功的原因，主要包括如下三点：

- 它是第一个广泛使用的局域网技术；
- 以太网非常简单，而且相关设备也很便宜；
- 以太网的版本不断更新，数据传输速率更高、成本更低。

这是当年以太网设计者画的草图。

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-06-14-21-29-48.webp" style="width:100%;" alt="Metcalfe’s Ethernet sketch">

**以太网的物理拓扑结构**

- bus:一直流行到 90 年代中期;所有节点都属于相同的冲突域
- star:中心是交换机;每个端口运行一个独立的以太网协议(节点相互之间不发生碰撞)

#### Ethernet Frame Structure

以太网的帧结构，如图所示，包括了前同步码、目的 MAC 地址、源 MAC 地址、类型、数据和 CRC 校验码。
注意这里 CRC 检验的数据只包含目的 MAC 地址、源 MAC 地址、类型、数据四部分。

<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-06-14-21-38-19.webp" style="width:100%;" alt="">

发送方：发送适配器将 IP 数据报封装成以太网帧，并传递到物理层。
接收方：接收适配器从物理层收到该帧，取出 IP 数据报，并传递给网络层。

**前同步码 Preamble**
前 7 字节是“10101010”，最后一个字节是“10101011”。
使接收方和发送方的时钟同步，接收方一旦收到连续的 8 字节前同步码，可确定有帧传过来。
前同步码是“无效信号”，接收方收到后删除，不向上层传。
CRC 的校验范围不包括前同步码。

**源、目的 MAC 地址**

同一以太网 LAN 中两台主机通信。
主机 A 向主机 B 发送一个 IP 数据报。
主机 A 适配器的 MAC 地址：XX-XX-XX-XX-XX-XX
主机 B 适配器的 MAC 地址：YY-YY-YY-YY-YY-YY
适配器 B 只接收目的 MAC 地址与自己 MAC 地址匹配的数据帧或广播地址的数据帧，并将数据字段的内容传递给网络层。否则，丢弃该帧。

**类型字段**

以太网可以“多路复用”（支持）多种网络层协议。通过“类型”字段区分。绝大多数这里的类型是指 IP 协议。
发送方填入网络层协议“类型”编号；
接收适配器根据“类型”字段，将数据字段传递给相应的网络层协议。

**数据字段(46 ～ 1500 字节)**

携带网络层传来的 IP 数据报
以太网的最大传输单元 MTU 是 1500 字节：
若 IP 数据报超过 1500 字节，必须将该数据报分段。
最小长度是 46 字节：
如果 IP 数据报小于 46 字节，必须填充为 46 字节。接收方网络层去除填充内容。

**循环冗余检测 CRC(4 字节)**

检测数据帧中是否出现比特差错（翻转）。
发送主机计算 CRC：范围包括目的地址、源地址、类型、数据字段的比特，结果放入帧 CRC 字段。
接收主机进行 CRC 校验：接收主机对收到的帧进行同样计算，并校验结果是否和 CRC 字段的内容相等。若计算结果不等于 CRC 字段的值(CRC 校验失败)，该帧有差错。

---

**以太网向网络层提供的服务**
无连接服务：通信时，发送方适配器不需要先和接收方适配器“握手”。
不可靠的服务：接收到的帧可能包含比特差错。
收到正确帧，不发确认帧；收到出错帧，丢弃该帧，不发否定帧。
发送适配器不会重发出错帧。
丢弃数据的恢复是通过终端传输层的可靠数据传输机制来实现的
以太网的 MAC 协议：以太网的 MAC 协议采用的是带二进制指数回退的 CSMA/CD 协议

### Link-Layer Switches

交换机是属于链路层的设备，其主要作用是存储转发数据帧，对于到达交换机的数据帧，交换机首先检查其目的 MAC 地址，然后根据 MAC 地址，有选择的将数据帧转发到一个或多个输出链路；
如果输出链路是一个共享网段，将使用 CSMA/CD 来访问共享链路。
<img src="https://assets.vluv.space/UESTC/Network/Ch3-2DataLinkLayer/Ch3-2DataLinkLayer-2024-06-14-21-46-10.webp" style="width:80%;" alt="">
在这幅图中 A、B、C 主机和交换机的端口 1 由集线器设备互连，因此这里，A、B、C 主机和交换机的端口 1 构成了一个共享网段，在共享链路发送数据帧，需要用到前面所说的以太网链路访问协议 CSMA/CD。
链路层交换机的第二个特点是透明，这里的透明是指的当一个主机向另一个主机发送数据帧时，它并不会知道某个交换机会收到这个数据帧，并将其转发到另一个节点。
交换机的第三个特点是即插即用和自学习，也就是说交换机是不需要手工配置的，插上就可以用

在组网时加入交换机后，可以支持多个节点同时传输数据帧。每个主机由单独的链路与交换机端口相连，因此交换机每个端口对应的链路和主机是一个独立的碰撞域。每个交换机有一个交换机转发表，其中每个条目格式为`(主机的MAC地址，到达主机的端口，时戳)`，通过自学习建立交换机转发表。

交换机会学习通过哪些端口可以到达哪些主机

- 当收到数据帧时，交换机“学习”发送主机的位置：进入的局域网网段(到达端口)
- 在转发表中记录发送主机/位置对

**交换机收到数据帧后的操作**

- 记录到达链路和发送主机的 MAC 地址
- 使用数据帧的目的 MAC 地址，在转发表中检索
- 如果在转发表条目中找到对应的 MAC 地址
- 如果目的 MAC 地址对应的端口与数据帧的达到端口相同则丢弃该数据帧，否则转发该数据帧到条目指定的端口
- 如果在转发表条目中未找到对应的 MAC 地址，向除到达端口之外的所有端口转发(flood)

#### Switch vs Router

**两者都是存储转发设备**
路由器: 网络层设备(检查网络层头部)
交换机：链路层设备(检查链路层头部)
**两者都有转发表**
路由器：使用路由算法计算转发表，基于 IP 地址转发
交换机：通过泛洪、自学习来学习转发表，基于 MAC 地址转发

### Virtual Local Area Networks (VLANs)

VLAN（Virtual Local Area Network，虚拟局域网）是一种在网络工程中广泛采用的局域网组织方法，它允许在物理网络的基础上创建多个逻辑上的独立网络，即广播域。VLAN 技术通过将一个物理网络划分成多个逻辑上的子网段，增强了网络管理的灵活性、安全性和效率。

**VLAN 的基本原理**
逻辑分隔：VLAN 使得网络管理者可以根据业务需求、应用需求或安全性要求，而非物理位置，来组织用户和资源。即便是在同一台交换机上连接的设备，也可以被分配到不同的 VLAN 中，彼此之间在数据链路层（第二层）是隔离的，无法直接通信。

广播控制：每个 VLAN 构成一个独立的广播域，有效限制了广播流量的范围，减少了网络拥堵，提高了网络性能。

灵活配置：VLAN 成员资格可以静态配置，即手动指定交换机端口属于哪个 VLAN；也可以动态配置，如基于 MAC 地址、IP 子网或用户身份自动分配 VLAN。

**VLAN 间通信**：为了使不同 VLAN 之间的设备能够通信，需要通过路由器、三层交换机或 VLAN 间路由技术（如 VLAN Trunking、802.1Q 标签、VLAN 间路由协议等）来实现。

**VLAN 的类型：**
静态 VLAN：基于端口分配，网络管理员手动配置交换机端口所属的 VLAN。
动态 VLAN：根据设备的 MAC 地址、IP 子网或是用户认证信息自动分配 VLAN，包括基于 MAC 的 VLAN、基于 IP 子网的 VLAN 和基于用户的 VLAN。
**VLAN 的优势：**
增强网络安全性：通过隔离广播域减少安全风险。
提高网络效率：限制不必要的广播流量，优化带宽使用。
简化网络管理：逻辑上组织网络，便于调整网络布局而不影响物理布线。
增强网络灵活性：支持移动、添加和更改网络设备，而无需重新配置物理网络。
