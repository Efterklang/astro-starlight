---
title: 数字电路设计与嵌入式开发——组合逻辑电路的Verilog实现
date: 2024-11-1
excerpt: 22级电子科技大学软件工程学院(嵌入式方向)，数字电路设计与嵌入式开发实验报告(Lab2);
categories: [Miscellaneous]
tags: [FPGA, UESTC, Verilog]
---

## Intro

22 级电子科技大学软件工程学院(嵌入式方向)，数字电路设计与嵌入式开发实验报告;
其中包含

- `lab2-1`: 使用开关 `SW0~SW6` 完成对 6 个 7 段显示的控制。
  - `SW3~SW0` 控制显示的数据，从 0 到 F；
  - `SW6~SW4` 控制用六个 7 段数码管，000 对应 7SD-1, 001 对应 7SD-2，以此类推，101 对应 7SD-6，其它情况下都不显示。
- `lab2-2`: 用 Verilog 实现一个 2 位 3 选 1 数据选择器。
- `lab2-3`: 用 Verilog 实现一个 3 线-8 线译码器
- `lab2-4`: 用 Verilog 实现一个 8 线-3 线编码器
- `lab2-5`: 用 Verilog 实现一个 3 位二进制加减法器。X=0 时进行加法计算；X=1 时进行减法计算

本人大二上选择方向时，对几个方向都不甚了解；后面学到嵌入式专业课才发觉自己对此不感兴趣，几门专业课也都没有听(一节课也没有)，嵌入式相关知识的学习~~压力~~动力全来自于平时作业&课程 lab，故对报告质量不作保证；

---

22 级嵌入式相关课程，选择方向时可以作为参考，看下自己对相关课程是否感兴趣 😊

- 大二上：没有专业课；
  嵌入式学生最爽时刻 top1，怀念一周三休
- 大二下：嵌入式系统，ARM 处理器体系结构及应用；
  二门嵌入式专业课，开卷考。~~那场考试毁了我的保研梦,选择嵌入式我没有后悔。#沉淀#顶峰相见#保研梦#黑皮程序员~~ 😭<img src="https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-4.webp" alt="" style="width: 20%"/>
- 大三上：数字电路设计与嵌入式开发(+FPGA)；
  实验的课时安排的周六，共 6 周。数电和形策打了一波配合，五周内体验四次单休 👍👍👍；嵌入式学生最爽时刻 top-1
  10.5 周六，形策；10.12 周六，国庆调休上数电；10.19 喘息一周；10.26FPGA 实验，11.1 数电实验；后面周一就没课了，勉强苟延残喘

**NOTE**

实验课的显示器应该是[Lenovo D186](https://support.lenovo.com/us/en/solutions/pd013690-lenovo-d186-185-in-wide-lcd-monitor-overview)，电脑系统 windows xp。目测设备年龄超过 10 年，使用过程中是比较卡顿的；IDE 的编辑体验和笔记本比较类似。
此外拷贝程序建议别用太新的 u 盘，可能跟文件系统有关？没研究过这些。下图中的 U 盘可以正常使用，但昨天被我搞坏了...

| <img src="https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-6.webp" alt="" style="width: 90%"/> | <img src="https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-7.webp" alt="" style="width: 50%"/> |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |

## Part 1

### 实验结果与分析

使用开关 `SW0~SW6` 完成对 6 个 7 段显示的控制。
定义模块 `seven_seg_display`，接收两个输入 `hexnum` 和 `select`，输出两个输出 `led` 和 `show`

首先通过`case`语句判断`select`的值，然后通过 assign 语句更新`led`的值；这个 case 语句的作用是，负责控制选择用哪一个 7 段数码管来显示数字

比如希望在`select==0`时点亮`DISP1 LTD-4708JR`数码管，可以在下面的约束文件中添加`NET led<0> LOC=M17;`语句将`led[0]`与`M17`引脚绑定，即`led[0]`对应电路图中的`7SD-C1`信号。当遇到`3'b000`这个 case 时，`led=6'b000001;`,即`led[0]`赋值为 1，即`7SD-C1`为高电平,即选中第一个数码管 C1 进行显示;

<img src="https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-1.webp" alt="" style="width: 50%"/>

<br/>

然后通过`display`的 8 个 bits 分别负责`a,b,c,d,e,f,g,dp`数码管的亮灭，从而更新显示的 hexadecimal number;本实验中 Digilent Anvyl 开发板上的数码管为共阴极数码管。以`4'h0: display = 8'b11111100;`为例，表示`a,b,c,d,e,f`亮，`g,dp`灭；

|      bin      |  hex  |
| :-----------: | :---: |
| `8'b11111100` |  `0`  |
| `8'b01100000` |  `1`  |
| `8'b11011010` |  `2`  |
| `8'b11110010` |  `3`  |
| `8'b01100110` |  `4`  |
| `8'b10110110` |  `5`  |
| `8'b10111110` |  `6`  |
| `8'b11100000` |  `7`  |
| `8'b11111110` |  `8`  |
| `8'b11100110` |  `9`  |
| `8'b11101110` |  `a`  |
| `8'b00111110` |  `b`  |
| `8'b10011100` |  `c`  |
| `8'b01111010` |  `d`  |
| `8'b10011110` |  `e`  |
| `8'b10001110` |  `f`  |

<img src="https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2.webp" alt="" style="width: 50%"/>

```verilog
module seven_seg_display (
    input [3:0] hexnum,          // 4-bit input, controls displayed data (0 to F)
    input [2:0] select,          // 3-bit input, selects which 7-segment display to control (000 to 101)
    output reg [5:0] led,        // 6-bit output, activates one of six 7-segment displays
    output reg [7:0] display        // 8-bit output, controls the segments of the 7-segment display
);

    // Control which 7-segment display is active based on the 'select' input
    always @(*) begin
        case (select)
            3'b000: led = 6'b000001; // Activate 7SD-1
            3'b001: led = 6'b000010; // Activate 7SD-2
            3'b010: led = 6'b000100; // Activate 7SD-3
            3'b011: led = 6'b001000; // Activate 7SD-4
            3'b100: led = 6'b010000; // Activate 7SD-5
            3'b101: led = 6'b100000; // Activate 7SD-6
            default: led = 6'b000000; // Turn off all displays for other values of 'select'
        endcase
    end

    // Determine the pattern to display on the 7-segment display based on 'hexnum'
    always @(*) begin
        case (hexnum)
            4'h0: display = 8'b11111100; // Display 0
            4'h1: display = 8'b01100000; // Display 1
            4'h2: display = 8'b11011010; // Display 2
            4'h3: display = 8'b11110010; // Display 3
            4'h4: display = 8'b01100110; // Display 4
            4'h5: display = 8'b10110110; // Display 5
            4'h6: display = 8'b10111110; // Display 6
            4'h7: display = 8'b11100000; // Display 7
            4'h8: display = 8'b11111110; // Display 8
            4'h9: display = 8'b11100110; // Display 9
            4'hA: display = 8'b11101110; // Display A
            4'hB: display = 8'b00111110; // Display B
            4'hC: display = 8'b10011100; // Display C
            4'hD: display = 8'b01111010; // Display D
            4'hE: display = 8'b10011110; // Display E
            4'hF: display = 8'b10001110; // Display F
            default: display = 8'b00000000; // Turn off all segments for invalid hexnum
        endcase
    end
endmodule
```

参照该图，补全约束文件，使得数字 0~F 在 正确的 7 段数码管上以正确的形式显示。

<img src="https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-2.webp" alt="" style="width: 50%"/>

```shell
# 下面是ucf文件，为了显示效果，文中用bash代码块进行高亮
NET hexnum<O> LOC=V5;
NET hexnum<1> LOC=U4;
NET hexnum<2> LOC=V3;
NET hexnum<3> LOC=P4;
NET select<O> LOC=R4;
NET select<1> LOC=P6;
NET select<2> LOC=P5
NET led<0> LOC=M17;
NET led<1> LOC=P16;
NET led<2> LOC=P19;
NET led<3> LOC=N16;
NET led<4> LOC=AB21;
NET led<5> LOC=AA20;
NET display<O> LOC=P15;
NET display<1> LOC=Y21
NET display<2> LOC=P20;
NET display<3> LOC=AB19;
NET display<4> LOC=N15;
NET display<5> LOC=Y22;
NET display<6> LOC=AA22;
NET display<7> LOC=AA21;
```

### 验证图片

编译后将 bit 文件写入开发板验证即可

![alt text](https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-3.webp)

## Part 2

### 实验结果与分析

根据控制信号 C 的值，选择一个 2 位输入信号 D0、D1 或 D2，并将该信号输出到 Y。下面是代码的具体解释和实现思路。输出信号通过 LD0 和 LD1 两个发光二极管进行验证

```verilog
module Mux3to1_2bit (
    input [1:0] C,
    input [1:0] D0,
    input [1:0] D1,
    input [1:0] D2,
    output reg[1:0] Y
);
    always@(*)
    case (C)
        2'b00: Y = D0;
        2'b01: Y = D1;
        2'b10: Y = D2;
        default: Y = 2'b00;
    endcase
endmodule
```

### 验证图片

![alt text](https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-5.webp)

## Part 3

### 实验结果与分析

输入端有 3 根信号线,表示从`000`到`111` 8 种不同的二进制组合，输出端有 8 根信号线,每一根线对应输入的一种二进制组合。
编写如下代码，然后在约束文件中将`out[0]-outp[7]`分别绑定到 LD0 到 LD7 八个 LED 灯即可

```verilog
module decoder3to8(
 input [2:0] in, // 3-bit input
 output reg [7:0] out // 8-bit output
);
    always @(*) begin
        out = 8'b0000_0000; // 初始化输出
        case (in)
            3'b000: out  = 8'b0000_0001;
            3'b001: out  = 8'b0000_0010;
            3'b010: out  = 8'b0000_0100;
            3'b011: out  = 8'b0000_1000;
            3'b100: out  = 8'b0001_0000;
            3'b101: out  = 8'b0010_0000;
            3'b110: out  = 8'b0100_0000;
            3'b111: out  = 8'b1000_0000;
            default: out = 8'b0000_0000;
        endcase
    end
endmodule
```

### 验证图片

队友的玉手出镜，拨码挡住了，懒得重新拍了(没挡住看得也费力，老师应该也不会细看)

![alt text](https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-9.webp)

## Part 4

### 实验结果与分析

代码结构与 3-8 译码器类似，将输入输出倒置即可。在约束文件中，`out[0]、out[1]、out[2]`绑定到`LD0、LD1、LD2`即可

```verilog
module encoder8to3(
 input [7:0] in, // 8-bit input
 output reg [2:0] out // 3-bit output
);
    always @(*) begin
        case (in)
            8'b0000_0001: out = 3'b000;
            8'b0000_0010: out = 3'b001;
            8'b0000_0100: out = 3'b010;
            8'b0000_1000: out = 3'b011;
            8'b0001_0000: out = 3'b100;
            8'b0010_0000: out = 3'b101;
            8'b0100_0000: out = 3'b110;
            8'b1000_0000: out = 3'b111;
            default: out      = 3'b000;
        endcase
    end
endmodule
```

### 验证图片

![alt text](https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-10.webp)

## Part 5

### 实验结果与分析

> 用 Verilog 实现一个 3 位二进制加减法器。X=0 时进行加法计算；X=1 时进行减法计算

代码根据控制信号 X 的值来决定是执行加法还是减法操作

- `A` 和 `B` 是 3 位的**无符号**操作数(即全为正数)
- `X` 是控制信号，当 `X = 0` 时执行加法，当 `X = 1` 时执行减法。
- `Y` 是 4 位输出结果，返回运算结果的补码形式
- `Overflow` 作为 Flag，用于指示是否在操作中发生溢出。

{% message color:primary "title: 补码 wikipedia"%}

补码（英语：2's complement）是一种用二进制表示有符号数的方法，也是一种将数字的正负号变号的方式，常在计算机科学中使用。补码以有符号比特的二进制数定义。

正数和 0 的补码就是该数字本身再补上最高比特 0。负数的补码则是将其绝对值按位取反再加 1。

补码系统的最大优点是可以在加法或减法处理中，不需因为数字的正负而使用不同的计算方式。只要一种加法电路就可以处理各种有号数加法，而且减法可以用一个数加上另一个数的补码来表示，因此只要有加法电路及补码电路即可完成各种有号数加法及减法，在电路设计上相当方便。

我在下面举个栗子 👇

| decimal  | binary | complement       |
| -------- | ------ | ---------------- |
| `2`      | `0010` | `0010`           |
| `-3`     | `1011` | `1101`           |
| `2-3=-1` | `1111` | `0010+1101=1111` |
| `2+3=5`  | `0101` | `0010+0011=0101` |

{% endmessage %}

为方便运算，在计算过程中需要将运算数转为补码;转换的过程如下

- `A` 作为被加数/被减数，一定为正数；只需要在`A`前面加一个`0`bit 作为符号位即可
  `assign A_comp = {1'b0, A};`
- `B` 作为加数/减数，根据控制信号 `X` 来确定其正负，如果是加法(`X==0`)，加一个`0`作为符号位即可；如果是减法(`X==1`)，那么运算可以视作`A+(-B)`，`-B`作为负数，求补码需要先按位取反(符号位不需要取反)再加 1
  `assign B_comp = (X == 0) ? {1'b0, B} : {1'b1, ~B} + 1`

接下来判断运算结果是否溢出

- 如果是减法，运算结果一定不会溢出；(运算结果一定会在 `0到-7`这个区间里)
- 如果是加法，运算结果可能溢出；例如`A=011,B=110`得到`Y=1101`，两个正数相加得到负数，显然发生了溢出；
  `assign Overflow = (X == 0) ? Y[3] : 0;`

```verilog
module AdderSubtractor(
    input [2:0] A,    // 3-bit operand A
    input [2:0] B,    // 3-bit operand B
    input X,          // Control signal: 0 for addition, 1 for subtraction
    output [3:0] Y,   // 4-bit result to include overflow
    output Overflow   // Overflow indicator
);
    // 4-bit complement of A and B
    wire [3:0] A_comp;
    wire [3:0] B_comp;
    assign A_comp = {1'b0, A};
    assign B_comp = (X == 0) ? {1'b0, B} : {1'b1, ~B} + 1；
    assign Y = A_comp + B_comp;
    assign Overflow = (X == 0) ? Y[3] : 0;
endmodule
```

```shell
NET A<O> LOC=V5;
NET A<1> LOC=U4;
NET A<2> LOC=V3;
NET B<0> LOC=P4;
NET B<1> LOC=R4;
NET B<2> LOC=P6;
NET X LOC=P5;
NET Y<O> LOC=W3;
NET Y<1> LOC=Y4;
NET Y<2> LOC=Y1;
NET Y<3> LOC=AB4;
NET Overflow LOC=AA4;
```

### 验证图片

![alt text](https://vluv-space.s3.bitiful.net/UESTC/Embedded/lab2/lab2-8.webp)
