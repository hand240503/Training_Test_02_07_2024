define([
        'jquery',
        'text!template/shp/perInfo/Per_Ent_Tab_Doc.html'      

        ],
        function($,
			Per_Ent_Tab_Doc    		
        		) {


	var PerEntTabDoc     = function (header,content,footer, grpName) {
		var pr_divHeader 			= header;
		var pr_divContent 			= content;
		var pr_divFooter 			= footer;

		//------------------------------------------------------------------------------------
		var tmplName				= App.template.names;
		var tmplCtrl				= App.template.controller;
		
		var svClass 				= App['const'].SV_CLASS;
		var svName					= App['const'].SV_NAME;
		var sessId					= App['const'].SESS_ID;
		var userId          		= App['const'].USER_ID;

		var fVar					= App['const'].FUNCT_SCOPE;
		var fName					= App['const'].FUNCT_NAME;
		var fParam					= App['const'].FUNCT_PARAM;		

		var self 					= this;
		//------------------------------------------------------------------------------------
		
		var pr_tableNewLineId 	= 0;
		var pr_table			= undefined;
		var pr_news_line_data	= undefined;
		
		var defautNumberFormat 	= "#,###.##";
		
		//--------------------Cache-------------------------------------
		
		
		//------------------controllers------------------------------------------------------
		var pr_ctr_Main 			= null;
		var pr_ctr_List 			= null;
		var pr_ctr_Ent				= null;
		var pr_ctr_EntHeader 		= null;
		var pr_ctr_EntBtn 			= null;
		var pr_ctr_EntTabs 			= null;
		
	
		//-----------------------------------------------------------------------------------
		var pr_obj					= null;
		var pr_mode					= null;
		//--------------------APIs--------------------------------------//
		this.do_lc_init		= function(){
			pr_ctr_Main 			= App.controller.Per.Main;
			pr_ctr_List 			= App.controller.Per.List;

			pr_ctr_Ent				= App.controller.Per.Ent;
			pr_ctr_EntHeader 		= App.controller.Per.EntHeader;
			pr_ctr_EntBtn 			= App.controller.Per.EntBtn;
			pr_ctr_EntTabs 			= App.controller.Per.EntTabs;
		}
		
		this.do_lc_show		= function(obj, mode){
			
			pr_obj 	= obj;
			pr_mode		= mode;
			
			try{
				tmplCtrl.do_lc_put_tmpl(tmplName.PER_ENT_TAB_DOC, Per_Ent_Tab_Doc); 			
				$("#div_Per_Ent_Tab_Doc").html(tmplCtrl.req_lc_compile_tmpl(tmplName.PER_ENT_TAB_DOC, obj));
				
				do_bind_event (obj, mode);
			}catch(e) {
				console.log(e);
			}
		};


		//---------private-----------------------------------------------------------------------------
		var do_bind_event = function (obj, mode){
			$( "#inp_img" ).change(function() {
				let fileToUpload  = this.files;
				const formData = new FormData();
				for(var i=0;i< fileToUpload.length;i++){
					formData.append('file'+i, fileToUpload[i], fileToUpload[i].name);
				}
//				var code 		= this.input.data("code");
//				var typ01 		= this.input.data("typ01");
//				var typ02 		= this.input.data("typ02");
//				var dataname	= this.input.data("name");
//				var maxFile		= this.input.data("maxfile");
//				var maxSize		= this.input.data("maxfilesize");
//				var fileType	= this.input.data("filetype");
//				var entId		= this.input.data("entid");
				var {code,typ01,typ02,name,maxfile,maxsize,filetype,entid} = $(this).data();
				var obj = {"code":code,"typ01":typ01,"typ02":typ02,"dataname":name,"maxFile":maxfile,"maxSize":maxsize,"fileType":filetype,"entId" :entid}
				formData.append('obj', JSON.stringify( obj ));
				
				$.ajax({
					  method: "POST",
					  url: "https://localhost:44335/api", 
					  processData: false,
					  contentType: false,
					  data: formData,
					  success: function(data){
						    alert(data);
					  }
					})
					  .done(function( msg ) {
					    alert( "Data Saved: " + msg );
					  });
			})
		}.bind(this);
	};
	
	return PerEntTabDoc;
});