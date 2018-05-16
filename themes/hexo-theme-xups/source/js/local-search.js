(function(){
var articleDatas = null;
var resultDiv = null;
new Vue({
	el: "#search-box",
	data: {
		queryText: null,
		searchResult: []
	},
	mounted: function() {
		resultDiv = document.getElementById("search-result-box")
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
					content: item.getElementsByTagName("content")[0].textContent,
					url: item.getElementsByTagName("url")[0].textContent,
				}
			})
		});
	},
	watch: {
		queryText: function(newVal, oldVal) {
			this.searchResult.length = 0;
			if(!resultDiv) return;
			if(newVal && newVal.trim() && articleDatas) {
				resultDiv.style.display = "block"
			} else {
				resultDiv.style.display = "none"
				return
			}
			var keywords = newVal.trim().toLowerCase().split(/[\s\-]+/);
			var _this = this;
			articleDatas.forEach(function(article){
				var isMatch = true;
				var title = article.title.trim().toLowerCase();
				var content = article.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
				var index_title = -1;
				var index_content = -1;
				var first_occur = -1; //关键字在正文当中第一次出现的位置
				keywords.forEach(function(keyword, i) {
					index_title = title ? title.indexOf(keyword) : -1;
					index_content = content ? content.indexOf(keyword) : -1;
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
