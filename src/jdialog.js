define(['jquery', 'jqueryUI', 'jdialog'], function($, $UI, dialog){
	function JDialog(config) {
		this.config = $.extend({
			// 对话框宽度
			width: '',
			// 对话框高度
			height: '',
			// 对话框标题
			title: 'JDialog',
			// 对话框内容
			content: '<span>JDialog content<span>',
			// 右上角关闭按钮,回调函数
			close: null,
			// 确定按钮回调函数
			ok: null,
			// 确定按钮文本
			okVal: 'ok',
			// 取消按钮回调函数
			cacel: null,
			// 取消按钮文本
			cacelVal: 'cacel',
			// 取消按钮是否显示
			cacelDisplay: 'true',
			// 自定义样式class名
			skin: '',
			// css文件路径，留空不自动加载样式。只允许加载一个css文件。
			cssUri: '../css/ui-jdialog.css',
			// 模态
			isModal: false,
			// 遮罩背景颜色
			maskBg: '#000',
			// 遮罩透明度
			maskOpacity: 0.7,
			// 是否可拖动，使用jqueryui插件
			isDrag: true,
			// 指定哪个地方可以拖动,可拖动地方的class
			dragHandler: ".ui-jdialog-header",
			// 模板。使用jd="***"属性识别目标结构。
			innerHTML: 
					'<div class="ui-jdialog-main">'
				+		'<div jd="header" class="ui-jdialog-header">'
				+			'<button jd="close" class="ui-jdialog-close">&#215;</button>'
				+			'<div jd="title" class="ui-jdialog-title"></div>'
				+		'</div>'
				+		'<div jd="content" class="ui-jdialog-content"></div>'
				+		'<div jd="footer" class="ui-jdialog-footer">'
				+			'<div jd="button" class="ui-jdialog-btn">'
				//+				'<button jd="cacel" class="ui-jdialog-btn-default">cacel</button>'
				//+				'<button jd="ok" class="ui-jdialog-btn-default ui-jdialog-btn-primary">ok</button>'
				+			'</div>'
				+		'</div>'
				+	'</div>'
		}, config);
		
	};
	JDialog.prototype = {
		/**
		 * 初始化对话框
		 */
		_init: function(){
			// 添加包裹层。便于元素的查找
			var wrapper = this._wrapLayer = $("<div />").addClass('ui-jdialog').attr('jd', 'dialog')
										.html(this.config.innerHTML).appendTo('body');
			var CFG = this.config;
			this.config._wrapLayer = wrapper; // 将包裹层添加到构造函数的config对象中
			if(CFG.title) {
				this.setTitle(this.config.title);
			}
			if(typeof CFG.content === 'string') {
				this.setContent(this.config.content);
			}
			if(CFG.isModal) {
				this.config._maskObj = maskObj = $('<div class="ui-jdialog-mask"></div>');
				maskObj.appendTo('body');
				if(typeof CFG.maskBg === 'string') {
					maskObj.css({"background": CFG.maskBg})
				} 
				if(typeof CFG.maskOpacity === 'number') {
					maskObj.css({"opacity": CFG.maskOpacity,
					             "filter": "alpha(opacity=" + CFG.maskOpacity*100 + ")"});
				}
			}
			var _proto = $.extend({}, JDialog.prototype, CFG);
			if(CFG.isModal) {
				maskObj.click(function(){
					_proto.removeWrap();
				});
			}
			if(typeof CFG.cacel === 'function') {
				this._find("button").append('<button jd="cacel" class="ui-jdialog-btn-default"></button>');
				var cacelBtn = this._find("cacel");
				if(typeof CFG.cacelVal === 'string') {
					cacelBtn.text(CFG.cacelVal);
				}
				cacelBtn.click(function(){
					CFG.cacel.apply(_proto, arguments);
				});
			}
			if(typeof CFG.ok === 'function') {
				this._find("button").append('<button jd="ok" class="ui-jdialog-btn-default ui-jdialog-btn-primary"></button>');
				var okBtn = this._find("ok");
				if(typeof CFG.okVal === 'string') {
					okBtn.text(CFG.okVal);
				}
				okBtn.click(function(){
					CFG.ok.call(_proto, arguments);
				});
			}
			if(typeof CFG.close === 'function') {
				this._find("close").click(function(){
					CFG.close.call(_proto, arguments);
					_proto.removeWrap();
				});
			}else {
				this._find("close").addClass("ui-jdialog-hidden");
			}
			if(CFG.skin) {
				wrapper.addClass(CFG.skin);
			}
			if(CFG.isDrag) {
				if(CFG.dragHandler) {
					wrapper.draggable({handle: CFG.dragHandler});
				}
				wrapper.draggable();
			}
			this._setCenter(wrapper);
			
		},
		listen: function(){},
		/** 显示对话框  */
		show: function() {
			this._init();
			return this;
		},
		/** 显示遮罩层 */
		showModal: function() {
			this.config.isModal = true;
			return this.show.apply(this, arguments);
		},
		/**
		 * 设置内容
		 * @param {string} html
		 */
		setContent: function(html) {
			this._find('content').html(html);
			return this;
		},
		/**
		 * 设置标题
		 * @param {string} text
		 */
		setTitle: function(text) {
			this._find('title').text(text);
			return this;
		},
		removeWrap: function(){
			if(this.isModal) {
				this._maskObj.remove();
			}
			this._wrapLayer.remove();
		},
		/**
		 * 查找自定义节点函数
		 * @param {string} jd
		 */
		_find: function(jd) {
			return this._wrapLayer.find('[jd=' + jd + ']');
		},
		/**
		 * 设置元素位置在浏览器可视区域居中
		 * @param {Object} 元素对象
		 */
		_setCenter: function(elem) {
			var docW = document.documentElement.clientWidth || document.body.clientWidth,
				docH = document.documentElement.clientHeight || document.body.clientHeight,
				docL = document.documentElement.scrollLeft || document.body.scrollLeft,
				docT = document.documentElement.scrollTop || document.body.scrollTop,
				elemW = elem.width(),
				elemH = elem.height();
			var left = ((docW - elemW)/2)/(docW) * 100 + "%",
				top =  ((docH - elemH)/2)/(docH) * 100 + "%";
			elem.css({
				"position": "fixed",
				"top": top,
				"left": left
			});
		}
	};	
	return JDialog;	
});
