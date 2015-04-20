(function($){

	// 自定义构建的Easyui的Plugin对象
	//   如linkbutton
	var EasyuiPluginBaseModel = function(element, plugin){
		var baseModel = {
			element:element,
			plugin:plugin,
			options:{},
			observableOptions:{},
			events:{},
			methods:$.fn[plugin].methods
		};
		if($.fn[plugin] && $.fn[plugin].parseOptions){
			var options = $.extend({}, $.fn[plugin].defaults, $.fn[plugin].parseOptions(element));
			//$.extend(baseModel, $.fn[plugin].defaults, options);
			$.each(options,function(name, value){
				var option = {},observableOption={};
				//option[name] = ko.observable(value);
				//option[name] = value;
				if(name.indexOf('on') === 0 && typeof value === 'function'){
					$.extend(baseModel.events, option);
				}else{
					//observableOption[name] = function(){return value;};
					observableOption[name] = ko.observable(value);
					observableOption[name].subscribe(function(newValue){this.options[name]=newValue;},baseModel);
					$.extend(baseModel.observableOptions, observableOption);
					option[name] = (function(obj){return obj.observableOptions[name]();})(baseModel);
					$.extend(baseModel.options, option);
					
				}
			});
		}
		return baseModel;
	};

	// 绑定对象，该对象扩展ko.observable，一个对象对应到一个easyui的UI控件
	var bindingHandlerModel = function(element, valueAccessor, allBindings, viewModel, bindingContext, plugin){
		var model = ko.observable(null);
		$.extend(model,{
			ko_element: element,
			ko_valueAccessor: valueAccessor,
			ko_allBindings: allBindings,
			ko_viewModel: viewModel,
			ko_bindingContext: bindingContext,
			ko_plugin: plugin
		});
		
		return model;
	};

	// 迭代$.parser.plugins，生成自定义的bindingHandlers
	$.each($.parser.plugins,function(i, plugin){
		if($.fn[plugin] && typeof $.fn[plugin] === 'function'){
			ko.bindingHandlers[plugin] = {
				init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
					console.info(element,viewModel);
					console.info(valueAccessor,valueAccessor(),viewModel[valueAccessor()]);
					var cc = viewModel[valueAccessor()];
					console.info(valueAccessor.name,cc,cc&&cc())
					console.info(allBindings,allBindings,allBindings.get('f1'),plugin,allBindings.has(plugin));
					console.info(viewModel,viewModel.d1);
					console.info(bindingContext);
					window.aa = new EasyuiPluginBaseModel(element, plugin);
					$.extend(cc,window.aa);
					return 123;
				},
				update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
					console.info(789)
				}
			};
		}
	});
})(jQuery); 