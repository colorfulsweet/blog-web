define(['axios', 'vue'],function(axios, Vue){
var articleDatas = null,
  resultDiv = null,
  initCallback = function(){};
function executeSearch(keywords) {
	var _this = this;
	articleDatas.forEach(function(article){
		var isMatch = true,
		 title = article.title.trim().toLowerCase(),
		 index_title = -1, index_content = -1,
		 first_occur = -1; //关键字在正文当中第一次出现的位置
		keywords.forEach(function(keyword, i) {
			index_title = title ? title.indexOf(keyword) : -1;
			index_content = article.content ? article.content.indexOf(keyword) : -1;
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
		if (isMatch) {
			var resultItem = {};
			resultItem.url = article.url;
			resultItem.title = article.title;
			if (first_occur >= 0) {
				// 截取出关键字所在的前后若干字符
				var start = first_occur - 10;
				var end = first_occur + 15;
				if(start <= 0){
					start = 0;
					end = 25;
				}
				if(end > article.content.length){
					end = article.content.length;
				}
				var matchContent = article.content.substring(start, end); 
				// 高亮关键字
				keywords.forEach(function(keyword){
					var keywordReg = new RegExp(keyword, "gi");
					matchContent = matchContent.replace(keywordReg, "<strong class=\"search-keyword\">"+keyword+"</strong>");
				})
				resultItem.matchContent = matchContent
			}
			_this.searchResult.push(resultItem)
		}
	});
}
new Vue({
	el: "#search-box",
	data: {
		queryText: null,
		searchResult: [],
		searchIniting: false // 搜索是否正在初始化(search.xml文件很大, 异步ajax以及xml解析需要时间)
	},
	mounted: function() {
		resultDiv = document.getElementById("search-result-box");
	},
	methods : {
		searchInit: function() {
			if(articleDatas || this.searchIniting) return;
			this.searchIniting = true;
			var _this = this;
			axios({
				url: "/search.xml"
			}).then(function(response){
				var xmlDoms = null
				if(window.DOMParser) {
					var parser = new DOMParser()
					xmlDoms = parser.parseFromString(response.data, "application/xml")
				} else {
					xmlDoms = new ActiveXObject("Microsoft.XMLDOM");
					xmlDoms.async = false;
					xmlDoms.loadXML(response.data);
				}
				//找出所有文章的标题 正文 URL
				articleDatas = Array.prototype.map.call(xmlDoms.getElementsByTagName("entry"), function(item){
					return {
						title: item.getElementsByTagName("title")[0].textContent,
						content: item.getElementsByTagName("content")[0].textContent.trim().replace(/<[^>]+>/g,"").toLowerCase(),
						url: item.getElementsByTagName("url")[0].textContent,
					}
				});
				_this.searchIniting = false;
				initCallback.call(_this);
			}).catch(function(){
				_this.searchIniting = false;
				_this.searchInit();
			});
		}
	},
	watch: {
		queryText: function(newVal, oldVal) {
			this.searchResult.length = 0;
			if(!resultDiv) return;
			if(newVal && newVal.trim()) {
				resultDiv.style.display = "block";
			} else {
				resultDiv.style.display = "none";
				return
			}
			var keywords = newVal.trim().toLowerCase().split(/[\s\-]+/);
			var _this = this;
			if(this.searchIniting) {
				initCallback = function(){
					executeSearch.call(this, keywords);
				}
			} else {
				executeSearch.call(this, keywords);
			}
		}
	}
})
})
