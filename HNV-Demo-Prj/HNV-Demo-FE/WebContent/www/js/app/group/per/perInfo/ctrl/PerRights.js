/**
 * Right definitions for PERSON
 */

define(['jquery'],
	function($) {

	var PerRights = function(){
		//	TYPE PARTNER----------------------------------------
		var typePartnerClient		= 1010002;
		var typePartnerProspect		= 1010007;
		
		var typePartnerProvider		= 1010003;
		var typePartnerProducer		= 1010004;
		var typePartnerDoctor		= 1010005;
		var typePartnerThirdparty	= 1010006;

		var typeCompany				= 1010010;
		var typeCompanyChild		= 1010011;
		
		//  RIGHT PERSON----------------------------------------
		
		var RIGHT_PER_CLIENT_G		=	20101;
		var RIGHT_PER_CLIENT_N		=	20102;
		var RIGHT_PER_CLIENT_M		=	20103;
		var RIGHT_PER_CLIENT_D		=	20104;
		var RIGHT_PER_CLIENT_R		=	20105;
		
		var RIGHT_PER_SUPPLIER_G	=	20201;
		var RIGHT_PER_SUPPLIER_N	=	20202;
		var RIGHT_PER_SUPPLIER_M	=	20203;
		var RIGHT_PER_SUPPLIER_D	=	20204;
		var RIGHT_PER_SUPPLIER_R	=	20205;
		
		var RIGHT_PER_PRODUCER_G	=	20301;
		var RIGHT_PER_PRODUCER_N	=	20302;
		var RIGHT_PER_PRODUCER_M	=	20303;
		var RIGHT_PER_PRODUCER_D	=	20304;
		var RIGHT_PER_PRODUCER_R	=	20305;
		
		var RIGHT_PER_THIRDPARTY_G	=	20401;
		var RIGHT_PER_THIRDPARTY_N	=	20402;
		var RIGHT_PER_THIRDPARTY_M	=	20403;
		var RIGHT_PER_THIRDPARTY_D	=	20404;
		var RIGHT_PER_THIRDPARTY_R	=	20405;
		
	
		this.req_lc_Right = function(right){
			
			var listUserRight = App.data.user.rights;
			
			if(listUserRight.includes(right)) return right;
			
			return -1;
		}
	};

	return PerRights;
  });