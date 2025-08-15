---
title: Java SE PART 4
hide: false
date: 2023-08-22 20:28:34
excerpt: Java IO相关知识的学习笔记，学习资料包括JavaGuide，Java全栈知识体系等
categories: [Lang, Java]
tags: [Java]
---

## Java.IO

### Java IO Intro

IO 表示 `Input/Output`，意为输入和输出，具体概念可以参考[简书-程序员应该这样理解 IO](https://www.jianshu.com/p/fa7bdc4f3de7)

{% message color:primary "title: Stream"%}

A **stream** is a sequence of data. [**I/O Stream**](https://www.geeksforgeeks.org/java-io-input-output-in-java-with-examples/) refers to a stream that is unlikely a method to sequentially access a file. I/O Stream means an input source or output destination representing different types of sources e.g. disk files. The java.io package provides classes that allow you to convert between Unicode character streams and byte streams of non-Unicode text

- **InputSteam** read data from source
- **OutputStream** writes Data to a destination

{% endmessage %}

### Classification

<img src="https://vluv-space.s3.bitiful.net/Java/java_se4/1730958199068.webp" alt="" style="width: 80%"/>

|                  | Byte Based             |                         | Character Based    |                   |
| ---------------- | ---------------------- | ----------------------- | ------------------ | ----------------- |
|                  | Input                  | Output                  | Input              | Output            |
| Abstract Class   | `InputStream`          | `OutputStream`          | `Reader`           | `Writer`          |
| Arrays           | `ByteArrayInputStream` | `ByteArrayOutputStream` | `CharArrayReader`  | `CharArrayWriter` |
| Files            | `FileInputStream`      | `FileOutputStream`      | `FileReader`       | `FileWriter`      |
|                  | `RandomAccessFile`     | `RandomAccessFile`      |                    |                   |
| Pipes            | `PipedInputStream`     | `PipedOutputStream`     | `PipedReader`      | `PipedWriter`     |
| Buffering        | `BufferedInputStream`  | `BufferedOutputStream`  | `BufferedReader`   | `BufferedWriter`  |
| Filtering        | `FilterInputStream`    | `FilterOutputStream`    | `FilterReader`     | `FilterWriter`    |
| Parsing          | `PushbackInputStream`  |                         | `PushbackReader`   |                   |
|                  | `StreamTokenizer`      |                         | `LineNumberReader` |                   |
| Strings          |                        |                         | `StringReader`     | `StringWriter`    |
| Data             | `DataInputStream`      | `DataOutputStream`      |                    |                   |
| Data - Formatted |                        | `PrintStream`           |                    | `PrintWriter`     |
| Objects          | `ObjectInputStream`    | `ObjectOutputStream`    |                    |                   |
| Utilities        | `SequenceInputStream`  |                         |                    |                   |

![Class Hierarchy](https://vluv-space.s3.bitiful.net/Java/java_se4/1730962912348.webp)

## ByteStream

在 Java 中，`InputStream`和`OutputStream`是用于处理字节流输入和输出的抽象类，它们分别表示输入流和输出流。字节流是处理原始字节数据（如图片、音频文件等）的基础

### InputStream Methods

`InputStream`就是 Java 标准库提供的最基本的输入流。它位于 `java.io`这个包里，`InputStream`是一个抽象类，它是所有输入流的超类。

- `read()`：返回输入流中下一个字节的数据。返回的值介于 0 到 255 之间。如果未读取任何字节，则代码返回 `-1` ，表示文件结束。
- `read(byte b[ ])` : 从输入流中读取一些字节存储到数组 `b` 中。如果数组 `b` 的长度为零，则不读取。如果没有可用字节读取，返回 `-1`。如果有可用字节读取，则最多读取的字节数最多等于 `b.length` ， 返回读取的字节数。这个方法等价于 `read(b, 0, b.length)`。
- `read(byte b[], int off, int len)`：在 `read(byte b[ ])` 方法的基础上增加了 `off` 参数（偏移量）和 `len` 参数（要读取的最大字节数）。
- `skip(long n)`：忽略输入流中的 n 个字节 ,返回实际忽略的字节数。
- `available()`：返回输入流中可以读取的字节数。
- `close()`：关闭输入流释放相关的系统资源。

从 Java 9 开始，`InputStream` 新增加了多个实用的方法：

- `readAllBytes()`：读取输入流中的所有字节，返回字节数组。
- `readNBytes(byte[] b, int off, int len)`：阻塞直到读取 `len` 个字节。
- `transferTo(OutputStream out)`：将所有字节从一个输入流传递到一个输出流。

### OutputStream Methods

`OutputStream`用于将数据（字节信息）写入到目的地（通常是文件），`java.io.OutputStream`抽象类是所有字节输出流的父类。

- `write(int b)`：将特定字节写入输出流。虽然传入的是 `int`参数，但只会写入一个字节，即只写入 `int`最低 8 位表示字节的部分，相当于 `b & 0xff`
- `write(byte b[ ])` : 将数组 `b` 写入到输出流，等价于 `write(b, 0, b.length)` 。
- `write(byte[] b, int off, int len)` : 在 `write(byte b[ ])` 方法的基础上增加了 `off` 参数（偏移量）和 `len` 参数（要读取的最大字节数）。
- `flush()`：它的作用是将缓冲区中的数据强制写入目标设备或输出流，而不是等待缓冲区满或流关闭时自动写入。这对于确保及时输出数据非常关键。
- `close()`：关闭输出流释放相关的系统资源。

{% message color:primary "title: flush"%}

为什么引入`flush()`方法？

性能优化：为了提高性能，Java 的流通常使用缓冲区来临时存储数据。数据并不是每次写入流时就立刻输出，而是被缓存在内存中，等到一定条件（如缓冲区满）才一起写入。flush() 允许程序员控制何时将缓冲区的内容强制写入目标。

数据一致性：在一些场景下，如网络通信或日志记录时，开发者可能需要确保数据即时写入，而不是等待缓冲区满。调用 flush() 可以确保数据及时被发送到目标设备，避免丢失或延迟。

关闭流前的清理：通常，在流关闭之前会自动调用 flush()，但在某些特殊情况下，调用 flush() 可以更好地控制何时刷新流中的数据。

```java
BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("file.txt"));
bos.write("Hello".getBytes());
bos.flush();  // 强制刷新缓冲区，立即写入文件
bos.close();  // 关闭流
```

{% endmessage %}

## CharacterStream

> In Java, characters are stored using [Unicode conventions](https://docs.oracle.com/javase/tutorial/java/data/characters.html). Character stream automatically allows us to read/write data character by character. For example, FileReader and FileWriter are character streams used to read from the source and write to the destination

### Reader Methods

`Reader`是 Java 的 IO 库提供的另一个输入流接口。和 `InputStream`的区别是，`InputStream`是一个字节流，即以 `byte`为单位读取，而 `Reader`是一个字符流，即以 `char`为单位读取：

| InputStream                         | Reader                                |
| :---------------------------------- | :------------------------------------ |
| 字节流，以 `byte`为单位             | 字符流，以 `char`为单位               |
| 读取字节（-1，0~255）：`int read()` | 读取字符（-1，0~65535）：`int read()` |
| 读到字节数组：`int read(byte[] b)`  | 读到字符数组：`int read(char[] c)`    |

- `read()` : 从输入流读取一个字符。
- `read(char[] cbuf)` : 从输入流中读取一些字符，并将它们存储到字符数组 `cbuf`中，等价于 `read(cbuf, 0, cbuf.length)` 。
- `read(char[] cbuf, int off, int len)`：在 `read(char[] cbuf)` 方法的基础上增加了 `off` 参数（偏移量）和 `len` 参数（要读取的最大字符数）。
- `skip(long n)`：忽略输入流中的 n 个字符 ,返回实际忽略的字符数。
- `close()` : 关闭输入流并释放相关的系统资源。

```java
public void readFile() throws IOException {
 try (Reader reader = new FileReader("src/readme.txt", StandardCharsets.UTF_8)) {
  char[] buffer = new char[1000];
  int n;
  while ((n = reader.read(buffer)) != -1) {
   System.out.println("read " + n + " chars.");
  }
 }
}
```

### Writer Methods

`Reader`是带编码转换器的 `InputStream`，它把 `byte`转换为 `char`，而 `Writer`就是带编码转换器的 `OutputStream`，它把 `char`转换为 `byte`并输出。

| OutputStream                           | Writer                                   |
| :------------------------------------- | :--------------------------------------- |
| 字节流，以 `byte`为单位                | 字符流，以 `char`为单位                  |
| 写入字节（0~255）：`void write(int b)` | 写入字符（0~65535）：`void write(int c)` |
| 写入字节数组：`void write(byte[] b)`   | 写入字符数组：`void write(char[] c)`     |
| 写入 String: 无对应方法                | 写入 String：`void write(String s)`      |

- `write(int c)` : 写入单个字符。
- `write(char[] cbuf)`：写入字符数组 `cbuf`，等价于 `write(cbuf, 0, cbuf.length)`。
- `write(char[] cbuf, int off, int len)`：在 `write(char[] cbuf)` 方法的基础上增加了 `off` 参数（偏移量）和 `len` 参数（要读取的最大字符数）。
- `write(String str)`：写入字符串，等价于 `write(str, 0, str.length())` 。
- `write(String str, int off, int len)`：在 `write(String str)` 方法的基础上增加了 `off` 参数（偏移量）和 `len` 参数（要读取的最大字符数）。
- `append(CharSequence csq)`：将指定的字符序列附加到指定的 `Writer` 对象并返回该 `Writer` 对象。
- `append(char c)`：将指定的字符附加到指定的 `Writer` 对象并返回该 `Writer` 对象。
- `flush()`：刷新此输出流并强制写出所有缓冲的输出字符。
- `close()`:关闭输出流释放相关的系统资源。

```java
try (Writer writer = new FileWriter("readme.txt", StandardCharsets.UTF_8)) {
 writer.write('H'); // 写入单个字符
 writer.write("Hello".toCharArray()); // 写入char[]
 writer.write("Hello"); // 写入String
}
```

{% message color:primary "title:`Reader/Writer`和 `Input/OutputStream`有什么关系？"%}

除了特殊的 `CharArrayReader`和 `StringReader`，普通的 `Reader`实际上是基于 `InputStream`构造的

`Reader`需要从 `InputStream`中读入字节流`byte`，然后根据编码设置转换为 `char`。如果我们查看 `FileReader`的源码，它在内部实际上持有一个 `FileInputStream`。

既然 `Reader`本质上是一个基于 `InputStream`的 `byte`到 `char`的转换器，那么，如果我们已经有一个 `InputStream`，想把它转换为 `Reader`，是完全可行的。`InputStreamReader`就是这样一个转换器，它可以把任何 `InputStream`转换为 `Reader`。示例代码如下：

```java
try (Reader reader = new InputStreamReader(new FileInputStream("src/readme.txt"), "UTF-8")) {
 // code
}
```

而普通的 Writer 实际上是基于 `OutputStream`构造的，它接收 `char`，然后在内部自动转换成一个或多个 `byte`，并写入 `OutputStream`。因此，`OutputStreamWriter`就是一个将任意的 `OutputStream`转换为 `Writer`的转换器：

```java
try (Writer writer = new OutputStreamWriter(new FileOutputStream("readme.txt"), "UTF-8")) {
 // code
}
```

{% endmessage %}

## Buffering

缓冲是指通过在内存中暂时存储数据来优化 I/O 操作的性能。Java 中的缓冲通常是通过缓冲流（Buffered Streams）来实现的。缓冲的主要目的是通过将数据加载至缓冲区，一次性读取/写入多个字节，**避免频繁的 I/O 操作**，从而提高性能，尤其是在处理大文件或高频繁数据读写时。

读写时机 👇

- 写入：当缓冲区已满或程序里调用 flush 方法时，它才会将数据写入实际的输出目标设备（如磁盘文件、网络等）
- 读取：缓冲区会提前从输入源（如文件、网络流）读取一定数量的数据，直到缓冲区的数据被消耗完，才会重新从源读取数据。

```java
BufferedOutputStream bos = new BufferedOutputStream(new FileOutputStream("test.txt"));
bos.write(new byte[] {66, 67, 68, 69}); // 写入字符 'B', 'C', 'D', 'E'
bos.flush(); // 强制刷新缓冲区，写入文件

BufferedInputStream bis = new BufferedInputStream(new FileInputStream("test.txt"));
int data = bis.read();
```

内部实现 👇

```java
// `BufferedInputStream` 内部维护了一个缓冲区，这个缓冲区实际就是一个字节数组，源码如下
public class BufferedInputStream extends FilterInputStream {
 // 内部缓冲区数组
 protected volatile byte buf[];
 // 缓冲区的默认大小,8KB
 private static int DEFAULT_BUFFER_SIZE = 8192;
 // 使用默认的缓冲区大小
 public BufferedInputStream(InputStream in) {
  this(in, DEFAULT_BUFFER_SIZE);
 }
 // 自定义缓冲区大小
 public BufferedInputStream(InputStream in, int size) {
  super(in);
  if (size <= 0) {
   throw new IllegalArgumentException("Buffer size <= 0");
  }
  buf = new byte[size];
 }
}
```

**缓冲机制为什么会提高性能**

减少 IO 操作次数: I/O 操作（无论是文件操作、网络通信还是磁盘访问）通常比内存操作要慢得多。每次进行 I/O 操作时，涉及的系统调用、硬盘读写、网络延迟等都会消耗大量时间。

- 每次 I/O 操作都会涉及到系统调用，这会消耗宝贵的 CPU 时间。比如用户态与内核态的切换、中断处理、内核锁的竞争、数据复制、上下文切换等等
  > I/O 系统调用的开销来自多个方面，其中每个方面都可能影响 I/O 的整体性能。为了减少这些开销，现代操作系统和编程语言会使用缓冲区（buffering）、异步 I/O、非阻塞 I/O 等优化技术，从而提高系统性能

## NIO

Java NIO（New Input/Output）是 Java 1.4 中引入的一组新的 I/O API，相比传统的 I/O（即 Java IO）具有更高效的性能。Java NIO 主要用于构建高性能、可伸缩的网络应用程序，特别适合处理大量并发连接。NIO 通过以下核心特性提供了更灵活的 I/O 处理方式：

1. 非阻塞模式
   Java NIO 支持非阻塞 I/O 操作，即一个线程可以同时处理多个连接而不被某个特定 I/O 操作阻塞。对于网络编程中的高并发场景，非阻塞模式允许程序不必等待 I/O 操作完成，可以立即执行其他任务，提高了应用程序的响应速度。

2. Channel 和 Buffer
   Channel：Channel 类似于传统 I/O 中的流，但与流不同的是，Channel 是双向的，可以同时用于读取和写入数据。
   Buffer：Buffer 是一个容器，用于临时存储数据。数据从 Channel 读取到 Buffer，或者从 Buffer 写入到 Channel。Buffer 不仅简化了数据管理，还允许我们直接操作数据，提高了 I/O 性能。
3. Selector（选择器）
   Selector 是 NIO 中的关键组件，允许一个单独的线程监控多个 Channel 的状态。通过 Selector，一个线程可以管理多个 Channel，利用非阻塞 I/O 来轮询多个连接，提高并发能力。Selector 通过选择“就绪”的 Channel 来执行后续操作，适合处理大量并发连接的网络服务程序。

4. 零拷贝（Zero Copy）
   NIO 通过直接缓冲区（Direct Buffer）实现了零拷贝。Direct Buffer 在物理内存中分配，不经过 JVM 堆，因此数据可以直接在硬件设备（如磁盘、网络）与内存之间传输，减少了复制次数和用户态/内核态的切换，提高了 I/O 性能。

5. 内存映射文件（Memory-Mapped File）
   NIO 提供了内存映射文件（Memory-Mapped File）功能，可以将文件的一部分映射到内存中，支持快速随机访问。对于大文件的处理，内存映射文件特别有效，可以直接在内存中访问文件数据，且不需要传统 I/O 的频繁系统调用。

6. NIO 与 NIO.2 扩展
   Java 7 引入了 NIO.2（java.nio.file 包），进一步扩展了 NIO。NIO.2 提供了更便捷的文件系统操作 API（例如异步文件 I/O、文件监听等），使得文件操作更加方便和高效。它还增强了异常处理、路径操作等功能。
