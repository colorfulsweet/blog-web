define(['loadlive2d', 'axios'], function(loadlive2d, axios) {
/**
 * 字符串模板替换
 * 例如 template:"这是一个{text}内容", context:{text:"有趣的"}
 * return "这是一个有趣的内容"
 * @param {String} template 模板内容
 * @param {Object} context 替换的内容
 */
function render(template, context) {
	var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;
	return template.replace(tokenReg, function (word, slash1, token, slash2) {
		if (slash1 || slash2) {  
			return word.replace('\\', '');
		}
		var variables = token.replace(/\s/g, '').split('.');
		var currentObject = context;
		var i, length, variable;
		for (i = 0, length = variables.length; i < length; ++i) {
			variable = variables[i];
			currentObject = currentObject[variable];
			if (!currentObject) return '';
		}
		return currentObject;
	});
}
var re = /x/;
console.log(re);
re.toString = function() {
	showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000);
	return '';
};

document.addEventListener('copy', function(){
	showMessage('你都复制了些什么呀，转载要记得加上出处哦', 5000);
})

var tips = document.querySelector('.banner-tips');
var tipTimer = undefined;
/**
 * 显示消息
 * @param {Object} text 消息内容(如果是数组则显示其中的随机一个元素)
 * @param {Number} timeout 消失的延迟时间
 */
function showMessage(text, timeout){
	if(tipTimer) {
		window.clearTimeout(tipTimer);
		tipTimer = undefined;
	}
	if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
	tips.innerHTML = text;
	tips.style.opacity = 1;
	hideMessage(timeout);
}
/**
 * 隐藏消息
 * @param {Number} timeout 消失的延迟时间
 */
function hideMessage(timeout){
	tipTimer = setTimeout(function(){
		tips.style.opacity = 0;
	}, timeout || 5000);
}
var text, productHref = [
		'https://www.colorfulsweet.site/',
		'https://sookie2010.coding.me/',
		'https://sookie2010.github.io/'
	];
if(document.referrer){
	var referrer = document.createElement('a');
	referrer.href = document.referrer;
	text = 'Hello! 来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友';
	var domain = referrer.hostname.split('.')[1];
	if (domain == 'baidu') {
		text = 'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？';
	}else if (domain == 'so') {
		text = 'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？';
	}else if (domain == 'google') {
		text = 'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
	}
}else {
	if (productHref.indexOf(window.location.href) !== -1) { //如果是主页
		var now = new Date().getHours();
		if (now > 23 || now <= 5) {
				text = '你是夜猫子呀？这么晚还不睡觉，明天起的来吗';
		} else if (now > 5 && now <= 7) {
				text = '早上好！一日之计在于晨，美好的一天就要开始了';
		} else if (now > 7 && now <= 11) {
				text = '上午好！工作顺利吗，不要久坐，多起来走动走动哦！';
		} else if (now > 11 && now <= 14) {
				text = '中午了，工作了一个上午，现在是午餐时间！';
		} else if (now > 14 && now <= 17) {
				text = '午后很容易犯困呢，今天的运动目标完成了吗？';
		} else if (now > 17 && now <= 19) {
				text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~';
		} else if (now > 19 && now <= 21) {
				text = '晚上好，今天过得怎么样？';
		} else if (now > 21 && now <= 23) {
				text = '已经这么晚了呀，早点休息吧，晚安~';
		} else {
				text = '嗨~ 快来逗我玩吧！';
		}
	}else {
		text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split('|')[0] + '』</span>';
	}
}

/**
 * 页面中元素触发的看板娘消息
 */
function createTrigger(tips) {
	return function(){
		var text = tips.text;
		if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
		text = render(text, {text: this.textContent});
		showMessage(text, 3000);
	}
}
function bindElementEvent(url) {
	axios.get(url).then(function(res){
		for(var eventName in res.data) {
			res.data[eventName].forEach(function(tips){
				Array.prototype.forEach.call(document.querySelectorAll(tips.selector),function(item){
					item.addEventListener(eventName, createTrigger(tips));
				});
			});
		}
	});
}

// 一言
function getHitokoto(){
	axios.get('https://v1.hitokoto.cn/?encode=json&charset=utf-8&c=b&c=a&c=e').then(function(res){
		showMessage(res.data.hitokoto, 5000);
		setTimeout(getHitokoto, 30000);
	}).catch(function(){
		setTimeout(getHitokoto, 45000);
	})
}
return {
	/**
	 * 加载看板娘模型
	 * @param {Sting} modelUrl 模板的json描述文件路径
	 */
	init: function(modelUrl){
		axios.get(modelUrl).then(function(res){
			var randomIndex = Math.floor(Math.random() * res.data.textures.length);
			//随机皮肤
			if(window.location.href.startsWith('http://localhost') || ("ActiveXObject" in window)) {
				//本地开发调试或者是IE浏览器
				res.data.textures = ['/resource/model/skin/'+res.data.textures[randomIndex]];
			} else {
				//服务器部署运行(使用网易蜂巢对象存储)
				res.data.textures = ['https://blog-cdn.nos-eastchina1.126.net/live2D/'+res.data.textures[randomIndex]];
			}
			loadlive2d('live2d', '/resource/', '', res.data);
			// loadlive2d("live2d", "/resource/model.json");
		});
		// 定时显示"一言"
		setTimeout(getHitokoto, 10000);
		// 按照json当中的配置给页面元素绑定事件
		bindElementEvent("/resource/banner-tips.json");
		showMessage(text, 6000);
	},
	showMessage: showMessage
}
});