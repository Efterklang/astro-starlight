---
title: Java SE PART 2
date: 2023-08-19
excerpt: 记录 Java OOP;
categories: [Lang, Java]
tags: [Java]
---

## OOP

**面向过程编程（Procedural Programming）**是一种更传统的编程方式，它强调的是功能的行为。分析解决问题的步骤，将复杂的任务分解为一系列的过程或函数。这种编程模式主要关注于如何解决问题，通常通过以下方式实现：

- 模块化：将程序划分为多个独立的功能模块或函数。
- 顺序执行：按照预定的顺序执行各个过程或函数以完成特定任务。
- 面向过程编程简化了问题解决的步骤，使程序结构清晰，易于理解和调试。然而，在处理大规模系统时，可能会导致代码重复和难以维护的问题。

**面向对象编程（Object Oriented Programming）**是一种编程范式，指将构成问题的事务分解成各个对象，而建立对象的目的也不是为了完成一个个步骤，而是为了描述某个事物在解决整个问题的过程中所发生的行为。面向对象有封装、继承、多态的特性，所以易维护、易复用、易扩展。可以设计出低耦合的系统。 但是性能上来说，比面向过程要低。

- 封装：将数据和方法组织在一个类中，隐藏内部实现细节，只暴露必要的接口。
- 继承：允许创建一个新类继承现有类的属性和方法，从而支持代码复用。
- 多态：同一操作作用于不同的对象可以有不同的解释，并产生不同的执行结果

### Class

五大成员

- 属性 property
- 方法 method
- 构造器 constructor
- 代码块 codeblock
- 内部类 inner class

类是构造对象的模板，由类构造(construct)对象的过程称为创建类的实例(instance)

> a class is a template for objects, and an object is an instance of a class.

```java
class Person {} // 声明一个类
Person mike = new Person(); // Person类的实例
```

#### 属性/成员变量 Property

1. 属性的定义语法同变量，示例 `访问修饰符 属性类型 属性名`;访问修饰符用于控制属性的访问范围，有四种访问修饰符 `public protected default private`
2. 属性的定义类型可以为任意类型，包括基本类型和引用类型
3. 属性如果不赋值，有默认值，规则与数组一致


##### 成员变量 vs 局部变量

成员变量与局部变量的区别？语法形式：从语法形式上看，成员变量是属于类的，而局部变量是在代码块或方法中定义的变量或是方法的参数；成员变量可以被 public,private,static 等修饰符所修饰，而局部变量不能被访问控制修饰符及 static 所修饰；但是，成员变量和局部变量都能被 final 所修饰。存储方式：从变量在内存中的存储方式来看，如果成员变量是使用 static 修饰的，那么这个成员变量是属于类的，如果没有使用 static 修饰，这个成员变量是属于实例的。而对象存在于堆内存，局部变量则存在于栈内存。生存时间：从变量在内存中的生存时间上看，成员变量是对象的一部分，它随着对象的创建而存在，而局部变量随着方法的调用而自动生成，随着方法的调用结束而消亡。默认值：从变量是否有默认值来看，成员变量如果没有被赋初始值，则会自动以类型的默认值而赋值（一种情况例外:被 final 修饰的成员变量也必须显式地赋值），而局部变量则不会自动赋值。

为什么成员变量有默认值？先不考虑变量类型，如果没有默认值会怎样？变量存储的是内存地址对应的任意随机值，程序读取该值运行会出现意外。默认值有两种设置方式：手动和自动，根据第一点，没有手动赋值一定要自动赋值。成员变量在运行时可借助反射等方法手动赋值，而局部变量不行。对于编译器（javac）来说，局部变量没赋值很好判断，可以直接报错。而成员变量可能是运行时赋值，无法判断，误报“没默认值”又会影响用户体验，所以采用自动赋默认值。

```java
public class VariableExample {

    // 成员变量
    private String name;
    private int age;

    // 方法中的局部变量
    public void method() {
        int num1 = 10; // 栈中分配的局部变量
        String str = "Hello, world!"; // 栈中分配的局部变量
        System.out.println(num1);
        System.out.println(str);
    }

    // 带参数的方法中的局部变量
    public void method2(int num2) {
        int sum = num2 + 10; // 栈中分配的局部变量
        System.out.println(sum);
    }

    // 构造方法中的局部变量
    public VariableExample(String name, int age) {
        this.name = name; // 对成员变量进行赋值
        this.age = age; // 对成员变量进行赋值
        int num3 = 20; // 栈中分配的局部变量
        String str2 = "Hello, " + this.name + "!"; // 栈中分配的局部变量
        System.out.println(num3);
        System.out.println(str2);
    }
}
```

#### 对象分配机制

```java
Person p1 = new Person();
p1.age = 10;
Person p2 = p1; //把p1赋给p2，或者说让p2指向p1，修改p2的属性p1也会受影响
System.out.print(p2.age);//10
```

<img src="https://vluv-space.s3.bitiful.net/Java/java_se2/JavaⅠ-2024-09-18-14-57-47.webp" style="width:80%;" alt="">

##### Java 内存结构分析

1. 栈：一般存放基本数据类型（局部变量）
2. 堆：存放对象（Person p，数组等）
3. 方法区：常量池（常量，比如字符串），类加载信息
4. 示意图 [ Person (name, age, price) ]

##### Java 创建对象流程简单分析

1. 先加载 Person 类信息（属性和方法信息，只会加载一次）
2. 在堆中分配空间，进行默认初始化
3. 把地址赋给 p（p 指向对象）
4. 进行指定初始化，`p.name = "jack",p.age = 18`

### 成员方法及其传参机制

#### 基本介绍

Java 方法是语句的集合，它们在一起执行一个功能。

- 方法是解决一类问题的步骤的有序组合
- 方法包含于类或对象中
- 方法在程序中被创建，在其他地方被引用

**方法的优点**

- 使程序变得更简短而清晰。
- 有利于程序维护。
- 可以提高程序开发的效率。
- 提高了代码的重用性。

**方法的命名规则**

- 方法的名字的第一个单词应以小写字母作为开头，后面的单词则用大写字母开头写，不使用连接符。例如：`addPerson`。
- 下划线可能出现在 JUnit 测试方法名称中用以分隔名称的逻辑组件。一个典型的模式是：`test<MethodUnderTest>_<state>`，例如 `testPop_emptyStack`。
- 方法的定义：

  ```java
  修饰符 返回值类型 方法名(参数类型 参数名) {
      ···
      方法体
      ···
      return 返回值;//void 不需要return语句
  }
  ```

<img src="https://vluv-space.s3.bitiful.net/Java/java_se2/JavaⅠ-2024-09-18-14-58-23.webp" style="width:80%;" alt="">

**注意细节**

- 一个方法可以有 0 个或多个参数，用 `,`隔开，类型可以为任意类型。
- 方法定义时的参数称为形式参数，简称形参；方法调用时的参数称为实际参数，简称实参。调用带参方法时，形参与实参的类型要一致或兼容，个数、顺序须一致
- 方法体里面完成功能的具体语句，但方法体里不能再定义方法
- 一个方法最多有一个返回值，返回类型可以为任意类型，包含基本类型和引用类型(数组，对象)
- 如果方法要求有返回数据类型，则方法体中最后的执行语句必须为 `return`，并且返回值应该与要求的返回值类型一致或兼容

#### 方法的调用机制

<img src="https://vluv-space.s3.bitiful.net/Java/java_se2/JavaⅠ-2024-09-18-14-59-17.webp" style="width:80%;" alt="">

1. 当程序执行到方法时，就会开辟一个独立的空间(栈空间)
2. 当方法执行完毕，或者执行到 `return`语句时，就会返回到调用方法的地方，之后继续执行方法后面的代码
3. 当 `main`方法执行完毕，整个程序退出

#### 方法调用注意事项

1. 同一个类中的方法调用：直接调用即可

   ```java
   class A {
       public void myPrint(int n){
           System.out.println(n);
       }

       public void sayHello(int j){
           myPrint(j);
       }
   }
   ```

2. 跨类中的方法，A 类中调用 B 类的方法：创建对象后调用

   ```java
   class B {
       public void sayHello() {
           System.out.println("Hello");
       }
   }

   class A {
       public void method() {
           B instanceofB = new B();
           instanceofB.hi();
       }
   }
   ```

#### 🚨 方法传参机制

> 对于值传递，无论是值类型还是引用类型，都会在调用栈上创建一个副本，不同是，对于值类型而言，这个副本就是整个[原始值](https://www.zhihu.com/search?q=原始值&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={)的复制。而对于引用类型而言，由于引用类型的实例在堆中，在栈上只有它的一个引用（一般情况下是指针），其副本也只是这个引用的复制，而不是整个[原始对象](https://www.zhihu.com/search?q=原始对象&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={)的复制

> Java 中的传参机制是按值传递（pass by value）。这意味着在方法调用时，实参的值被复制到形参中，方法中对形参的修改不会影响实参的值。

1. 对于基本数据类型，传递的是值(值拷贝)，形参的任何改变不影响实参
2. 引用类型传递的是地址（传递的也是值，但是传递的值是地址），可以通过形参影响实参

### overload&可变参数

#### Overload

**介绍**

java 中允许一个类中，多种同名方法的存在，但要求形参列表不一致

重载的好处：减轻**给方法命名**以及**记忆方法名**的麻烦

**注意事项**

1. 方法名字必须相同
2. **形参列表必须不同**(形参类型或个数或顺序，至少有一样不同，参数名无要求)
3. 返回类型无要求

**代码示例**

```java
class MyCalculator {
    public int calculate(int n1, int n2) {
        return n1 + n2;
    }
    public double calculate(double n1, int n2){
        return n1 + n2;
    }
    public double calculate(double n1, double n2, double n3){
        return n1 + n2 + n3;
    }
    ...
}
```

#### Variable Parameter

**介绍**
Java 中允许将同一个类中**多个同名同功能**但**参数个数不同**的方法封装成一个方法，通过可变参数实现

**基本语法&注意事项**

1. `int...`表示接收的是可变参数，类型为 `int`，实参可以为任意数量(包括 0)
2. 可变参数的实质为数组。使用可变参数时，可以当作数组来使用，例如 `scores`可以当作数组
3. 一个形参列表中至多出现一个可变参数
4. 可变参数可以和普通类型参数一起放在形参列表，但必须保证它的位置在形参列表的最后；

```java
访问修饰符 返回类型 方法名(数据类型... 形参名){
    ...
}
//demo
class Demo{
    public String showScore(String name,double... scores){
        double totalScore = 0;
        for(int i = 0; i < scores.length; i++) {
            totalScore += scores[i];
        }
        return name + "共有" + scores.length + "门课程，总分为:" + totalScore;
 }
}

```

### 作用域

Java 的作用域规则指的是变量在程序中的可见性和生命周期。Java 中有三个作用域：类作用域、方法作用域和块作用域。

- 类作用域指的是在整个类中都可见的变量，也称为成员变量或全局变量。在类中定义的变量可以被类中的所有方法访问，也可以被类的实例访问。类变量在程序启动时就会被创建，直到程序结束才会被销毁。
- 方法作用域指的是在方法中定义的变量，只能在该方法内部被访问。方法变量在方法被调用时创建，在方法结束时销毁。
- 块作用域指的是在代码块中定义的变量，包括循环、条件语句和方法内部的语句块。块作用域中定义的变量只能在该代码块内部被访问，当代码块执行完毕后，变量就会被销毁。

#### 变量类型

- **局部变量（Local Variables）：**定义在方法、构造方法或语句块中的变量，作用域只限于当前方法、构造方法或语句块中。局部变量必须在使用前声明，并且不能被访问修饰符修饰。
- **成员变量（Instance Variables）：**定义在类中、方法之外的变量，作用域为整个类，可以被类中的任何方法、构造方法和语句块访问。成员变量可以被访问修饰符修饰。
- **静态变量（Class Variables）：**定义在类中、方法之外的变量，并且使用 `static` 关键字修饰，作用域为整个类，可以被类中的任何方法、构造方法和语句块访问，静态变量的值在程序运行期间只有一个副本。静态变量可以被访问修饰符修饰。
- **参数变量（Parameters）：**方法定义时声明的变量，作为调用该方法时传递给方法的值。参数变量的作用域只限于方法内部。

##### 参数变量

Java 中的参数变量是指在方法或构造函数中声明的变量，用于接收传递给方法或构造函数的值。参数变量与局部变量类似，但它们只在方法或构造函数被调用时存在，并且只能在方法或构造函数内部使用。

Java 方法的声明语法如下：

```java
accessModifier returnType methodName(parameterType parameterName1, parameterType parameterName2, ...) {
    // 方法体
}
```

- parameterType -- 表示参数变量的类型。
- parameterName -- 表示参数变量的名称。

在调用方法时，我们必须为参数变量传递值，这些值可以是常量、变量或表达式。

方法参数变量的值传递方式有两种：**值传递**和**引用传递**。

- **值传递：**在方法调用时，传递的是实际参数的值的副本。当参数变量被赋予新的值时，只会修改副本的值，不会影响原始值。Java 中的基本数据类型都采用值传递方式传递参数变量的值。
- **引用传递：**在方法调用时，传递的是实际参数的引用（即内存地址）。当参数变量被赋予新的值时，会修改原始值的内容。Java 中的对象类型采用引用传递方式传递参数变量的值。

##### 局部变量

- 局部变量声明在方法、构造方法或者语句块中。
- 局部变量在方法、构造方法、或者语句块被执行的时候创建，当它们执行完成后，变量将会被销毁。
- 局部变量必须在使用前声明，并且不能被访问修饰符修饰，因为它们的作用域已经被限制在了声明它们的方法、代码块或构造函数中。
- 局部变量只在声明它的方法、构造方法或者语句块中可见，不能被其他方法或代码块访问。
- 局部变量是在栈上分配的。
- 局部变量没有默认值，所以局部变量被声明后，必须经过初始化，才可以使用

局部变量的声明语法为：

```java
type variableName;
```

局部变量只在声明它的方法、构造方法或语句块内可见，其他方法、构造方法或语句块不能访问该局部变量。当方法、构造方法或语句块执行完毕后，局部变量将被销毁，其占用的内存也会被释放。

##### 成员变量

- 成员变量声明在一个类中，但在方法、构造方法和语句块之外。
- 当一个对象被实例化之后，每个成员变量的值就跟着确定。
- 成员变量在对象创建的时候创建，在对象被销毁的时候销毁。
- 成员变量的值应该至少被一个方法、构造方法或者语句块引用，使得外部能够通过这些方式获取实例变量信息。
- 成员变量可以声明在使用前或者使用后。
- 访问修饰符可以修饰成员变量。
- 成员变量对于类中的方法、构造方法或者语句块是可见的。一般情况下应该把成员变量设为私有。通过使用访问修饰符可以使成员变量对子类可见。
- 成员变量具有默认值。数值型变量的默认值是 0，布尔型变量的默认值是 false，引用类型变量的默认值是 null。变量的值可以在声明时指定，也可以在构造方法中指定；
- 成员变量可以直接通过变量名访问。但在静态方法以及其他类中，就应该使用完全限定名：**ObjectReference.VariableName**。

成员变量的声明语法为：

```java
accessModifier type variableName;
```

- accessModifier --表示访问修饰符，可以是 public、protected、private 或默认访问级别（即没有显式指定访问修饰符）。
- type -- 表示变量的类型。
- variableName -- 表示变量的名称。

与局部变量不同，成员变量的值在创建对象时被分配，即使未对其初始化，它们也会被赋予默认值，例如 int 类型的变量默认值为 0，boolean 类型的变量默认值为 false。

成员变量可以通过对象访问，也可以通过类名访问（如果它们是静态成员变量）。如果没有显式初始化成员变量，则它们将被赋予默认值。可以在构造函数或其他方法中初始化成员变量，或者通过对象或类名访问它们并设置它们的值。

##### 类变量（静态变量）

##### Scope

1. 属性和局部变量可以重名，访问时遵循就近原则
2. 在同一个作用域中，比如在同一个成员方法中，两个局部变量，不能重名
3. 属性生命周期较长，伴随着对象的创建而创建，伴随着对象的销毁而销毁。局部变量生命周期较短，伴随着它的代码块的执行而创建，伴随着代码块的结束而销毁，即它的生命周期在一次方法调用过程中。
4. 全局变量/属性： 可以在本类使用，或其他类使用(通过对象调用)

   局部变量：只能在本类中对应的方法中使用

5. 全局变量/属性可以加修饰符，局部变量不可以加修饰符

### 构造器/构造方法(constructor)

**基本语法**

```java
[修饰符] 方法名 (形参列表){

}
```

1. 构造器的修饰符可以默认，也可以是 `public protected private`
2. `constructor`参数列表的规则 与 成员方法的规格一致

```java
public Constructor01 {
    public static void main(String[] args){
        Person p1 = new Person("Smith",19);
        p1.Person(); // error
    }
}
class Person {
    String name;
    int age;
    public Person(String pName, int pAge) {
        System.out.println("构造器被调用");
        name = pName;
        age = pAge;
    }
    public Person(String pName) {
        System.out.println("构造器的重载被调用");
        name = pName;
    }
}
```

#### 注意事项

1. 一个类可以定义多个构造器，即构造器重载 overload
   比如：我们可以再给 `Class Person`定义一个构造器，用来创建对象的时候，只指定人名，不需要指定年龄
2. `constructor`的名需要与 class 名一致，且 `constructor`没有返回值
3. `constructor`是完成对象的初始化，并不是创建对象
4. 在创建对象时，系统会自动调用该类的构造器完成对象的初始化
5. 如果程序员没有定义构造器，系统会自动给类生成一个默认无参构造器(也叫默认构造器)，使用 `javap`反编译查看

   ```java
   public class Constructor{
       public static void main(String[] args){
           //Dog()，括号内没有传入参数，即为调用无参构造器
        Dog d = new Dog();
       }

   }
   class Dog {
       /*默认构造器，无参构造器的形式
        Compiled from "a.java"
     Dog {
        Dog();
     }
       */
   }
   ```

6. 一旦定义了自己的构造器，默认构造器就被覆盖了，就不能再使用默认构造器

#### 对象创建的流程分析

```java
class Person{
    int age = 90;
    String name;
    Person(String n,int a){
        name = n;
        age = a;
    }
}
Person p = new Person("Mark",19);
// 类加载检查 分配内存
// age初始为 0， name初始为null
//显示初始化 age 初始化为90
//构造器初始化 Mark, 90
//返回地址0x1122，赋给p
```

**主要步骤：类加载检查-分配内存-初始化零值-设置对象头-执行 init 方法**

- **类加载检查**
  当虚拟机碰到 new 的时候，就先去检查对象的类是否已经被加载过，如果没有被加载过，就要先进行类的加载。
- **分配内存**
  一个对象所占的内存在类加载完毕后即可以确定了，于是虚拟机就需要在 Java 的堆上分配一块确定大小的空间给这个新的对象。分配的方式有“指针碰撞”（适合没有内存碎片的情况）和“空闲列表”（适合内存不规整的情况），分配的方式如果学习过操作系统的话就会有浓浓的熟悉感。
- **初始化零值**
  给对象分配了内存后，JVM 就需要对这个对象里的空间都初始化为零值（例如我们创建一个 int[] temp 对象不需要我们为每个 element 赋予初值，C++需要）。
- **设置对象头**
  这个阶段是对对象头进行必要的设置，对象头里有一些信息例如，这个对象是哪个类的实例，对象的 hashCode，对象的 GC 分代以及年龄，等等这些都存放在对象头中。
- **执行 init 方法**
  上面工作完成后，这个新生的对象有空间有初值，从 JVM 的角度来说这个对象已经可以拿来使用了。但是一个对象需要按照我们程序员自己的想法来进行初值的赋予和构造。就需要来执行 init()方法，让对象按照程序猿的思路来进行优化，这样一个真正可用的对象才能创建出来。

### this

Java 虚拟机会给每个对象分配 `this`，代表当前对象。

<img src="https://vluv-space.s3.bitiful.net/Java/java_se2/JavaⅠ-2024-09-18-15-01-00.webp" style="width:80%;" alt="">

```java
class Dog{
    String name;
    int age;
    public Dog(String name, int age){
        //哪个对象调用，this就代表哪个对象
        this.name = name;
        this.age = age;
    }
    public void info(){//调用this访问类的属性
        System.out.println("this.name = " + this.name);
        System.out.println("this.hashCode = " + this.hashCode());
    }
}

public class test{
    public static void main(String[] args) {
        Dog Tom = new Dog("Tom",18);
        Tom.info();
        System.out.println("Tom.hashCode = " + Tom.hashCode());
        System.out.println("=================");
        Dog Tim = new Dog("Tim",15);
        Tim.info();
        System.out.println("Tim.hashCode() = " + Tim.hashCode());
    }
}
```

```powershell
this.name = Tom
this.hashCode = 366712642
Tom.hashCode = 366712642
=================
this.name = Tim
this.hashCode = 1829164700
Tim.hashCode() = 1829164700
```

##### **使用细节**

1. this 关键字可以用来访问本类的属性，方法，构造器
2. this 用来区分当前类的属性和局部变量
3. 访问成员方法的语法 `this.methodname(parameter list)`
4. 访问构造器语法：`this(parameter list)`；注意只能在构造器中使用（即在一个构造器中访问另一个构造器），并且必须放在第一条语句

   ```java
   class Test {
       String name;
       int age;
       public Test() {
           //这里去访问T(String name,int age)构造器
           //如果要访问其他构造器，this()必须放在第一条语句
           this("jack",100);
           System.out.println("Test()构造器被调用");
       }
       public Test(String name, int age) {
           System.out.println("Test(String name,int age)被调用");
       }
   }

   public class A{
       public static void main(String[] args) {
           Test t1 = new Test();
       }
   }
   ```

   ```bash
   Test(String name,int age)被调用
   Test()构造器被调用
   ```

5. this 不能在类定义的外部使用，只能在类定义的方法中使用

### Package

#### Package 的基本介绍

**作用**

1. 区分相同名字的 `class`
2. 管理 `class`，控制访问范围

**本质** ：创建不同的文件夹/目录来保存类文件

**使用细节**

1. `package`的作用是声明当前类所在的包，需要放在类的最上面，一个类中最多只有一句 `package`
2. `import`指令位置放在 `package`的下面，在类定义的前面，可以有多句且没有顺序要求
3. 只能包含数字、字母、下划线、`.`，不能以关键字开头，不能是关键字或保留字

#### 常见包

- `java.lang` 基本包，默认引入，不需要再引入
- `java.util` 由系统提供的工具包，工具类
- `java.net` 网络包，用于网络开发
- `java.awt` java 界面开发，GUI

#### 引入包

语法:`import package`

`import java.util.Scanner`:只引入 `Scanner`这一 package

`import java.util.*`将 java.util 包全部引入

### Modifier

#### 基本介绍

Java 语言提供了很多修饰符，修饰符用来定义类、方法或者变量，通常放在语句的最前端。主要分为以下两类：

- 访问修饰符
- 非访问修饰符

#### 访问控制修饰符

##### 注意

java 的访问控制是停留在编译层的，也就是它不会在.class 文件中留下任何的痕迹，只在编译的时候进行访问控制的检查。其实，通过反射的手段，是可以访问任何包下任何类中的成员，例如，访问类的私有成员也是可能的

##### 基本介绍

Java 中，可以使用访问控制符来保护对类、变量、方法和构造方法的访问。Java 支持 4 种不同的访问权限。

- **default** 默认: 在同一包内可见，不使用任何修饰符。使用对象：类、接口、变量、方法。
- **private** : 在同一类内可见。使用对象：变量、方法。 **注意：不能修饰类（外部类）**
- **public** : 对所有类可见。使用对象：类、接口、变量、方法
- **protected** : 对同一包内的类和所有子类可见。使用对象：变量、方法。 **注意：不能修饰类（外部类）**。

我们可以通过以下表来说明访问权限：

| 修饰符      | 同类 | 同包 | 子孙类(同一包) | 子孙类(不同包)                                                                     | 其他包 |
| :---------- | :--- | :--- | :------------- | :--------------------------------------------------------------------------------- | :----- |
| `public`    | Y    | Y    | Y              | Y                                                                                  | Y      |
| `protected` | Y    | Y    | Y              | Y/N（[说明](https://www.runoob.com/java/java-modifier-types.html#protected-desc)） | N      |
| `default`   | Y    | Y    | Y              | N                                                                                  | N      |
| `private`   | Y    | N    | N              | N                                                                                  | N      |

---

##### default

如果在类、变量、方法或构造函数的定义中没有指定任何访问修饰符，那么它们就默认具有默认访问修饰符。

默认访问修饰符的访问级别是包级别（package-level），即只能被同一包中的其他类访问。

如下例所示，变量和方法的声明可以不使用任何修饰符。

```java
// MyClass.java

class MyClass {  // 默认访问修饰符

    int x = 10;  // 默认访问修饰符

    void display() {  // 默认访问修饰符
        System.out.println("Value of x is: " + x);
    }
}

// MyOtherClass.java

class MyOtherClass {
    public static void main(String[] args) {
        MyClass obj = new MyClass();
        obj.display();  // 访问 MyClass 中的默认访问修饰符变量和方法
    }
}
```

以上实例中，MyClass 类和它的成员变量 x 和方法 display() 都使用默认访问修饰符进行了定义。MyOtherClass 类在同一包中，因此可以访问 MyClass 类和它的成员变量和方法。

---

##### private

私有访问修饰符是最严格的访问级别，所以被声明为 **private** 的方法、变量和构造方法只能被所属类访问，并且类和接口不能声明为 **private**。

声明为私有访问类型的变量只能通过类中公共的 getter 方法被外部类访问。

Private 访问修饰符的使用主要用来隐藏类的实现细节和保护类的数据。

下面的类使用了私有访问修饰符：

```java
public class Logger {
    private String format;
    public String getFormat() {
        return this.format;
    }
    public void setFormat(String format) {
        this.format = format;
    }
}
```

实例中，Logger 类中的 format 变量为私有变量，所以其他类不能直接得到和设置该变量的值。为了使其他类能够操作该变量，定义了两个 public 方法：getFormat() （返回 format 的值）和 setFormat(String)（设置 format 的值）

---

##### public

被声明为 public 的类、方法、构造方法和接口能够被任何其他类访问。

如果几个相互访问的 public 类分布在不同的包中，则需要导入相应 public 类所在的包。由于类的继承性，类所有的公有方法和变量都能被其子类继承。

以下函数使用了公有访问控制：

```java
public static void main(String[] args) {
   // ...
}
```

---

##### protected

protected 需要从以下两个点来分析说明：

- **子类与基类在同一包中**：被声明为 protected 的变量、方法和构造器能被同一个包中的任何其他类访问；
- **子类与基类不在同一包中**：那么在子类中，子类实例可以访问其从基类继承而来的 protected 方法，而不能访问基类实例的 protected 方法。

protected 可以修饰数据成员，构造方法，方法成员，**不能修饰类（内部类除外）**

---

##### 访问控制和继承

请注意以下方法继承的规则：

- 父类中声明为 public 的方法在子类中也必须为 public。
- 父类中声明为 protected 的方法在子类中要么声明为 protected，要么声明为 public，不能声明为 private。
- 父类中声明为 private 的方法，不能够被子类继承。

#### 非访问修饰符

为了实现一些其他的功能，Java 也提供了许多非访问修饰符。

1. static 修饰符，用来修饰类方法和类变量。
2. final 修饰符，用来修饰类、方法和变量，final 修饰的类不能够被继承，修饰的方法不能被继承类重新定义，修饰的变量为常量，是不可修改的。
3. abstract 修饰符，用来创建抽象类和抽象方法。
4. synchronized 和 volatile 修饰符，主要用于线程的编程。

### OOP 编程特点

#### Encapsulation

**封装 Encapsulation**是与对象有关的一个重要概念。从形式上看，封装不过是将数据和行为组合在一个包中，并对对象的使用者隐藏了数据的实现方式。对象中的数据称为实例域(instance field)，操纵数据的过程称为方法(method)。对于每个特定的类实例(对象)都有一组特定的实例域值。这些值的集合就是这个对象的当前状态(state)

**定义**

把抽象出的数据[属性]和对数据的操作[方法]封装在一起，数据被保护在内部，程序的其他部分只有通过被授权的操作[方法]，才能对数据进行操作

**作用**

1. 隐藏实现细节 方法(连接数据库)<--调用(传入参数)
2. 可以对数据进行验证，保证安全合理

**实现步骤**

1. 将属性私有化 `private`，【不能直接修改属性】
2. 提供一个公共的方法，用于对属性判断，赋值，修改等操作

   ```java
   public void setAge(int age) {
       this.age = age;
   }

   public void getAge() {
       System.out.println("年龄 = " + this.age);
   }
   ```

##### constructor & encapsulation

```java
class Person {
    public Person() {
    }
    public Person(String name, int age, double salary) {
        this.setName(name); //this可以省略
        setAge(age);
        setSalary(salary);
    }

    public void setName(String name){
        this.name = name;
    }
    //......
}
```

#### Extend

##### 介绍

继承就是子类继承父类的特征和行为，使得子类对象（实例）具有父类的实例域和方法，或子类从父类继承方法，使得子类具有父类相同的行为。

继承可以解决代码复用，让我们的编程更加靠近人类思维。当多个类存在相同的属性(变量)和方法时，可以从这些类中抽象出父类(超类，基类)，在父类中定义这些相同的属性和方法，所有的子类(派生类)不需要重新定义这些属性和方法，只需要通过 `extends`来声明继承父类即可

```java
class 子类 extends 父类{
  //基本语法示意
}
```

```java
//Person.java
package com.uestc.learnextend
public class Person {
    public String name;
    int age;
    char gender;
}
//Student.java
package com.uestc.learnextend
public class Student extends Person {
    double score;
}
```

##### 注意事项

1. 子类继承了所有地属性和方法，但是私有属性和方法不能在子类直接访问，要通过父类提供公共的方法去访问

   ```java
   // Path:src/com/father/Base.java
   package com.father
   public class Base {
       public int n1 = 100; //子类可以访问public,protected
       protected int n2 = 1;
       int n3 = 30; //不同包，不能访问
       private int n4 = 0;//子类不能访问private

       public int getN4() { //通过父类提供public方法使子类访问private
           return n4;
       }
   }
   // Path:src/com/use/Sub.java
   package com.use;
   import com.father.Base;
   public class Sub extends Base {
       public Sub() {
           System.out.println("Hello,sub");
       }
       public void sayOK(){
           System.out.println("n4 = " + getN4());
       }
      //main
       public static void main(String[] args) {
           Sub sub = new Sub();
           sub.sayOK();
       }
   }
   ```

2. 子类会默认调用父类的构造器，完成父类的初始化
3. 当创建子类对象时，不管使用子类的哪个构造器，默认情况下总会去调用父类的无参构造器，如果父类没有提供无参构造器，则必须在子类的构造器中用 `super()`确定使用父类的哪个构造器完成对父类的初始化工作，否则，编译不会通过
4. `super`在使用时，必须放在构造器的第一行
5. `super()`与 `this()`都只能放在构造器的第一行，因此这两个方法不能共存在一个构造器中

##### 继承的本质分析

1. 如果要访问子类的某个属性/方法，首先看子类是否有该属性/方法
2. 如果子类有这个属性/方法，并且可以访问则返回信息
3. 子类没有这个属性/方法，就向上查找他的父类
4. 父类没有则继续找上级父类，直至 `Object`，若查找不到则报错

##### exercise

**ex1**

```java
class A {
    A() {
        System.out.println("a");
    }
    A(String name){
        System.out.println("a name");
    }
}

class B extends A {
    B() {
        this("abc"); //复用构造器，调用B(String name)，此时没有默认调用Super();
        System.out.println("b");
    }
    B(String name) {
        //默认有一句Super()；
        //当创建子类对象时，不管使用子类的哪个构造器，默认情况下总会去调用父类的无参构造器
        System.out.println("bname");
    }
}

public class Sub {
    public static void main(String[] args) {
        B b = new B();
    }
}
```

```bash
a
bname
b
```

#### Super & Override

##### Super

**介绍**

`super`代表父类的引用，用于访问父类的属性，方法，构造器

**基本语法**

1. 访问父类的属性，但不能访问父类的 `private`属性
   `super.属性名`
2. 访问父类的方法，不能访问父类的 `private`方法
   `super.方法名(paras)`
3. 访问父类的构造器
   `super(paras)`只能放在构造器的第一句，只能出现一句

**注意事项**

1. 调用父类构造器的好处：分工明确，父类属性由父类参数，子类的属性由子类初始化
2. 当子类和父类中的成员(属性，方法)重名时，可以通过 `this.method_name(),super.method_name()`区分
3. `super`也可以访问到父类的父类的成员，重名时访问遵循就近原则

##### this & super 比较

|                   | this                                                      | super                                    |
| ----------------- | --------------------------------------------------------- | ---------------------------------------- |
| 访问属性/调用方法 | 访问本类中的属性/方法，如果本类中没有此属性则向上查找父类 | 从父类开始查找属性/方法                  |
| 调用构造器        | 调用本类构造器，必须放在构造器首行                        | 调用父类构造器，必须放在子类构造器的首行 |
| 特殊              | 表示当前对象                                              | 子类中访问父类对象                       |

##### Override

**基本介绍**
方法覆盖(重写)就是子类有一个方法，和父类的某个方法的名词，返回类型，参数一样，那么我们就说子类的这个方法覆盖了父类的那个方法

**注意事项**

1. 子类的方法的参数、方法名，要和父类方法的参数、方法名一样，不然不构成 override 关系
2. 子类方法的返回类型和父类的返回类型一样，或者是父类的返回类型的子类
   例如 父类返回 `Object`,子类返回 `String`

   ```java
   public Object getInfo(){};   // 父类
   public String getInfo(){};   // 子类
   ```

3. 子类方法不能缩小父类方法的访问权限(`public > protected > default > private`)

|            | `Override`                                                   | `Overload`                                                 |
| ---------- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| 定义       | 子类中定义与父类中方法名、参数列表相同的方法                 | 在同一个类中定义多个方法，它们具有相同的名称但参数列表不同 |
| 目的       | 重写父类中的方法                                             | 提供更多的方法选项                                         |
| 参数       | 参数列表必须与父类中的方法完全相同                           | 参数列表必须不同                                           |
| 返回值     | 返回值必须与父类中的方法的返回值一样或者是父类返回类型的子类 | 可以相同也可以不同                                         |
| 运行时行为 | 运行时根据实际对象类型调用对应的方法                         | 运行时根据传递给方法的参数数量和类型调用对应的方法         |

#### Polymorphism

##### 基本介绍

方法或对象具有多种形态。是面向对象的第三大特征，多态是建立在封装和继承基础之上的。

> 多态性是对象多种表现形式的体现。
>
> 现实中，比如我们按下 F1 键这个动作：
>
> - 如果当前在 Flash 界面下弹出的就是 AS 3 的帮助文档；
> - 如果当前在 Word 下弹出的就是 Word 帮助；
> - 在 Windows 下弹出的就是 Windows 帮助和支持。
>
> 同一个事件发生在不同的对象上会产生不同的结果。

**多态的优点**

- 消除类型之间的耦合关系
- 可替换性
- 可扩充性
- 接口性
- 灵活性
- 简化性

**多态存在的必要条件**

1. 继承
2. 重写
3. 父类引用指向子类对象 `Parent p = new Child()`

**多态的具体体现**

1. 方法的多态
   - `overload`传入不同参数，从而调用不同的方法
   - `override`子类重写父类的方法，从而实现不同的行为
2. 对象的多态
   - 一个对象可以被当作它所实现的接口或它所继承的父类来对待。这种行为体现了多态的特性，即同一种类型的对象在不同的情况下呈现出不同的状态
     - 一个对象的编译类型和运行类型可以不一致
     - 编译类型在定义对象时，就确定了，不能改变
     - 运行类型是可以变化的

##### Objects' Polymorphism

###### 向上转型 upcasting

**本质**：父类的引用指向了子类的对象
**语法**：`Animal foo = new Dog()；`
**特点**：

- 非静态方法编译类型看 `=`的左边，运行类型看 `=`的右边（静态方法和属性都看左边，因为他们没有重写之说）
- 可以调用父类的所有成员（需要遵守访问权限），但不能调用子类中的特有成员（因为在编译阶段，能调用哪些成员，是由编译类型来决定的）
- 最终运行效果看子类的具体实现，即调用方法时，从运行类型开始查找方法，然后调用

```java
public class Polymorphism {
    public class void main(String[] args) {
        //animal的编译类型看左边，为Animal，运行类型为Dog，能调用父类中的成员，不能调用子类的特有成员
        Animal animal = new Dog();
        //运行会调用Dog的cry
        animal.cry();
        //运行类型变为cat，调用方法时从Cat开始向上查找，若子类Cat没有则去Animal父类查找
        animal = new Cat();
        cat.cry();
    }
}
```

###### 向下转型 downcasting

**语法：**`Dog foo = (Dog)animal;`
**特点**

1. 只能强转父类，不能强转父类的对象
2. 要求父类的引用必须指向的是当前目标类型的对象

   ```java
   // 安全的向下转型是先把子类对象向上转型为服了，再将父类强制转换为子类
   Animal animal = new Cat(); //只能调用父类的
   Cat cat = (Cat)animal; //让animal向下转型，使其可以调用子类
   ```

3. 当向下转型后，就可以调用子类类型中的所有成员

##### 多态注意事项

- 属性没有重写之说，属性的值看编译类型
- `instanceOf`比较操作符，用于判断对象的运行类型是否为 XX 类型或者 XX 类型的子类

  ```java
  Father test = new Child();
  test instanceOf Child; //true，test的运行类型为Child
  ```

##### exercise

**计算税额练习**

```java
// path:src/com/pay/Income.java
package com.pay;
class Income {
    protected double income;

    public Income(double income) {
        this.income = income;
    }

    public double getTax() {
        return income * 0.1;
    }
}
// path:src/com/pay/Salary.java
package com.pay;
class Salary {
    public Salary(double income) {
        super(income);
    }

    @Override
    public double getTax() {
        if (income <= 5000) {
            return 0;
        } else {}
            return (income - 5000) * 0.2;
        }
    }
}
// path:src/com/pay/StateCouncilSpecialAllowance.java
package com.pay;
class StateCouncilSpecialAllowance {
    public StateCouncilSpecialAllowance(double income) {
        super(income);
    }
    @Override
    //国务院特别津贴，全部免税
    public double getTax() {
        return 0;
    }
}
// path:src/com/pay/totalTax.java
package com.pay;
class totalTax {
    public static double totalTax(Income... incomes) {
        double total = 0;
        for(Income income:incomes) {
            total = total + income.getTax();
        }
     return total;
    }
}
// path:src/com/pay/Main.java
package com.pay;

public class Main {
    public static void main(String[] args) {
        Income[] incomes = new Income[] {
            new Income(3000),
            new Salary(7500),
            new StateCouncilSpecialAllowance(15000)
        };
        System.out.println(totalTax.totalTax(incomes));
    }
}
```

##### Dynamic Binding

- 当调用对象方法的时候，该方法会和该对象的内存地址/运行类型绑定
- 当调用对象属性时，没有动态绑定机制，哪里声明，就哪里使用（按照作用域规则）

```java
package Extends_;

class A {
    public int i = 10;
    public int getI() {
        return i;
    }

    public int sum() {
        return getI() + 10; //b.getI()调用的是运行类型B的getI()， 20 + 10
    }

    public int sum1() {
        return i + 10; //哪里声明就哪里使用 返回 10 + 10
    }
}

class B extends A {
    public int i = 20;
    public int getI() {
        return i;
    }
}

public class ExtendsTheory {
    public static void main(String[] args) {
        A a = new B();
        System.out.println(a.sum()); //30
        System.out.println(a.sum1()); //20
    }
}
```

##### 多态数组

数组的定义为父类类型，里面保存的实际元素为子类类型

```java
Person[] persons = new Person[10];
person[0] = new Person();
person[1] = new Student();
person[2] = new Teacher();
......
for (i = 0; i < persons.length(); i++){
    persons[i].say();
}
```

**多态参数**

方法定义的形参类型为父类类型，实参类型允许为子类类型

### Object 类详解

#### equals

**介绍**
在 Java 中，equals()方法是用于比较两个对象是否相等的方法。它是 Object 类中的一个方法，因此所有 Java 类都继承了这个方法。默认情况下，equals()方法比较的是两个对象的引用是否相等，也就是说它们是否指向同一个内存地址。

`==`与 `equals`对比：

1. `==`既可以判断基本类型又可以判断引用类型。判断基本类型时，判断的是值是否相等；判断引用类型时，判断的是地址是否相等，即判断是不是同一个对象

   ```java
   Father a = new A();
   Child b = a;
   a == b; //true
   ```

2. `equals`是 Object 类中的方法，只能判断引用类型，默认判断的是地址是否相等，子类中往往重写该方法，用于判断内容是否相等

   - `String.equals()`比较字符串是否相等
   - `Integer.equals()` 比较两个整数是否相等

**equals()的重写**

```java
public boolean equals(Object obj) {
    //如果比较的两个对象是同一个对象，则直接返回true
    if(this == obj) {
        return true;
    }

    if(obj instanceof Person) {
        //向下转型
        Person p = (Person)obj;
        return this.name.equals(p.name) && this.age == p.age && this.gender == p.gender;
    }
    //如果不是Person，则直接返回false
    return false;
}
```

#### hashCode

- 提高具有哈希结构容器的效率
- 两个引用，如果指向同一个对象，则哈希值一定相同；如果指向不同对象，则哈希值是不同的(如果发生哈希碰撞，此时哈希值一样)
- 哈希值主要是通过对象的内部转换成一个整数实现的

#### toString

默认返回 全类名(包名+类名) + @ + 哈希值的十六进制，子类往往重写该方法，用于返回对象的属性信息

#### finalize

当垃圾回收器确定不存在对该对象的更多引用时，由对象的垃圾回收器调用此方法

- 当对象被回收时，系统自动调用对象的 finalize 方法，子类可以重写该方法，做一些释放资源的操作
- 什么时候被回收：当某个对象没有任何引用时，则 jvm 就认为这个对象为垃圾，就会使用垃圾回收机制来销毁该对象，在销毁该对象前，会调用 finalize 方法
- 程序员可以重写 finalize，写自己的业务逻辑代码(比如释放资源：数据库连接，或者打开文件…)
- 垃圾回收机制的调用，是由系统来决定(即有自己的 GC 算法)，也可以通过 `System.gc()`主动触发垃圾回收机制

### POP & OOP

> 面向过程编程和面向对象编程是两种不同的编程范式。
>
> 面向过程编程是一种基于函数的编程方式，它将程序看作是一系列的步骤或函数调用。程序按照顺序执行，每个函数都是为了完成某个特定的任务而设计的。面向过程编程的重点在于算法和数据结构。
>
> 面向对象编程则是一种基于对象的编程方式，它将程序看作是一组对象的集合。每个对象都有自己的状态和行为，并且可以与其他对象进行交互。面向对象编程的重点在于对象之间的关系和交互。
>
> 总的来说，面向过程编程更加注重算法和数据结构，而面向对象编程更加注重对象之间的交互和关系。

## Class Variable & Class Method

### 基本介绍

> 类变量 Class Variable，也称静态变量 Static Variable;
> 类方法 Class Method，也称静态方法 Static Method;

### Static Variable

Java 中的静态变量是指在类中定义的一个变量，它与类相关而不是与实例相关，即无论创建多少个类实例，静态变量在内存中只有一份拷贝，被所有实例共享，任何一个该类的对象去访问它时，取到的都是相同的值，同样任何一个该类的对象去修改它时，修改的也是同一个变量。静态变量在类加载时被创建，在整个程序运行期间都存在

- 静态变量是同一个类中所有对象共享的
- 静态变量在类加载的时候就生成了
- 静态变量的访问修饰符可以是 public、protected、private 、default

使用场景

- 存储全局状态或配置信息
- 计数器或统计信息
- 缓存数据或共享资源
- 工具类的常量或方法
- 单例模式中的实例变量

```java
public class MyClass {
    public static int count = 0;
    // 其他成员变量和方法
}
MyClass.count = 10; // 通过类名访问
MyClass obj = new MyClass();
obj.count = 20; // 通过实例名访问
```

#### 生命周期

静态变量在类加载时被创建，在整个程序运行期间都存在。静态变量的生命周期与程序的生命周期一样长，即它们在类加载时被创建，在整个程序运行期间都存在，直到程序结束才会被销毁。因此，静态变量可以用来存储整个程序都需要使用的数据，如配置信息、全局变量等。

#### 初始化时机

静态变量在类加载时被初始化，其初始化顺序与定义顺序有关。

如果一个静态变量依赖于另一个静态变量，那么它必须在后面定义。

#### 常量和静态变量的区别

常量也是与类相关的，但它是用 final 关键字修饰的变量，一旦被赋值就不能再修改。与静态变量不同的是，常量在编译时就已经确定了它的值，而静态变量的值可以在运行时改变。另外，常量通常用于存储一些固定的值，如数学常数、配置信息等，而静态变量通常用于存储可变的数据，如计数器、全局状态等。

总之，静态变量是与类相关的变量，具有唯一性和共享性，可以用于存储整个程序都需要使用的数据，但需要注意初始化时机和与常量的区别。

#### 静态变量的线程安全性

Java 中的静态变量是属于类的，而不是对象的实例。因此，当多个线程同时访问一个包含静态变量的类时，需要考虑其线程安全性。

静态变量在内存中只有一份拷贝，被所有实例共享。因此，如果一个线程修改了静态变量的值，那么其他线程在访问该静态变量时也会看到修改后的值。这可能会导致并发访问的问题，因为多个线程可能同时修改静态变量，导致不确定的结果或数据一致性问题。

为了确保静态变量的线程安全性，需要采取适当的同步措施，如同步机制、原子类或 volatile 关键字，以便在多线程环境中正确地读取和修改静态变量的值。

### Static Method

类方法也叫静态方法

```java
//定义
class A{
    public static void MethodName() {
        //方法体
    }
}
//访问
A.MethodName();
A a = new A();
a.MethodName();
```

#### 使用场景

- 当我们希望不创建实例，也可以调用某个方法时

  ```java
  Math.sqrt(9);
  ```

- 开发自己的工具类时，可以声明静态方法方便调用

  ```java
  class MyTools {
      public static double calSum(double... a) {
          double sum = 0;
          for(int i = 0; i < a.length; i++) {
              sum += a[i];
          }
      }
  }

  sum = MyTools.calSum(1,2,3.3);
  ```

  #### 注意事项

  - 类方法中不允许 使用和对象有关的关键词，例如 `super,this`

    ```java
    class Person{
        int age = 0;
        public static setAge(int age){
            this.age = age;//error
            Person.age = age; //ok
        }
    }
    ```

  - 类方法中只能访问静态变量或静态方法
  - 非静态方法可以访问静态成员以及非静态成员

## main(String[] args)

### 深入理解 main 方法

`public static void main(String[] args){}`

1. main 方法是由 JVM 调用
2. JVM 需要调用类的 main()方法，所以访问权限必须是 public
3. JVM 在执行 main()方法时不创建对象，所以方法必须是 static
4. 该方法接收 String 类型的数组参数，该数组中保存执行 java 命令时传递给所允许的类的参数

   ```java
   public class Main {
       public static void main(String[] args) {
           if(args[0].equals("version")){
               System.out.println("1.0");
           }
       }
   }
   ```

   ```bash
   javac -encoding UTF-8 Main.java
   java Main version
   [OUT] 1.0
   ```

### 注意事项

1. 静态方法 main 可以访问本类的静态成员
2. 如果要访问本类的非静态成员，需要先创建对象然后再调用

## Code Block

### 基本介绍

代码块又称为初始化块，属于类的成员，类似于方法，将逻辑语句封装再方法体中，用 `{}`包围

代码块与方法不同，没有方法名，返回值以及参数，只有方法体，而且不用通过对象或类显示调用，而是加载类时或创建对象时隐式调用

```java
[修饰符]{
  //方法体
};
```

- 修饰符可省略，此时为普通代码块
- 修饰符只能为 static，此时为静态代码块
- 逻辑语句可以为任意逻辑语句(输入、输出、方法调用、循环、判断等)
- 末尾 `;`可以省略

### 应用场景

- 代码块相当于另外一种形式的构造器(对构造器的补充机制)，可以做初始化操作
- 场景：如果多个构造器中都有重复的语句，可以抽取到初始化块中，提高代码的重用性

```java
class Movie {
    String name;
    double duration;
    static {//调用构造器前会先调用代码块
        System.out.println("电影广告开始");
        System.out.println("电影广告结束");
    }
    public Movie(double duration) {
        this.duration = duration;
    }
    public Movie(String name, double duration) {
        this.name = name;
        this.duration = duration;
    }
}
```

### 使用细节

- static 代码块也叫静态代码块，作用就是对类进行初始化，而且它随着类加载而执行，并且只会执行一次。

  **类什么时候加载：**

  - 创建对象实例时(创建相同对象，类只会加载一次)
  - 创建子类对象实例时，父类也会被加载，而且父类先被加载，子类后被加载
  - 使用类的静态成员时，调用类的静态成员时，类的父类也会被加载

- 普通的代码块，在创建的对象实例时，会被隐形的调用，与类是否加载无关

  - 对象被创建一次，就会调用一次
  - 如果只是使用类的静态成员，普通代码块并不会执行

### 创建对象顺序

无继承关系时优先级

顺序：静态-普通-构造器

1. 调用静态代码块和静态属性初始化
   静态代码块和静态属性初始化调用的优先级一样，他们同时出现时，按照定义顺序调用

   ```java
   static {
       System.out.println("static code blcok");
   }
   public static int n1 = 5;
   ```

2. 调用普通代码块和普通属性初始化
   它们的优先级一样，规则同时，按代码顺序执行
3. 调用构造器

有继承关系时优先级

顺序：父子静态 父类普通&构造 子类普通&构造

1. 父类的静态代码块和静态属性初始化
2. 子类的静态代码块和静态属性初始化
3. 父类的普通代码块和普通属性初始化
4. 父类的构造方法
5. 子类的普通代码块和普通属性初始化
6. 子类的构造方法

   ```java
   public class Main {
       public static void main(String[] args) {
           B b = new B();
       }
   }

   class A {
       {
           System.out.println("A普通代码块");
       }
       public A() {
           System.out.println("A构造器");
       }
   }
   class B extends A{
       {
           System.out.println("B普通代码块");
       }
       public B() {
           System.out.println("B构造器");
       }
   }
   A普通代码块
   A构造器
   B普通代码块
   B构造器
   ```

## Singleton Pattern

### 介绍

单例模式（Singleton Pattern）是 Java 中最简单的设计模式之一。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建。这个类提供了一种访问其唯一的对象的方式，可以直接访问，不需要实例化该类的对象。

单例模式是一种创建型设计模式，它确保一个类只有一个实例，并提供了一个全局访问点来访问该实例。

**注意：**

- 1、单例类只能有一个实例。
- 2、单例类必须自己创建自己的唯一实例。
- 3、单例类必须给所有其他对象提供这一实例。

### 步骤

1. 构造器私有化 =》防止直接 `new`一个对象
2. 类的内部创建对象 =》 用 `static`修饰，使得静态的公共方法能够返回它
3. 向外暴露一个静态的公共方法
4. 代码实现

### Singleton Eager Initialization

类被加载时就创建了对象，可能造成创建了对象但是没有使用的情况

```java
class Wife {
    private String name;
    private static Daisy = new Wife("Daisy");
    private Wife(String name) {
        this.name = name;
    }
    public static Wife getInstance() {
        return Daisy;
    }
}

public class Singleton {
    public static void main(String[] args) {
        Wife instance = Wife.getInstance();
    }
}
```

### Singleton Lazy Initialization

当用户使用 getInstance 时，才创建对象；存在线程安全问题

```java
class Cat {
    private String name;
    private static Cat cat; //声明但不分配空间
    private Cat(String name) {
        this.name = name;
    }
    public static Cat getInstance(){
        if(cat == null) {
            cat = new Cat("Daisy");
        }
        return cat;
    }
}
```

## Final

### 基本介绍

final 在 Java 中是一个保留的关键字，可以修饰类、属性、方法和局部变量。一旦你将引用声明作 final，你将不能改变这个引用了，编译器会检查代码，如果试图将变量再次初始化的话，编译器会报编译错误

### 使用场景

- 当不希望类被继承时，用 final 修饰
- 不希望方法被子类重写时
- 不希望类的某个属性值被修改
- 不希望某个局部变量被修改，此时局部变量也称为局部常量，例如 `final double PI = 3.1415926`

### 细节

- final 修饰的属性又叫常量，命名规范形如 `TAX_RATE`
- final 修饰的属性必须赋初值，并且不能再修改； 可以在定义时赋值、在代码块中、构造器中赋值
- 如果 final 修饰的属性是静态的，则只能在定义时赋值或者在静态代码块中赋值，不能在构造器中赋值
- final 类不能被继承，但可以实例化对象
- 如果类不是 final 类，但是含有 final 方法，则该方法虽然不能被重写，但是可以被继承[A3]类
- 如果类被 final 修饰，内部的方法就没必要用 final 修饰了
- final 不能修饰构造器
- final 与 static 往往搭配使用，效率更高，不会导致类加载，底层编译器做了优化处理

  ```java
  class A {
      public final static int num = 100;
      static {
          System.out.println("Static Block");
      }
  }

  class main {
      public static void main(String[] args){
     A.num; //此时不会加载A类，因为底层编译器对此做了优化
      }
  }
  ```

- 包装类,String 都是 final 类，不能被继承

## Abstract Class

### 基本介绍

在面向对象的概念中，所有的对象都是通过类来描绘的，但是反过来，并不是所有的类都是用来描绘对象的，如果一个类中没有包含足够的信息来描绘一个具体的对象，这样的类就是抽象类

- 由于抽象类不能实例化对象，所以抽象类必须被继承，才能被使用
- 父类包含了子类集合的常见的方法，但是由于父类本身是抽象的，所以不能使用这些方法。
- 在 Java 中抽象类表示的是一种继承关系，一个类只能继承一个抽象类，而一个类却可以实现多个接口

### Abstract Method

如果你想设计这样一个类，该类包含一个特别的成员方法，该方法的具体实现由它的子类确定，那么你可以在父类中声明该方法为抽象方法。

Abstract 关键字同样可以用来声明抽象方法，抽象方法只包含一个方法名，而没有方法体。

抽象方法没有定义，方法名后面直接跟一个分号，而不是花括号

抽象方法不能被 private、final、static 修饰，因为这些关键字都与 override 相违背

```java
public abstract class Employee{
    private String name;
    private String address;
    private int number;
    public abstract double computePay();
}
```

### 注意细节

- 抽象类的本质还是类，可以有类的任意成员，可以没有抽象方法，但含有抽象方法的类一定是抽象类
- 抽象类不能被实例化，只有抽象类的非抽象子类可以创建对象
- 抽象类中的抽象方法只是声明，不包含方法体
- 构造方法，类方法不能声明为抽象方法
- 抽象类的子类必须给出抽象类中的抽象方法的具体实现，除非该子类也是抽象类

### Template Design Pattern

```java
public abstract class Template {
    public abstract void job();

    public void calculateTime() {
        long start = System.currentTimeMillis();
        job();
        long end = System.currentTimeMillis();
     System.out.println("执行时间 = " + (end - start));
    }
}

public class Test extends Template {
    public void job() {
        //TO DO
    }
}
```

```java
// 抽象饮料类
public abstract class Beverage {
    // 模板方法
    public final void prepareBeverage() {
        boilWater();
        brew();
        pourInCup();
        if (addCondiments()) {
            addCondiments();
        }
    }

    // 公共方法
    public void boilWater() {
        System.out.println("Boiling water");
    }

    public void pourInCup() {
        System.out.println("Pouring into cup");
    }

    // 抽象方法
    public abstract void brew();

    public abstract boolean addCondiments();
}

// 具体饮料类之一：咖啡
public class Coffee extends Beverage {
    public void brew() {
        System.out.println("Dripping coffee through filter");
    }

    public boolean addCondiments() {
        System.out.println("Adding sugar and milk");
        return true;
    }
}

// 具体饮料类之二：茶
public class Tea extends Beverage {
    public void brew() {
        System.out.println("Steeping the tea");
    }

    public boolean addCondiments() {
        System.out.println("Adding lemon");
        return false;
    }
}

// 客户端代码
public class Client {
    public static void main(String[] args) {
        Beverage coffee = new Coffee();
        coffee.prepareBeverage();

        Beverage tea = new Tea();
        tea.prepareBeverage();
    }
}

```

## Interface

### 基本介绍

接口，在 JAVA 编程语言中是一个抽象类型，是抽象方法的集合，接口通常以 interface 来声明。一个类通过继承接口的方式，从而来继承接口的抽象方法。

接口无法被实例化，但是可以被实现。一个实现接口的类，必须实现接口内所描述的所有方法，否则就必须声明为抽象类。另外，在 Java 中，接口类型可用来声明一个变量，他们可以成为一个空指针，或是被绑定在一个以此接口实现的对象

### 引入案例

```java
interface Usb {
    public void connect();
    public void disconnect();
}

class Phone implements Usb {
    public void connect() {
        System.out.println("Connect to phone");
    }
    public void disconnect() {
        System.out.println("Disconnect from phone");
    }
}

class Camera implements Usb {
    public void connect() {
        System.out.println("Connect to camera");
    }
    public void disconnect() {
        System.out.println("Disconnect from camera");
    }
}

class Computer {
    public void working(Usb device){
        device.connect();
        device.disconnect();
    }
}

class Main {
    public static void main(String[] args) {
        Computer computer = new Computer();
        computer.working(new Phone());
        computer.working(new Camera());
    }
}
```

```powershell
Connect to phone
Disconnect from phone
Connect to camera
Disconnect from camera
```

### 接口特性

- 接口中的方法会被隐式的指定为 `public`接口中的抽象方法可以不写 `abstract`
- 接口中可以含有变量，但是接口中的变量会被隐式的指定为 **public static final** 变量（并且只能是 public，用 private 修饰会报编译错误）。
  访问方式 `Interfacename.variablename`
- 接口中的非 `default`、`static`方法是不能在接口中实现的，只能由实现接口的类来实现接口中的方法
- JDK8 之后可以有 `default`和 `static`方法
- 抽象类去实现接口时，可以不实现接口的抽象方法；普通类实现接口时，必须将接口的所有方法都实现

  ```java
  interface a {
      default void m1 {
          System.out.println(" ");
      };
      public static void m2 {
          System.out.println(" ");
      }
  }
  ```

  - default 方法的应用

    ```java
    //声明为默认方法或者静态方法，子类不需要将Interface中的默认方法重写，只需要重写自己需要用到的方法即可
    public interface MouseListener {
     default void mousedieked(MouseEvent event) {}
        default void mousePressed(MouseEvent event) {}
        default void mouseReleased(MouseEvent event) {}
        default void mouseEntered(MouseEvent event) {}
        default void mouseExited(MouseEvent event) {}
    }
    ```

- 接口不能继承类，但可以继承多个接口

  ```java
  interface A {};
  interface B {};
  interface C extends A,B{};
  ```

- 接口的修饰符与类一样，只能是默认或者 public

### Extends vs. Implements

继承的价值：解决代码的复用性和可维护性
接口的价值：设计好各种规范、方法，让其他类去实现，比继承更加灵活

实现接口是对 Java 单继承机制的补充

当子类继承了父类，就自动拥有了父类的一些功能，如果子类需要扩展这些功能，可以通过 `implements`接口来实现扩展

```java
interface Fishable {
    void swimming();
}
interface Fly {
    void flying();
}

class LilMonkey extends Monkey implements Fishable,Fly {
 //继承Monkey类，通过Implements实现Swim，Fly
}
```

### Interface & Polymorphism

### Interface PolyParameters

接口类型的变量可以指向实现接口的对象
A 类型变量 demo 可以指向 a,b

```java
interface A {}
class a implements A {}
class b implements B {}

//main()
A demo = new a();
demo = new b();
```

### Interface PolyArr

```java
interface Usb{
    void work();
}
class Phone implements Usb{...}
class Camera implements Usb{...}
//main
Usb[] usbs = new Usb[3];
Usb[0] = new Phone();
Usb[1] = new Camera();

for(Usb usb: usbs) {
    usb.work();
    if(usb instanceof Phone) {
        (Phone)usb.call(); //向下转型
    }
}
```

### Interface PolyPass

```java
//多态传递现象
interface I1 {}
interface I2 extends I1 {}
class A implements I2 {}
//A实现了I2,I2继承I1 ==|> A需要实现I1
I1 demo = new A(); //ok
I2 demo2 = new A(); //ok
```

## Inner Class

### 基本介绍

一个类的内部又嵌套了另一个类结构，被嵌套的类称为内部类 Inner Class，外部的类称为外部类 Outer Class；内部类的最大特点就是可以直接访问私有属性，并且可以体现类与类之间的包含关系

Java 一个类中可以嵌套另外一个类，语法格式如下

```java
class OuterClass {   // 外部类
    // ...
    class NestedClass { // 嵌套类，或称为内部类
        // ...
    }
}

class Other{ // 外部其他类
}
```

### Four Inner Class

- 定义在外部类的局部位置
  - 局部内部类(有类名)
  - 匿名内部类(无类名)
- 成员内部类
  - 静态成员内部类
  - 非静态成员内部类

#### Local Inner Class

局部内部类是定义再外部类的局部位置，通常在方法内；

- 可以直接访问外部类的所有成员，包括 private
- 不能添加修饰符，但是可以使用 `final`修饰
- 作用域：定义它的方法或代码块中
- 外部类在方法中，可以创建内部类对象，然后调用方法
- 如果外部类的成员与内部类的成员重名，则遵循就近原则，如果想访问外部类的成员，可以使用 `外部类名.this.成员`
  外部类.this 也是用于区分内部类和外部类的同名属性或方法。它指向包含当前内部类的外部类的实例

  ```java
  class Outer {
      private int n1 = 100;
      private void m1() {}
      public void localmethod1() {
          final class Inner {
              public void f1() {
                  int n1 = 10;
                  //内部类可以直接访问外部类的所有成员，包括private
                  System.out.println("n1 = " + n1); //10
                  System.out.println(Outer.this.n1); //100
                  System.out.println("Outer.this.hashCode = " + Outer.this.hashCode());
                  m1();
              }
          }
          //外部类在方法中，可以创建内部类对象，然后调用方法
          Inner foo = new Inner();
          foo.f1();
      }
  }

    class Main {
        public static void main(String[] args) {
            Outer outer = new Outer();
            System.out.println("outer.hashCode() = " + outer.hashCode());
            outer.localmethod1();
        }
    }
  ```

  ```powershell
  outer.hashCode() = 366712642
  n1 = 10
  100
  Outer.this.hashCode = 366712642
  ```

#### Anonymous Inner Class

匿名内部类是定义在外部类的局部位置，比如方法中，并且没有类名的类

- 本质是类，内部类，该类没有名字
- 同时是一个对象
- 匿名内部类可以当实参传递，简洁高效

```java
//语法
new class_name/interface_name(parameterlist) {
    类体
};
```

匿名内部类的名字为 Outer\$1,JDK 底层在创建匿名内部类 Outer$1 后，立即生成一个实例对象，并将其地址赋值给 cat 变量，用完之后匿名内部类就不能再使用，但 cat 对象能正常使用;同理 p 的运行类型为 Outer\$2

```java
interface say{
    void cry();
}

class Person {
    String name;
    public Person(String name) {
        this.name = name;
    }
    public void sayHello() {
        System.out.println("Hello");
    }
}

class Outer {
    public void method() {
        //cat的编译类型为say,运行类型为匿名内部类
        say cat = new say(){
            @Override
            public void cry() {
                System.out.println("meow");
            }
        };
        cat.cry();
        //p的编译类型为Person,运行类型为匿名内部类
        Person p = new Person("Jack"){
            @Override
            public void sayHello() {
                System.out.println("Hello,Anonymous");
            }
        };
        p.sayHello();
        System.out.println("cat的运行类型 = " + cat.getClass()); //Outer$1
        System.out.println("p的运行类型 = " + p.getClass()); //Outer$2
    }
}

public class Main {
    public static void main(String[] args) {
        Outer outer = new Outer();
        outer.method();
    }
}
```

匿名内部类当实参传递

```java
interface Bell {
    void ring();
}

class CellPhone {
    public void alarmclock(Bell bell) {
        bell.ring();
    }
}

class Main {
    public static void main(String[] args) {
        CellPhone cellPhone = new CellPhone();
        cellPhone.alarmclock(new Bell(){
            @Override
            public void ring() {
                System.out.println("嗨，匿名内部类");
            }
        });
        cellPhone.alarmclock(() -> System.out.println("懒猪起床了"));
    }
}
```

#### Member Inner Class

- 定义在外部类的成员位置上，可以直接访问外部类的所有成员，包括私有成员
- 可以添加任意访问修饰符
- 作用域和外部类的其他成员一样，为整个类体
- 成员内部类访问外部类可以直接访问，外部类访问内部类需要先创建对象然后再访问
- 外部其他类访问内部类：

  - `外部实例名.new 内部类名()`

    ```java
    Outer foo = new Outer();
    Outer.Inner test = foo.new Inner();
    ```

  - 写一个 `getInnerInstance`方法

  ```java
  class Outer {
      private int n = 1;
      public class Inner {
          ...
      }

      public Inner getInnerInstance() {
          return new Inner();
      }
  }
  ```

- 内部类与外部类变量重名，遵循就近原则，如果要访问外部变量，语法 `Outer.this.n`

#### Static Inner Class

- 可以直接访问外部类的静态成员，作用域为整个类体，但不能直接访问非静态成员
- 内部类访问外部类，直接访问即可；外部类访问内部类，创建对象后访问
- 外部其他类访问内部类

  - `Outer.Inner foo = new Outer.Inner`
  - `getInnerInstance`
    `Outer.Inner foo = Outer.Inner.getInner()`

  ```java
  class Outer {
      public static String name = 'Jack';
      static class Inner {
       System.our.println(name);
      }
      public Inner getInnerinstance() {
          return new Inner;
      }
  }

  class Other {
      Outer.Inner foo = new Outer.Inner();
  }
  ```

- 重名时访问规则同上，访问外部类时 `Outer.n`即可

## Ref

[Java Guide 成员变量与局部变量的区别](https://javaguide.cn/java/basis/java-basic-questions-01.html#%E6%88%90%E5%91%98%E5%8F%98%E9%87%8F%E4%B8%8E%E5%B1%80%E9%83%A8%E5%8F%98%E9%87%8F%E7%9A%84%E5%8C%BA%E5%88%AB)
[Pass By Value or Referrence 知乎](https://www.zhihu.com/question/20628016/answer/28970414)
[Java Pass By Value or Referrence?](https://www.zhihu.com/question/31203609)
