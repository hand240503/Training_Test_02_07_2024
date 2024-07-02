package com.hnv.api.service.publ.cfg;


import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import com.hnv.api.def.DefAPI;
import com.hnv.api.def.DefJS;
import com.hnv.api.def.DefTime;
import com.hnv.api.interf.IService;
import com.hnv.api.main.API;
import com.hnv.api.service.common.APIAuth;
import com.hnv.common.tool.ToolData;
import com.hnv.common.tool.ToolJSON;
import com.hnv.common.tool.ToolLogServer;
import com.hnv.common.util.CacheData;
import com.hnv.data.json.JSONObject;
import com.hnv.db.aut.TaAutUser;
import com.hnv.db.cfg.TaCfgValue;
import com.hnv.def.DefDBExt;
/**
* ----- ServiceCfgGroup by H&V
* ----- Copyright 2023------------
*/
public class ServiceCfgValuePubl implements IService {
	private static	String 			filePath	= null; 
	private	static	String 			urlPath		= null; 
	

	//--------------------------------Service Definition----------------------------------
	public static final String SV_MODULE 				= "HNV".toLowerCase();

	public static final String SV_CLASS 				= "ServiceCfgValuePubl".toLowerCase();	
	
	public static final String SV_GET 					= "SVGet"		.toLowerCase();	
	public static final String SV_LST 					= "SVLst"		.toLowerCase();
	
	public static final Integer	ENT_TYP					= DefDBExt.ID_TA_CFG_VALUE;
		
	//-----------------------------------------------------------------------------------------------
	//-------------------------Default Constructor - Required -------------------------------------
	public ServiceCfgValuePubl(){
		ToolLogServer.doLogInf("----" + SV_CLASS + " is loaded -----");
	}

	//-----------------------------------------------------------------------------------------------

	@Override
	public void doService(JSONObject json, HttpServletResponse response) throws Exception {
		String 		sv 		= API.reqSVFunctName(json);
		TaAutUser 	user	= (TaAutUser) json.get("userInfo");
		try {
			//---------------------------------------------------------------------------------
			if(sv.equals(SV_GET) 				){
				doGet(user,  json, response);

			} else if(sv.equals(SV_LST)			){
				doLst(user,  json, response);

			} else {
				API.doResponse(response, DefAPI.API_MSG_ERR_RIGHT);
			}	

		}catch(Exception e){
			API.doResponse(response, DefAPI.API_MSG_ERR_API);
			e.printStackTrace();
		}		
	}
	//---------------------------------------------------------------------------------------------------------
	
	private static final int WORK_GET 	= 1;
	private static final int WORK_LST 	= 2;
	private static final int WORK_NEW 	= 3;
	private static final int WORK_MOD 	= 4;
	private static final int WORK_DEL 	= 5;
	private static final int WORK_UPL 	= 10; //upload
	
	private static boolean canWorkWithObj ( TaAutUser user, int typWork, Object...params){
		switch(typWork){
		case WORK_GET : 
			//check something with params
			return true;
		case WORK_LST : 
			//check something with params
			return true;
		case WORK_NEW : 
			//check something with params
			return true;
		case WORK_MOD : 
			//check something with params
			return true;	
		case WORK_DEL : 
			//check something with params
			return true;
		case WORK_UPL : 
			//check something with params
			return true;
		}
		return false;
	}
	//---------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------------
	private static CacheData<TaCfgValue> 		cache_entity= new CacheData<TaCfgValue>		(500, DefTime.TIME_10_00_00_000 );
	static {
		cache_entity.doCheckTimeAuto(DefTime.TIME_10_00_00_000);
	}
	private static void doGet(TaAutUser user,  JSONObject json, HttpServletResponse response) throws Exception  {	
		//ToolLogServer.doLogDebug("--------- "+ SV_CLASS+ ".doGet --------------");

		TaCfgValue 		ent 		= reqGet(json);

		if (ent==null){
			API.doResponse(response, DefAPI.API_MSG_KO);
			return;
		}

		if (!canWorkWithObj(user, WORK_GET, ent)){
			API.doResponse(response, DefAPI.API_MSG_ERR_RIGHT);
			return;
		}

		API.doResponse(response, ToolJSON.reqJSonString(		//filter,
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, ent 
				));
	}
	
	private static TaCfgValue reqGet(JSONObject json) throws Exception{
		String	 			entCode		= ToolData.reqStr	(json, "code"		, null	);
		if (entCode==null)	return null;
		
		TaCfgValue 			ent 		= cache_entity.reqData(entCode);	
		if (ent ==null) {
			ent 	= TaCfgValue.DAO.reqEntityByValue(TaCfgValue.ATT_T_CODE, entCode);;
			
			if (ent!=null) {
				//---do something and put to cache
				cache_entity.reqPut(entCode, ent);
			}
		}else {				
			ToolLogServer.doLogInf("---reqGet use cache-----");
		}

		return ent;
	}
	
	//---------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------
	private static CacheData<List<TaCfgValue>> 	cache_lst 		= new CacheData<List<TaCfgValue>>(500, DefTime.TIME_10_00_00_000 );	
	static {
		cache_lst.doCheckTimeAuto(DefTime.TIME_10_00_00_000);
	}
	private static void doLst(TaAutUser user,  JSONObject json, HttpServletResponse response) throws Exception  {
		//ToolLogServer.doLogDebug("--------- "+ SV_CLASS+ ".doLst --------------");
		List<TaCfgValue> 	list = reqLst(user, json); 
		
		if (list==null ){
			API.doResponse(response,DefAPI.API_MSG_KO);
			return;
		}

		API.doResponse(response, ToolJSON.reqJSonString(//filter,		
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, list 
				));				
	}

	private static List<TaCfgValue> reqLst(TaAutUser user, JSONObject json) throws Exception  {
		Set<String>	 		codes	= ToolData.reqSetStr	(json, "codes"	, null	);
		Set<Integer>	 	ids		= ToolData.reqSetInt	(json, "ids"	, null	);
		if (codes==null && ids==null)	return null;
		String 				key		= "";
		if (codes!=null) {
			key		= codes.toString();
		} else {
			key		= ids.toString();
		}
		
		List<TaCfgValue> 	lst		= cache_lst.reqData(key);	
		if (lst ==null) {
			if (codes!=null) {
				lst 	= TaCfgValue.DAO.reqList_In(TaCfgValue.ATT_T_CODE, codes, 
						Restrictions.eq(TaCfgValue.ATT_I_STATUS_01, TaCfgValue.STAT_01_ACTIVE));;
			} else {
				lst 	= TaCfgValue.DAO.reqList_In(TaCfgValue.ATT_I_ID, ids, 
						Restrictions.eq(TaCfgValue.ATT_I_STATUS_01, TaCfgValue.STAT_01_ACTIVE));
			}
			
			if (lst!=null && lst.size()>0) {
				//---do something and put to cache
				cache_lst.reqPut(key, lst);
			}
		}else {				
			ToolLogServer.doLogInf("---reqGet use cache-----");
			lst = null;
		}

		return lst;
	}
	
	//---------------------------------------------------------------------------------------------------------		
}
