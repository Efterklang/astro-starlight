---
title: Java SE Annotation
hide: false
date: 2023-08-20 18:28:34
excerpt: Java Annotation;
categories: [Lang, Java]
tags: [Java]
---

## Annotation

注解 Annotation 也成为元数据 Metadata，用于修饰解释 `package,class,method,属性，constructor,局部变量`等数据信息

和注释一样，注解不影响程序逻辑，但注解可以被编译或运行，相当于嵌入在代码中的补充信息

在 JavaSE 中，注解的使用目的比较简单，例如标记过时的功能，忽略警告等。在 JavaEE 中占据了更重要的角色，例如用来配置应用程序的任何切面，代替 JavaEE 旧版中所遗留的繁冗代码和 XML 配置等

```java
@Override 限定某个方法，是重写父类方法，该注解只能用于方法;
@Deprecated 用于表示某个程序元素(类，方法等)已过时;
@SuppressWarnings:抑制编译器警告等
```

```java
@SupressWarnings
unchecked 忽略没有检查的警告
rawtypes 没有指定泛型
unused 某个变量没有被使用过
```

修饰注解的注解称为元注解

```java
@Target 指定注解在哪些位置使用
@Doucmented 指定该注解是否会在javadoc体现
@Inherited 子类会继承父类注解
@Retention 指定注解的作用范围SOURCE,CLASS,RUNTIME
```

## 注解

### 概念

注解：类的组成部分，可以给类携带一些额外的信息，提供一种安全的类似注释标记的机制，用来将任何信息或元数据（metadata）与程序元素（类、方法、成员变量等）进行关联

* 注解是给编译器或 JVM 看的，编译器或 JVM 可以根据注解来完成对应的功能
* 注解类似修饰符，应用于包、类型、构造方法、方法、成员变量、参数及本地变量的声明语句中
* **父类中的注解是不能被子类继承的**

注解作用：

* 标记
* 框架技术多半都是在使用注解和反射，都是属于框架的底层基础技术
* 在编译时进行格式检查，比如方法重写约束 @Override、函数式接口约束 @FunctionalInterface.

***

### 注解格式

定义格式：自定义注解用 @interface 关键字，注解默认可以标记很多地方

```java
修饰符 @interface 注解名{
     // 注解属性
}
```

使用注解的格式：@注解名

```java
@Book
@MyTest
public class MyBook {
    //方法变量都可以注解
}

@interface Book{
}
@interface MyTest{
}
```

***

### 注解属性

#### 普通属性

注解可以有属性，**属性名必须带 ()**，在用注解的时候，属性必须赋值，除非属性有默认值

属性的格式：

* 格式 1：数据类型 属性名()
* 格式 2：数据类型 属性名() default 默认值

属性适用的数据类型:

* 八种数据数据类型（int，short，long，double，byte，char，boolean，float）和 String、Class
* 以上类型的数组形式都支持

```java
@MyBook(name="《精通Java基础》",authors = {"播仔","Dlei","播妞"} , price = 99.9 )
public class AnnotationDemo01 {
    @MyBook(name="《精通MySQL数据库入门到删库跑路》",authors = {"小白","小黑"} ,
          price = 19.9 , address = "北京")
    public static void main(String[] args) {
    }
}
// 自定义一个注解
@interface MyBook{
    String name();
    String[] authors(); // 数组
    double price();
    String address() default "武汉";
}

```

***

#### 特殊属性

注解的特殊属性名称：value

* 如果只有一个 value 属性的情况下，使用 value 属性的时候可以省略 value 名称不写
* 如果有多个属性，且多个属性没有默认值，那么 value 是不能省略的

```java
//@Book("/deleteBook.action")
@Book(value = "/deleteBook.action" , age = 12)
public class AnnotationDemo01{
}

@interface Book{
    String value();
    int age() default 10;
}
```

***

### 元注解

元注解是 sun 公司提供的，用来注解自定义注解

元注解有四个：

* @Target：约束自定义注解可以标记的范围，默认值为任何元素，表示该注解用于什么地方，可用值定义在 ElementType 类中：

  * `ElementType.CONSTRUCTOR`：用于描述构造器
  * `ElementType.FIELD`：成员变量、对象、属性（包括 enum 实例）
  * `ElementType.LOCAL_VARIABLE`：用于描述局部变量
  * `ElementType.METHOD`：用于描述方法
  * `ElementType.PACKAGE`：用于描述包
  * `ElementType.PARAMETER`：用于描述参数
  * `ElementType.TYPE`：用于描述类、接口（包括注解类型）或 enum 声明
  
* @Retention：定义该注解的生命周期，申明注解的作用范围：编译时，运行时，可使用的值定义在 RetentionPolicy 枚举类中：

  * `RetentionPolicy.SOURCE`：在编译阶段丢弃，这些注解在编译结束之后就不再有任何意义，只作用在源码阶段，生成的字节码文件中不存在，`@Override`、`@SuppressWarnings` 都属于这类注解
  * `RetentionPolicy.CLASS`：在类加载时丢弃，在字节码文件的处理中有用，运行阶段不存在，默认值
  * `RetentionPolicy.RUNTIME` : 始终不会丢弃，运行期也保留该注解，因此可以使用反射机制读取该注解的信息，自定义的注解通常使用这种方式
  
* @Inherited：表示修饰的自定义注解可以被子类继承

* @Documented：表示是否将自定义的注解信息添加在 Java 文档中

```java
public class AnnotationDemo01{
    // @MyTest // 只能注解方法
    private String name;

    @MyTest
    public static void main( String[] args) {
    }
}
@Target(ElementType.METHOD) // 申明只能注解方法
@Retention(RetentionPolicy.RUNTIME) // 申明注解从写代码一直到运行还在，永远存活！！
@interface MyTest{
}
```

***

### 注解解析

开发中经常要知道一个类的成分上面到底有哪些注解，注解有哪些属性数据，这都需要进行注解的解析

注解解析相关的接口：

* Annotation：注解类型，该类是所有注解的父类，注解都是一个 Annotation 的对象
* AnnotatedElement：该接口定义了与注解解析相关的方法
* Class、Method、Field、Constructor 类成分：实现 AnnotatedElement 接口，拥有解析注解的能力

Class 类 API ：

* `Annotation[] getDeclaredAnnotations()`：获得当前对象上使用的所有注解，返回注解数组
* `T getDeclaredAnnotation(Class<T> annotationClass)`：根据注解类型获得对应注解对象
* `T getAnnotation(Class<T> annotationClass)`：根据注解类型获得对应注解对象
* `boolean isAnnotationPresent(Class<Annotation> class)`：判断对象是否使用了指定的注解
* `boolean isAnnotation()`：此 Class 对象是否表示注释类型

注解原理：注解本质是**特殊接口**，继承了 `Annotation` ，其具体实现类是 Java 运行时生成的**动态代理类**，通过反射获取注解时，返回的是运行时生成的动态代理对象 `$Proxy1`，通过代理对象调用自定义注解（接口）的方法，回调 `AnnotationInvocationHandler` 的 `invoke` 方法，该方法会从 `memberValues`  这个 Map 中找出对应的值，而 `memberValues` 的来源是 Java 常量池

解析注解数据的原理：注解在哪个成分上，就先拿哪个成分对象，比如注解作用在类上，则要该类的 Class 对象，再来拿上面的注解

```java
public class AnnotationDemo{
    @Test
    public void parseClass() {
        // 1.定位Class类对象
        Class c = BookStore.class;
        // 2.判断这个类上是否使用了某个注解
        if(c.isAnnotationPresent(Book.class)){
            // 3.获取这个注解对象
            Book b = (Book)c.getDeclarAnnotation(Book.class);
            System.out.println(book.value());
            System.out.println(book.price());
            System.out.println(Arrays.toString(book.authors()));
        }
    }
    @Test
    public void parseMethod() throws Exception {
        Class c = BookStore.class;
        Method run = c.getDeclaredMethod("run");
        if(run.isAnnotationPresent(Book.class)){
            Book b = (Book)run.getDeclaredAnnotation(Book.class);
            sout(上面的三个);
        }
    }
}

@Book(value = "《Java基础到精通》", price = 99.5, authors = {"张三","李四"})
class BookStore{
    @Book(value = "《Mybatis持久层框架》", price = 199.5, authors = {"王五","小六"})
    public void run(){
    }
}
@Target({ElementType.TYPE,ElementType.METHOD}) // 类和成员方法上使用
@Retention(RetentionPolicy.RUNTIME) // 注解永久存活
@interface Book{
    String value();
    double price() default 100;
    String[] authors();
}
```

****

## 10.2 注解(Annotation)

### 10.2.1 注解的概述

从 JDK 5.0 开始， Java 增加了对元数据 (`MetaData`) 的支持，也就是Annotation( 注解 )。

Annotation 其实就是代码里的特殊标记，这些标记可以在**编译，类加载，运行时**被读取，并执行相应的处理。通过使用 Annotation，程序员可以在不改变原有逻辑的情况下，在源文件中嵌入一些补充信息。代码分析工具、开发工具和部署工具可以通过这些补充信息进行验证或者进行部署。

Annotation 可以像修饰符一样被使用，可用于修饰包、类、构造器、方法、成员变量、参数、局部变量的声明，这些信息被保存在 Annotation 的`“name=value”` 对中。

在 JavaSE 中，注解的使用目的比较简单，例如标记过时的功能，忽略警告等。在 JavaEE/Android 中注解占据了更重要的角色，例如用来**<u>配置应用程序的任何切面</u>**，代替 JavaEE 旧版中所遗留的繁冗代码和 XML 配置等。

未来的开发模式都是基于注解的，JPA 是基于注解的，Spring2.5 以上都是基于注解的，Hibernate3.x 以后也是基于注解的，现在的 Struts2 有一部分也是基于注解的了，注解是一种趋势，一定程度上可以说：==框架 = 注解 +反射 + 设计模式==。  

### 10.2.2 Annotation的使用示例

使用 Annotation 时要在其前面增加 @ 符号 , 并把该 Annotation 当成一个修饰符使用。用于修饰它支持的程序元素

* 示例一：生成文档相关的注解
  * @author 标明开发该类模块的作者，多个作者之间使用 `,` 分割；
  * @version 标明该类模块的版本；
  * @see 参考转向，也就是相关主题；
  * @since 从哪个版本开始增加的；
  * @param 对方法中某参数的说明，如果没有参数就不能写；
  * @return 对方法返回值的说明，如果方法的返回值类型是 void 就不能写；
  * @exception 对方法可能抛出的异常进行说明，如果方法没有用 throws显式抛出的异常就不能写其中；
  * @param @return 和 @exception 这三个标记都是只用于方法的；
  * @param 的格式要求：@param 形参名形参类型形参说明；
  * @return 的格式要求：@return 返回值类型返回值说明；
  * @exception 的格式要求：@exception 异常类型异常说明；
  * @param 和 @exception 可以并列多个。
* 示例二：在编译时进行格式检查 (JDK 内置的三个基本注解 )
  * @Override：限定重写父类方法 , 该注解只能用于方法，
  * @Deprecated：用于表示所修饰的元素 ( 类，方法等 ) 已过时。通常是因为所修饰的结构危险或存在更好的选择；
  * @SuppressWarnings：抑制编译器警告。
* 示例三：跟踪代码依赖性，实现替代配置文件功能
  * Servlet3.0 提供了注解 (annotation)，使得不再需要在 web.xml 文件中进行 Servlet 的部署；
  * spring 框架中关于“事务”的管理。  

```java
import java.util.ArrayList;
import java.util.Date;

public class AnnotationTest {
    public static void main(String[] args) {
        Person p = new Student();
        p.walk();
        Date date = new Date(2020, 10, 11);
        System.out.println(date);
        @SuppressWarnings("unused")
        int num = 10;
        // System.out.println(num);
        @SuppressWarnings({"unused", "rawtypes"})
        ArrayList list = new ArrayList();
    }
}

class Person {
    private String name;
    private int age;

    public Person() {
        super();
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void walk() {
        System.out.println(" 学习中……");
    }

    public void eat() {
        System.out.println(" 摸鱼中……");
    }
}

interface Info {
    void show();
}

class Student extends Person implements Info {
    @Override
    public void walk() {
        System.out.println(" 喷子走开 ");
    }

    @Override
    public void show() {
    }
}
```

### 10.2.3 如何自定义注解

* 定义新的 Annotation 类型使用 **`@interface`** 关键字。

* 自定义注解自动继承了 **java.lang.annotation.Annotation** 接口。

* Annotation 的成员变量在 Annotation 定义中以无参数方法的形式来声明。其方法名和返回值定义了该成员的名字和类型。我们称为配置参数。类型只能是八种基本数据类型、String 类型、Class 类型、enum 类型、Annotation 类型、以上所有类型的数组。

* 可以在定义 Annotation 的成员变量时为其指定初始值，指定成员变量的初始值可使用 **default** 关键字。

* 如果只有一个参数成员，建议使用参数名为 value。

* 如果定义的注解含有配置参数，那么使用时必须指定参数值，除非它有默认值。格式是“参数名 = 参数值”，如果只有一个参数成员，且名称为 value，可以省略“value=”。

* 没有成员定义的 Annotation 称为标记；包含成员变量的 Annotation称为元数据 Annotation。

  **<u>注意：自定义注解必须配上注解的信息处理流程才有意义。</u>**

### 10.2.4 jdk中4个基本的元注解的使用

JDK 的元 Annotation 用于修饰其他 Annotation 定义。

JDK5.0 提供了 4 个标准的meta-annotation类型，分别是：

* Retention
* Target
* Documented
* Inherited

Retention: 指定所修饰的 Annotation 的生命周期：`SOURCE\CLASS`（默认行为）\`RUNTIME` 只有声明为 RUNTIME 生命周期的注解，才能通过反射获取。

Target: 用于指定被修饰的 Annotation 能用于修饰哪些程序元素。(出现的频率较低)

Documented: 表示所修饰的注解在被 javadoc 解析时，保留下来。

Inherited: 被它修饰的 Annotation 将具有继承性  

```java
import org.testng.annotations.Test;

import java.lang.annotation.*;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.ElementType.TYPE_USE;

public class AnnotationTest {
    @Test
    public void testGetAnnotation() {
        Class clazz = Student.class;
        Annotation[] annotations = clazz.getAnnotations();
        for (Annotation annotation : annotations) {
            System.out.println(annotation);
        }
    }
}

@MyAnnotation(value = "hello")
class Person {
    private String name;
    private int age;

    public Person() {
        super();
    }

    @MyAnnotation
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @MyAnnotation
    public void walk() {
        System.out.println(" 学习中……");
    }

    public void eat() {
        System.out.println(" 摸鱼中……");
    }
}

interface Info {
    void show();
}

class Student extends Person implements Info {
    @Override
    public void walk() {
        System.out.println(" 喷子走开 ");
    }

    @Override
    public void show() {
    }
}

@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR,
        LOCAL_VARIABLE, TYPE_PARAMETER, TYPE_USE})
@interface MyAnnotation {
    String value() default "book";
}
```

### 10.2.5 利用反射获取注解信息

JDK 5.0 在 `java.lang.reflect` 包下新增了 `AnnotatedElement` 接口，该接口代表程序中可以接受注解的程序元素；

当一个`Annotation` 类型被定义为运行时`Annotation` 后，该注解才是运行时可见，当class 文件被载入时保存在class 文件中的Annotation才会被虚拟机读取；

程序可以调用 AnnotatedElement 对象的如下方法来访问 Annotation 信息；

### 10.2.6 jdk8新特性：可重复注解/类型注解

Java 8 对注解处理提供了两点改进：可重复的注解及可用于类型的注解。此外，反射也得到了加强，在 Java8 中能够得到方法参数的名称。这会简化标注在方法参数上的注解 。
