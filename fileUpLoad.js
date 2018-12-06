(function(root,factory){
	if (typeof define === 'function' && define.amd) {
		define(['$'], factory);
	} else if (typeof exports === 'object') { //umd
		module.exports = factory();
	} else {
		root.fileInputCompent  = factory(window.Zepto || window.jQuery || $);
	}
})(this,function($){
	var  url = '';
	var fileInputCompent = {
			init : function(options){
				 url = options.url; 
				 var accessTemps = '<div style="width:100%;height:30px;line-height:30px;background-color: #f9f9f9"><a style="font-size:14px;float:left;margin-left:15px" ctype="file_type" filesize="@filesize" filename="@filename" path="@path" size="@size">@filename</a> <a style="margin-left:25px;">@filesize</a><span class="fileupload_del" onclick="fileInputCompent.remove(this)" title="删除"></span><span path="@path" class="fileupload_down" filename="@filename" title="下载" onclick="fileInputCompent.download(this)"></span> <span class="fileupload_view" filename="@filename" path="@path" title="预览" onclick="fileInputCompent.view(this)"></span></div>';
				 $("#fileupload").fileinput({
			         theme: 'explorer',
			         language: 'zh',
			         uploadUrl: url+'/workflow/form/CaseManage/uploadFileAccess.do',
			         showRemove:false,
			         uploadAsync:false,
			         showUpload:false,
			         showCaption:true,
			         dropZoneEnabled:false,
			         showPreview:false,
			         browseLabel:"文件上传",
			         uploadExtraData:function(a,b){
			  	           return {flag:"0"};
			  	     }
			     }).on('filebatchselected', function (event, files) {//选中文件事件  
			         $(this).fileinput("upload"); 
			     });
			     $('#fileupload').on("filebatchuploadsuccess", function(event, data, previewId, index) {
			     	 if(data.response.message){
			     	    var context = data.response.message;
			     	    if(context){
			     	       var datas = eval(context);
			     	       var strs = "";
			     	       for(var i = 0; i < datas.length; i++){
				               strs = accessTemps.replace("@filename", datas[i].filename)
				                  .replace("@filename", datas[i].filename)
				                  .replace("@filename", datas[i].filename)
				                  .replace("@size", datas[i].size)
				                  .replace("@path", datas[i].path)
				                  .replace("@path", datas[i].path)
				                  .replace("@path", datas[i].path)
				                  .replace("@filesize", datas[i].filesize)
				                  .replace("@filesize", datas[i].filesize);
			                   $("#uploadfilelist").append(strs);
			     	       }
			     	    }
			     	 }
			 	 });
			},
			remove : function(element){
		 	    if(!element){
		  	       return;
		  	    }
		  	    var parentElement = element.parentElement;
		  	    var outElement = document.getElementById("uploadfilelist");
		  	    outElement.removeChild(parentElement);
		  	},
		  	download : function(element){
		  	   if(element){
		  		   var path = element.getAttribute("path");
		  		   path=encodeURI(encodeURI(path)); 
		  	       var filename = element.getAttribute("filename");
		  	       filename=encodeURI(encodeURI(filename)); 
		  	       var dpwnloadurl = url+"/workflow/form/CaseManage/downLoad.do?path=" + path + "&filename=" + filename;
		  		   window.open(dpwnloadurl);
		  	   }
		     },
		     initHasSavedFile : function(files){
		 	     if(files){
		 	         var datas = eval(files);
		 	         if(datas && datas.length > 0){
		 	             var strs = "";
		 	             for(var i = 0; i < datas.length; i++){
		     	            strs += accessTemps.replace("@filename", datas[i].filename).replace("@filename", datas[i].filename).replace("@filename", datas[i].filename).replace("@size", datas[i].size).replace("@path", datas[i].path).replace("@path", datas[i].path).replace("@filesize", datas[i].filesize).replace("@filesize", datas[i].filesize);
		     	         }
		     	         $("#uploadfilelist").html(strs);
		 	         }
		 	      }
		 	 }		     
	 };
	 /**
	  * 该接口是封装了上传的文件功能，支持多个文件上传，支持下载文件
	  * 使用方法为三步
	  * 第一步：引入插件，例子：<script src="$ui.ctx/js/fileUpLoad.js"></script>，根据路径改做出相应改动。
	  * 第二步：添加样式
	  * <style>.kv-file-upload{display:none} 
        .fileupload_del{float:right;background-image: url("$!link.contextPath/style/images/del.png");margin-right:20px;width:22px;height:22px;display:inline-block;cursor: pointer;}
        .fileupload_down{float:right;background-image: url("$!link.contextPath/style/images/down.png");margin-right:15px;width:20px;height:20px;display:inline-block;cursor: pointer;}
        .fileupload_view{float:right;background-image: url("$!link.contextPath/style/images/view.png");margin-right:15px;width:20px;height:22px;display:none;cursor: pointer;}
        </style>
      *第三步：调用插件暴露接口方法：uploadTools。调用方式参照用例：$("#"+ id).uploadTools({url:'/dmdp-workflow'})。id为添加的div的id值，url为工程根路径。放到$(function(){}),页面加载自动调用。
	  */
 	 $.fn.extend({ 
 		 uploadTools : function(options){			       
 			 if(null == this){throw new Error("没有找到相应dom元素！")}
 			 var str ="<div class='ibox-content'><div class='form-group'><label class='col-sm-2 control-label'></label><div class='col-sm-8'><div style='width:100%;min-height:50px;' id='uploadfilelist'></div></div></div><div class='form-group' id='file_id'><label class='col-sm-2 control-label'>上传附件</label><div class='col-sm-8'><input style='float:right;width:80px;height:30px' multiple id='fileupload' type='file' value='上传附件'/></div></div></div>"
 			 this.append(str);
 			 fileInputCompent.init(options);
         }
 	 })
 	 
 	  /**
 	  * 获取上传文件的信息
 	  * 使用方法：$.getFileInfos(),返回值是数组，信息包含文件路径，文件名，文件大小。
 	  * 返回值是一个数组。
 	  */
 	 $.extend({
 		 getFileInfos : function(){
 			var fileInfos = [];
 			var div_files = $("#uploadfilelist div");		
 			if(div_files.length != 0){
 				 $.each(div_files, function(index,file) {
 					 var array    =  file.getElementsByTagName("a");
 					 var fileInfo =  {
 						 "path"     : array[0].getAttribute("path"),
 						 "filename" : array[0].getAttribute("filename"),
 						 "filesize" : array[0].getAttribute("filesize")
 					 }				 
 					 fileInfos.push(fileInfo);
 				 });
 			 }
 			 return Array.prototype.slice.call(fileInfos);
 		 }	 
 	 })
 	return fileInputCompent;
})

