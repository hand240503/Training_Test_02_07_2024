package com.hnv.api.service.publ.com;

import javax.servlet.http.HttpServletResponse;

import com.hnv.api.def.DefAPI;
import com.hnv.api.def.DefJS;
import com.hnv.api.interf.IService;
import com.hnv.api.main.API;
import com.hnv.common.tool.ToolJSON;
import com.hnv.common.tool.ToolLogServer;
import com.hnv.data.json.JSONObject;
import com.hnv.db.aut.TaAutUser;
import com.hnv.def.DefAPIExt;



public class ServicePubl implements IService {

	//--------------------------------Service Definition----------------------------------
	public static final String SV_MODULE 							= "EC_V3".toLowerCase();

	public static final String SV_CLASS 							= "ServicePubl".toLowerCase();

	public static final String SV_PING 								= "SVPing".toLowerCase();	
	public static final String SV_VERS 								= "SVVersion".toLowerCase();	

	//-------------------------Default Constructor - Required -------------------------------------
	public ServicePubl(){
		ToolLogServer.doLogInf("----" + SV_CLASS + " is loaded -----");
	}

	//-----------------------------------------------------------------------------------------------

	@Override
	public void doService(JSONObject json, HttpServletResponse response) throws Exception {
		// ToolLogServer.doLogInf("--------- "+ SV_CLASS+ ".doService --------------");
		String 		sv 		= API.reqSVFunctName(json);
		TaAutUser 	user	= (TaAutUser) json.get("userInfo");
		try {
			
			if (sv.equals(SV_PING)){
				doPing(user, json, response);
			}else if (sv.equals(SV_VERS)) {
				doVers(user, json, response);
			}
		} catch (Exception e) {
			API.doResponse(response, DefAPI.API_MSG_ERR_API);
			e.printStackTrace();
		}
	}
	
	
	private static void doPing(TaAutUser user, JSONObject json, HttpServletResponse response) throws Exception {
		API.doResponse(response, ToolJSON.reqJSonString(		//filter,
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, "Hello" 
				));	
	}
	
	
	private static void doVers(TaAutUser user, JSONObject json, HttpServletResponse response) throws Exception {
		API.doResponse(response, ToolJSON.reqJSonString( // filter,
				DefJS.SESS_STAT	, 1, 
				DefJS.SV_CODE	, DefAPI.SV_CODE_API_YES, 
				DefJS.RES_DATA	, DefAPIExt.API_VERSION));
	}

	
}
