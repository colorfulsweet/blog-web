// A local search script with the help of [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
// Copyright (C) 2015 
// Joseph Pan <http://github.com/wzpan>
// Shuhao Mao <http://github.com/maoshuhao>
// Edited by MOxFIVE <http://github.com/MOxFIVE>
(function(){
var searchFunc = function(path, search_id, content_id) {
	'use strict';
	axios({
		url: path
	}).then(function(response){
		var parser = new DOMParser()
		const xmlDoms = parser.parseFromString(response.data, "application/xml")
		//找出所有文章的标题 正文 URL
		var datas = Array.prototype.map.call(xmlDoms.getElementsByTagName("entry"), function(){
			return {
				title: this.getElementsByTagName("title").innerHTML,
				content: this.getElementsByTagName("content").innerHTML,
				url: this.getElementsByTagName("url").innerHTML,
			}
		})
		var $input = document.getElementById(search_id);
		var $resultContent = document.getElementById(content_id);

		$input.addEventListener('input', function(){
			var str='<ul class=\"search-result-list\">';                
			var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
			$resultContent.innerHTML = "";
			if (this.value.trim().length <= 0) {
					return;
			}
			// perform local searching
			datas.forEach(function(data) {
				var isMatch = true;
				var content_index = [];
				var data_title = data.title.trim().toLowerCase();
				var data_content = data.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
				var data_url = data.url;
				var index_title = -1;
				var index_content = -1;
				var first_occur = -1;
				// only match artiles with not empty titles and contents
				if(data_title != '' && data_content != '') {
					keywords.forEach(function(keyword, i) {
						index_title = data_title.indexOf(keyword);
						index_content = data_content.indexOf(keyword);
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
				// show search results
				if (isMatch) {
						str += "<li><a href='"+ data_url +"' class='search-result-title' target='_blank'>"+ "> " + data_title +"</a>";
						var content = data.content.trim().replace(/<[^>]+>/g,"");
						if (first_occur >= 0) {
							// cut out characters
							var start = first_occur - 6;
							var end = first_occur + 6;
							if(start < 0){
								start = 0;
							}
							if(start == 0){
								end = 10;
							}
							if(end > content.length){
								end = content.length;
							}
							var match_content = content.substr(start, end); 
							// highlight all keywords
							keywords.forEach(function(keyword){
								var regS = new RegExp(keyword, "gi");
								match_content = match_content.replace(regS, "<em class=\"search-keyword\">"+keyword+"</em>");
							})
							str += "<p class=\"search-result\">" + match_content +"...</p>"
						}
					}
				})
				$resultContent.innerHTML = str;
		})
	})
	
	// $.ajax({
	// 	url: path,
	// 	dataType: "xml",
	// })
}
var articleDatas = null;
new Vue({
	el: "#search-box",
	data: {
		queryText: null,
		searchResult: null
	},
	mounted: function() {
		axios({
			url: "/search.xml"
		}).then(function(response){
			var xmlDoms = null
			if(window.DOMParser) {
				var parser = new DOMParser()
				xmlDoms = parser.parseFromString(response.data, "application/xml")
			} else {
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
		});
	},
	watch: {
		queryText: function(newVal, oldVal) {
			if(!newVal || !newVal.trim() || !articleDatas) return
			var keywords = newVal.trim().toLowerCase().split(/[\s\-]+/);
			var searchResult = '<ul class=\"search-result-list\">';
			articleDatas.forEach(function(article){
				var isMatch = true;
				var content_index = [];
				var data_title = article.title.trim().toLowerCase();
				var data_content = article.content.trim().replace(/<[^>]+>/g,"").toLowerCase();
				var data_url = article.url;
				var index_title = -1;
				var index_content = -1;
				var first_occur = -1;
				if(data_title && data_content) {
					keywords.forEach(function(keyword, i) {
						index_title = data_title.indexOf(keyword);
						index_content = data_content.indexOf(keyword);
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
					searchResult += "<li><a href='"+ data_url +
					"' class='search-result-title' target='_blank'>"+ "> " +data_title+"</a>";
					var content = article.content.trim().replace(/<[^>]+>/g,"");
					if (first_occur >= 0) {
						// cut out characters
						var start = first_occur - 6;
						var end = first_occur + 6;
						if(start < 0){
							start = 0;
						}
						if(start == 0){
							end = 10;
						}
						if(end > content.length){
							end = content.length;
						}
						var match_content = content.substr(start, end); 
						// highlight all keywords
						keywords.forEach(function(keyword){
							var keywordReg = new RegExp(keyword, "gi");
							match_content = match_content.replace(keywordReg, "<strong class=\"search-keyword\">"+keyword+"</strong>");
						})
						searchResult += "<p class=\"search-result\">" + match_content +"...</p>";
					}
					searchResult += "</li>";
				}
			})
			searchResult += "</ul>";
			this.searchResult = searchResult
			console.log(searchResult)
		}
	}
})
})()
