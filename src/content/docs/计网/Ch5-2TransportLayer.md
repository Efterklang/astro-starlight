---
title: 运输层 TransportLayer Part Ⅱ
date: 2024-05-20
excerpt: 记录运输层学习笔记, 第二部分。主要内容为TCP报文结构、序号和确认号、超时和重传、流量控制、可靠数据传输、快速重传、GBN和SR、流量控制、TCP连接管理(三次握手、四次挥手),拥塞控制
categories: [Dev, Network]
tags: [Network, TCP]
thumbnail: https://assets.vluv.space/cover/Networks/transportlayer2.avif
cover: https://assets.vluv.space/cover/Networks/transportlayer2.avif
---

## Connection-Oriented Transport: TCP

### TCP Connection

- **面向连接 connection-oriented**：相互发送预备报文段，以建立确保数据传输的参数；
- **全双工服务 full-duplex service**：如果一台主机上的进程 A 与另一台主机上的进程 B 存在一条 TCP 连接，那么应用层数据就可以在从进程 B 流向进程 A 的同时，也从进程 A 流向进程 B；
- **点对点 point-to-point**：即在单个发送方与单个接收方之间的连接；
- **三次握手 three-way handshake**：客户先发送一个特殊 TCP 报文段，服务器用另一个特殊的 TCP 报文段来响应，最后客户再用第三个特殊报文段作为响应。
- **流量控制 Traffic control**：TCP 通过流量控制机制来确保发送方不会淹没接收方；

客户进程通过套接字，TCP 会将要发送的数据引导到该连接的发送缓存（send buffer），发送缓存是发起三次握手期间设置的缓存之一，TCP 发送缓存与接收缓存如下图所示：

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-04-23-15-09-31.webp" style="width:80%;" alt="tcp buffer">

### TCP Segment Structure

```wikitext
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |          Source Port          |       Destination Port        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                        Sequence Number                        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                    Acknowledgment Number                      |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |  Hlen | Res |N|C|E|U|A|P|R|S|F|            Window             |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |           Checksum            |         Urgent Pointer        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                           Options             |    Padding    |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                                                               |
    |                            Data                               |
    |                                                               |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                   The TCP packet header [RFC 793].
```

- **源端口和目的端口字段** Source Port Dest Port: 各占 2 字节。端口是运输层与应用层的服务接口。运输层的复用和分用功能都要通过端口才能实现
- **序号字段** Sequence number: 占 4 字节。TCP 连接中传送的数据流中的每一个字节都编上一个序号。序号字段的值则指的是本报文段所发送的数据的第一个字节的序号
- **确认号字段** Acknowledge number: 占 4 字节，是期望收到对方的下一个报文段的数据的第一个字节的序号
- **数据偏移**(首部长度) header length 占 4 位，它指出 TCP 报文段的数据起始处距离 TCP 报文段的起始处有多远。“数据偏移”的单位是 32 位字（以 4 字节为计算单位）
- **保留字段** Unused: 占 8 位，保留为今后使用，但目前应置为 0
- **标识字段** flag field 占 6bit
  - URG (Urgent Pointer field significant)：当设置为 1 时，表示紧急指针字段有意义，即 TCP 报文段中存在紧急数据，需要优先传送。
  - ACK (Acknowledgement field significant)：当设置为 1 时，表示确认号字段有效。TCP 使用 ACK 标志和确认号字段来实现可靠传输，确认对方发送的数据已经成功接收。
  - PSH (Push Function)：当设置为 1 时，表示接收方应立即将这个报文段交给应用层，而不是等待缓冲区满后再交付。
  - RST (Reset the connection)：当设置为 1 时，表示连接出现严重问题，需要立即重置，即终止当前连接。
  - SYN (Synchronize sequence numbers)：在建立连接时使用。当 SYN 标志设置为 1，而 ACK 标志为 0 时，表示这是一个连接请求报文段。如果 SYN 和 ACK 都为 1，表示对方已确认连接请求，此时连接建立。
  - FIN (Finish,No more data from sender)：当设置为 1 时，表示此方已经没有数据要发送，希望关闭连接。
    > 实践中，PSH，URG，Urgent data pointer 不被广泛使用
    > 在 RFC 3168 中添加了两个新的标志（ECE 和 CWR），
    > CWR：CWR 标志与后面的 ECE 标志都用于 IP 首部的 ECN 字段，ECE 标志为 1 时，则通知对方已将拥塞窗口缩小；
    > ECE：若其值为 1 则会通知对方，从对方到这边的网络有阻塞。在收到数据包的 IP 首部中 ECN 为 1 时将 TCP 首部中的 ECE 设为 1；
- **窗口字段** Receiver window: 占 2 字节，用来让对方设置发送窗口的依据，单位为字节。
- **检验和** Internet checksum:占 2 字节。检验和字段检验的范围包括 12 字节的伪首部、TCP 首部和数据。
- **紧急指针字段** Urgent data pointer 占 16 位，指出在本报文段中紧急数据共有多少个字节（紧急数据放在本报文段数据的最前面）。
- **填充字段** Padding 确保首部长度是 32bit 的整数倍。

### Seq number and ACK number

报文段的序号(Sequence number)和确认号(Acknowledgement number)是 TCP 提供可靠数据传输的关键。其中序号指数据段中第一个字节在数据流中的位置编号，确认号指期望从另外一边收到的下一个字节的序号。TCP 为全双工通信，因此每个方向的数据流都有自己的序号和确认号。

假设有两台主机，主机 A 启动了一个与主机 B 的 Telnet 会话。因为主机 A 启动了会话，所以它被标记为客户端，主机 B 被标记为服务器。
用户（在客户端）输入的每个字符都会被发送到远程主机；远程主机将会发送回每个字符的副本，这些字符将会显示在 Telnet 用户的屏幕上。这种“回显”用于确保 Telnet 用户看到的字符已经在远程站点被接收并处理。因此，每个字符在用户按下键盘到字符在用户的监视器上显示的时间内，都会在网络上传输两次
现在假设用户输入了一个单独的字母`C`，然后去拿咖啡。如图所示，这里我们假设客户端和服务器的起始序列号 ISN 分别是 42 和 79。一个段的序列号是数据字段中第一个字节的序列号。因此，从客户端发送的第一个段的序列号将是 42；从服务器发送的第一个段的序列号将是 79。回忆一下，确认号是主机正在等待的下一个数据字节的序列号。在 TCP 连接建立但在任何数据发送之前，客户端正在等待字节 79，服务器正在等待字节 42

> 在 TCP 中，每一个新的连接都会从一个**随机**的起始序列号（ISN, Initial Sequence Number）开始。ISN 是在 TCP 三次握手过程的第一步中由连接的发起方确定。实际的 TCP 连接中，起始序列号会是一个随机的、32 位的数值。这里我们使用 42 和 79 只是为了简化讨论。
> 为什么要用随机 ISN?一方面是为了防止连接失效后 SOCKET 被重用使得以前残留的包被错误的接受；另一方面是为了防止黑客轻易的知道序列号之后制造 tcp 序列号攻击，不过即使这样 tcp 序列号攻击也是有办法进行的，所以有很多 tcp 序列号的生成算法被提出和改进。

如图所示，发送了三个段。第一个段从客户端发送到服务器，其数据字段中包含字母`C`的 1 字节 ASCII 表示。正如我们刚才描述的，这个第一个段的序列号字段中有 42。另外，因为客户端还没有从服务器接收到任何数据，所以这个第一个段的确认号字段中会有 79。

第二个段从服务器发送到客户端。它有两个目的。首先，它确认了服务器接收到的数据。通过在确认字段中放入 43，服务器告诉客户端它已经成功接收了直到字节 42 的所有内容，现在正在等待字节 43 及其后的数据。这个段的第二个目的是**回显**字母`C`。因此，这个第二个段的数据字段中有字母`C`的 ASCII 表示。这个第二个段的序列号是 79，这是这个 TCP 连接的服务器到客户端数据流的初始序列号，因为这是服务器发送的第一个数据字节。注意，对客户端到服务器数据的确认是在携带服务器到客户端数据的段中进行的；这个确认被说成是在服务器到客户端的数据段上的捎带确认。

> 回显 Echo Protocol 通常用于网络测试和故障排查。它是一种简单的协议，客户端发送给服务器的任何数据，服务器都会原封不动地发送回来。这种机制可以用于测试网络连接的质量，包括延迟、数据包丢失率等。它在 RFC 862 中有详细的描述。然而，需要注意的是，TCP Echo 并不常用，因为它可能会被利用进行拒绝服务攻击（Denial of Service attack，DoS attack）

第三个段从客户端发送到服务器。它的唯一目的是确认它从服务器接收到的数据。（回忆一下，第二个段包含了从服务器到客户端的数据——字母`C`。）这个段的数据字段是空的（也就是说，确认没有与任何客户端到服务器的数据捎带）。这个段的确认号字段中有 80，因为客户端已经接收了直到字节序列号 79 的字节流，现在正在等待字节 80 及其后的数据。你可能会觉得奇怪，这个段也有一个序列号，虽然段中没有数据。但是，因为 TCP 有一个序列号字段，所以这个段需要有一些序列号。

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-04-26-17-03-10.webp" style="width:80%;">

TCP，就像我们在 3.4 节中的 rdt 协议一样，使用超时/重传机制来从丢失的段中恢复。虽然这在概念上很简单，但是当我们在实际的协议如 TCP 中实现超时/重传机制时，会出现许多微妙的问题。也许最明显的问题是超时间隔的长度。显然，超时应该大于连接的往返时间（RTT），即从发送一个段到它被确认的时间。否则，会发送不必要的重传。但是超时应该大多少？首先应该如何估计 RTT？是否应该与每个未确认的段关联一个定时器？

### Round-Trip Time Estimation and Timeout

**如何估计往返时间**

- $SampleRTT$: 测量从报文段发送到收到确认的时间
- $EstimatedRTT$: TCP 维持的 $SampleRTT$ 均值，其更新方式如下:

$$
EstimatedRTT=(1-\alpha)\times EstimatedRTT+\alpha\times SampleRTT
$$

$\alpha$ 推荐值为 0.125
上述平均方法被称为**指数加权移动平均（Exponential Weighted Moving Average，EWMA）**

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-04-26-21-06-22.webp" style="width:65%;" alt="rtt">

**RTT 偏差**(RTT Deviation,DevRTT)，用于估算 SampleRTT 一般会偏离 EstimatedRTT 的程度：$\beta$ 推荐值为 0.25

$$
DevRTT=(1-\beta)\times DevRTT+\beta\times |SampleRTT-EstimatedRTT|
$$

---

**Timeout 时间设置**
超时间隔应该大于等于 EstimatedRTT 以避免不必要的重传。同时要考虑到 RTT 的变化，因此要加上 RTT 偏差

$$
TimeoutInterval = EstimatedRTT + 4\times DevRTT
$$

---

1. 初始时$TimeoutInterval$设置为 1s
2. 第一个样本 RTT 获得后， $EstimatedRTT=SampleRTT,DevRTT=SampleRTT/2$
3. $TimeoutInterval = EstimatedRTT + max (G, K*DevRTT)$ （K=4，G 是用户设置的时间粒度）

### Reliable Data Transfer

TCP 在 IP 不可靠服务之上创建了一种**可靠数据传输服务（reliable data transfer service,rdt）**。为了减少多个定时器管理带来的相当大的开销，TCP 在即使有多个已发送但未确认的报文段的情况下，定时器的管理过程仅使用**单一**的定时器。简化的 TCP 发送方如下

```c
/* Assume sender is not constrained by TCP flow or congestion control,
that data from above is less than MSS in size, and that data transfer
is in one direction only. */

NextSeqNum=InitialSeqNumber // 表示下一个要发送的数据段的序列号
SendBase=InitialSeqNumber // 表示已发送但尚未被确认的最早的数据段的序列号

loop (forever) {
    switch(event)
        event: data received from application above
            create TCP segment with sequence number NextSeqNum
            if (timer currently not running)
             start timer
            pass segment to IP
            NextSeqNum=NextSeqNum+length(data)
            break;

        event: timer timeout
            retransmit not-yet-acknowledged segment with smallest sequence number
            start timer
            break;

        event: ACK received, with ACK field value of y
            if (y > SendBase) {
                SendBase=y
                if (there are currently any not-yet-acknowledged segments)
                 start timer
            }
      break;
} /* end of loop forever */
```

**简化的 TCP 发送方**

- data received from application above: 当从上层应用接收到数据时，创建一个 TCP Segment，其序列号为 NextSeqNum，如果没有启动定时器，则启动定时器，然后将该段传递给 IP 层以进行传输，`NextSeqNum += length(data)`
- timer timeout: 当定时器超时时（这通常意味着一个 TCP 段丢失了，因为我们没有在预期的时间内收到 ACK），会重新传输序列号最小的尚未确认的段，然后重新启动定时器
- ACK received, with ACK field value of y: 当收到一个 ACK 时，如果 ACK 字段的值 y 大于 SendBase，则更新 SendBase 为 y。这意味着我们已经收到了序列号小于或等于 y 的所有段的确认。然后，如果还有尚未确认的段，就启动定时器
  <img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-04-26-21-25-57.webp" style="width:80%;" alt="">

---

**Retransmission Scenarios**

当发生 timeout 事件时，TCP 重传时都会将下一次的 timeout 间隔设为先前值的两倍；当发生其他两个事件计时器重启时，`TimeoutInterval`由最近的 `EstimatedRTT`值与 `DevRTT`值推算得到。这种修改提供了一个形式受限的拥塞控制,在拥塞时期，如果源继续坚持重新传输数据包，拥塞可能会变得更,通过延长超时时间，TCP 可以减少重传的次数，从而减少拥塞。如下图 p2 所示，Seq92 超时重传，TimeoutInterval 加倍，$TimeoutInterval \lt TransportTime\_{Seq100} \lt 2 \times TimeoutInterval $, 从而 Seq100 不会被重传

累计确认机制避免了重传第一个段，如下图 p3 所示，Seq92 和 Seq100 已经被确认，虽然 ACK100 丢失，但 ACK120 被接收，由于累计确认机制，Seq92 和 Seq100 都被确认，因此不会被重传

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-04-26-22-42-12.webp" style="width:80%;" alt="Retransmission Scenarios">

> p1: Retransmission due to a lost acknowledgment
> p2: Segment 100 not retransmitted
> p3: A cumulative acknowledgment avoids retransmission of the first segmen

**Fast Retransmit**

当比期望序号大的失序报文段到达，接收方立即发送**冗余 ACK（duplicate ACK）**，指明下一个期待字节的序号
如果发送方收到一个确认后再收到 3 个对同样报文段的确认，发送方应意识到不对劲。生成三个重复 ACK，是因为接收方存在缺失报文段；于是启动快速重传(fast retransmit): 在定时器超时之前重发丢失的报文段

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-04-30-15-08-41.webp" style="width:80%;" alt="">

```c
event: ACK received, with ACK field value of y
if (y > SendBase) {
    SendBase = y
    if (there are currently not-yet-acknowledged segments)
            start timer
    }
else {
    increment count of dup ACKs received for y
    if (count of dup ACKs received for y == 3) {
        resend segment with sequence number y
    }
}
```

**GBN or SR**

TCP 错误恢复机制是 GBN（Go-Back-N）协议还是 SR（Selective Repeat）协议？

TCP 的确认是累积的，正确接收但是顺序错误的段并不会被接收者单独确认。因此，TCP 发送者只需要维护传输但未确认的字节的最小序列号（SendBase）和下一个要发送的字节的序列号（NextSeqNum）。从这个意义上说，TCP 看起来很像一个 GBN 风格的协议。
但是 TCP 和 GBN 之间有一些显著的差异。许多 TCP 实现会缓存(buffer)正确接收但顺序错误的 Segment [Stevens 1994]。
对 TCP 的一项提议修改，所谓的选择性确认 [RFC 2018]，允许 TCP 接收者选择性地确认顺序错误的段，而不是只是累积地确认最后正确接收的，顺序正确的段。当与选择性重传结合使用，TCP 看起来很像我们的通用 SR 协议。因此，TCP 的错误恢复机制可能最好被分类为 GBN 和 SR 协议的混合体。

### TCP Connection Management

**How a TCP connection is established and torn down?**

#### three-way handshake

假设一个主机（客户端）上的进程希望与另一个主机（服务器）上的进程建立连接。客户端应用程序首先通知客户端的 TCP 它希望与服务器中的进程建立连接。然后，客户端的 TCP 按照以下方式与服务器的 TCP 建立连接：

- **Step 1**：客户端 TCP 首先向服务器 TCP 发送一个特殊的 TCP 段。这个特殊段中不包含应用层数据。但是段头部(Segment Header)中的 SYN 标志位，被设置为 1。因此，这个特殊段被称为 SYN Segment。此外，客户端随机选择一个初始序列号（client_isn），并将此号码放入初始 TCP SYN 段的序列号字段中。此段被封装在一个 IP 数据报中并发送到服务器

- **Step 2**：一旦包含 TCP SYN 段的 IP 数据报到达服务器主机，服务器将 TCP SYN 段从数据报中提取出来，为连接分配 TCP 缓冲区和变量，并向客户端 TCP 发送连接确认段。这个连接确认段也不包含应用层数据。然而，它在段头部包含三个重要的信息。首先，SYN 位被设置为 1。其次，TCP 段头部的确认字段被设置为 client_isn+1。最后，服务器选择自己的初始序列号（server_isn）并将此值放入 TCP 段头部的序列号字段中。这个连接确认段实际上在说，“我收到了你的 SYN 包，要求以你的初始序列号 client_isn 开始一个连接。我同意建立这个连接。我的初始序列号是 server_isn。”这个连接确认段被称为 SYNACK 段。

- **Step 3**：收到 SYNACK 段后，客户端也为连接分配缓冲区和变量。然后，客户端主机向服务器发送另一个段；这个最后的段确认了服务器的连接确认段（客户端通过将值 server_isn+1 放入 TCP 段头部的确认字段中来做到这一点）。SYN 位被设置为零，因为连接已经建立。第三次握手时客户端可以在报文中加入数据
  <img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-05-07-14-45-07.webp" style="width:80%;" alt="TCP Three-Way Handshake">

> 为什么需要三次握手
> 三次握手（Three-Way Handshake）是 TCP/IP 协议中建立连接的过程，其主要目的是在两个 TCP 节点之间建立一个可靠的连接。这个过程为什么需要三次握手，主要有以下几个原因：
> **确认双方的接收与发送能力**：三次握手确保了双方都有发送和接收数据的能力。当客户端发送 SYN 包给服务器时，这表明客户端有发送数据的能力；当服务器回应 SYN-ACK 包给客户端时，这表明服务器有接收和发送数据的能力；当客户端再回应 ACK 包给服务器时，这表明客户端有接收数据的能力。
> **防止过期的连接请求到达服务器**：如果只有一次握手，那么过期的连接请求可能会导致服务器错误地打开连接。例如，如果客户端发送了一个连接请求，但是因为网络延迟，这个请求晚到了，而在此期间，客户端已经关闭了连接，那么如果服务器接收到这个过期的请求，就会错误地打开一个已经不存在的连接。而三次握手可以防止这种情况，因为即使服务器接收到了过期的第一个 SYN 包，但是在没有收到最后一个 ACK 包之前，服务器是不会打开连接的。
> **初始化序列号**：每个 TCP 连接都有各自独立的序列号，这些序列号在连接过程中被初始化。客户端和服务器都在 SYN 包中发送自己的初始序列号，这样，双方都能知道对方的初始序列号，以便后续的数据传输。

#### four-way handshake

- **Step 1**: 客户发送 TCP FIN 控制报文段到服务器
- **Step 2**: 服务器接收 FIN, 回复 ACK. 进入半关闭连接状态；
- **Step 3**: 服务器发送 FIN 到客户，客户接收 FIN, 回复 ACK，
  进入 “time wait”状态
  等待结束时释放连接资源
- **Step 4**: 服务器接收 ACK. 连接关闭.
  <img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-05-07-14-47-37.webp" style="width:80%;">

> 为什么需要四次挥手，而不是两次或者三次呢？
> 因为 TCP 是一个全双工协议，也就是说，数据可以在两个方向上同时传输。因此，每个方向都需要一个 FIN 和一个 ACK。A 需要告诉 B 它已经没有数据要发送了（FIN-1），并且需要确认 B 已经知道这一点（ACK-2）。同样，B 也需要告诉 A 它已经没有数据要发送了（FIN-2），并且需要确认 A 已经知道这一点（ACK-1）。这就是为什么我们需要四次挥手来关闭一个 TCP 连接。
> 为什么不能把服务端发送的 ACK 和 FIN 合并起来，变成三次挥手？
> 因为服务端收到客户端断开连接的请求时，可能还有一些数据没有发完，这时先回复 ACK，表示接收到了断开连接的请求。等到数据发完之后再发 FIN，断开服务端到客户端的数据传送。

#### TCP State

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-05-07-14-57-59.webp" style="width:100%;" alt="TCP State">

## Congestion Control

**拥塞 Congestion** 从信息角度看: “太多源主机发送太多的数据，速度太快以至于网络来不及处理”
表现为:
丢失分组 (路由器的缓冲区溢出)
长延迟 (在路由器的缓冲区排队)

> 流量控制主要目的是防止发送端发送过多的数据，从而溢出接收端的缓冲区。
> 拥塞控制的目标是防止过多的数据填充网络，以避免网络拥塞。当网络中的数据包过多，超过了网络的承载能力，就会导致网络拥塞。网络拥塞可能导致数据包的丢失，进而引发发送端的超时重传，这反过来又会加剧网络拥塞，形成恶性循环。

### The Causes and the Costs of Congestion

- 当分组的到达速率接近链路容量时，分组经历巨大的排队时延；
- 发送方在遇到大时延时所进行的不必要重传会引起路由器利用其链路带宽来转发不必要的分组副本；
- 当一个分组沿一条路径被丢弃时，每个上游路由器用于转发该分组到丢弃该分组而使用的传输容量最终被浪费掉；

### Approaches to Congestion Control

**端到端拥塞控制 End-to-end congestion control**
在端到端拥塞控制方法中，网络层没有为运输层拥塞控制显示支持。即使网络中存在拥塞，端系统也必须通过对网络行为的观察来判断；
**网络辅助的拥塞控制 Network-assisted congestion control**
网络辅助的拥塞控制中，路由器向发送方提供关于网络中拥塞状态的显示反馈信息；

### TCP Congestion Control

TCP 采取的方法是让每个发送者根据感知到的网络拥塞情况来限制其发送流量的速率。如果 TCP 发送者感知到自己和目的地之间的路径上几乎没有拥塞，那么 TCP 发送者会增加其发送速率；如果发送者感知到路径上存在拥塞，那么发送者会降低其发送速率。
但是这种方法引出了三个问题。首先，TCP 发送者如何限制其向其连接发送流量的速率？其次，TCP 发送者如何感知到自己和目的地之间的路径上存在拥塞？第三，发送者应该使用什么算法来根据感知到的端到端拥塞来改变其发送速率？

---

**如何限制速率**
前文讲到每个 TCP 连接的两端都有一个接收缓冲区，一个发送缓冲区，以及几个变量（LastByteRead，rwnd 等）。实现拥塞控制，需要维护一个额外的变量，即拥塞窗口 congestion window,记为 cwnd，对 TCP 发送者可以向网络发送流量的速率施加了约束。

<div>
$$
LastByteSent-LastByteACKed\le \min\{CongWin,RcvWindow\} \\
大体上有 rate = \frac{CongWin}{RTT} Bytes/sec
$$
</div>
上面的约束限制了发送者处未确认的数据量，因此间接地限制了发送者的发送速率。

---

**如何感知拥塞**

当存在过度拥塞时，路径上的一个（或多个）路由器缓冲区会溢出，导致一个数据报（包含一个 TCP 段）被丢弃。丢弃的数据报反过来导致发送者处出现一个丢失事件——要么超时，要么接收到三个重复 ACK——这被发送者视为发送者到接收者路径上存在拥塞的指示。

因为 TCP 使用确认来触发（或时钟）其拥塞窗口大小的增加，所以 TCP 被称为自计时(self-clocking)。
TCP 基于本地信息设置它们的发送速率的指导性原则：

- 一个丢失的报文段表意味着拥塞，TCP 发送方在丢失事件发生后降低发送速率 (通过减少 CongWin)
- 一个确认报文段指示该网络正在向接收方交付发送方的报文段，因此，当对先前未确认报文段的确认到达时，能够增加发送方的速率；
- 探求带宽 Bandwidth probing.

---

**拥塞控制算法实现**

拥塞控制算法主要包括**慢启动（slow-start）**、**拥塞避免（congestion avoidance）**、**快速恢复（fast recovery）**

在慢启动（slow-start）状态，`cwnd`的初始值为 1 个 MSS， 每当传输的报文段首次被确认就增加 1 个 MSS。TCP 发送速率起始很慢，但在慢启动阶段以**指数**增长，尽快达到期待的速率，故将以 2 的指数方式增加速率，直到产生丢失事件，或者 cwnd 大于等于 ssthresd(进入 Congestion Avoidance 模式),cwnd 会由指数增长变为线性增长

> MSS: Maximum Segment Size, 一个 TCP 报文段的最大长度
> ssthresh: slow start threshold, 慢启动阈值

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-05-07-16-13-57.webp" style="width:50%;">

如果存在一个由超时指示的丢包事件，TCP 发送方将 `cwnd`(Congestion Window)设置为 1 并重新开始慢启动过程。并将变量 `ssthresh`设置为 `cwnd/2`
收到三个重复的确认时,将变量 `ssthresh`设置为 `cwnd/2`, `cwnd`设置为 `ssthresh(更新后的) + 3MSS`，并进入快速恢复状态

> 怎么理解不同的丢包事件？
> 3 个重复的 ACKs 表明网络具有传输一些数据段的能力
> 在三个重复的确认之前超时，表明网络不具备传输数据段的能力
> 上述为 TCP Reno 版本的内容，在 TCP Tahoe 版本里，
> 无论超时还是三个重复，都直接将 CongWin 置为 1 个 MSS

三个状态变换 FSM 如下图：

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-05-07-16-27-02.webp" style="width:80%;">

> TCP AIMD(Additive-increase,multiplicative-decrease)
> 发送方增加传输速率（窗口大小），探测可用带宽，直到发生丢包事件
> 乘性递减: 发生丢包事件后将拥塞窗口减半
> 加性递增: 每个 RTT 内如果没有丢失事件发生，拥塞窗口增加一个 MSS

> [!example] Congestion Control 例题
> **Q** 主机甲和主机乙已建立了 TCP 连接，甲始终以 MSS=1KB 大小的段发送数据，并一直有数据发送；乙每收到一个数据段都会发出一个接收窗口为 10KB 的确认段。若甲在 t 时刻发生超时时拥塞窗口为 8KB，则从 t 时刻起，不再发生超时的情况下，经过 10 个 RTT 后，甲的发送窗口是？
> **A** `ssthresh` 被设定为 8 的一半即 4，拥塞窗口被设为 1KB;拥塞窗口经 10 个 RTT 依次变化为 2、4（未超过 `ssthresh` 值之前以指数级增长，后面超过 `ssthresh` 之后以数量级增长）、5、6、7、8、9、10、11、12，最终达到 12KB;而流量控制的角度出发，接受窗口恒为 10KB,发送方的发送窗口=min(拥塞窗口，接收窗口),故最后答案是 10KB

**总结**

- 当 CongWin 低于阈值, 发送方处于慢启动阶段, 窗口指数增长.
- 当 CongWin 高于阈值, 发送方处于拥塞避免阶段, 窗口线性增长.
- 当三个重复的 ACK 出现时,阈值置为 CongWin/2 并且 CongWin 置为阈值加上 3 个 MSS 并进入快速恢复阶段，此时每收到一个重复的 ACK 拥塞窗口增加 1MSS，如果收到新的 ACK 则 cwnd = ssthresh
- 当超时发生时 ，阈值置为 CongWin/2 并且 CongWin 置为 1 MSS.

**TCP 平均吞吐量**
假设忽略慢启动
假设在丢失发生时，设 W 是窗口大小
如果窗口为 W, 吞吐量是 W/RTT
丢失发生后, 窗口降为 W/2, 吞吐量为 W/2RTT.
平均吞吐量为 0 .75 W/RTT

### TCP CUBIC

CUBIC 是一种 TCP 拥塞控制算法，它是 Linux 内核的默认拥塞控制算法。CUBIC 主要用于长距离、高带宽网络，它的目标是更充分地利用可用带宽，同时保持网络的稳定性。

CUBIC 的关键特性是它的拥塞窗口调整函数，这个函数是时间的三次立方函数。这与传统的 TCP 拥塞控制算法（如 TCP Reno 或 TCP NewReno）不同，后者使用线性或者二次函数来调整拥塞窗口。

CUBIC 的工作原理如下：

当网络出现拥塞（例如，丢失了一个数据包）时，CUBIC 会减小其拥塞窗口，就像其他 TCP 拥塞控制算法一样。

当网络没有拥塞时，CUBIC 不会像传统的 TCP 算法那样线性地增加其拥塞窗口。相反，它会根据时间的立方函数来增加拥塞窗口。这意味着在网络条件良好时，CUBIC 可以更快地增加其发送速率。

当网络再次出现拥塞时，CUBIC 会再次减小其拥塞窗口，但是减小的速度会比上次慢。这使得 CUBIC 能够更好地适应网络的变化，避免过度反应。

CUBIC 的这些特性使其在高带宽、长距离的网络环境中表现得非常出色，这也是为什么它被选为 Linux 内核的默认拥塞控制算法。

## Flow Control

TCP 通过让发送方维护一个称为**接收窗口**（receive window）的变量来提供流量控制。通俗的说，接收窗口用于给发送方一个指示——该接收方还有多少可用的缓存空间。因为 TCP 是全双工通信，在连接两端的发送方都各自维护一个接收窗口。
接收窗口（`rwnd`）和接收缓存（`RcvBuffer`）如下图所示：

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-04-30-16-03-28.webp" style="width:80%;">

通过 TCP 连接的主机都会为连接设置一个接收缓冲区。当 TCP 连接接收到正确且顺序正确的字节时，它会将数据放入接收缓冲区(TCP data in buffer)。相关的应用程序进程(Application process )将从这个缓冲区读取数据。进程从 buffer 中读取数据的时机是不确定的，可能在数据到达的瞬间读取，也可能在数据到达很久之后才尝试读取数据。如果应用程序读取数据的速度相对较慢，发送者很容易通过过快地发送过多的数据来溢出连接的接收缓冲区。

TCP 为其应用程序提供了一种**流量控制服务 Flow Control**，防止接收端超负荷工作。流量控制是一种速度匹配服务(匹配发送者发送的速率与接收应用程序读取的速率)。

如前所述，由于 IP 网络内的拥塞，TCP 发送者也可能被节流(throttled)；这种称为**拥塞控制 Congestion Control**。尽管流量控制和拥塞控制采取的行动相似（即节流发送者），但它们显然是出于非常不同的原因。

TCP 通过让发送者维护一个叫做 receive window 的变量来提供**流量控制**。接收窗口用于告诉 sender 关于 receiver 有多少可用缓冲区空间的信息。因为 TCP 是全双工的，连接的每一侧的发送者都维护一个独立的接收窗口。让我们在文件传输的上下文中研究接收窗口。

假设主机 A 正在通过 TCP 连接向主机 B 发送一个大文件。主机 B 为这个连接分配一个接收缓冲区；表示其大小为 RcvBuffer。不时地，主机 B 的应用程序进程从缓冲区中读取数据。定义以下变量：

- `LastByteRead`：这是应用程序从接收缓冲区中读取的数据流的最后一个字节的序号。换句话说，这是应用程序最后读取的数据的字节序号。例如，如果 LastByteRead 的值为 1000，那么意味着应用程序已经读取了序号为 1 到 1000 的字节。
- `LastByteRcvd`：这是已经从网络到达并被放入主机 B 的接收缓冲区的数据流的最后一个字节的序号。换句话说，这是最后一个被接收并放入缓冲区的数据的字节序号。例如，如果 LastByteRcvd 的值为 1500，那么意味着已经接收了序号为 1 到 1500 的字节，并且这些字节已经被放入了接收缓冲区。
  > $LastByteRcvd - LastByteRead$即为应用程序未读取的数据量，它存放于 Buffer 中

因为 TCP 不允许溢出分配的缓冲区，我们必须有 $LastByteRcvd - LastByteRead \lt RcvBuffer$
接收窗口，表示为 rwnd，设置为缓冲区的空闲空间：$rwnd = RcvBuffer - (LastByteRcvd - LastByteRead)$，因为空闲空间随时间变化，rwnd 是动态变化的。

连接如何使用变量 rwnd 来提供流量控制服务呢？

主机 B 通过在每个发送给 A 的 Segment 的[[Ch5-2TransportLayer#TCP Segment Structure | rwnd]] 字段告诉主机 A 连接缓冲区中有多少空闲空间。最初，主机 B 设置$rwnd = RcvBuffer$。注意，要实现这一点，主机 B 必须跟踪几个特定于连接的变量。

反过来，主机 A 跟踪两个变量，LastByteSent 和 LastByteAcked。这两个变量之间的差值 $LastByteSent - LastByteAcked$ 表示 A 已发送但未被确认的数据的量。通过保持未确认的数据量小于 rwnd 的值，主机 A 可以确保它没有溢出接收者的缓冲区。

这个方案有一个小的技术问题。假设主机 B 的接收缓冲区变满了，即 rwnd = 0。在向主机 A 通知 rwnd = 0 后，假设 B 没有任何数据要发送给 A。现在考虑会发生什么。当 B 的应用程序进程清空缓冲区时，TCP 不会向主机 A 发送新的段和新的 rwnd 值；实际上，只有当 TCP 有数据要发送，或者有确认要发送时，才会向主机 A 发送段。因此，主机 A 永远不会被通知主机 B 的接收缓冲区已经有了一些空间——主机 A 被阻塞了，不能再传输任何数据
为了解决这个问题，TCP 规范要求主机 A 得知 B 的接收窗口为零时继续发送带有一个数据字节的段。这些段将被 B 确认。最终，缓冲区将开始清空，确认将包含一个非零的 rwnd 值。
[Flow Control Animations](https://www2.tkn.tu-berlin.de/teaching/rn/animations/flow/)

<img src="https://assets.vluv.space/UESTC/Network/Ch5-2TransportLayer/Ch5-2TransportLayer-2024-04-30-17-50-43.webp" style="width:80%;">

> UDP 不提供流量控制，因此，由于缓冲区溢出，接收者可能会丢失段。例如，考虑从主机 A 的一个进程发送一系列 UDP 段到主机 B 的一个进程。对于典型的 UDP 实现，UDP 会将段附加在一个有限大小的缓冲区中，这个缓冲区“位于”相应的套接字之前。进程一次从缓冲区中读取一个完整的段。如果进程从缓冲区中读取段的速度不够快，缓冲区将溢出，段将被丢弃。

> [!example] Flow Control + Congestion Control 例题
> **Q**: 主机甲和主机乙之间已建立一个 TCP 连接，TCP 最大段长度为 1000 字节，若主机甲的当前拥塞窗口为 5000 字节，在主机甲向主机乙连接发送 2 个最大段后，成功收到主机乙发送的第一段的确认段，确认段中通告的接收窗口大小为 3000 字节，则此时主机甲还可以向主机乙发送的最大字节数是？
> **A**: 第一个段的 ACK 段中通告的接收窗口 rwnd 大小为 3000 字节，即表明在接受到第一个报文段后，还有 3000 字节的缓存空间可用。 由于发送方发送了二个报文段，第二个段将占用剩下的 3000 字节中的 1000 字节，即一共还有 3000-1000=2000 字节，min{2000,CongestionWindowSize} = 2000,所以此时主机甲还可以向主机乙发送的最大字节数是 2000Byte

| 属性         | 拥塞控制 (Congestion Control)                    | 流量控制 (Flow Control)        |
| ------------ | ------------------------------------------------ | ------------------------------ |
| **目标问题** | 防止网络拥塞，保护网络性能                       | 防止接收端超负荷工作           |
| **控制范围** | 网络路径中间的所有设备与资源（路由器、交换机等） | 通信的发送方和接收方           |
| **触发条件** | 网络节点缓冲区溢出或丢包率上升                   | 接收端缓冲区耗尽或处理能力不足 |
| **实现方式** | 慢启动、拥塞避免、快速恢复等                     | 滑动窗口、接收窗口大小调整     |
| **工作层次** | 网络整体                                         | 通信双方                       |
| **典型协议** | TCP 拥塞控制、QUIC 拥塞控制等                    | TCP 滑动窗口流量控制等         |

**拥塞控制** 是面向网络的，解决的是“网络能承受多少”的问题。
**流量控制** 是面向端点的，解决的是“接收端能承受多少”的问题。
