require.config({
	paths: {
		jquery: './src/global_modules/jquery.min',
		jqueryUI: './src/global_modules/jquery-ui.min',
		jdialog: './src/jdialog.min'
	}
});
require(["jquery", "jqueryUI", "jdialog"], function($, $ui, dialog){
	var jdialog = new dialog({
		//title: "系统提示",
		content: "嘎嘎，这是测试内容哈哈哈",
		//content: '<input type="text" value="just a test for jdialog" />'//,
		//skin: "black",
		ok: function(){
			var that = this;
			that.setTitle("提交中...");
			setTimeout(function () {
	            that.removeWrap();
	        }, 2000);
			return false;
		},
		okVal: "确认",
		cacel: function(){
			var that = this;
			that.setTitle("关闭对话框中...");
			setTimeout(function () {
	            that.removeWrap();
	        }, 2000);
			return false;
		},
		cacelVal: "取消",
		/*close: function(){
			var that = this;
			that.setTitle("关闭对话框中...");
			alert("关闭对话框");
			return false;
		},*/
		isModal: true
	});
	$("#c-btn").click(function(){
		jdialog.show();
	});
	
});
