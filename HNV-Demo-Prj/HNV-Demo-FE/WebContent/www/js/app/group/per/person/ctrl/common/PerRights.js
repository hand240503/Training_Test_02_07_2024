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
		
		var RIGHT_PER_CLIENT_G		=	30000011;
		var RIGHT_PER_CLIENT_N		=	30000012;
		var RIGHT_PER_CLIENT_M		=	30000013;
		var RIGHT_PER_CLIENT_D		=	30000014;
		var RIGHT_PER_CLIENT_R		=	30000015;
		
		var RIGHT_PER_SUPPLIER_G	=	30000021;
		var RIGHT_PER_SUPPLIER_N	=	30000022;
		var RIGHT_PER_SUPPLIER_M	=	30000023;
		var RIGHT_PER_SUPPLIER_D	=	30000024;
		var RIGHT_PER_SUPPLIER_R	=	30000025;
		
		var RIGHT_PER_PRODUCER_G	=	30000031;
		var RIGHT_PER_PRODUCER_N	=	30000032;
		var RIGHT_PER_PRODUCER_M	=	30000033;
		var RIGHT_PER_PRODUCER_D	=	30000034;
		var RIGHT_PER_PRODUCER_R	=	30000035;
		
		var RIGHT_PER_THIRDPARTY_G	=	30000041;
		var RIGHT_PER_THIRDPARTY_N	=	30000042;
		var RIGHT_PER_THIRDPARTY_M	=	30000043;
		var RIGHT_PER_THIRDPARTY_D	=	30000044;
		var RIGHT_PER_THIRDPARTY_R	=	30000045;
		
		var RIGHT_PER_SELF_G		=	30000001;
		var RIGHT_PER_SELF_N		=	30000002;
		var RIGHT_PER_SELF_M		=	30000003;
		var RIGHT_PER_SELF_D		=	30000004;
		var RIGHT_PER_SELF_R		=	30000005;
		
	
		this.req_lc_Right = function(typePartner, right){
			
			var rightCode 	= -1;
			
			switch(typePartner){
			
			case typePartnerProspect:
			case typePartnerClient	: {
				var listRight = [RIGHT_PER_CLIENT_G, RIGHT_PER_CLIENT_N, RIGHT_PER_CLIENT_M, RIGHT_PER_CLIENT_D, RIGHT_PER_CLIENT_R];
				rightCode 	= listRight[right];
			};
			break;
			
			case typePartnerProvider:{
				var listRight = [RIGHT_PER_SUPPLIER_G, RIGHT_PER_SUPPLIER_N, RIGHT_PER_SUPPLIER_M, RIGHT_PER_SUPPLIER_D, RIGHT_PER_SUPPLIER_R];
				rightCode = listRight[right];
			};
			break;
			case typePartnerProducer:{
				var listRight = [RIGHT_PER_PRODUCER_G, RIGHT_PER_PRODUCER_N, RIGHT_PER_PRODUCER_M, RIGHT_PER_PRODUCER_D, RIGHT_PER_PRODUCER_R];
				rightCode = listRight[right];
			};
			break;
			
			case typePartnerThirdparty	:
			case typePartnerDoctor		:{ //Doctor is also Third Party
				var listRight = [RIGHT_PER_THIRDPARTY_G, RIGHT_PER_THIRDPARTY_N, RIGHT_PER_THIRDPARTY_M, RIGHT_PER_THIRDPARTY_D, RIGHT_PER_THIRDPARTY_R];
				rightCode = listRight[right];
			};
			break;
			
			case typeCompany 		:		
			case typeCompanyChild 	:{
				var listRight = [RIGHT_PER_SELF_G, RIGHT_PER_SELF_N, RIGHT_PER_SELF_M, RIGHT_PER_SELF_D, RIGHT_PER_SELF_R];
				rightCode = listRight[right];
			}	
			break;
			}
			
			var listUserRight = App.data.user.rights;
			for(var i = 0; i < listUserRight.length; i++){
				if(rightCode == listUserRight[i]){
					return rightCode;
				}
			}
			return -1;
		}
	};

	return PerRights;
  });