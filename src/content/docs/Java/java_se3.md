---
title: Java SE PART 3
date: 2023-08-20
excerpt: 记录 Java 枚举、异常;
categories: [Lang, Java]
tags: [Java]
---

## Enumeration

### 使用

通过自定义类实现

1. 构造器私有化
2. 本类内创建一组对象
3. 对外暴露对象，可以通过 `public final static`修饰符实现
4. 可以提供 get 方法，但是不要提供 set

```java
class Season {
    private String name;
    private String desc;
    //构造器私有化，防止New
    //去掉Set方法，防止属性被修改
    //在Season内部，直接创建固定的对象
    private Season(String name, String desc) {
        this.name = name;
        this.desc = desc;
    }

    public final static Season SPRING = new Season("春天","温暖");
    public final static Season WINTER = new Season("冬天","寒冷");
}

class Enumeration {
    public static void main(String[] args) {
        System.out.println(Season.SPRING);
    }
}
```

通过 `enum`关键字实现

- 常量写在最前面，用 `,`分隔，最后以 `;`结尾
- 如果调用无参构造器创建枚举对象，可以省略小括号

```java
enum Season {
    SPRING("Spring","Warm"),SUMMER("summer","hot"),AUTUMU("fall","cool"),WINTER("winter","cold");
    private String name;
    private String desc;
    private Season(String name, String desc) {
        this.name = name;
        this.desc = desc;
    }
}

class Enumeration {
    public static void main(String[] args) {
        System.out.println(Season.SPRING);
    }
}
```

```java
$ javap Season.class
Compiled from "Main.java"
final class Season extends java.lang.Enum<Season> {
  public static final Season SPRING;
  public static final Season SUMMER;
  java.lang.String name;
  java.lang.String desc;
  public static Season[] values();
  public static Season valueOf(java.lang.String);
  static {};
}
```

### Enumeration Method

```java
public class Main {
    public static void main(String[] args) {
        Season summer = Season.SUMMER;
        System.out.println(summer.name()); //SUMMER
        System.out.println(summer.ordinal()); //输出元素的下标，从0开始，此处输出1
        System.out.println(Season.SPRING.compareTo(Season.SUMMER));//SPRING下标 - SUMMER下标
        System.out.println("================================");
        System.out.println(Season.values()); //Season.values()返回Season的元素数组
        for (Season season : Season.values()) {
            System.out.println(season);
        }
        System.out.println(Season.valueOf("SPRING"));//如果有SPRING则返回SPRING,没有则报异常
    }
}
```

- 使用 `enum`关键字后，就不能继承其他类了，因为 `enum`隐式继承了 `Enum`，而 Java 是单继承机制
- 枚举类和普通类一样，可以实现接口，如下形式

  `enum 类名 implements Interface1,Interface2 {}`

```java
interface IPlaying {
    public void playing();
}

enum Music implements IPlaying {
    CLASSICALMUSIC;
    @Override
    public void playing() {
        System.out.println("Playing Music~");
    }
}
```

## 异常概述

在使用计算机语言进行项目开发的过程中，即使程序员把代码写得尽善尽美，在系统的运行过程中仍然会遇到一些问题，因为很多问题不是靠代码能够避免的，比如：客户输入数据的格式，读取文件是否存在，网络是否始终保持通畅等等。

程序运行时，发生的不被期望的事件，它阻止了程序按照程序员的预期正常执行，这就是异常（开发过程中的语法错误和逻辑错误不是异常）。

Java 程序在执行过程中所发生的异常事件可分为两类：

- Error：Java 虚拟机无法解决的严重问题。如：JVM 系统内部错误、资源耗尽等严重情况，一般不编写针对性的代码进行处理；比如：
  - StackOverflowError（栈溢出）
  - OOM（内存溢出）
- Exception: 其它因编程错误或偶然的外在因素导致的一般性问题，可以使用针对性的代码进行处理。例如：
  - 空指针访问
  - 试图读取不存在的文件
  - 网络连接中断
  - 数组角标越界

异常分为两大类：运行时异常和编译时异常.

- 运行时异常，编译器检查不出来。一般是指编程时的逻辑错误，是程序员应该避免其出现的异常；java.lang.RuntimeException 类及它的子类都是运行时异常
- 对于运行时异常，可以不作处理，因为这类异常很普遍，若全处理可能会对程序的可读性和运行效率产生影响
- 编译时异常，是编译器要求必须处置的异常。

<img src="https://vluv-space.s3.bitiful.net/Java/java_se3/java_se3-2024-10-01-23-31-26.webp" style="width:80%;" alt="">

## RuntimeException

- NullPointerException 空指针异常 空指针异常是最常见的异常之一，当对一个指向 null 的对象对象进行操作的时候就会报这个异常

  ```java
  String name = null;
  System.out.println(name);//null
  //System.out.println(name.length());//运行时出错，程序终止
  ```

- ArithmeticException 数学运算异常 例如一个数除以 0

  ```java
  int c = 10/0;
  ```

- ArrayIndexOutOfBoundsException 数组越界异常

  ```java
  int[] arr = {1,2,3};
  System.out.println(arr[2])；
  ```

- ClassCastException 类型转换异常

  ```java
  Object o = 23;
  //String s = (String) o;//运行时出错，程序终止
  ```

- NumberFormatException 数字转换异常

  ```java
  String number = "23";
  String number1= "23aabb";
  //Integer it = Integer.valueOf(number1);
  //System.out.println(it + 1)
  ```

## Exception

- IOException 输入输出异常,IOException 一般不会被具体的抛出，取而代之的是其子类，比如文件未找到异常，以到达文件尾异常等。我们假设在不存在的路径下读取一个文件，就会抛出文件不存在异常
- SQLException SQL 异常
- FileNotFoundException 文件不存在
- ClassNotFoundException 类不存在
- EOFException 操作文件，到文件末尾时发生异常
- IllegalArgumentException 参数异常

## CustomException

一般情况下，我们自定义异常是继承 RuntimeException 即把自定义异常做成 运行时异常，好处时，我们可以使用默认的处理机制

```java
class AgeException extends RuntimeException {
    public AgeException(String message) {
        super(message);
    }
}

public class CustomException {
    public static void main(String[] args) {
        int age = 80;
        if(!(age >= 18 && age <= 100)) {
            throw new AgeException("年龄需要在18-100之间");
        }
    }
}
```

## 异常处理

下面的列表是 Throwable 类的主要方法:

| Method                                       | Introduction                                                                                       |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `public String getMessage()`                 | 返回关于发生的异常的详细信息。这个消息在 `Throwable`类的构造函数中初始化了                         |
| `public Throwable getCasue()`                | 返回一个 Throwable 对象代表异常的原因                                                              |
| `public String toString()`                   | 返回此 Throwable 的简单描述                                                                        |
| `public void printStackTrace()`              | 将此 Throwable 及其回溯打印到标准错误流                                                            |
| `public StackTraceElement[] getStackTrace()` | 返回一个包含堆栈层次的数组。**下标为 0**的元素**代表栈顶**，最后一个元素代表方法调用堆栈的**栈底** |
| `public Throwable fillInStackTrace()`        | 用当前的调用栈层次填充 Throwable 对象栈层次，添加到栈层次任何先前信息中                            |

### try-catch

- 监视捕获异常，常用在方法内部，可以将方法内部出现的异常直接捕获处理
- 可以完成异常的处理，使程序继续往下执行
- catch 不能独立于 try 存在。
- 在 try/catch 后面添加 finally 块并**非强制性**要求的。
- **try 代码后不能既没 catch 块也没 finally 块**。
- try, catch, finally 块之间不能添加任何代码
- finally 先于 return，即如果 catch 中有 return，会先执行 finally 块中的代码，再执行 return;

  ```java
  try {
      int i = 0;
  }catch(Exception e) {
      return ++i;//会生成temp = ++i; temp = 1;然后执行fianlly；最后返回temp
  }fianlly {
      i = 10;
  }
  ```

```java
try{
   // 程序代码
}catch(异常类型1 异常的变量名1){
  // 程序代码
}catch(异常类型2 异常的变量名2){
  // 程序代码
}catch(异常类型3 异常的变量名3){
  // 程序代码
}
```

finally：要 try-catch 一起使用，用在后面，无论有什么异常发生，finally 都会被执行（可以运行清理类型等收尾善后性质的语句）

```java
public class test {
    public static void main(String[] args) {
        try {
            int a = 1/0;
        }catch (Exception e) {
            System.out.println(e);
        }finally {
            System.out.println("finally执行");
        }
    }
}
//java.lang.ArithmeticException: / by zero
//finally执行
```

应用 try-catch 输入一个整数

```java
import java.util.Scanner;

public class test {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int num;
        String inputStr = "";
        while(true) {
            System.out.println("请输入一个整数");
            inputStr = scanner.next();
            try {
                num = Integer.parseInt(inputStr);
                break;
            } catch (NumberFormatException e) {
                System.out.println("你输入的不是一个整数");
            }
        }
        System.out.println("你输入的num为" + num);
    }
}
```

## throws & throw

### throws

throws 用来在类中捕获异常信息，标明方法可能抛出的异常。说明该方法在运行的时候可能会出现这样的异常，在代码中一定要对相应的异常进行处理。一个方法还可以声明多个异常，用逗号隔开就行了

- 这里的异常是一个 FileNotFoundException 编译异常
- 使用前面讲过的 try-catch-finally
- 使用 throws ,抛出异常，让调用 f2 方法的调用者(方法)处理
- throws 后面的异常类型可以是方法中产生的异常类型，也可以是它的父类异常
- throws 关键字后也可以是 异常列表，即可以抛出多个异常

```java
public class Throws01 {
 public static void main(String[] args) {
  public void f2() throws FileNotFoundException,NulPointerException {
   FileInputStream fis = new FileInputStream("d://aa.txt");
        }
    }
}
```

- 对于编译异常，程序中必须处理，比如 try-catch 或者 throws
- 对于运行时异常，程序中如果没有处理，默认就是 throws 的方式处理

  ```java
  class Test{
   public f1() throws FileNotFoundException {
       FileInputStream fis = new FileInputStream("d://aa.txt");
   }
   public f2() throws ArithmeticException {
   }
   public f3() {
       f1() //error，f1抛出的是编译异常，要么throws，要么catch
    f2() //ok，f2抛出的是运行异常，不要求程序员显式处理，因为有默认处理机制
   }
  }
  ```

- 子类重写父类的方法时，对抛出异常的规定

  - 子类重写的方法，所抛出的异常类型和父类抛出的异常一致
  - 为父类抛出的异常的类型的子类型

    ```java
    class Father {
        public void method() throws RuntimeException{}
    }
    class Son {
        @Override
        public void method() throws ArithmeticException{}
    }
    ```

- 在 throws 过程中，如果有方法 try-catch，就相当于处理异常，就可以不必

### throw

当程序发生异常而无法处理的时候，会抛出对应的异常对象。在某些时刻可能会想要自行定义抛出异常，想要自行抛出异常，可以使用 throw 关键字，并生成指定的异常对象抛出。throw 是一个动作，是抛出异常。例如：throw new RuntimeException()，主动抛出异常。

```java
public class test {
    public static void main(String[] args) {
        try {
            int a = 1/0;
        }catch (Exception e) {
            System.out.println(e);
        }finally {
            System.out.println("finally执行");
        }
        if (true) {
            throw new RuntimeException("自定义的throw错误");
        }
    }
}
//    java.lang.ArithmeticException: / by zero
//    finally执行
//    Exception in thread "main" java.lang.RuntimeException: 自定义的throw错误
//    at com.xizhicheng.mybatis.test.main(test.java:15)

```

### throw vs throws

|        | 意义                     | 位置       | 后面跟的东西 |
| ------ | ------------------------ | ---------- | ------------ |
| throws | 异常处理的一种方式       | 方法声明处 | 异常类型     |
| throw  | 手动生成异常对象的关键词 | 方法体中   | 异常对象     |
