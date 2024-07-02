package com.hnv.api.service.publ.aut;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

import com.hnv.api.def.DefAPI;
import com.hnv.api.def.DefJS;
import com.hnv.api.def.DefTime;
import com.hnv.api.interf.IService;
import com.hnv.api.main.API;
import com.hnv.common.tool.ToolData;
import com.hnv.common.tool.ToolJSON;
import com.hnv.common.tool.ToolLogServer;
import com.hnv.common.util.CacheData;
import com.hnv.data.json.JSONObject;
import com.hnv.db.aut.TaAutStudent;
import com.hnv.db.aut.TaAutStudent;
import com.hnv.db.aut.vi.ViAutUserDyn;


public class ServiceAutStudentPubl implements IService{
	
	private static	String 			filePath	= null; 
	private	static	String 			urlPath		= null; 
	

	//--------------------------------Service Definition----------------------------------
	public static final String SV_MODULE 				= "HNV".toLowerCase();

	public static final String SV_CLASS 				= "ServiceAutStudentPubl".toLowerCase();	
	
	public static final String SV_PING 					= "SVPing"		.toLowerCase();	
	
	public static final String SV_GET 					= "SVGet"		.toLowerCase();	
	public static final String SV_LST 					= "SVLst"		.toLowerCase();
	public static final String SV_LST_DYN				= "SVLstDyn"	.toLowerCase(); 

	public static final String SV_NEW 					= "SVNew"		.toLowerCase();	
	public static final String SV_MOD 					= "SVMod"		.toLowerCase();	
	public static final String SV_DEL 					= "SVDel"		.toLowerCase();
	
	//-----------------------------------------------------------------------------------------------
	//-------------------------Default Constructor - Required -------------------------------------
	public ServiceAutStudentPubl(){
		ToolLogServer.doLogInf("----" + SV_CLASS + " is loaded -----");
	}

	//-----------------------------------------------------------------------------------------------

	@Override
	public void doService(JSONObject json, HttpServletResponse response) throws Exception {
		String 		sv 		= API.reqSVFunctName(json);
		TaAutStudent 	user	= (TaAutStudent) json.get("userInfo");
		try {
			//---------------------------------------------------------------------------------
			if(sv.equals(SV_PING)					){
				doPing(user,  json, response);
				
			} else if(sv.equals(SV_NEW)					){
				doNew(user,  json, response);
			} else if(sv.equals(SV_MOD)					){
				doMod(user,  json, response);
			} else  if(sv.equals(SV_DEL)				){
				doDel(user,  json, response);
			
			
			} else if(sv.equals(SV_GET) 				){
				doGet(user,  json, response);

			} else if(sv.equals(SV_LST)					){
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
	private static void doPing(TaAutStudent user,  JSONObject json, HttpServletResponse response) throws Exception  {
	
		API.doResponse(response, ToolJSON.reqJSonString(		
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, "Hello you touched the ServiceAutStudentPubl"
		));
	}
	
	//---------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------------
	private static void doNew(TaAutStudent user,  JSONObject json, HttpServletResponse response) throws Exception  {
		TaAutStudent 			ent		= reqNew		(user, json);
		if (ent==null){
			API.doResponse(response, DefAPI.API_MSG_KO);
			return;
		}

		API.doResponse(response, ToolJSON.reqJSonString(		//filter,
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, ent
		));
	}

	private static TaAutStudent reqNew(TaAutStudent user,  JSONObject json) throws Exception {
		JSONObject			obj		= ToolData.reqJson		 (json, "obj", null);
		Map<String, Object> attr 	= API.reqMapParamsByClass(obj, TaAutStudent.class);	
		TaAutStudent  			ent	 	= new TaAutStudent		 (attr);
		
		ent.reqSet(TaAutStudent.ATT_I_ID, null);//đảm bảo id null để CSDL quyết định khi tạo mới
		
		TaAutStudent.DAO.doPersist(ent);

		return ent;
	}
	//---------------------------------------------------------------------------------------------------------
	private static void doMod(TaAutStudent user,  JSONObject json, HttpServletResponse response) throws Exception  {
		TaAutStudent  		ent	 	=  reqMod(user, json); 								
		if (ent==null){
			API.doResponse(response, DefAPI.API_MSG_KO);
		} else {
			API.doResponse(response, ToolJSON.reqJSonString(
					DefJS.SESS_STAT		, 1, 
					DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
					DefJS.RES_DATA		, ent
			));	
		}		
	}

	private static TaAutStudent reqMod(TaAutStudent user,  JSONObject json) throws Exception {
		
		JSONObject			obj		= ToolData.reqJson 	(json	, "obj"	, null);
		int 				objId 	= ToolData.reqInt	(obj	, "id"	, null);
		
		TaAutStudent 			ent 	= TaAutStudent.DAO.reqEntityByRef(objId);
		if (ent==null){
			return null;
		}
		
		Map<String, Object> attr 	= API.reqMapParamsByClass(obj, TaAutStudent.class);
		
		TaAutStudent.DAO.doMerge(ent, attr);
		return ent;
	}

	//---------------------------------------------------------------------------------------------------------
	private static void doDel(TaAutStudent user,  JSONObject json, HttpServletResponse response) throws Exception  {
		if (!canDel(user, json)){
			API.doResponse(response, DefAPI.API_MSG_KO);
		} else {
			API.doResponse(response, DefAPI.API_MSG_OK);
		}
	}

	private static boolean canDel(TaAutStudent user,  JSONObject json) throws Exception {
		Integer 		entId	= ToolData.reqInt	(json, "id", null	);	
				
		TaAutStudent  	ent	 	= TaAutStudent.DAO.reqEntityByRef(entId);
		if (ent==null){
			return false;
		}

		TaAutStudent.DAO		.doRemove (ent);
		//---we have to check T_Aut_Right in AutRole + AutAuthorization?

		return true;
	}

	//---------------------------------------------------------------------------------------------------------
	//---------------------------------------------------------------------------------------------------------
	private static void doGet(TaAutStudent user,  JSONObject json, HttpServletResponse response) throws Exception  {	
		//ToolLogServer.doLogDebug("--------- "+ SV_CLASS+ ".doGet --------------");

		Integer 			objId		= ToolData.reqInt	(json, "id"			, -1);				
		TaAutStudent 			ent 		= reqGet(objId);

		if (ent==null){
			API.doResponse(response, DefAPI.API_MSG_KO);
			return;
		}


		API.doResponse(response, ToolJSON.reqJSonString(		//filter,
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, ent 
				));
	}
	
	public static TaAutStudent reqGet(Integer objId) throws Exception{
		TaAutStudent 		ent 	= TaAutStudent.DAO.reqEntityByRef(objId);
		return ent;
	}
	
	//---------------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------------------
	private static void doLst(TaAutStudent user,  JSONObject json, HttpServletResponse response) throws Exception  {
		//ToolLogServer.doLogDebug("--------- "+ SV_CLASS+ ".doLst --------------");

		List<TaAutStudent> 	list = reqLst(user, json); //and other params if necessary
		if (list==null || list.size()==0){
			API.doResponse(response,DefAPI.API_MSG_KO);
			return;
		}

		API.doResponse(response, ToolJSON.reqJSonString(//filter,		
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, list 
				));				
	}

	private static List<TaAutStudent> reqLst(TaAutStudent user, JSONObject json) throws Exception  {
		Integer 			nbLine      = ToolData.reqInt		(json, "nbLine" 	, 10);
		Set<String> 		searchkey	= ToolData.reqSetStr	(json, "searchkey"	, null);
		Set<Integer>		stat		= ToolData.reqSetInt	(json, "stat"		, null);
		Set<Integer>		typ			= ToolData.reqSetInt	(json, "typ"		, null);
		
		
//		if (typ==null && stat==null){
//			return null;
//		}

		Criterion cri				= reqRestriction (user, searchkey, stat, typ);	
		List<TaAutStudent>	list		= TaAutStudent.DAO.reqList(0, nbLine, cri);	

		return list;
	}
	
	//---------------------------------------------------------------------------------------------------------		
	

	private static Criterion reqRestriction(TaAutStudent user, Set<String> searchKey, Set<Integer> stats, Set<Integer> types) throws Exception {		
		if (stats == null){
			stats = new HashSet<Integer>() ; 
			stats.add(TaAutStudent.STAT_ACTIVE);
		}
		
		Criterion cri = Restrictions.in(TaAutStudent.ATT_I_STATUS, stats);
		
		if(types!=null) {
			cri = Restrictions.and(	cri, Restrictions.in(TaAutStudent.ATT_I_TYPE_01 , types));
		}

		if (searchKey!=null) {
			for (String s : searchKey){
				cri = 	 Restrictions.and	(cri, Restrictions.or(
													Restrictions.ilike(TaAutStudent.ATT_T_INFO_01	, s),
													Restrictions.ilike(TaAutStudent.ATT_T_INFO_02	, s))
											);
			}
		}
		
		return cri;
	}

}
