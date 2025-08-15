---
title: Java SE PART 1
date: 2023-08-03
excerpt: 记录 Java 基础;
categories: [Lang, Java]
tags: [Java]
---

## Java Basics

### Introduction

#### Java Feature

- 面向对象（封装，继承，多态）
- 平台无关性（ Java 虚拟机实现平台无关性）
- 支持多线程
- 可靠性（具备异常处理和自动内存管理机制）
- 安全性（Java 语言本身的设计就提供了多重安全防护机制如访问权限修饰符、限制程序直接访问操作系统资源）
- 高效性（通过 Just In Time 编译器等技术的优化，Java 语言的运行效率还是非常不错的）
- 支持网络编程并且很方便
- 编译与解释并存
- ...

#### EE & ME & SE

- Java ME(Java Micro Edition) 主要用于嵌入式系统程序的 开发 包含 Java SE 中的一部分类
- Java SE(Java Standard Edition) 主要用于桌面应用程序或简单的服务器应用程序;Java 编程语言的基础，它包含了支持 Java 应用程序开发和运行的核心类库以及虚拟机等核心组件。
- Java EE(Java Enterprise Edition)。指 Java 企业级开发的技术规范总和，可以用于构建分布式、可移植、健壮、可伸缩和安全的服务端 Java 应用程序，例如 Web 应用程序。包含 13 项技术规范： JDBC、JNDI、EJB、RMI、JSP、ServIet、XML、JMS、Java IDL、JTS、JTA、JavaMails JAF

#### JDK，JRE，JVM

1. JRE(Java Runtime Environment) = JVM + Java SE 标准类库（Java 核心类库）,包含 JVM 和核心类库 Runtime Library，JRE 是 Java 应用程序的运行环境，用于在计算机上运行 Java 程序
   - JVM(Java Virtual Machine)是 Java 虚拟机，它是 JRE 的核心组件，JVM 提供了垃圾回收、安全性管理、线程管理等功能，保证了 Java 程序的稳定性和安全性。
   - Java 基础类库（Class Library）：一组标准的类库，提供常用的功能和 API（如 I/O 操作、网络通信、数据结构等）
2. JDK(Java Development Kit) = JRE + 开发工具集(包含 Compiler,debugger 及其他开发工具)，是 Java 开发工具包

<img src="https://vluv-space.s3.bitiful.net/Java/java_se1/JavaⅠ-2024-09-18-16-18-56.webp" style="width:80%;" alt="">

**Java 是如何实现跨平台的**

<img src="https://vluv-space.s3.bitiful.net/Java/java_se1/JavaⅠ-2024-09-18-16-03-58.webp" style="width:80%;" alt="">

Java 语言借助 JVM 实现跨平台。javac 将 Java 源代码编译生成字节码文件(Bytecode，后缀 `.class`)，字节码不针对任何具体的硬件体系结构和软件平台生成，它会被 JVM 解释执行；JVM 判断代码是否为 Hotspot Code，如果是热点代码则 JIT compiler 将其编译为适合该平台的机器码，如果不是则让 Interpreter 逐行解释代码。由此我们认为 Java 是编译与解释共存的语言。

> JDK 引入了 AOT(Ahead of Time Compilation)，与 JIT 不同，其将编译放在编译时，而不是在运行时。AOT 的主要优势在于启动时间、内存占用和打包体积。JIT 的主要优势在于具备更高的极限处理能力，可以降低请求的最大延迟;此外，AOT 编译无法支持 Java 的一些动态特性，如反射、动态代理、动态加载、JNI（Java Native Interface）等

<img src="https://vluv-space.s3.bitiful.net/Java/java_se1/JavaⅠ-2024-09-18-16-42-10.webp" style="width:80%;" alt="">

### Variable In Java

1. 变量必须先声明再使用。声明变量时需要指定变量的类型和名称，作用域内同一变量不能重复声明。
2. Java 变量有不同的类型，包括基本类型和引用类型。基本类型包括整型、浮点型、布尔型和字符型等。引用类型包括类、接口、数组等。
3. 变量的命名应该具有描述性，以便代码的可读性和可维护性。

> [!info] Java `+` 运算符
>
> 1. 左右都是数值，则做加法运算
> 2. 左右有一方为字符串时，做拼接运算
>
> ```java
> "hello" + 100 + 3; //hello1003
> 100 + 3 + "hello"; //103hello
> ```

#### Identifier

Java 对各种变量，方法和类等命名时使用的字符序列称为标识符
凡是可以自己取名字的地方都叫标识符

1. 只能包括 26 个字母大小写，`0-9，_，$` 且不能为数字开头，不能包含空格
2. 不能与关键字和保留字重复
3. Java 严格区分大小写，长度无限制

**命名规范**

[Java 命名规范-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/1896438)

1. 包名：多单词组成时所有字母都小写 比如 `com.xxx.ccc`
2. 类名、接口名：大驼峰 `AaaXxxZzz`
3. 变量名、方法名：小驼峰 `xxxZzzYyy`
4. 常量：所有字母大写，下划线连接 `XXX_AAA_BBB`

#### 基本数据类型 Primitive Data Types

基本数据类型是编程语言中最简单的数据类型，基本数据类型的值是直接存储在内存中。

| 整型  | size | 取值范围                                                                   | 默认值 |
| ----- | ---- | -------------------------------------------------------------------------- | ------ |
| byte  | 1    | -128($-2^{7}$)👉127($2^{7-1}$)                                              | 0      |
| short | 2    | -32768($-2^{15}$)👉32767($2^{15}-1$)                                        | 0      |
| int   | 4    | -2,147,483,648($-2^{31}$)👉2,147,483,647($2^{31}-1$)                        | 0      |
| long  | 8    | -9,223,372,036,854,775,808($-2^{63}$)👉9223,372,036,854,775,807($2^{63}-1$) | 0L,-1L |

| 浮点型 | size | 取值范围                                       | 默认值 | desc                    |
| ------ | ---- | ---------------------------------------------- | ------ | ----------------------- |
| float  | 4    | upto 7 decimal digits($-2^{128}$👉$2^{128}$)    | 0.0F   | IEEE 754 floating point |
| double | 8    | upto 16 decimal digits($-2^{1024}$👉$2^{1024}$) | 0.0    | IEEE 754 floating point |

| 字符型 | size   | 取值范围 | 默认值   |
| ------ | ------ | -------- | -------- |
| char   | 2 字节 | 0-65535  | '\u0000' |

| 布尔型  | size       | 取值范围    | 默认值 |
| ------- | ---------- | ----------- | ------ |
| boolean | 视情况而定 | true、false | false  |

> Java 的每种基本类型所占存储空间的大小不会像其他大多数语言那样随机器硬件架构的变化而变化。这种所占存储空间大小的不变性是 Java 程序比用其他大多数语言编写的程序更具可移植性的原因之一

##### Note

**float**

1. 浮点数的存放形式：浮点数 = 符号位 + 指数位 + 尾数位
2. 尾数部分可能丢失，造成精度损失(小数都是近似值)；在涉及金融和货币计算的应用中，建议使用 `BigDecimal`类
3. 浮点型常量默认为 double 型，声明 float 型常量，须在后加 f 或 F，例如 1.1f
4. 浮点型常量有两种表示形式
   - 十进制数形式：`.512,512.0f,5.12`
   - 科学计数法形式：`5.12e2(5.12×10^2),5.12E-2(5.12×10^-2)`

---

**boolean**

理论上只需 1 位来表示真假两个状态，但在大多数实现中，为了方便处理，boolean 类型通常会占用一个字节或更多。它的值只能是 true 或 false

---

**转义字符 Escape Character**

```java
\t 制表符
\n 换行符，表示将光标移动到下一行的开头
\r 回车符，表示将光标移动到当前行的开头
\b 退格符
\f 进纸符（换页）
\' 单引号
\" 双引号
\\ 反斜杠
```

#### 引用数据类型 Reference Data Types

引用数据类型是编程语言中一种重要的数据类型分类，与基本数据类型（如整数、浮点数、字符等）相对应。引用数据类型的主要特点是它们在内存中的处理方式：变量存储的是指向实际数据的内存地址，而不是数据本身。

**接口 Interface**
接口是一种抽象类型，它定义了一组方法签名。接口可以被类实现（implements），实现接口的类必须提供接口中所有声明的方法的具体实现。接口用于定义对象的行为标准，而具体的行为实现则由实现该接口的类来完成。接口支持多继承，即一个类可以实现多个接口。

**数组 Array**
数组是一种容器对象，用于存储固定大小的同类型元素集合。数组中的每个元素可以通过索引访问，索引是从零开始的整数。数组属于引用类型，因为即使数组本身不是对象，它也通过引用被访问。当数组作为参数传递给方法时，实际上传递的是数组的引用而非数组的内容。

**类 Class**
类是面向对象编程的基本组成部分，它定义了一个对象的属性和行为。类是一种用户定义的数据类型，它可以包含字段（成员变量）、方法（成员函数）、构造函数以及其他类成员。当一个类的对象被创建时，分配给该对象的内存地址被保存在引用变量中。通过这个引用，可以访问和操作对象的状态和行为。

#### Data Type Conversion

Java 中的类型转换是指将一种数据类型转换成另一种数据类型。类型转换可以在不同的场景下发生，例如从基本数据类型到包装类的转换、从父类到子类的转换等。Java 中的类型转换可以分为自动类型转换（隐式转换）和强制类型转换（显式转换）两种。

- 自动类型转换（隐式转换）
  自动类型转换是指编译器自动将一种数据类型转换为另一种数据类型。这种情况通常发生在数值类型之间，当一个较小的数据类型赋值给一个较大的数据类型变量时。
- 强制类型转换（显式转换）
  强制类型转换是在程序员明确指示的情况下发生的类型转换。这通常用于将较大类型的数据转换为较小类型的数据，或者在类之间进行转换时。

##### 自动类型转换 Automatic Type Conversion

- 空间小的类型自动转化为大的类型,多种类型数据混合运算时，系统首先自动将所有数据换成容量最大的那种数据类型，然后再进行计算
  <img src="https://vluv-space.s3.bitiful.net/Java/java_se1/JavaⅠ-2024-09-14-18-18-55.webp" style="width:50%;" alt="自动转换示意图">
- 把精度大的数据类型赋值给精度小的数据类型时，就会报错

  ```java
  float d1 = n1 + 1.1; //右侧精度为double，float精度小于double，报错
  [ERROR] Type mismatch: cannot convert from double to float
  ```

- byte, short, char 三者可以计算，在计算时首先转换为 Int 类型

  ```java
  byte b = 1;
  char s = 'a';
  int x = b + s; //98
  byte c = 2 * b//错误，运算过程中byte转换为Int
  ```

- boolean 不参与转换

Note: long 类型的数据的 size 大于 float 型的。但实际上，float 表示的范围却是比 long 要大的。但将 long 类型转换为 float 类型同样会带来**精度损失**的问题。这是因为 float 类型只有有限的精度，而 long 类型可以表示更大的整数值。

具体可以查询 IEEE 754 floating point

##### 强制类型转换 Explicit Type Casting

```java
type foo = (type) value;
```

强制类型转换的限制

- 溢出：当将一个较大的数值转换为较小的数据类型时，可能会发生溢出。例如，将一个 long 类型的值转换为 int 类型时，如果 long 类型的值超出了 int 类型的范围，就会发生溢出。
- 精度损失：在进行浮点数之间的转换时，可能会发生精度损失。例如，将一个 double 类型的值转换为 float 类型时，如果 double 类型的值超出了 float 类型的精度范围，就会发生精度损失。

强制类型转换可能会隐藏潜在的类型不匹配问题，导致运行时错误或异常。因此，在使用强制类型转换时，需要格外小心并确保转换的安全性。在使用强制类型转换时，以下是一些最佳实践：

- 考虑使用包装类：对于可能发生溢出的数值类型，可以考虑使用包装类，它们能够自动处理溢出和精度问题。
- 文档和注释：在进行强制类型转换时，应该在代码中添加适当的文档和注释，说明转换的目的、范围和潜在问题。这样有助于其他开发人员理解代码并避免未来的错误或问题。
- 测试：在开发过程中，对使用强制类型转换的代码进行充分的测试是非常重要的。确保在不同的边界条件下测试代码，以捕获任何潜在的溢出、精度损失或其他问题。

##### 基本数据类型与 String 类型的转换

```java
//基本 => String
String s = x + ""; //x可为任意基本类型
String s = s1 + "" + s2 + s3; //字符串的拼接
//String => 基本
int num = Integer.parseInt(str);
double num = Double.parseDouble(str);
```

### Operator In Java

#### Arithmetic Operator

**算术运算符**：用于执行基本的数学运算，如加、减、乘、除和模运算（取余数）

- 加 Addition：+
- 减 Subtraction：-
- 乘 Multiplication：\*
- 除 Division：/
- 取余 Modulus：%

#### Relational Operator

**关系运算符**：用于比较两个值之间的关系，并返回一个布尔值

- 等于 Equal to：==
- 不等于 Not equal to：!=
- 大于 Greater than：>
- 小于 Less than：<
- 大于等于 Greater than or equal to：>=
- 小于等于 Less than or equal to：<=

#### Logical Operator

**逻辑运算符**：用于将多个关系表达式组合成一个更复杂的表达式，并返回一个布尔值（true 或 false）。

- 逻辑与 Logical AND：&
- 短路与 Conditional AND: &&
- 逻辑或 Logical OR：|
- 短路或 Contional OR: ||
- 逻辑非 Logical NOT：!
- 逻辑异或 Logical XOR: ^

> 短路与&& 与逻辑与&的区别：当符号左边为 false 时，不再执行右侧的运算
> 短路或|| 与逻辑或|的区别：当符号右边为 true 时，不在执行右侧的运算

实际开发中使用短路运算符，因为其效率更高

#### Bitwise Operators

**位运算符**：用于对二进制位进行操作，如按位与、按位或、按位异或等。移位操作符实际上支持的类型只有 int 和 long，编译器在对 short、byte、char 类型进行移位前，都会将其转换为 int 类型再操作

- 按位与 Bitwise AND：&
- 按位或 Bitwise OR：|
- 按位异或 Bitwise XOR：^
- 取反 Bitwise Complement：~
- 有符号左移(算术移位) Left Shift：<<
- 有符号右移(算术移位) Right Shift：>>
- 无符号右移(逻辑移位) Unsigned Right Shift：>>>

> 无符号右移 >>>: 最高位始终用 0 填充。
> 有符号右移 >>: 最高位保留，其余位用符号位填充。

#### Assignment Operators

**赋值运算符**：用于将一个值赋给一个变量。

- 简单赋值 Assignment：=
- 加法赋值 Add and assign：+=
- 减法赋值 Subtract and assign：-=
- 乘法赋值 Multiply and assign：\*=
- 除法赋值 Divide and assign：/=
- 取余数赋值 Modulus and assign：%=
- 左移赋值 Left shift and assign：<<=
- 右移赋值 Right shift and assign：>>=
- 按位与赋值 Bitwise AND and assign：&=
- 按位或赋值 Bitwise OR and assign：|=
- 按位异或赋值 Bitwise XOR and assign：^=

> tips:复合赋值运算符（例如 +=, -=, \*=, /= 等）会自动进行类型转换
>
> ```java
> byte b = 1;
> b++; // b = (byte)(b + 1);
> ```

#### Others

条件运算符/三目运算符 Conditional Operator/Ternary:

```java
//本质为if-else
x = condition ? expression1 : expression2;
```

`instanceof`：用于判断一个对象是否是一个类的实例。
`++`,`--`：用于对变量进行自增或自减操作。
`.`,`[]`：用于访问对象的属性或方法。

#### 运算细节

##### 整除 & 取余

```java
int 10 / 4; // 2
5 / 9; // 0
double 10 / 4;  // 2.0 (double)(10 / 4)
double 10.0 / 4; // 2.5
```

$$
\begin{align}
& 当a为整数时：a \%b = a - a / b * b \\
& 当a为小数时(结果是近似值)：a \%b = a - (int)a / b * b \\
& -10 \% 3 => -10 - (-10) / 3 * 3 = -1\\
& 10 \%-3 = 10 - 10 \ (-3) * (-3) = 1\\
& -10.5 \%3 = -10.5 - (-10)/3*3 = -1.5
\end{align}
$$

#### ++ & --

```java
当作为独立语句时，i++与++i等价，等价于i += 1;
int j = ++i; 先后执行 i += 1； j = i;
int j = i++; 先后执行 j = i; i += 1;
自增运算符解析：
    ++i的返回值为i + 1，参数i被修改为i + 1
    i++的返回值为i,参数i被修改为i + 1
int i = 1, j = 1;
//Arithmetic Exercise Of Java
i = i++; // return = i； i = i + 1; i = return;
j = ++j; // return = j + 1; j = j + 1; j = return;
System.out.println(i,j) // 1  2
```

#### 运算符优先级

| 优先级 | 运算符               | 结合性         |
| ------ | -------------------- | -------------- |
| 1      | ( )　[ ] 　.         | LR（从左到右） |
| 2      | ! 　~　 ++　 –       | RL（从右到左） |
| 3      | \* / %               | LR             |
| 4      | + -                  | LR             |
| 5      | << >> >>>            | LR             |
| 6      | < <= > >= instanceof | LR             |
| 7      | == !=                | LR             |
| 8      | &                    | LR             |
| 9      | ^                    | LR             |
| 10     | \|                   | LR             |
| 11     | &&                   | LR             |
| 12     | \|\|                 | LR             |
| 13     | ? :                  | LR             |
| 14     | = +=\*= ... ~= <<=   | RL             |
| 15     | ,                    | RL             |

括号级别最高，逗号级别最低
单目 > 算术 > 位移 > 关系 > 逻辑 > 三目 > 赋值

## Flow Control

### Branch Control

让程序有选择的执行，分为单分支，双分支，多分支

```java
// 单分支
if(condition) {
    <codeblock>
}
// 双分支
if (condition) {
    <codeblock>
} else {
    <codeblock>
}
// 多分支
if (condition) {
    <codeblock>
} else if (conditon) {
    <codeblock>
} else if(condition) {
    <codeblock>
} else {
    <codeblcok>
}
// 多分支
switch(condition){
    case 常量1:
        语句块1;
        break;
    case 常量2:
        语句块2;
        break;
    ...
    default:
        语句块3;
     break;
}

// 嵌套分支

if(条件1){
    if(条件2){
        执行代码1;
    }else{
        执行代码2;
    }
}else{
    执行代码;
}
```

Note:

1. 如果被执行的 case 没有 break 语句，则会有穿透现象：程序会顺序执行到 switch 结尾，或者在过程中遇到 break 退出 switch
2. 表达式的数据类型，应该和 case 后的常量类型一致，或者是可以自动转成可以相互比较的类型，比如输入的是字符，而 case 常量为 int
3. switch 中的表达式的返回值只能是：byte,short,int,char,enum,String
4. case 中的值只能是常量或常量表达式，不能是变量

```java
// 穿透现象的应用
Scanner myScanner = new Scanner(System.in);
System.out.println("输入月份");
int month = myScanner.nextInt();
switch(month) {
    case 3:
    case 4:
    case 5:
        System.out.println("春");
        break;
    ......
    default:
        ...
}
```

### Loop Control

让代码能够循环执行

```java
// for
for (循环变量初始化;循环条件;循环变量迭代) {
    循环操作;
}
// 增强for循环
int[] nums = {1, 2, 3}
for (int i : nums) {
    System.out.println(i);
}
语法 for (type var : vals) {}
// while
while (循环条件) {
    循环操作;
}
// do...while
do {
    循环体(语句);
    循环变量迭代;
}while(循环条件);
```

#### break & continue & return

1. break 语句出现在多层嵌套的语句块中，可以通过**标签**指明要终止的是哪一层语句块

   ```java
   label1:
   for(int i = 0; i < 4; i++){
   label2:
       for(int j = 0; j < 10; j++){
           if(i == 2){
               //break; 等价 break label2，退出label2循环
               break label1; //退出label1循环
           }
       }
   }
   ```

   - break 可以指定退出哪层
   - 实际开发中尽量不要使用标签
   - 如果没有指定 label，默认退出最近的循环体

2. continue 语句用于结束本次循环，继续执行下一次循环。当出现在多层嵌套的语句块中，可以通过**标签**指明要执行的是哪一层语句块
3. return 用于跳出所在方法，结束该方法的运行

## Ref

[JavaGuide](https://javaguide.cn/java/basis/)
