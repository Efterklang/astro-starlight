---
title: 运输层 TransportLayer Part Ⅰ
date: 2024-05-17
excerpt: 介绍运输层协议 TCP 和 UDP 的基本概念和作用、运输层的多路复用和多路分解技术，可靠数据传输协议的设计原则。
categories: [Dev, Network]
tags: [Network, TCP, UDP]
thumbnail: https://assets.vluv.space/cover/Networks/transportlayer1.webp
cover: https://assets.vluv.space/cover/Networks/transportlayer1.webp
---

## Introduction and Transport-Layer Services

### Relationship Between Transport and Network Layers

运输层协议为运行在不同的主机上的应用进程之间提供了**逻辑通信**（logic communication）功能
<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-02-14-43-16.webp" style="width:50%;" alt="运输层协议"/>
传输层协议运行在端系统而非路由器

- 发送方: 将从发送应用程序接收到的报文转换成传输层分组(segment)传递给网络层
- 接受方: 将数据段重新组装成报文传递到应用层

传输层: **进程之间**的逻辑通信;传输层建立在网络层之上，负责端到端的通信会话和数据的可靠传输。传输层使用端口号来区分主机上的不同应用程序，并确保数据被正确地发送到接收应用程序。
网络层: **主机之间**的逻辑通信; 网络层负责处理数据包的发送和路由，包括 IP 地址处理和路由选择。网络层的主要目标是确定如何将数据从源主机传输到目标主机，即使这两台主机在物理上可能相隔很远，并且在它们之间可能存在多个中间节点（路由器）。网络层的一个关键协议是互联网协议（IP），它定义了数据包的格式和地址。

### Overview of the Transport Layer in the Internet

Internet 的传输层协议有两个:
**传输控制协议 TCP, Transmission Control Protocol**: 提供了一种可靠的、面向连接的服务。
**用户数据报协议 UDP, User Datagram Protocol**: 提供不可靠、无连接的服务

> 网络层的 IP 协议(Internet Protocol)提供了一种不可靠的、无连接的服务;
> IP 的服务模型是尽力而为交付服务（best-effort delivery service）

UDP 和 TCP 最基本的责任是，将两个端系统间 IP 的交付服务扩展为运行在端系统上的两个进程之间的交付服务。将主机间交付扩展到进程间交付被称为**运输层的多路复用（transport-layer multiplexing）**与**多路分解（demultiplexing）**。

## Multiplexing and Demultiplexing

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-02-15-57-37.webp" style="width:50%;" alt=""/>

运输层的多路复用与多路分解，也就是将由网络层提供的主机到主机的交付服务延伸到为运行在主机上的应用程序提供进程到进程的服务。一个进程（作为网络应用的一部分）有一个或多个**套接字（socket）**，它相当于从网络向进程传递数据和从进程向网络传递数据的门户。下图为进程交付过程：

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-02-15-48-45.webp" alt=""/>

- **多路复用**（Multiplexing）：在源主机从不同套接字中收集数据块，并为每个数据块封装上首部信息（这将在以后用于分解）从而生成报文段，然后将报文传递到网络层；
- **多路分解**（Demultiplexing）：它是多路复用的逆过程;在接收端，运输层检查这些字段，标识出接收套接字，进而将报文段定向到该套接字，即将运输层报文段的数据交付到正确的套接字的工作；

---

主机收到 IP 数据报(IP Datagram),每个 IP 数据报中有源 IP 地址和目的 IP 地址,每个数据报搬运一个数据段,数据段中有源端口号和目的端口号,这样就可以将数据段交付给正确的 Socket。

运输层多路复用要求:

1. 套接字由唯一标识符；
2. 每个报文段通过**源端口号字段**（source port number field）和**目的端口号字段**（destination port number field）来指示该报文段所要交付的套接字；
   > 端口号是一个 16 比特的数，其大小在 `0~65535`之间。`0~1023`范围的端口号称为**周知端口号（well-know port number）**，是受限制的。
   > <img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-02-16-00-52.webp" alt="Ch5-1TransportLayer-2024-04-02-16-00-52">

- **UDP 的 Socket 表示**
  `(source port， dest port)`
  <img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-10-08-58-17.webp" style="width:50%;" />
- **TCP 的 Socket 表示**
  `(source IP， source port， dest IP， dest port)`
  <img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-10-08-58-22.webp" style="width:50%;" />

## Connectionless Transport: UDP

### UDP Segment Structure

使用 UDP 时，在发送报文段之前，发送方和接收方的运送层实体之间没有握手，UDP 被称为**无连接的 connectionless**;UDP 只在 IP 的数据报服务之上增加了很少一点的功能，即端口的功能和差错检测的功能。

- 是无连接的，即发送数据之前不需要建立连接(no connection establishment)
- 简单: 在发送者接受者之间不需要连接状态(no connection state)
- 没有拥塞控制，很适合多媒体通信的要求,UDP 能够用尽可能快的速度传递(no congestion control)
- UDP 的首部开销小，只有 8 个字节(small header size)
- 支持一对一、一对多、多对一和多对多的交互通信

UDP 是面向报文的。发送方 UDP 对应用程序交下来的报文，在添加首部后就向下交付 IP 层。UDP 对应用层交下来的报文，既不合并，也不拆分，而是保留这些报文的边界。
应用层交给 UDP 多长的报文，UDP 就照样发送，即一次发送一个报文。
接收方 UDP 对 IP 层交上来的 UDP 用户数据报，在去除首部后就原封不动地交付上层的应用进程，一次交付一个完整的报文。
应用程序必须选择合适大小的报文。
虽然 UDP 用户数据报只能提供不可靠的交付，但 UDP 在某些方面有其特殊的优点。

> UDP 首部有 8 个字节，由 4 个字段构成，每个字段都是两个字节： 1.源端口： 源端口号，需要对方回信时选用，不需要时全部置 0. 2.目的端口：目的端口号，在终点交付报文的时候需要用到。 3.长度：UDP 的数据报的长度（包括首部和数据）其最小值为 8（只有首部） 4.校验和：检测 UDP 数据报在传输中是否有错，有错则丢弃,该字段是可选的，当源主机不想计算校验和，则直接令该字段全为 0.
> 当传输层从 IP 层收到 UDP 数据报时，就根据首部中的目的端口，把 UDP 数据报通过相应的端口，上交给应用进程。
> 如果接收方 UDP 发现收到的报文中的目的端口号不正确（不存在对应端口号的应用进程），就丢弃该报文，并由 ICMP 发送“端口不可达”差错报文给对方。

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-10-10-19-15.webp" alt="" style="width: 80%"/>

伪首部中 17 是协议代号，表示 UDP
**伪首部的作用**
第一，通过伪首部的 IP 地址检验，UDP 可以确认该数据报是不是发送给本机 IP 地址的；第二，通过伪首部的协议字段检验，UDP 可以确认 IP 有没有把不应该传给 UDP 而应该传给别的高层的数据报传给了 UDP。

伪首部包括了 IPv4 头部中的一些信息，但它并不是发送 IP 数据包时使用的 IP 数据包的头部。接收主机在收到 UDP 报文以后，**从 IP 首部获悉 IP 地址信息构造 UDP 伪首部**。在进行校验和计算。
识别一个通信应用需要 5 个因素。"源 IP 地址"、"目标 IP 地址"、"源端口"、"目标端口"、"协议号"。UDP 首部只包含了（源端口和目标端口），用此来校验，如果其他三项信息被破坏，极有可能导致应收包应用收不到，不应该收包的应用收到。
为此，有必要在通信中，验证这 5 项的识别码是否正确，就引入了伪首部的概念。

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-11-09-54-10.webp" alt="">

### UDP Checksum

**Sender**:
在发送数据时，计算数据包的检验和，把得到的结果存入校验和字段中。
加上伪首部的所有数据，以 16bit 为单位求和，进位“回卷”，回卷就是进位加到和上，所得结果按位取反，即为校验和
**Receiver**
计算接收到数据段的校验和
检查 计算的校验和是否等于校验和域中的值:
NO – 检测到错误
YES – 没有检测到错误,但是可能是错误的

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-16-15-56-24.webp" alt="">

## Principles of Reliable Data Transfer

可靠数据传输的框架：为上层实体提供的服务抽象是：数据可以通过一条可靠的信道进行传输。如下图所示：
<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-16-16-19-54.webp" alt="">

> rdt: reliable data transfer

### Building a Reliable Data Transfer Protocol

#### Reliable Data Transfer over a Perfectly Reliable Channel: rdt1.0

发送方和接收方的表示使用**有限状态机（Finite-State Machine，FSM）**定义，如果对一个事件没有动作，我们将在横线上方或下方使用**符号$\Lambda$**，以表示发生这个事件后不进行处理。
我们考虑最简单的情况，**即底层信道是完全可靠的**，我们称该协议为 `rdt1.0`，发送方和接收方的 FSM 定义如下：
<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-16-16-37-28.webp" alt="rdt1.0 FSM">

#### Reliable Data Transfer over a Channel with Bit Errors: rdt2.0

> **下层信道可能让传输分组中的 bit 受损**
>
> - 校验和将检测到 bit 错误
>
> **问题: 如何从错误中恢复**
>
> - 确认(ACKs): 接收方明确告诉发送方 分组接收正确
> - 否认 (NAKs):接收方明确告诉发送方 分组接收出错
> - 发送方收到 NAK 后重发这个分组
>
> **在 rdt2.0 中的新机制 (在 rdt1.0 中没有的):**
>
> - 差错检测
> - 接收方反馈: 控制信息 (ACK,NAK) rcvr->sender

实际上的底层信道是可能出现比特受损的；在分组传输、传播或缓存的过程中，这种比特差错通常会出现在网络的物理部件中。在接收方得到比特差错的信息时，需要发送方进行重传。在计算机网络环境中，基于这种重传机制的可靠数据传输协议称为**自动重传请求（Automatic Repeat reQuest，ARQ）协议**。ARQ 协议中还需要另外三种协议来处理存在比特差错的情况：

- **Error Detection**：发送方同时发送检测和（checksum）到接收端判断是否出现比特差错；
- **Receiver feedback**：
  - **肯定确认（ACKnowledgement，ACK）**：接收方告诉发送方包数据无差错；
  - **否定确认（Negative AcKnowledgement，NAK）**：接收方告诉发送方包数据有错误；
- **Retransmission**：接收方收到有差错的分组时，发送方将重传该分组文；

> rdt2.0 中，当发送方为`Wait for ACK or NAK`状态时，它不能再接收上层传来的数据，即`rdt_send()`事件不能再出现；直到接收到 ACK 并离开该状态，才能再次接收上层传来的数据。因此，rdt2.0 也被称为**停等协议（stop-and-wait protocol）**。
> <img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-16-17-03-03.webp" alt="rdt2.0 FSM" style="width:50%;" />

`rdt2.0`协议存在致命的缺陷，它并没有考虑 ACK 和 NAK 受损的情况,一个困难的问题是协议该如何 从错误中恢复。
为了解决这一问题，就是在数据分组中添加一新字段，让发送方对其数据分组编号(编号占用 1bit，为 0/1)，即将发送数据分组的**序号（sequence number）**放在该字段。于是，接收方只需要检查序号即可确定收到的分组是否一次重传。

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-16-18-55-34.webp" alt="rdt2.1 FSM">

rdt2.2: 一个不要 NAK 的协议;同 rdt2.1 一样的功能, 只用 ACKs 不用 NAK。如果上个报文接收正确接收方发送 ACK;接收方必须明确包含被确认的报文的序号；如果接受到受损的数据，那就发送一个 ACK，序号为最后一个正确的数据包的序号。发送方收到重复 ACK(duplicate ACK)等同于收到 NAK,将重发当前报文

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-17-09-18-24.webp" alt="rdt" style="width: 80%"/>

#### Reliable Data Transfer over a Lossy Channel with Bit Errors: rdt3.0

新假设: 下层信道还要丢失报文 (数据或者 ACKs);校验和, 序号, 确认, 重发将会有帮助，但是不够
引入**倒计数定时器（countdown timer）**，实现基于时间的重传机制；只有在定时器超时时才触发重发

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-17-09-39-00.webp" style="width:50%;" alt="">

因为分组序号在 0 和 1 之间交替，因此 `rdt3.0`也被称为**比特交替协议（alternating-bit protocol）**。运行如下图所示：

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-17-09-43-49.webp" style="width:100%;" alt="">

### Pipelined Reliable Data Transfer Protocols

sender 信道利用率$U_{sender}=\frac{L/R}{RTT+L/R}$

Stop-and-Wait 方式发送方信道利用率很低，解决方案是**流水线化（pipelining）**，即发送方可以发送多个分组，而不需要等待接收方的确认。

<img src="https://assets.vluv.space/UESTC/Network/Ch5-1TransportLayer/Ch5-1TransportLayer-2024-04-17-10-03-56.webp" style="width:100%;" alt="">

### GBN & SR

[[Ch3-1DataLinkLayer#回退 N 帧协议 Go-Back-N Protocol]]
[[Ch3-1DataLinkLayer#选择重传协议 Selective Repeat Protocol]][udp/ip 硬件协议栈设计（三）：校验](https://zhuanlan.zhihu.com/p/184884139)
