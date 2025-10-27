---
title: 应用层 ApplicationLayer Part Ⅱ
date: 2024-06-10
excerpt: Application Layer Part Ⅱ,DNS,P2P,Video Streaming,CDN,Socket Programming
categories:
  - Dev
  - Network
tags:
  - Network
cover: https://assets.vluv.space/cover/Networks/application_layer2.webp
---

## DNS——The Internet’s Directory Service

### Services Provided by DNS

识别主机的两种方式：通过**hostname**或者**IP address**。人们喜欢记忆主机名标识方式，而路由器喜欢定长的、有着层次结构的 IP 地址。DNS 提供了一种将主机名转换为 IP 地址的服务。

**DNS(Domain Name System),域名系统**

- 分布式数据库：一个由分层 DNS 服务器实现的分布式数据库
- 应用层协议：DNS 服务器实现域名转换,域名/地址转换;DNS 协议运行在 `UDP`之下，使用 `53`号端口；
  <img src="https://assets.vluv.space/UESTC/Network/Ch6-2ApplicationLayer/Ch6-2ApplicationLayer-2024-03-28-14-16-31.webp" alt="">

**DNS 服务器提供的功能**

- 主机名到 IP 地址的转换（hostname to IP address translation）；
- 主机别名（host aliasing）：一个主机可以有一个规范主机名和多个主机别名,应用程序调用 DNS 获取主机别名对应的规范主机名（canonical hostname）以及主机的 IP 地址；
- 邮件服务器别名（mail server aliasing）；
- 负载分配（load distribution）：繁忙的站点被**冗余分布在多台服务器**上，每台服务器运行在不同的端系统上，每个都有着不同的 IP 地址。由于这些冗余的 Web 服务器，一个 IP 地址集合对应**一个规范主机名**。当客户对映射到某处到某地址集合的名字发出一个 DNS 请求时，该服务器用 IP 地址的整个集合进行响应，但在每个回答中循环这些地址次序。因为客户通常**总是向 IP 地址排在最前面的服务器发送 HTTP 请求报文**，所以 DNS 就在所有这些冗余的 Web 服务器之间循环分配了负载；

### Overview of How DNS Works

#### 集中式设计的问题

- 单点故障（a single point of failure）；
- 通信容量（traffic volume）；
- 远距离的集中式数据库（distant centralized database）；
- 维护（maintenance）；

#### 分布式 DNS 服务器的层次结构

- Root DNS servers:负责记录顶级域名服务器的信息
- Top-Level Domain DNS servers:负责顶级域名 `com, org, net, edu, etc,` 和所有国家的顶级域名 `uk, fr, ca, jp.`
- Authoritative DNS servers:在因特网上具有公共可访问主机（如 Web 服务器和邮件服务器）的每个组织机构必须提供公共可访问的 DNS 记录，这些记录将这些主机的名字映射为 IP 地址。组织机构的权威 DNS 服务器负责保存这些 DNS 记录。
- Local DNS servers:严格来说不属于该服务器的层次结构,每个 ISP（如居民区 ISP、公司、大学）都有一个本地 DNS,也叫默认服务器,当主机发出 DNS 请求时，该请求被发往本地 DNS 服务器,它起着代理的作用，转发请求到层次结构中。

<img src="https://assets.vluv.space/UESTC/Network/Ch6-2ApplicationLayer/Ch6-2ApplicationLayer-2024-03-28-14-18-29.webp" alt="">

> [!info]
>
> Windows系统可以通过在powershell运行 `ipconfig /all` 命令查看本地 DNS 服务器的地址。
>
> ```powershell
> Wireless LAN adapter WLAN:
> Connection-specific DNS Suffix . :
> Description . . . . . . . . . . . : Intel(R) Wi-Fi 6 AX200 160MHz
> Physical Address. . . . . . . . . : 48-51-C5-27-0C-9F
> DHCP Enabled. . . . . . . . . . . : Yes
> Autoconfiguration Enabled . . . . : Yes
> IPv4 Address. . . . . . . . . . . : 113.54.231.1(Preferred)
> Subnet Mask . . . . . . . . . . . : 255.255.224.0
> Lease Obtained. . . . . . . . . . : Thursday, March 28, 2024 12:25:52 PM
> Lease Expires . . . . . . . . . . : Thursday, March 28, 2024 3:16:27 PM
> Default Gateway . . . . . . . . . : 113.54.224.1
> DHCP Server . . . . . . . . . . . : 113.54.224.1
> DNS Servers . . . . . . . . . . . : 202.112.14.21
> 202.112.14.11
> NetBIOS over Tcpip. . . . . . . . : Enabled
> ```

#### DNS 查询方法

**递归 Recursive Query**：客户端只发一次请求，要求对方给出最终结果。
**迭代 Iterated Query**：客户端发出一次请求，对方如果没有授权回答，它就会返回一个能解答这个查询的其它名称服务器列表

<img src="https://assets.vluv.space/UESTC/Network/Ch6-2ApplicationLayer/Ch6-2ApplicationLayer-2024-03-28-14-57-53.webp" alt="">

#### DNS 缓存

- 一旦名字服务器获得 DNS 映射, 它将缓存该映射到局部内存
  - 服务器在一定时间后将丢弃缓存的信息
  - 本地 DNS 服务器可以缓存 TLD 服务器的 IP 地址
  - 因此根 DNS 服务器不会被经常访问
- 权威 DNS 服务器记录更新：IETF 动态更新/通报机制

### DNS Records and Messages

#### DNS Resource Records

DNS 服务器中存储了大量的资源记录——Resource Record(RR),RR 是一个包含了下列字段的 4 元组`(name, value, type, ttl)`
<img src="https://assets.vluv.space/UESTC/Network/Ch6-2ApplicationLayer/Ch6-2ApplicationLayer-2024-03-28-15-31-40.webp" alt="">

#### DNS Messages

- Identification 标识符: 16 位，查询和应答报文使用相同的标识符
- Flags 标志:有若干个标志构成，分别标识不同的功能
  - 查询/应答－0/ 1
  - 查询希望是/非递归查询－1/0
  - 应答可/否获得(支持)递归查询－1/0
  - 应答是/否来自权威名字服务器－1/ 0
- Questions 问题部分:查询的 Name, type
- Answers 回答部分:对于查询,应答的资源记录可以多个资源记录，由于可以有多个 IP 地址
- Authority 权威部分:域对应的权威名字服务器的信息
- Additional information 附加信息部分:权威名字服务器的 IP 地址等其他有帮助的记录.

<img src="https://assets.vluv.space/UESTC/Network/Ch6-2ApplicationLayer/Ch6-2ApplicationLayer-2024-03-28-15-32-48.webp" alt="">

```python
import dns.message
import dns.query

# 创建一个 DNS 查询报文对象
query = dns.message.make_query("baidu.com", dns.rdatatype.ANY)

# 发送 DNS 查询并接收响应报文,设置DNS服务器的IP地址为202.112.14.21
response = dns.query.tcp(query, "202.112.14.21")

# 打印输出报文的信息
print(f"Identification: {response.id}")
print(f"Flags: {response.flags}")
print(f"Questions: {response.question}")
print(f"Answers: {response.answer}")
print(f"Authority: {response.authority}")
print(f"Additional information: {response.additional}")
[OUTPUT]
Identification: 41532
Flags: 33152
Questions: [<DNS baidu.com. IN ANY RRset: []>]
Answers: [<DNS baidu.com. IN A RRset: [<110.242.68.66>, <39.156.66.10>]>, <DNS baidu.com. IN NS RRset: [<ns7.baidu.com.>, <ns2.baidu.com.>, <dns.baidu.com.>, <ns3.baidu.com.>, <ns4.baidu.com.>]>]
Authority: []
Additional information: [<DNS dns.baidu.com. IN A RRset: [<110.242.68.134>]>, <DNS ns2.baidu.com. IN A RRset: [<220.181.33.31>]>, <DNS ns3.baidu.com. IN A RRset: [<153.3.238.93>, <36.155.132.78>]>, <DNS ns4.baidu.com. IN A RRset: [<111.45.3.226>, <14.215.178.80>]>, <DNS ns7.baidu.com. IN A RRset: [<180.76.76.92>]>, <DNS ns7.baidu.com. IN AAAA RRset: [<240e:bf:b801:1002:0:ff:b024:26de>, <240e:940:603:4:0:ff:b01b:589a>]>]
```

## Peer-to-Peer File Distribution

- 没有总是在线的服务器
- 任意端系统之间直接通信
- 对等方之间可以间断连接并可以改变 IP 地址

### BitTorrent

BitTorrent 是一种用于高效分发文件的协议和技术。它是一种点对点（P2P）文件共享协议，允许用户在互联网上分享和下载文件。

相比于传统的文件下载方式，BitTorrent 采用了一种分布式的下载模式，使得文件可以同时从多个来源下载，从而提高了下载速度和可靠性。BitTorrent 协议的核心思想是让下载者同时充当上传者，即将下载好的文件块分享给其他下载者，从而实现文件的高效传输。

以下是 BitTorrent 的工作原理：

种子文件（Torrent File）的创建和分享：对于要被共享的文件，首先需要创建一个种子文件，该文件包含了文件的元数据和跟踪器（Tracker）的信息。跟踪器是协调下载者之间连接的服务器，帮助下载者找到其他参与文件共享的人。这个种子文件被分享给其他用户。

Peers 的连接和数据交换：下载者（也称为 Peer）通过 BitTorrent 客户端连接到跟踪器，并获取参与共享文件的其他 Peer 的信息。然后，下载者与这些 Peer 建立连接，开始交换文件块。下载者不仅从上传者下载文件块，也同时将自己已经下载好的文件块分享给其他下载者。

分块下载和校验：文件被分成小块（通常为 256KB 或 512KB），下载者通过与其他 Peer 交换文件块来逐步下载文件。每个文件块都有一个唯一的标识符，以便下载者之间进行正确的数据交换。下载者还会进行校验，确保下载的文件块的完整性和准确性。

做种（Seeding）：当下载者完全获得整个文件后，他们可以选择继续将文件保持在 BitTorrent 网络中作为种子继续分享给其他下载者，这称为做种。通过做种，更多的用户可以从他们那里下载文件，从而促进整个网络的稳定性和可扩展性。

<img src="https://assets.vluv.space/UESTC/Network/Ch6-2ApplicationLayer/Ch6-2ApplicationLayer-2024-03-28-15-52-44.webp" alt="BitTorrent">

## Video Streaming and Content Distribution Networks

### HTTP Streaming And DASH

HTTP 流所有客户接受到相同编码的视频，但对不同用户或者不同时间，客户可用的带宽大小有很大不同。**HTTP 的动态适应性流（Dynamic Adaptive Streaming over HTTP，DASH）**：视频编码成几个不同的版本，其中每个版本具有不同的比特率，对应于不同的质量水平。客户动态地请求来自不同版本且长度为几秒的视频段数据块。

每个视频版本存储在 HTTP 服务器中，每个版本都有一个不同的 URL。HTTP 服务器也有一个**告示文件（manifest file）**，为每个版本提供了一个 URL 及其比特率。

### Content Distribution Networks

如何从海量的视频中，挑选出某些内容，采用流的方式发送给成千上万的用户?
CDN 使用多台分布在全球各地的服务器（这些服务器被称为边缘节点），这些服务器存储了网站中内容的副本。当用户请求访问网站时，CDN 会根据用户的地理位置，选择距离用户最近的边缘节点来响应请求。

- **Private CDN** 私有 CDN 是由单个组织或企业自己建立和管理的内容分发网络。它通常由该组织或企业在自己的数据中心或云环境中架设服务器节点，用于存储和分发自己的内容。私有 CDN 的优势在于对内容的控制权和安全性更高。
- **Third-party CDN** 第三方 CDN 是由专业的 CDN 提供商运营和管理的网络基础设施。这些提供商拥有全球分布的服务器节点，并为各种网站和应用提供内容分发服务。第三方 CDN 通过在全球各地部署服务器节点，将站点或应用的静态和动态内容缓存到离用户近的节点，并通过智能路由和负载均衡，将用户的请求引导到最近的节点。

**CDN Operation:**

When a browser in a user’s host is instructed to retrieve a specific video (identified by a URL), the CDN must intercept(截获) the request so that it can

1. Determine a suitable CDN server cluster(集群) for that
   client at that time
2. Redirect the client’s request to a server in that cluster.
   <img src="https://assets.vluv.space/UESTC/Network/Ch6-2ApplicationLayer/Ch6-2ApplicationLayer-2024-03-28-20-11-15.webp" alt="CDN Operations">
   > 许多 CDN 利用 DNS 截获用户请求并将用户重定向到最近的 CDN 服务器。

如下是一个用户访问 NetCinema 网页中视频的过程：

- 用户访问 NetCinema 的网页。
- 当用户点击链接`http://video.netcinema.com/6Y7B23V`时，用户的主机会发送一个寻找`video.netcinema.com`的 DNS 查询。
- 用户的本地 DNS 服务器（LDNS）将 DNS 查询转发到 NetCinema 的权威 DNS 服务器，该服务器注意到主机名`video.netcinema.com`中的字符串 video。为了将 DNS 查询交给 KingCDN，NetCinema 的权威 DNS 服务器不返回 IP 地址，而是返回 KingCDN 域中的主机名，例如`a1105.kingcdn.com`
- DNS 查询进入 KingCDN 的私有 DNS 基础设施;用户的 LDNS 然后发送查询`a1105.kingcdn.com`的请求;KingCDN 的 DNS 系统指定合适的 KingCDN 内容服务器,将其 IP 地址返回给 LDNS。
- LDNS 将提供内容的 CDN 节点的 IP 地址转发给用户的主机。
- 一旦客户端收到 KingCDN 内容服务器的 IP 地址，它就会与该 IP 地址的服务器建立 TCP 连接，并发出一个 HTTP GET 请求获取视频。如果使用 DASH，服务器会首先向客户端发送一个清单文件，其中包含一个 URL 列表，每个版本的视频对应一个 URL，客户端会动态地从不同的版本中选择块。

## Socket Programming: Creating Network Applications

<img src="https://assets.vluv.space/UESTC/Network/Ch6-2ApplicationLayer/Ch6-2ApplicationLayer-2024-03-28-20-40-38.webp" alt="Socket Programming">
