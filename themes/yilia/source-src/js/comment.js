// const AV = require('leancloud-storage');
window.AV = require('leancloud-storage');
const Valine = require('../lib/Valine.min');
/**
 * Valine.min.js.bak文件, 是根据Valine项目源代码重新打包的
 * 可以支持对于AV对象的传参输入, 而不需要暴露全局变量
 * 但是缺少一些新功能
 */
// 评论配置
const commentConfig = require("../config/comment.json");

if(window.yiliaConfig.isPost && commentConfig.valine.enable) {
	commentConfig.valine.config.path = window.location.pathname;
	// commentConfig.valine.config.av = AV;
	new Valine(commentConfig.valine.config);
}
