---
title: Spring
---

## Spring Overview

Spring 在不同语境下有不同的含义。它可以用来指代[Spring Framework](https://github.com/spring-projects/spring-framework)本身；后来，很多[基于 Spring 框架开发的项目](https://spring.io/projects)涌现出来，Spring 也被用来指代基于 Spring Framework 的项目家族。本文 Spring 代表 Spring Framework 本身。

<img src="Spring/Spring1.webp" alt="alt text">

### History

Spring 是 Rod Johnson 在[《Expert One-on-One J2EE Development without EJB》](https://book.douban.com/subject/1426848/)中提出的一种取代 EJB(Enterprise JavaBeans) 的轻量级框架，Spring 和 Java EE 是互补的技术栈，Spring 通过选择性集成 Java EE 的一些规范，提供了一个更加轻量、灵活的开发框架。开发者可以在 Spring 中利用 Jakarta EE 的优势，同时保持独立于 Java EE 平台的灵活性。

> “Jakarta”是 Java EE（Java Platform, Enterprise Edition）的继任者的名称，它是一个开放的、企业级 Java 应用开发平台。Jakarta EE 是在 Java EE 被移交给 Eclipse 基金会后产生的新名称。
> 在 Jakarta EE 9 中，API 命名空间由 `javax._` 更改为 `jakarta._`

### Design Philosophy

- Provide choice at every level.
- Accommodate diverse perspectives.
- Maintain strong backward compatibility.
- Care about API design.
- Set high standards for code quality.

## Core Technologies Overview

### Features

- **Core** technologies: dependency injection, events, resources, i18n, validation, data binding, type conversion, SpEL, AOP.
- **Testing**: mock objects, TestContext framework, Spring MVC Test, WebTestClient.
- **Data** Access: transactions, DAO support, JDBC, ORM, Marshalling XML.
- **Spring** MVC and Spring WebFlux web frameworks.
- **Integration**: remoting, JMS, JCA, JMX, email, tasks, scheduling, cache and observability.
- **Languages**: Kotlin, Groovy, dynamic languages.

## Modules

<img src="Spring/Spring.png" alt="Spring5.x主要模块">

- Core Container:
  - spring-core
  - spring-beans
  - spring-context
  - spring-expression

<img src="Spring/Spring.webp" alt="alt text">

## IoC Container

### Component & Container

组件可以是一个简单的函数、一个类，也可以是一个复杂的子系统。比如 Service, DAO 等等；

组件的容器用于管理其生命周期，提供组件运行所需要的资源和服务。以 Servlet 容器为例，其负责 Servlet,Filter,Listener 等组件的管理。Tomcat，Jetty 是常见的 Servlet 容器;

Spring 中的组件是由 Spring 管理的，这些组件被封装在 **Spring Bean** 中，而 Spring Bean 是由 IoC 容器来管理的。

`ApplicationContext context = new ClassPathXmlApplicationContext("application.xml");`语句便是在创建一个 Spring IoC Container 的实例

### IoC

IoC，即 Inversion of Control，中文译为控制反转。IoC 是一种设计原则，其核心思想是将对象的创建和管理的控制权从程序代码转移到外部容器，这个外部容器通常是一个框架。这样做的目的是为了降低程序代码之间的耦合度，提高代码的模块化和可维护性，同时方便单元测试。案例可参考[IoC 原理——廖雪峰](https://liaoxuefeng.com/books/java/spring/ioc/basic/index.html)

- **控制**（Control）：指的是对象创建（实例化、管理）的权力
- **反转**（Inversion）：控制权交给外部环境（Spring 框架、IoC 容器）

[Spring IoC 容器源码分析](https://javadoop.com/post/spring-ioc)

#### DI

DI，Dependency Injection 是 IoC 的实现方式之一，Martin Fowler 在[《Inversion of Control Containers and the Dependency Injection pattern》](Inversion of Control Containers and the Dependency Injection pattern)中提议 IoC 这一命名太宽泛，DI 这种表述更直接；

- **依赖**（Dependency）：指一个对象使用另一个对象的实例。例如，类 A 需要使用类 B 的功能，因此类 A“依赖”于类 B。
- **注入**（Injection）：指将这个依赖对象传递给需要它的对象，而不是让类 A 自己创建类 B 的实例。

> 通俗讲，IoC 是一种设计思想，DI 作为 IoC 一个具体的实现方式。不过后来发现基本上 IOC 只有 DI 这一种实现方式，两者也不再做严格区分了

**DI 的三种实现方式**

1. 构造器注入（Constructor Injection）

```java
class ServiceA {
    private ServiceB serviceB;
    // 构造函数注入
    public ServiceA(ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}
```

2. 属性注入（Property Injection / Setter Injection）

```java
class ServiceA {
    private ServiceB serviceB;

    // Setter 注入
    public void setServiceB(ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}
```

3. 接口注入（Interface Injection）

```java
interface IService {
    void setServiceB(ServiceB serviceB);
}

class ServiceA implements IService {
    private ServiceB serviceB;

    // 实现接口中的注入方法
    public void setServiceB(ServiceB serviceB) {
        this.serviceB = serviceB;
    }
}
```

#### Bean

## AOP

## Ref

[Spring Home](https://spring.io/)
[Spring Framework Documentation](https://docs.spring.io/spring-framework/reference/index.html)
