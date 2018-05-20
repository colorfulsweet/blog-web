---
title: Hexo站点实现站内搜索
date: 2018-1-9 14:44:53
tags: 
  - Hexo
categories: 
  - 前端杂烩
---

在hexo博客中 , 可以添加站内文章搜索的支持
但是需要生成所有文章的索引
安装hexo官方提供的插件
```bash
npm install hexo-generator-search --save
```
<!-- more -->
默认只索引post , 要索引所有文章 , 需要在_config.yml当中配置
```yml
search:
  path: search.xml
  field: all
```

之后访问`/search.xml`就可以获取到文章的索引了
大致是如下结构
```xml
<search>
  <entry>
    <title>CSS布局(4)-grid</title>
    <link href="/文章URL地址/"/>
    <url>/文章URL地址/</url>
    <content type="html">
    <![CDATA[
    <p>这里是文章内容</p>
    ]]>
    </content>
    <categories>
      <category>分类1</category>
    </categories>
    <tags>
      <tag>标签1</tag>
      <tag>标签2</tag>
    </tags>
  </entry>
  ...
</search>
```
其中的一个entry是一篇文章的信息
可以在JS当中使用ajax获取到这段XML文本 , 然后进行解析处理 , 从而做出站内搜索的功能
需要注意的是content部分是html文本 , 在处理当中需要把html标签去除

以下是借助Vue实现的自动渲染搜索结果列表的代码
```javascript
(function(){
var articleDatas = null;
var resultDiv = null;
new Vue({
  el: "#search-box",
  data: {
    queryText: null, //搜索的关键字文本
    searchResult: [] //搜索结果
  },
  mounted: function() {
    axios({ //调用ajax获取文章索引信息
      url: "/search.xml"
    }).then(function(response){
      var xmlDoms = null
      if(window.DOMParser) {
        var parser = new DOMParser()
        xmlDoms = parser.parseFromString(response.data, "application/xml")
      } else { // IE浏览器
        var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoms = xmlDoc.loadXML(response.data);
      }
      //找出所有文章的标题 正文 URL
      articleDatas = Array.prototype.map.call(xmlDoms.getElementsByTagName("entry"), function(item){
        return {
          title: item.getElementsByTagName("title")[0].innerHTML,
          content: item.getElementsByTagName("content")[0].innerHTML,
          url: item.getElementsByTagName("url")[0].innerHTML,
        }
      })
      resultDiv = document.getElementById("search-result-box")
    });
  },
  watch: {
    queryText: function(newVal, oldVal) {
      this.searchResult.length = 0;
      // 控制搜索结果框的显示与隐藏
      if(newVal && newVal.trim() && articleDatas) {
        resultDiv.style.display = "block"
      } else {
        resultDiv.style.display = "none"
        return
      }
      //多关键字分别匹配
      var keywords = newVal.trim().toLowerCase().split(/[\s\-]+/);
      var _this = this;
      articleDatas.forEach(function(article){
        var isMatch = true;
        var title = article.title.trim().toLowerCase();
        var content = article.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
        var index_title = -1;
        var index_content = -1;
        var first_occur = -1; //关键字在正文当中第一次出现的位置
        if(title && content) {
          keywords.forEach(function(keyword, i) {
            index_title = title.indexOf(keyword);
            index_content = content.indexOf(keyword);
            if( index_title < 0 && index_content < 0 ){
              isMatch = false;
            } else {
              if (index_content < 0) {
                index_content = 0;
              }
              if (i == 0) {
                first_occur = index_content;
              }
            }
          });
        }
        if (isMatch) {
          var resultItem = {};
          resultItem.url = article.url;
          resultItem.title = article.title;
          if (first_occur >= 0) {
            // 截取关键字前后的一段文字
            var start = first_occur - 6;
            var end = first_occur + 15;
            if(start < 0){
              start = 0;
            }
            if(start == 0){
              end = 10;
            }
            if(end > content.length){
              end = content.length;
            }
            var matchContent = content.substring(start, end); 
            // 高亮关键字
            keywords.forEach(function(keyword){
              var keywordReg = new RegExp(keyword, "gi");
              matchContent = matchContent.replace(keywordReg, "<strong class=\"search-keyword\">"+keyword+"</strong>");
            })
            resultItem.matchContent = matchContent
          }
          _this.searchResult.push(resultItem)
        }
      })
    }
  }
})
})()
```
这里借助axios实现ajax请求 , 当然也可以用别的 , 或者使用原生的写法
然后在页面的适当位置中编写搜索input与搜索结果框的html
```html
<div id="search-box">
  <div class="icon"><span class="icon-search"></span></div>
  <div class="input-box"><input type="text" id="search-input" v-model="queryText" placeholder="站内搜索"/></div>
  <!-- 搜索结果区 -->
  <div id="search-result-box" >
    <ul class="search-result-list" v-if="searchResult.length">
      <li v-for="(article,index) in searchResult" :key="index">
        <a :href='article.url' class='search-result-title' target='_blank'>{{article.title}}</a>
        <p class="search-result" v-html="article.matchContent"></p>
      </li>
    </ul>
    <!-- 无匹配时显示 -->
    <p class="search-result" v-else>没有搜索到任何结果</p>
  </div>
</div>
```
之后编写相应的样式就可以了
