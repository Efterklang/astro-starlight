---
title: NWDAF 网络数据分析功能
date: 2026-09-03
excerpt: 3GPP 在 5G 核心网里定义的数据分析网元 NWDAF：它在 5GC 里的位置、两组服务化接口、Analytics ID 清单、数据从哪来、Rel-17 之后 MTLF/AnLF 的拆分与 DCCF/ADRF 数据采集框架，以及闭环自动化的典型链路。
categories:
  - Dev
  - Network
tags:
  - Network
  - 5G
  - 3GPP
---

## NWDAF 是什么

**NWDAF（Network Data Analytics Function，网络数据分析功能）**是 3GPP 在 5G 核心网里定义的一个**网络功能（NF）**，职责是从网络里采数据，跑出分析结果，再把结果通过服务化接口交给其他网元或应用去用。

它要解决的问题很具体。4G 时代运营商也做网络分析，但数据采集靠的是各家厂商自己的接口、自己的日志格式、自己的探针，换一家厂商就得重做一遍集成。NWDAF 把「谁能被采数据、采什么、怎么采、结果长什么样」写进了规范，分析于是从一个厂商私有的旁路系统，变成了核心网里一个有标准接口的正式网元。

> [!info] 三份主要规范
>
> - **TS 23.288** 是主规范，定义 NWDAF 的架构、每个 Analytics ID 的输入输出和流程。看 NWDAF 应该从这份开始。
> - **TS 29.520** 是 stage 3，定义 `Nnwdaf` 服务的 HTTP/2 API 和 OpenAPI 描述。
> - **TR 23.791** 是 Rel-16 的立项研究报告，今天能看到的那批用例基本都来自它。

一句话概括它的定位：NWDAF 是**控制面里的分析网元**，输出的是给自动化决策用的数据，不是给人看的报表。

## 在 5GC 里的位置

5GC 是服务化架构（SBA），所有网元挂在同一条总线上，互相以「服务」的形式调用。NWDAF 在这条总线上同时扮演两个角色：

```wikitext
                   ┌──────────── 数据源 ────────────┐
   AMF   SMF   PCF   UDM   NRF   AF(经 NEF)   OAM/管理面
     │     │     │     │     │        │           │
     └─────┴─────┴──┬──┴─────┴────────┴───────────┘
                    │  Namf/Nsmf/… _EventExposure（NWDAF 作为消费者）
                    ▼
            ┌───────────────┐
            │     NWDAF     │  采集 → 训练/推理 → 输出统计与预测
            └───────────────┘
                    │  Nnwdaf_EventsSubscription / Nnwdaf_AnalyticsInfo
     ┌──────────────┼──────────────┬────────────┐
     ▼              ▼              ▼            ▼
    PCF            AMF            SMF     NSSF / NEF+AF / 编排器
                （NWDAF 作为生产者，消费者拿去做决策）
```

- **作为消费者**：向 AMF、SMF、PCF、UDM、NRF 订阅事件，向 OAM 要无线侧和网元的性能数据，通过 NEF 拿应用侧数据。
- **作为生产者**：把分析结果暴露给 PCF、AMF、SMF、NSSF、NEF/AF、编排器。

消费者不需要预先知道 NWDAF 部署在哪。NWDAF 注册到 **NRF** 时会带上自己支持的 Analytics ID、服务区域、S-NSSAI 等信息，消费者拿 Analytics ID 去 NRF 做发现，就能找到合适的实例。

## 两组服务化接口

NWDAF 对外主要就两个服务，区别是**一次性**还是**持续**：

| 服务                        | 操作                             | 语义                         | 适用场景                                        |
| --------------------------- | -------------------------------- | ---------------------------- | ----------------------------------------------- |
| `Nnwdaf_AnalyticsInfo`      | Request                          | 一问一答，请求即返回         | 决策点上临时查一次，比如选 UPF 前问一下 DN 性能 |
| `Nnwdaf_EventsSubscription` | Subscribe / Unsubscribe / Notify | 订阅后按周期或按阈值持续推送 | 闭环监控，比如切片负载超阈值就通知              |

订阅时消费者要给出的关键参数：

| 参数                              | 含义                                                   |
| --------------------------------- | ------------------------------------------------------ |
| **Analytics ID**                  | 要哪一类分析，见下一节的清单                           |
| **Target of Analytics Reporting** | 分析对象是单个 UE、一组 UE，还是「任意 UE」            |
| **Analytics Filter Information**  | 过滤条件，比如 S-NSSAI、DNN、area of interest、应用 ID |
| **Analytics target period**       | 时间窗。落在过去就是统计，落在未来就是预测             |
| **Preferred level of accuracy**   | 期望精度，NWDAF 据此选模型和数据量                     |
| **Reporting thresholds**          | 阈值，只在越界时才通知，用来压低通知量                 |

返回的结果分两类，这个区分很重要：

- **Statistics（统计）**：面向过去某个时间窗的观测结果。
- **Prediction（预测）**：面向未来，必须带 **Confidence（置信度）** 和 **Validity Period（有效期）**。

> [!warning] 预测是会错的
>
> 消费者拿到预测就去改策略，等于把网络行为绑在了一个概率结果上。所以 confidence 和 validity period 不是装饰性字段，闭环逻辑里要真的读它们，并且要设计好预测失准时的回退路径。

## Analytics ID 清单

Analytics ID 是 NWDAF 的核心词汇表，规范每加一版就会长一点。Rel-16 定下来的基础集合：

| Analytics ID           | 分析什么                          | 典型消费者        | 拿去做什么                                   |
| ---------------------- | --------------------------------- | ----------------- | -------------------------------------------- |
| `SLICE_LOAD_LEVEL`     | 切片实例的负载等级                | NSSF、PCF、AMF    | 切片选择、准入控制、切片扩容                 |
| `NF_LOAD`              | 单个 NF 的负载与预测              | 编排器、OAM       | NF 扩缩容、NF 选择                           |
| `NETWORK_PERFORMANCE`  | 区域内的网络性能与 gNB 状态       | 编排器、AF        | 容量规划、业务调度                           |
| `SERVICE_EXPERIENCE`   | 观测到的业务体验（MOS 类指标）    | PCF、AF（经 NEF） | 调 QoS、调码率                               |
| `UE_MOBILITY`          | UE 的移动轨迹与位置预测           | AMF、SMF          | 注册区与寻呼优化、边缘 UPF 选择              |
| `UE_COMM`              | UE 的通信模式（何时收发、多大量） | AMF、SMF、NEF     | 生成 Expected UE Behaviour 参数、配 MICO/DRX |
| `ABNORMAL_BEHAVIOUR`   | UE 的异常行为                     | AMF、SMF、PCF     | 识别被劫持或误用的终端，限速或断开           |
| `USER_DATA_CONGESTION` | 特定位置的用户面拥塞              | AF（经 NEF）、PCF | 拥塞感知的内容分发                           |
| `QOS_SUSTAINABILITY`   | 某区域内 QoS 能否维持             | AF（经 NEF）      | 提前降级业务                                 |

Rel-17 之后陆续补进来的，按同一套框架工作，只是分析对象更细：`DN_PERFORMANCE`（数据网络侧性能，用于边缘应用重定位）、`DISPERSION`（数据与业务在时空上的分散度）、`WLAN_PERFORMANCE`、`RED_TRANS_EXP`（冗余传输体验）、`SM_CONGESTION`，以及 Rel-18 面向定位精度和端到端传输时间的几项。

> [!tip] 看规范时的省力方法
>
> TS 23.288 里每个 Analytics ID 的写法是固定的四段：输入参数、需要采集的数据（列明从哪个 NF 的哪个事件采）、输出格式、以及消费者侧的示例流程。摸清一个的结构，剩下的都能照着读。

## 数据从哪来

NWDAF 自己不产生数据，全靠采。数据源有四类：

1. **5GC 网元**，走各自的 Event Exposure 服务：`Namf_EventExposure`（注册、可达性、位置变化）、`Nsmf_EventExposure`（PDU 会话建立释放、UP 路径变化）、`Nudm_EventExposure`、`Npcf_EventExposure`。
2. **NRF**，拿 NF 的注册与状态信息。
3. **OAM / 管理面**，拿无线侧和网元的性能测量。RAN 侧数据基本只能从这条路来，因为 NWDAF 和 gNB 之间没有直接接口。
4. **AF（应用功能）**，经由 NEF 上报应用层的体验数据，比如码率、卡顿、MOS。

> [!warning] 数据采集才是真正的工程瓶颈
>
> 按规范直接实现，NWDAF 会向 AMF、SMF 发起大量订阅，per-UE 粒度的订阅尤其贵。多个 NWDAF 实例还可能向同一个 NF 重复订阅同一份数据。在真实网络的话务量下，「给核心网加了个分析功能」很容易变成「给核心网加了个持续负载」。Rel-17 引入的那套数据采集框架就是冲着这个问题来的。

## Rel-17 之后：拆功能，拆数据通路

### MTLF 与 AnLF

Rel-17 把 NWDAF 内部按职责切成了两个逻辑功能：

| 逻辑功能 | 全称                            | 干什么                                                                                   |
| -------- | ------------------------------- | ---------------------------------------------------------------------------------------- |
| **MTLF** | Model Training Logical Function | 训练 ML 模型，通过 `Nnwdaf_MLModelProvision` 把模型（实际传的是模型文件地址）提供给 AnLF |
| **AnLF** | Analytics Logical Function      | 用模型做推理，通过 `Nnwdaf_AnalyticsInfo` 和 `Nnwdaf_EventsSubscription` 对外输出分析    |

这个拆分的意义在于**训练重、推理轻**，两者的资源画像和生命周期完全不同。拆开之后，一个集中部署的 MTLF 训好模型，可以下发给多个部署在边缘的 AnLF 做低时延推理，各自按各自的节奏扩缩容。一个 NWDAF 实例可以只含 MTLF、只含 AnLF，或者两者都含，注册到 NRF 时会声明。

Rel-18 在这个基础上加了**联邦学习**：多个 MTLF 之间交换模型参数而不交换原始数据，用来解决数据出不了域（跨运营商、跨管理域、隐私合规）情况下的联合训练。

### DCCF、MFAF、ADRF

同样是 Rel-17 之后引入，专门对付上面那个采集瓶颈：

| 网元     | 全称                                  | 解决什么                                                          |
| -------- | ------------------------------------- | ----------------------------------------------------------------- |
| **DCCF** | Data Collection Coordination Function | 协调数据采集，多个消费者要同一份数据时只向源 NF 订阅一次          |
| **MFAF** | Messaging Framework Adaptor Function  | 3GPP 服务化接口与消息总线（Kafka 之类）之间的适配层，负责扇出分发 |
| **ADRF** | Analytics Data Repository Function    | 存历史数据和历史分析结果，NWDAF 不必自己长期囤数据                |

加上这三个之后，数据通路从「每个 NWDAF 各自去每个 NF 拉数据」变成了「统一采一次，进总线，按需分发，历史入库」。这基本上是把大数据平台那套采集与分发架构，用 3GPP 的网元形式重新表达了一遍。

## 一条走通的闭环

`QOS_SUSTAINABILITY` 是最能说明 NWDAF 价值的例子，因为它输出的是**未来**，而消费者能拿这个未来做出有意义的动作：

1. 车联网 AF 通过 NEF 订阅分析，Analytics ID 为 `QOS_SUSTAINABILITY`，过滤条件是某段高速的地理区域加上目标 5QI。
2. NEF 做鉴权和参数映射，转成 `Nnwdaf_EventsSubscription_Subscribe` 发给 NWDAF。
3. NWDAF 向 OAM 订阅该区域小区的无线侧 KPI，向 SMF、PCF 订阅会话与 QoS 通知，喂进模型。
4. 模型判断未来十分钟内该区域无法维持目标 5QI，NWDAF 通过 Notify 上报，带上时间窗和置信度。
5. AF 提前动作：把编队行驶降级为辅助驾驶，或者把车载视频码率降下来。

关键在第 5 步。如果没有第 4 步的提前量，AF 只能等 QoS 真的掉下去之后再反应，而那时候车已经开在那段路上了。**分析的价值不在于看得准，在于看得早，早到还来得及做事。**

## 部署时会撞上的问题

- **厂商合规程度参差**。规范写了 Event Exposure，不代表在网的每个网元都实现了，或者实现得一致。RFP 阶段就要把 Analytics ID 和事件级别的支持列表写进去。
- **4G/5G 共存期的数据割裂**。集中式分析用例需要全网视角，而这段时期相当长，NWDAF 必须能和既有的分析系统对接，而不是另起炉灶。
- **分析孤岛**。运营商内部往往已经有收入保障、营销分析、网管分析等好几套系统，各自采一遍数据。让 NWDAF 变成第 N+1 个孤岛，收益会大打折扣。
- **存处理过的数据，不是原始数据**。除非法规要求留存，原始数据的存储成本增长比分析价值增长快得多。
- **隐私与合规**。per-UE 粒度的分析直接触及用户数据，跨域、跨运营商的场景更敏感，联邦学习在 Rel-18 被写进来就有这层考虑。
- **闭环要有刹车**。自动化动作由预测驱动，就必须有置信度门限、生效范围限制和人工接管路径。

## 和邻居们的区别

分析在移动网络里不止一个入口，三者的时间尺度和归属域不同，实践中是互补关系：

|          | NWDAF                        | MDAF（MDAS）                  | RIC（Near-RT / Non-RT）               |
| -------- | ---------------------------- | ----------------------------- | ------------------------------------- |
| 归属     | 3GPP SA2，5GC 控制面         | 3GPP SA5，管理面（TS 28.104） | O-RAN 联盟，RAN 域                    |
| 数据视角 | 会话、移动性、切片、业务体验 | 网元性能与告警、配置、能耗    | 无线侧的 UE 与小区级测量              |
| 时间尺度 | 秒到分钟                     | 分钟到小时                    | Near-RT 是 10ms 到 1s，Non-RT 大于 1s |
| 接口     | 服务化接口 `Nnwdaf`          | 管理服务 MnS                  | E2 / A1 / O1                          |
| 典型动作 | 改策略、选网元、调 QoS       | 扩缩容、优化配置              | 调度、切换、无线资源分配              |

## 规范索引

| 规范                  | 内容                                                |
| --------------------- | --------------------------------------------------- |
| TS 23.288             | 架构增强、Analytics ID 定义与流程，主规范           |
| TS 29.520             | `Nnwdaf` 服务的 stage 3 API 与 OpenAPI              |
| TS 23.501 / TS 23.502 | 5GS 架构与流程，NWDAF 在其中的位置                  |
| TR 23.791             | Rel-16 立项研究，早期用例的来源                     |
| TR 23.700-81          | Rel-18 网络自动化研究，联邦学习、精度监控、漫游场景 |
| TS 28.104             | 管理面的 MDA，与 NWDAF 互补                         |

## 参考

- [NWDAF: Automating the 5G network with machine learning and data analytics](https://inform.tmforum.org/features-and-opinion/nwdaf-automating-the-5g-network-with-machine-learning-and-data-analytics)（TM Forum, 2020），中译见 Clippings 目录
- [3GPP 规范检索](https://www.3gpp.org/dynareport)
