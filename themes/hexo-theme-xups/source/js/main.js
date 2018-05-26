require.config({
	baseUrl: '/js/',
	paths: {
		echo: 'lib/echo.min',
		loadlive2d: 'lib/live2d',
		axios: 'lib/axios.min',
		bannerGirl: 'banner-girl',
		vue: 'lib/vue.min',
		polyfill: 'lib/polyfill.min'
	},
	shim: {
		loadlive2d: {
			exports: 'loadlive2d'
		}
	}
});
require(['echo', 'bannerGirl'],function(echo, loadBannerGirl){
	function deepCopy(c, p) {
	　var c = c || {};
	　for (var i in p) {
	　　if (typeof p[i] === 'object') {
	　　　c[i] = (p[i].constructor === Array) ? [] : {};
	　　　deepCopy(p[i], c[i]);
	　　} else {
	　　　c[i] = p[i];
	　　}
	　}
	　return c;
	}
	(function(){
	var JELON = window.JELON || {};
	JELON = deepCopy(JELON, {
		name: 'JELON',
		version: '0.0.2',
		init: function() {
			this.toggleMenu();
			this.backToTop();
	
			echo.init({
				offset: 50,
				throttle: 250,
				unload: false,
				callback: function(element, op) {
					//console.log(element, 'has been', op + 'ed')
				}
			});
		},
		$: function(str) {
			return /^(\[object HTML)[a-zA-Z]*(Element\])$/.test(Object.prototype.toString.call(str)) ? str : document.getElementById(str);
		},
		toggleMenu: function() {
			var _this = this,
				$menu = _this.$(_this.name + '__menu');
			_this.$(_this.name + '__btnDropNav').onclick = function() {
				if ($menu.className.indexOf('hidden') === -1) {
					$menu.className += ' hidden';
				} else {
					$menu.className = $menu.className.replace(/\s*hidden\s*/, '');
				}
	
			};
		},
		backToTop: function() {
			var _this = this;
			if (typeof _this.$(_this.name + '__backToTop') === 'undefined') return;
			window.onscroll = window.onresize = function() {
				if (document.documentElement.scrollTop + document.body.scrollTop > 0) {
					_this.$(_this.name + '__backToTop').style.display = 'block';
				} else {
					_this.$(_this.name + '__backToTop').style.display = 'none';
				}
			};
			_this.$(_this.name + '__backToTop').onclick = function() {
				var Timer = setInterval(GoTop, 10);
	
				function GoTop() {
					if (document.documentElement.scrollTop + document.body.scrollTop < 1) {
						clearInterval(Timer)
					} else {
						document.documentElement.scrollTop /= 1.1;
						document.body.scrollTop /= 1.1
					}
				}
			};
		}
	});
	/**
	 * 布局初始化
	 */
	JELON.init();
	window.JELON = JELON;
	})();
	// 加载看板娘
	loadBannerGirl();
});
require(['polyfill', 'local-search'])