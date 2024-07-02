define([
        'jquery'
        ],
        function($) {



	
	var RightController 	= function () {
		
		this.		RIGHT_USER_GET		= 1; //consulter
		this.		RIGHT_USER_ADD		= 2; //ajouter
		this.		RIGHT_USER_MOD		= 3; //modifier
		this.		RIGHT_USER_DEL		= 4; //supprimer
			
		this.		RIGHT_TP_UP						= 100000; //
		this.		RIGHT_TP_RE						= 100001; //
		this.		RIGHT_TP_CH_SAFFIRE				= 100002; //
		this.		RIGHT_TP_CH_COBRA				= 100003; //
		this.		RIGHT_TP_CH_SAGE				= 100004; //
		this.		RIGHT_TP_INTERN					= 100005; //
		this.		RIGHT_TP_PARTICIPATION			= 100006; //
		
		this.		RIGHT_TP_CR						= 100020; //
		this.		RIGHT_TP_DE						= 100021; //
		this.		RIGHT_TP_DU						= 100022; //
		
		this.		RIGHT_TP_WF_01					= 100023; //
		this.		RIGHT_TP_WF_02					= 100024; //
		this.		RIGHT_TP_WF_03					= 100025; //
		this.		RIGHT_TP_WF_04					= 100026; //
		this.		RIGHT_TP_WF_015					= 100029; //
			
		this.		RIGHT_TP_REJECTED_15			= 100027; //
		this.		RIGHT_TP_REJECTED_20			= 100028; //
		this.		RIGHT_TP_REJECTED_30			= 100030; //
		
		this.		RIGHT_TP_GEN_RE					= 100040; //
		this.		RIGHT_TP_GEN_UP_IDENTITY		= 100041; //
		this.		RIGHT_TP_GEN_UP_TAX				= 100042; //
		this.		RIGHT_TP_GEN_UP_ADD_01			= 100043; //
		this.		RIGHT_TP_GEN_UP_ADD_02			= 100044; //
		this.		RIGHT_TP_GEN_UP_ADD_03			= 100045; //
		this.		RIGHT_TP_GEN_UP_COR				= 100046; //
		
		this.		RIGHT_TP_COM_RE					= 100050; //
		this.		RIGHT_TP_COM_UP_COM				= 100051; //	
		this.		RIGHT_TP_COM_CR_COM				= 100052; //
		this.		RIGHT_TP_COM_DE_COM				= 100053; //
		this.		RIGHT_TP_COM_UP_LOGO			= 100054; //
		this.		RIGHT_TP_COM_UP_CONTRACT		= 100055; //
		
		this.		RIGHT_TP_FIN_RE_REGULATION		= 100060; //
		this.		RIGHT_TP_FIN_UP_REGULATION		= 100061; //
		this.		RIGHT_TP_FIN_RE_ANALYTIC		= 100062; //
		this.		RIGHT_TP_FIN_UP_ANALYTIC		= 100063; //
		this.		RIGHT_TP_FIN_RE_SOLVENCY		= 100064; //
		this.		RIGHT_TP_FIN_UP_SOLVENCY		= 100065; //
		this.		RIGHT_TP_FIN_RE_RISK			= 100066; //
		this.		RIGHT_TP_FIN_UP_RISK			= 100067; //
		this.		RIGHT_TP_FIN_RE_BANK			= 100068; //
		this.		RIGHT_TP_FIN_UP_BANK			= 100069; //
		
		this.		RIGHT_TP_FIN_RE_TP				= 100070; //
		this.		RIGHT_TP_FIN_UP_INVOICE			= 100075; //
		this.		RIGHT_TP_FIN_UP_PAY				= 100078; //
		this.		RIGHT_TP_FIN_UP_COTRE			= 100077; //
		this.		RIGHT_TP_FIN_UP_GRKEY			= 100074; //
		
		
		this.		RIGHT_TP_BIL_RE					= 100080; //
		this.		RIGHT_TP_BIL_UP_ADMIN			= 100081; //
		this.		RIGHT_TP_BIL_UP_VALIDITY		= 100082; //
		this.		RIGHT_TP_BIL_UP_INVOICE			= 100083; //
		this.		RIGHT_TP_BIL_UP_PARTICULARITY	= 100084; //
		
		this.		RIGHT_TP_BIL_UP_ADMIN_CREATE	= 100087; //
		this.		RIGHT_TP_BIL_UP_ADMIN_DEL		= 100086; //
		
		
		this.		RIGHT_TP_CON_RE					= 100090; //
		this.		RIGHT_TP_CON_UP					= 100091; //
		this.		RIGHT_TP_CON_CR					= 100092; //
		this.		RIGHT_TP_CON_DE					= 100093; //
		
		this.		RIGHT_TP_WF_RE					= 100100; //
		
		this.		RIGHT_TP_HIS_RE_CREATION		= 100110; //
		this.		RIGHT_TP_HIS_RE_MODIFICATION	= 100111; //	

		this.		RIGHT_TP_PRINT					= 100031;
		
		//Diffusion screen access rights
		this.	 	RIGHT_AUTH_DIFFU_GET	= 1062; 
		this.		RIGHT_AUTH_DIFFU_ADD	= 1060;
		this.		RIGHT_AUTH_DIFFU_MOD	= 1061;
		this. 		RIGHT_AUTH_DIFFU_DEL	= 1063;

		
		//Mat calendar rights
		this.		RIGHT_MAT_CAL_READ				= 200100; //consulter
		this.		RIGHT_MAT_CAL_UPDATE			= 200101; //consulter
		this.		RIGHT_MAT_CAL_CREATE			= 200102; //consulter
		this.		RIGHT_MAT_CAL_DELETE			= 100000; //consulter
		this.		RIGHT_MAT_CAL_DUPLICATE			= 200103; //consulter
		
		this.		RIGHT_MAT_CAL_RCK_READ			= 200110; //consulter
		this.		RIGHT_MAT_CAL_RCK_UPDATE		= 200111; //consulter
		this.		RIGHT_MAT_CAL_RCK_CREATE		= 200112; //consulter
		this.		RIGHT_MAT_CAL_RCK_DELETE		= 200113; //consulter
		this.		RIGHT_MAT_CAL_RCK_DUPLICATE		= 200114; //consulter
		
		this.		RIGHT_MAT_CAL_HIS_READ			= 200120; //consulter
		

	
		///==========================================MATERIAL RIGHT CODES =====================//

		//Range Material rights 10000
		this.		RIGHT_MATERIAL_GET					= 200000; //10000; //consulter
		this.		RIGHT_MATERIAL_ADD					= 200001; //10001; //ajouter
		this.		RIGHT_MATERIAL_MOD					= 200002; //10002; //modifier
		this.		RIGHT_MATERIAL_COPY					= 200003; //10003; //Duplicate
		
		this.		RIGHT_MATERIAL_HEADER				= 200010; //10010; //R
		this.		RIGHT_MATERIAL_HEADER_ALL			= 200011; //10011; //U (code, generate code, type, status, unite base, Qty, Classe, Annee, cycle, variante, codecli, codeMere, type courrier) 
		this.		RIGHT_MATERIAL_HEADER_HIDE			= 200012; //10012; //I 
		this.		RIGHT_MATERIAL_HEADER_ADDIMAGE      = 200013; //Click Add Image
		this.		RIGHT_MATERIAL_HEADER_DELIMAGE      = 200014; //Click Delete Image
		
		this.		RIGHT_MATERIAL_TAB_DETAILS			= 200020; //10020; //R
		this.		RIGHT_MATERIAL_TAB_DETAILS_ALL		= 200021; //10021; //U (Property, Halal, denomination RF, EN, Story telling RF et EN)
		this.		RIGHT_MATERIAL_TAB_DETAILS_FAMILY	= 200022; //10022; //UI (Family R & D)
		this.		RIGHT_MATERIAL_TAB_DETAILS_DESC_EN	= 200023; //10024; //UI restreint
		
		this.		RIGHT_MATERIAL_TAB_NOMENC			= 200030; //10030; //R
		this.		RIGHT_MATERIAL_TAB_NOMENC_ALL		= 200031; //10031; //U
		
		this.		RIGHT_MATERIAL_TAB_GAMMES			= 200040; //10040; //R
		this.		RIGHT_MATERIAL_TAB_GAMMES_ALL		= 200041; //10041; //U
		
		this.		RIGHT_MATERIAL_TAB_USECASE			= 200050; //10050; //R
		this.		RIGHT_MATERIAL_TAB_USECASE_ALL		= 200051; //10051; //U
		
		this.		RIGHT_MATERIAL_TAB_CAL				= 200060; //10060; //R
		
		this.		RIGHT_MATERIAL_TAB_AUDIT			= 200070; //10070; //R

		this.		RIGHT_MATERIAL_TAB_WKF				= 200080; //10080; //R
		this.		RIGHT_MATERIAL_TAB_WKF_ALL			= 200081; //10081; //U
		this.		RIGHT_MATERIAL_TAB_WKF_HIDE			= 200082; //10082; //I

		
		this.can_lc_hasRight = function(right){
			if(App.data.user.rights != undefined)
				if( $.inArray(right,App.data.user.rights) !== -1)
					return true;
			return false;
		}
	

	};

	return RightController;
});