---
title: 消息中间件(2)-java连接ActiveMQ
date: 2018-11-2 15:59:34
categories: 
  - Java
tags: 
  - JMS
---

使用java连接activeMQ
### 引入依赖
```xml
<dependency>
  <groupId>org.apache.activemq</groupId>
  <artifactId>activemq-all</artifactId>
  <version>5.15.7</version>
</dependency>
```
<!-- more -->

### 1.连接ActiveMQ
```java
//step1 创建连接工厂
ConnectionFactory connectionFactory = new ActiveMQConnectionFactory("tcp://192.168.142.128:61616");

//step2 创建连接
Connection connection = connectionFactory.createConnection();

//step3 启动连接
connection.start();

//step4 创建会话
Session session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);
// 第一个参数是是否使用事务, 第二个参数是应答模式, 这里是自动应答

//step5 创建一个目标(队列)
Queue queue = session.createQueue("queue-test");
```
使用完毕之后需要调用close关闭连接
```java
// 关闭连接
connection.close();
```

### 2.生产者
使用上面的步骤当中创建的会话, 使用生产者向消息中间件发送消息
```java
// 创建生产者
MessageProducer producer = session.createProducer(queue);

// 创建消息
TextMessage textMessage = session.createTextMessage("这是一条测试消息");

// 发送消息
producer.send(textMessage);
```

### 3.消费者
创建连接和创建会话的步骤都是一样的
```java
// 创建消费者
MessageConsumer consumer = session.createConsumer(destination);

// 创建监听器
consumer.setMessageListener(new MessageListener() {
  @Override
  public void onMessage(Message message) {
    TextMessage textMessage = (TextMessage)message;
    try {
      System.out.println("接收消息:"+textMessage.getText());
    } catch (JMSException e) {
      e.printStackTrace();
    }
  }
});
```
