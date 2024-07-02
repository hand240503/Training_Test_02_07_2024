/**
 * Right definitions for USER
 */

define(['jquery'],
		function($) {

	var AutUserRights = function(){

		//  RIGHT USER----------------------------------------

		var RIGHT_AUT_USER_G		=	10101;
		var	RIGHT_AUT_USER_N		=	10102;
		var RIGHT_AUT_USER_M		=	10103;
		var	RIGHT_AUT_USER_D		=	10104;
		var RIGHT_AUT_USER_R		=	10105;

		var RIGHT_AUT_ROLE_G		=	10201;
		var RIGHT_AUT_ROLE_N		=	10202;
		var RIGHT_AUT_ROLE_M		=	10203;
		var RIGHT_AUT_ROLE_D		=	10204;

		this.req_lc_Right = function(right){


			var listUserRight = App.data.user.rights;
			
			if(listUserRight.includes(right)) return right;

			return -1;
		}

		this.req_lc_Roles = function(role){

			var listUserRight = App.data.user.rights;
			
			if(listUserRight.includes(role)) return role;
			
			return -1;
		}
	};

	return AutUserRights;
});