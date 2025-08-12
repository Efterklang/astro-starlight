---
title: ARM伪指令及编程基础
date: 2024-04-07
excerpt: ARM四类伪指令的概述,以及与C的混合编程
categories: [UESTC, ARM处理器体系结构及应用]
tags: [ARM]
---

## 伪指令概述

**伪指令**:人们设计了一些专门用于指导汇编器进行汇编工作的指令，由于这些指令不形成机器码指令，它们只是在汇编器进行汇编工作的过程中起作用，所以被叫做伪指令
伪指令具有的两个特征:伪指令是一条指令;伪指令没有指令代码。

**伪指令的作用**

- 程序定位的作用;
- 为非指令代码进行定义;
- 为程序完整性做标注;
- 有条件的引导程序段。

## 通用伪指令

在 ARM 汇编程序语言中，有如下几种伪指令：

- 符号定义（Symbol Definition）伪指令
- 数据定义（Data Definition）伪指令
- 汇编控制（Assembly Control）伪指令
- 其它（Miscellaneous）伪指令

### 为变量定义或赋值的伪指令

符号的命名由编程者决定，但必须遵循以下约定：

- 符号区分大小写，同名的大、小写符号会被编译器认为是两个不同的符号;
- 符号在其作用范围内必须唯一;
- 自定义的符号不能与系统保留字相同;
- 符号不应与指令或伪指令同名。

#### 声明全局变量伪指令 GBLA、GBLL 和 GBLS

GBLA、GBLL 和 GBLS 伪指令用于定义一个 ARM 程序中的全局变量，并将其初始化。全局变量的变量名在整个程序范围内必须具有唯一性
指令格式：`GBLA(GBLL和GBLS)  <variable_name>`
GBLA 定义一个 全局数字变量，其默认初值为 0 ;
GBLL 定义一个 全局逻辑变量 ，其默认初值为 FALSE;
GBLS 定义一个 全局字符串变量，其默认初值为 空 ;

#### 声明局部变量伪指令 LCLA、LCLL 和 LCLS

LCLA、LCLL 和 LCLS 伪指令用于定义一个 ARM 程序中的局部变量，并将其初始化。
格式：`LCLA(LCLL 和 LCLS) <variable_name>`
LCLA 定义一个局部数字变量，其默认初值为 0;
LCLL 定义一个局部逻辑变量，其默认初值为 FALSE;
LCLS 定义一个局部字符串变量，其默认初值为 空。

#### 变量赋值伪指令 SETA、SETL 和 SETS

伪指令 SETA、SETL 和 SETS 用于给一个已经定义的全局变量或局部变量进行赋值。 注：要顶格写

指令格式：`变量名 SETA（SETL 或 SETS）表达式`
SETA 伪指令用于给一个数字变量赋值;
SETL 伪指令用于给一个逻辑变量赋值;
SETS 伪指令用于给一个字符串变量赋值;

```c
Test1  SETA  0xAA   ;将Test1变量赋值为0xAA。
Test2  SETL  {TRUE}   ;将Test2 变量赋值为真;
Test3 SETS "Testing"    ;将Test3变量赋值为Testing
```

#### 定义寄存器列表伪指令

指令 LDM/STM 需要使用一个比较长的寄存器列表，使用伪指令 RLIST 可对一个列表定义一个统一的名称。
格式：`<name> RLIST <{list}>`
例如：

```c
LoReg RLIST {R0-R7} ;定义寄存器列表{R0-R7}的名称为 LoReg
STMFD SP!, LoReg ;堆栈操作使用寄存器列表
RegList RLIST {R0-R5,R8,R10} ;将寄存器列表名称定义为 RegList，可在 ARM 指令 LDM/STM 中通过该名称访问寄存器列表
```

### 数据定义伪指令

#### LTORG

用于声明一个数据缓冲池（文字池）的开始。
格式：`LTORG`
伪指令 LTORG 用来说明某个存储区域为一个用来暂存数据的数据缓冲区，也叫文字池或数据缓冲池。大的代码段也可以使用多个数据缓冲池。
其目的是，防止在程序中使用 LDR 之类的指令访问时，可能产生的越界。
通常把数据缓冲池放在代码段的最后面，或放在无条件转移指令或子程序返回指令之后，这样处理器就不会错误地将数据缓冲池中的数据当作指令来执行。

```c
         AREA example, CODE, READONLY
Start    BL  Func1
             …
Func1    LDR R1,=0x800
         MOV PC,LR
         LTORG  ;定义数据缓冲池的开始位置，
             ;系统会自动设置数据缓冲池的大小
         …
         END
```

#### MAP 和 FIELD

MAP 用于定义一个结构化的内存表的首地址。MAP 可以用`^` 代替。
格式：`MAP <expr> {,<base_register>}`

expr 是数字表达式或程序中的标号。当指令中没有 base_register 时，expr 即为结构化内存表的首地址，可以为 标号 或 数字表达式;
base_register 为基址寄存器（可选项）。当指令中包含这一项时，结构化内存表的首地址为 expr 与 base_register 寄存器值的和;
`MAP fun ;` fun 就是内存表的首地址
`MAP 0x100,R9` ;内存表的首地址为 R9+0X100

MAP 通常和 FIELD 伪指令相配合来定义一个结构化的内存表。
FIELD 伪指令用于定义一个结构化内存表中的数据域。
格式：`{label} FIELD expr`

Label 为域标号，要顶格写;
Expr 表示本数据域在内存表中所占用的字节数;
功能：FIELD 用于定义一个结构化内存表中的数据域，`#`与 FIELD 同义。

```c
    MAP 0X100 ;定义结构化内存表首地址为 0X100
A  FIELD 16 ;定义A的长度为16字节，位置为 0X100
B  FIELD 32 ;定义B的长度为32字节，位置为 0X110
S  FIELD 256 ;定义S的长度为256字节，位置为 0X130
注意：MAP 和 FIELD 伪指令仅用于定义数据结构，并不实际分配存储单元。 FIELD 也可用“#” 代替。
```

#### SPACE 和 DCB

SPACE 伪指令用于分配一片连续的存储区域并初始化为 0。
格式： `{label} SPACE expr`
label 为内存块起始地址标号;
Expr 为所要分配的内存字节数;
SPACE 也可用“%” 代替。

```c
    AREA DataRAM,DATA,READWRITE;声明一数据段，名为 DataRAM
DataSpace SPACE 100 ;分配连续的 100 字节的存储单元,并初始化为 0。
```

DCB 伪指令用于分配内存单元并初始化
格式：`{label}  DCB  expr{，expr }{，expr }…`

label 是存块起始地址标号;
expr 可以为 0 至 255 的数值或字符串，内存分配的字节数由 expr 个数决定;
功能：DCB 用于分配一段字节内存单元，并用伪指令中的 expr 初始化，一般可用来定义数据表格，或文字符串，`=`与 DCB 同义。

```c
DISPTAB  DCB 0x43,0x33,0x76,0x12
            DCB 120,20,32,44
String   DCB “send,data is error!”,0


LDR  R1, =DISPTAB   ;把DISPTAB的地址值送入R1
        LDRB R2, [R1,#2] ;获取地址为[R1+#2]字节单元的值,R2=0x76
```

#### DCD 和 DCDU

用于分配存储单元并初始化
格式：
`{label} DCD expr{，expr }{，expr }…`
`{label} DCDU expr{，expr }{，expr }…`
label 是内存块起始地址标号
expr 为常数表达式或程序中标号，内存分配字节数由 expr 个数决定
功能：
DCD 用于分配一段字内存单元，并用伪指令中的 expr 初始化，字对齐，可定义数据表格或其它常数。`&`与 DCD 同义。
DCDU 用于分配一段字内存单元，并用伪指令中的 expr 初始化。DCDU 伪指令分配的内存不需要字对齐，可定义数据表格或其它常数

```c
        AREA blockcopy,CODE,READONLY
        ……
        LDR R1,=ftt
        LDR R2,=ftt2
        LDR R3,[R1] ; R3 = 1
        LDR R4,[R2] ; R4 = 3
        LDR R5,[R1, #4]; R5 = 2
        LDR R6,[R2, #4]; R6 = 4
        ……
Src     DCD 1,2,3,4,5,6,7,8,

        MAP Src
ftt     FIELD 8; 8 Byte = 64 Bit = 2 words, 即ftt为src数组的前两个元素
ftt2 FIELD 8
        END
```

该例说明了,MAP 和 FIELD 伪指令不分配存储空间，只是给相关存储单元取个名称（标号）。便于程序以结构的方式访问对应的内存单元。

#### MISC

了解

- DCFD 和 DCFDU
- DCFS 和 DCFSU
- DCQ 和 DCQU
- DCW 和 DCWU

### 控制程序流向伪指令

IF、ELSE 和 ENDIF 伪指令能根据条件的成立与否决定是否编译某个程序段。

```c
IF condition
    程序段1
ELSE
    程序段2
ENDIF
```

WHILE 和 WEND 伪指令根据条件的成立与否决定是否重复汇编一个程序段。

```c
WHILE condition
    程序段
WEND
```

若 WHILE 后面的逻辑表达式为真，则重复汇编该程序段，直到逻辑表达式为假。

```c
    GBLA  NUM
NUM SETA  1

    AREA blockcopy,CODE,READONLY
    ENTRY
    WHILE NUM < 3
    ...
NUM SETA  NUM+1
    WEND
    .........
    END
```

### 其它伪指令

#### 定义对齐方式伪指令 ALIGN

格式：`ALIGN {表达式，{偏移量}}`
ALIGN 是边界对齐伪指令，它可以通过添加填充字节的方式，使当前位置满足一定的对齐方式。其中表达式用于指定对齐方式在不同场合有不同的定义
例如 ALIGN 4 ;4 字节字对齐，ALIGN 后面不能有等号

```c
        AREA    OffsetExample, CODE
        .........
ss1   DCB     1    ;假设ss1在0x01000字节
        ALIGN   4,3  ; 4字节对齐+3偏移量.
ss2     DCB     1
                ;使用“ALIGN 4，3”以后，
                ;当前位置会转到0x01003(0x01000+3)。
                ;ss1和ss2之间会空2个字节。
```

#### 段定义伪指令 AREA

AREA 用于定义一个代码段或数据段。一个汇编语言程序至少要有一个段。
格式：`AREA  sectionname {,attr} {,attr}…`

sectionname 是定义的代码段或数据段的名称。若该名称是以数据开头的，则该名称必须用“｜”括起来，如｜ 2_datasec ｜。还有一些代码段的名称是专有名称。
Attr 表示代码或数据段的属性，多个属性用短号分隔，常用的属性如下

| 属性         | 含义           | 备注                                                           |
| ------------ | -------------- | -------------------------------------------------------------- |
| CODE         | 代码段         | 默认读/写属性为 READONLY                                       |
| DATA         | 数据段         | 默认读/写属性为 READWRITE                                      |
| NOINIT       | 数据段         | 指定此数据段仅仅保留了内存单元，而没有将各初始值写入内存单元。 |
| READONLY     | 本段为只读     |                                                                |
| READWRITE    | 本段为可读可写 |                                                                |
| ALIGN 表达式 |                | ELF 的代码段和数据段为字对齐                                   |
| COMMON       | 多源文件共享段 |                                                                |

#### CODE16 和 CODE32

CODE16 告诉汇编编译器后面的指令序列为 16 位的 Thumb 指令。
CODE32 告诉汇编编译器后面的指令序列为 32 位的 ARM 指令。
注意：CODE16 和 CODE32 只是告诉编译器后面指令的类型，该伪操作本身不进行程序状态的切换

```c
AREA     ChangeState, CODE, READONLY
         ENTRY
         CODE32                   ;下面为32位ARM指令
         LDR   R0,=start+1   ;将跳转地址放入寄存器R0
         BX      R0  ;程序跳转到新的位置执行
             ……   ;并将处理器切换到Thumb工作状态
         CODE16                 ;下面为16位Thumb指令
start  MOV   R1,#10
           …….
          END

```

#### ENTRY & END

ENTRY 定义程序入口点伪指令 ,指定程序的入口点。

注意：一个程序（可包含多个源文件）中至少要有一个 ENTRY（可以有多个 ENTRY，当有多个 ENTRY 入口时，程序的真正入口点由链接器指定），但一个源文件中最多只能有一个 ENTRY（可以没有 ENTRY）

END 伪指令用于通知编译器汇编工作到此结束，不再往下汇编了。每一个汇编源程序都必须包含 END 伪操作，以表明本源程序的结束。

#### EXPORT & IMPORT & EXTERN

**EXPORT**
外部可引用符号声明伪指令 EXPORT（或 GLOBAL）
声明一个源文件中的符号，使此符号可以被其他源文件引用。
格式：`EXPORT/GLOBAL symbol {[weak]}`
symbol：声明的符号的名称。（区分大小写）
[weak]：声明其他同名符号优先于本符号被引用。

```c
        AREA example，CODE，READONLY
        EXPORT  DoAdd;申明一个全局引用的标号 DoAdd
DoAdd   ADD R0，R0，R1
```

**IMPORT**
当在一个源文件中需要使用另外一个源文件的外部可引用符号时，在被引用的符号前面，必须使用伪指令 IMPORT 对其进行声明：声明一个符号是在其他源文件中定义的。
格式：`IMPORT symbol{[weak]}`
如果源文件声明了一个引用符号，则无论当前源文件中程序是否真正地使用了该符号，该符号均会被加入到当前源文件的符号表中。
symbol：声明的符号的名称。
[weak]：当没有指定此项时，如果 symbol 在所有的源文件中都没有被定义，则连接器会报告错误。
当指定此项时，如果 symbol 在所有的源文件中都没有被定义，则连接器不会报告错误，而是进行下面的操作。
如果该符号被 B 或者 BL 指令引用，则该符号被设置成下一条指令的地址，该 B 或 BL 指令相当于一条 NOP 指令。
其他情况下此符号被设置成 0。

```c
        AREA Init, CODE, READONLY
        IMPORT  main
          …
        END
```

**EXTERN**
EXTERN 伪指令与 IMPORT 伪指令的功能基本相同，但如果当前源文件中的程序实际并未使用该符号，则该符号不会加入到当前源文件的符号表中。
其它与 IMPORT 相同。

#### GET & INCLUDE

GET（或 INCLUDE）
GET 伪指令用于将一个源文件包含到当前的源文件中，并将被包含的源文件在当前位置进行汇编。
语法格式：GET 文件名
可以使用 INCLUDE 代替 GET。
GET 伪指令只能用于包含源文件，包含目标文件则需要使用 INCBIN 伪指令。

## 与 ARM 指令相关的宏指令

### 宏

MACRO 和 MEND 伪指令可以为一个程序段定义一个名称。这样，在汇编语言应用程序中，就可以通过这个名称来使用它所代表的程序段，即当程序做汇编时，该名称将被替换为其所代表的程序段。

```c
MACRO
  $标号   宏名 $参数1, $参数2，…..
  程序段（宏定义体）
MEND
```

`$标号`：为主标号，宏内的所有其它标号必须由主标号组成;
宏名：宏名称，为宏在程序中的引用名;
`$参数 1`, `$参数2`：宏中可以使用的参数。宏中的所有标号必须在前面冠以符号`$`。
`MACRO`、 `MEND` 伪指令可以嵌套使用

```c
            MACRO    ;宏定义指令
$MDATA      MAXNUM $NUM1,$NUM2 ;主标号，宏名，参数
            语句段
$MDATA.WAY1  ;   宏内标号，必须写为“主标号.宏内标号”
            语句段
$MDATA.WAY2   ;  宏内标号
            语句段
    MEND  ; 宏结束指令
```

MEXIT 用于从宏定义中跳转出去

### 宏指令

在 ARM 中，还有一种汇编器内置的无参数和标号的宏——宏指令。
在汇编时，这些宏指令被替换成一条或两条真正的 ARM 或 Thumb 指令。ARM 宏指令有四条，分别是：

- ADR：小范围的地址读取宏指令；
- ADRL：中等范围的地址读取宏指令；
- LDR：大范围的地址读取宏指令；
- NOP：空操作宏指令。

ADR 指令用于将一个 近地址值 传递到一个寄存器中。
格式：`ADR{cond}  <reg>, <expr>`
reg 为目标寄存器名称；
expr 为表达式。该表达式通常是程序中一个表示存储位置的 地址标号。
该宏指令的功能是把标号所表示的地址传递到目标寄存器中。
汇编器在汇编时，将把 ADR 宏指令替换成一条真正的 ADD 或 SUB 指令，以当前的 PC 值减去或加上 expr 与 PC 之间的偏移量得到标号的地址，并将其传递到目标寄存器。若不能用一条指令实现，则产生错误，编译失败。

中等范围的地址读取宏指令 ADRL 类似于 ADR，但可以把更远的地址赋给目标寄存器。该指令只能在 ARM 状态下使用，在 Thumb 状态下不能使用。汇编时，ADRL 宏指令由汇编器替换成两条合适的指令。
大范围的地址读取宏指令 LDR

大范围的地址读取宏指令 LDR
格式：`LDR{cond} reg,={expr | label - expr}`
reg：目标寄存器名称；
expr：32 位常数；
label – expr：为地址表达式。
程序经常用这条指令把一个地址传递到寄存器 reg 中。汇编器在对这种指令进行汇编时，会根据指令中 expr 的值的大小来把这条指令替换为合适的指令。
与 ARM 指令的 LDR 的区别：伪指令 LDR 的参数有“=”

<!-- ## ARM 工程

## ARM 程序框架

## ARM 汇编语言程序设计

## C/C++语言和汇编语言的混合编程 -->

TODO...
Maybe never _(:з)∠)_
