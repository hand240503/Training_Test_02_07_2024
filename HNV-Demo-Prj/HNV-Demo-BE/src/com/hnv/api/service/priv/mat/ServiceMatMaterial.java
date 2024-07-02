package com.hnv.api.service.priv.mat;


import java.util.Date;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;

import com.hnv.api.def.DefAPI;
import com.hnv.api.def.DefDB;
import com.hnv.api.def.DefJS;
import com.hnv.api.def.DefTime;
import com.hnv.api.interf.IService;
import com.hnv.api.main.API;
import com.hnv.api.service.common.APIAuth;
import com.hnv.api.service.common.ResultPagination;
import com.hnv.api.service.main.ServiceAPILoginCheck;
import com.hnv.common.tool.ToolDBLock;
import com.hnv.common.tool.ToolData;
import com.hnv.common.tool.ToolDatatable;
import com.hnv.common.tool.ToolJSON;
import com.hnv.common.tool.ToolLogServer;
import com.hnv.common.util.CacheData;
import com.hnv.data.json.JSONArray;
import com.hnv.data.json.JSONObject;
import com.hnv.db.aut.TaAutAuthUser;
import com.hnv.db.aut.TaAutHistory;
import com.hnv.db.aut.TaAutRole;
import com.hnv.db.aut.TaAutUser;
import com.hnv.db.mat.vi.ViMatMaterialDyn;
import com.hnv.db.mat.TaMatMaterial;
import com.hnv.db.aut.vi.ViAutUserMember;
import com.hnv.db.per.TaPerPerson;
import com.hnv.db.sys.TaSysLock;
import com.hnv.db.tpy.TaTpyDocument;
import com.hnv.def.DefDBExt;

/**
 * ----- ServiceNsoPost by H&V
 * ----- Copyright 2017------------
 */
public class ServiceMatMaterial implements IService {
	//--------------------------------Service Definition----------------------------------
	public static final String SV_MODULE 					= "EC_V3".toLowerCase();

	public static final String SV_CLASS 					= "ServiceMatMaterial".toLowerCase();	

	public static final String SV_GET 						= "SVGet".toLowerCase();	
	public static final String SV_LST_IN_IDS				= "SVLstInIds".toLowerCase();
	public static final String SV_LST 						= "SVLst".toLowerCase();
	public static final String SV_LST_DYN					= "SVLstDyn".toLowerCase(); 
	public static final String SV_LST_SEARCH				= "SVLstSearch".toLowerCase(); 

	public static final String SV_NEW 						= "SVNew".toLowerCase();	
	public static final String SV_MOD 						= "SVMod".toLowerCase();	
	public static final String SV_DEL 						= "SVDel".toLowerCase();
	
	public static final String SV_LCK_REQ 					= "SVLckReq".toLowerCase(); //req or refresh	
	public static final String SV_LCK_SAV 					= "SVLckSav".toLowerCase(); //save and continue
	public static final String SV_LCK_END 					= "SVLckEnd".toLowerCase();
	public static final String SV_LCK_DEL 					= "SVLckDel".toLowerCase();

	public static final String SV_LST_HISTORY_CONNECTION	= "SVLstHistoryConnection".toLowerCase(); 
	public static final String SV_UPDATE_STATUS 			= "SVUpdateStat".toLowerCase();
	public static final String SV_GET_FILE 					= "SVGetFile".toLowerCase();	
	public static final String SV_MOD_TRANSL				= "SVModTransl".toLowerCase();	

	public static final Integer	ENT_TYP						= DefDBExt.ID_TA_MAT_MATERIAL;
	//-----------------------------------------------------------------------------------------------
	//-------------------------Default Constructor - Required -------------------------------------
	public ServiceMatMaterial(){
		ToolLogServer.doLogInf("----" + SV_CLASS + " is loaded -----");
	}

	//-----------------------------------------------------------------------------------------------

	
	
	//-----------------------------------------------------------------------------------------------
	@Override
	public void doService(JSONObject json, HttpServletResponse response) throws Exception {
		String 		sv 		= API.reqSVFunctName(json);
		TaAutUser 	user	= (TaAutUser) json.get("userInfo");
		
		try {
			//---------------------------------------------------------------------------------

			if(sv.equals(SV_GET) 					&&  (APIAuth.canAuthorizeWithOneRight(user, APIAuth.R_ADMIN, APIAuth.R_AUT_ALL_GET, APIAuth.R_AUT_USER_GET)
													||	APIAuth.canAuthorize(user, SV_CLASS, sv))) {
				doGet(user,  json, response);
			} else if(sv.equals(SV_LST_IN_IDS)		&&  (APIAuth.canAuthorizeWithOneRight(user, APIAuth.R_ADMIN, APIAuth.R_AUT_ALL_GET, APIAuth.R_AUT_USER_GET)
													||	APIAuth.canAuthorize(user, SV_CLASS, sv))) {
				doLstInIds(user, json, response);
			} else if(sv.equals(SV_LST)				&&  (APIAuth.canAuthorizeWithOneRight(user, APIAuth.R_ADMIN, APIAuth.R_AUT_ALL_GET, APIAuth.R_AUT_USER_GET)
													||	APIAuth.canAuthorize(user, SV_CLASS, sv))) {
			//	doLst(user,  json, response);
			} else if(sv.equals(SV_LST_DYN)			&&  (APIAuth.canAuthorizeWithOneRight(user, APIAuth.R_ADMIN, APIAuth.R_AUT_ALL_GET, APIAuth.R_AUT_USER_GET)
													||	APIAuth.canAuthorize(user, SV_CLASS, sv))) {
				doLstDyn(user,  json, response);
			
			} else if(sv.equals(SV_LST_SEARCH)		&&  (APIAuth.canAuthorizeWithOneRight(user, APIAuth.R_ADMIN, APIAuth.R_AUT_ALL_GET, APIAuth.R_AUT_USER_GET)
													||	APIAuth.canAuthorize(user, SV_CLASS, sv))) {
				doLstSearch(user,  json, response);
				}
					
			  else if(sv.equals(SV_NEW)			&&  (APIAuth.canAuthorizeWithOneRight(user, APIAuth.R_ADMIN, APIAuth.R_AUT_ALL_NEW, APIAuth.R_AUT_USER_NEW) 
													|| 	APIAuth.canAuthorize(user, SV_CLASS, sv))) {
				doNew(user, json, response);

			} 
		else {
				API.doResponse(response, DefAPI.API_MSG_ERR_RIGHT);
			}
		} catch (Exception e) {
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
		if (user.canBeSuperAdmin()) return true;
		
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
			if (params==null || params.length<=0) return false; 
//			TaAutUser post 	= (TaAutUser) params[0];
//			Integer   uId 	= post.reqInt(post, TaAutUser.ATT_I_AUT_USER_NEW);
//			if (uId!=null && uId.equals(user.reqUserId())) return true;
//			return false;
			
			return true;
		case WORK_UPL : 
			//check something with params
			return true;
		}
		return false;
	}
	//---------------------------------------------------------------------------------------------------------
	private static Set<String> filter = new HashSet<String>();
	static {
		filter.add(TaAutUser.class.getSimpleName()+"."+TaAutUser.ATT_T_PASS_01);
		filter.add(TaAutUser.class.getSimpleName()+"."+TaAutUser.ATT_T_PASS_02);
		filter.add(TaAutUser.class.getSimpleName()+"."+TaAutUser.ATT_T_PASS_03);
		
//		filter.add(ViMatMaterial.class.getSimpleName()+"."+TaAutUser.ATT_T_PASS_01);
//		filter.add(ViMatMaterial.class.getSimpleName()+"."+TaAutUser.ATT_T_PASS_02);
//		filter.add(ViMatMaterial.class.getSimpleName()+"."+TaAutUser.ATT_T_PASS_03);
	}
	//---------------------------------------------------------------------------------------------------------
	private static void doGet(TaAutUser user,  JSONObject json, HttpServletResponse response) throws Exception  {	
		//ToolLogServer.doLogDebug("--------- "+ SV_CLASS+ ".doGet --------------");

		Integer 			entId		= ToolData.reqInt	(json, "id"			, -1	);				
		Boolean				forced		= ToolData.reqBool	(json, "forced"		, true	);
//		Boolean				forManager	= ToolData.reqBool	(json, "forManager"	, false	);

		TaMatMaterial 			ent 		= reqGet(entId, forced);

		if (ent==null){
			API.doResponse(response, DefAPI.API_MSG_KO);
			return;
		}

		if (!canWorkWithObj(user, WORK_GET, ent)){
			API.doResponse(response, DefAPI.API_MSG_ERR_RIGHT);
			return;
		}

		API.doResponse(response, ToolJSON.reqJSonString(
				filter,
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, ent 
				));
	}
	
	private static CacheData<TaMatMaterial> 		cache_entity= new CacheData<TaMatMaterial>		(500, DefTime.TIME_24_00_00_000 );
	public static TaMatMaterial reqGet(Integer entId, Boolean forced) throws Exception{
		String 			key		= entId+"";
		TaMatMaterial 		ent 	= cache_entity.reqData(key);	
		
		if (forced || ent == null) {
			ent 	= TaMatMaterial.DAO.reqEntityByRef(entId);
			if (ent!=null) {
				//---do something and put to cache
				cache_entity.reqPut(key, ent);
			}
		}else {				
			ToolLogServer.doLogInf("---reqNsoAreaGet use cache-----");
			cache_entity.reqCheckIfOld(key); //cache in 20 hour
		}


		//---do build something other of ent like details....
//		if (ent!=null){		
//			ent.doBuildDocuments(forced);
//			ent.doBuildAvatar	(forced);
//			ent.doBuildPerson	(forced);
//			
////			ent.doBuilAuth		(forced, null);
//			ent.doBuilAuths		(forced);			
//			ent.doBuildManager	(forced);	
//			ent.doBuildSuperior	(forced);
//			ent.doBuildHistoryConnection(forced);
//			
//			ent.doHidePwd();
//		}

		return ent;
	}
	//---------------------------------------------------------------------------------------------------------
	private static void doLstInIds(TaAutUser user,  JSONObject json, HttpServletResponse response) throws Exception  {
		Set<Integer> 	ids     	= ToolData.reqSetInt 	(json, "ids" 		, null);
		Boolean			buildAvatar	= ToolData.reqBool		(json, "buildAvatar", null);
		
		if(ids == null || ids.size() <= 0) {
			API.doResponse(response,DefAPI.API_MSG_KO);
			return;
		}

		Criterion 			cri 	= Restrictions.in(ViMatMaterialDyn.ATT_I_ID, ids);
		
		List<ViMatMaterialDyn> 	list 	= ViMatMaterialDyn.DAO.reqList(cri); //and other params if necessary
		
		if (list==null ){
			API.doResponse(response,DefAPI.API_MSG_KO);
			return;
		}
		
	

		API.doResponse(response, ToolJSON.reqJSonString(
				filter,
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, list 
				));				
	}
	
	//---------------------------------------------------------------------------------------------------------

	//---------------------------------------------------------------------------------------------------------		
	private static Hashtable<String,Integer> mapCol = new Hashtable<String, Integer>(){
		{
			put("action"	, -1);
			put("id"		, 0 );
			put("login01"	, 1 );
			put("inf01"		, 2 );
			put("inf03"  	, 3 );
			put("inf04"  	, 4 );
		}
	};
	private static void doLstDyn(TaAutUser user,  JSONObject json, HttpServletResponse response) throws Exception {	
		Object[]  			dataTableOption = ToolDatatable.reqDataTableOption (json, null);
		Set<String>			searchKey		= (Set<String>)dataTableOption[0];
		Set<Integer>		stat01			= ToolData.reqSetInt	(json, "stat01"	, null);
	
		
		
		if (!canWorkWithObj(user, WORK_LST, null, stat01)){ //other param after objTyp...
			API.doResponse(response,DefAPI.API_MSG_KO);
			return;
		}
		//-------------------------------------------------------------------
		Criterion 	cri 				= reqRestriction(user, searchKey, null, stat01);				

		List<TaMatMaterial> list 		= reqListDyn(dataTableOption,cri);
		if (list==null ){
			API.doResponse(response,DefAPI.API_MSG_KO);
			return;
		} else {
//			for(TaAutUser u : list) {
//				p.doBuildUserLogin(true);
//			}
		}

//		Integer iTotalRecords 			= reqNbNsoPostListDyn().intValue();				
//		Integer iTotalDisplayRecords 	= reqNbNsoPostListDyn(cri).intValue();


		API.doResponse(response, ToolJSON.reqJSonString(		
				filter,
				DefJS.SESS_STAT				, 1, 
				DefJS.SV_CODE				, DefAPI.SV_CODE_API_YES,					
//				"iTotalRecords"				, iTotalRecords,
//				"iTotalDisplayRecords"		, iTotalDisplayRecords,
				"aaData"					, list
				));

	}
	
	private static void doLstSearch(TaAutUser user,  JSONObject json, HttpServletResponse response) throws Exception {
		ResultPagination  	res = reqListSearch(user, json); //and other params if necessary
		
		if (res.reqList()==null ){
			API.doResponse(response,DefAPI.API_MSG_KO);
			return;
		}

		API.doResponse(response, ToolJSON.reqJSonString(
				DefJS.SESS_STAT				, 1, 
				DefJS.SV_CODE				, DefAPI.SV_CODE_API_YES, 
				DefJS.RES_DATA				, res));
	}
	
	public static ResultPagination reqListSearch(TaAutUser user, JSONObject json) throws Exception {
		String				searchKey		= ToolData.reqStr		(json, "searchKey"	, null);
		Integer 			begin			= ToolData.reqInt		(json, "begin"		, 0	);
		Integer 			number			= ToolData.reqInt		(json, "number"		, 10); 
		Integer 			total			= ToolData.reqInt		(json, "total"		, 0	);
		
		Set<Integer>		stats			= ToolData.reqSetInt	(json, "stats"		, null);
		Set<Integer>		typs			= ToolData.reqSetInt	(json, "typs"		, null);
		Boolean				buildInfo		= ToolData.reqBool		(json, "buildInfo"	, false);
		Boolean				hardLoad		= ToolData.reqBool		(json, "hardLoad"	, false);
		
		String 				keyWord 		= stats.toString();
		ResultPagination 	rs 				= null;
		boolean				addCache		= true;
		
		if (!canWorkWithObj(user, WORK_LST, null, stats)){ //other param after objTyp...
			return null;
		}
		
		rs			= cacheEnt_rs.reqData(keyWord);
		
		//-------------------------------------------------------------------
		if(rs == null || hardLoad) {
			Criterion 	cri 				= reqRestrictionSearch(user, searchKey, stats, typs);				

			List<TaMatMaterial> list 		= TaMatMaterial.DAO.reqList(begin, number, cri);
			
			
			if (total == 0 ) {
				total						= TaMatMaterial.DAO.reqCount().intValue();
			}
			rs								= new ResultPagination(list, total, begin, number);
			
			if (addCache) cacheEnt_rs.reqPut(keyWord, rs);
		} else {
			ToolLogServer.doLogInf("---reqListSearch use cache-----");
			cacheEnt_rs.reqCheckIfOld(keyWord); //cache in 2 hour
		}

		return rs;
	}
	
	private static Criterion reqRestrictionSearch(TaAutUser user,  String searchKey, Set<Integer> stats, Set<Integer> typs) {
		Criterion cri = Restrictions.eq(TaMatMaterial.ATT_I_PER_MANAGER, user.reqPerManagerId());
		

		if (searchKey != null) {
			searchKey = '%' + searchKey + '%';
				cri = Restrictions.and(	cri, Restrictions.or(
						Restrictions.ilike(TaMatMaterial.ATT_T_INFO_01, searchKey),
						Restrictions.ilike(TaMatMaterial.ATT_T_INFO_02, searchKey) , 
						Restrictions.ilike(TaMatMaterial.ATT_T_INFO_03, searchKey))
						
				);
		}
		
		return cri;
	}

	private static Criterion reqRestriction(TaAutUser user,  Set<String> searchKey, Integer manId, Set<Integer> stat01 ) throws Exception {	
		//--Pre-Check condition---------------------------------------------------
		if (stat01 == null){
			stat01 = new HashSet<>() ; 
			stat01.add(1);
		}
				
		Criterion cri = Restrictions.in(TaMatMaterial.ATT_I_STATUS_01, stat01);

		if (searchKey != null) {
			for (String s : searchKey){
				cri = Restrictions.and(	cri, Restrictions.or(
						Restrictions.ilike(TaMatMaterial.ATT_T_INFO_01, '%'+s+'%'),
						Restrictions.ilike(TaMatMaterial.ATT_T_INFO_02, '%'+s+'%'), 
						Restrictions.ilike(TaMatMaterial.ATT_T_INFO_03, '%'+s+'%'),
						Restrictions.ilike(TaMatMaterial.ATT_T_NAME_01, '%'+s+'%')
						)
				);
			}
		}
		
		return cri;
	}

	private static List<TaMatMaterial> reqListDyn(Object[] dataTableOption,Criterion 	cri) throws Exception {	

		int begin 		= (int)	dataTableOption[1];
		int number 		= (int)	dataTableOption[2]; 
		int sortCol 	= (int)	dataTableOption[3]; 
		int sortTyp 	= (int)	dataTableOption[4];	

		List<TaMatMaterial> list 	= null;		

		Order 	order 	= null;			
		String 	colName = null;

		switch(sortCol){
		case 0: colName = TaMatMaterial.ATT_I_ID; break;		
		case 1: colName = TaMatMaterial.ATT_T_INFO_01; break;
		case 2: colName = TaMatMaterial.ATT_T_INFO_01; break;
		}
//
		if (colName!=null){
			switch(sortTyp){
			case 0: order = Order.asc (colName); break;
			case 1: order = Order.desc(colName); break;			
			}
		}

		if (order==null)
			list	= TaMatMaterial.DAO.reqList(begin, number,cri);
		else
			list	= TaMatMaterial.DAO.reqList(begin, number, order,cri);			

		return list;
	}
//
//	private static Number reqNbNsoPostListDyn() throws Exception {						
//		return ViMatMaterial.DAO.reqCount();		
//	}
//	
//	private static Number reqNbNsoPostListDyn(Criterion cri) throws Exception {			
//		return ViMatMaterial.DAO.reqCount(cri);
//	}
//
//	//---------------------------------------------------------------------------------------------------------
	private static void doNew (TaAutUser user,  JSONObject json, HttpServletResponse response) throws Exception  {
		TaMatMaterial 			ent		= reqNew		(user, json);
		if (ent==null){
			API.doResponse(response, ToolJSON.reqJSonString(
					DefJS.SESS_STAT		, 1, 
					DefJS.SV_CODE		, DefAPI.SV_CODE_API_NO					
					));
			return;
		}

		TaSysLock 	lock 	= ToolDBLock.reqLock (json, "lock", DefDB.DB_LOCK_NEW, ENT_TYP, (Integer)ent.req(TaAutUser.ATT_I_ID), user.reqId(), user.reqStr(TaAutUser.ATT_T_LOGIN_01), null);
		API.doResponse(response, ToolJSON.reqJSonString(		//filter,
				DefJS.SESS_STAT		, 1, 
				DefJS.SV_CODE		, DefAPI.SV_CODE_API_YES,
				DefJS.RES_DATA		, ent,
				"lock"				, lock
				));
	}

	private static TaMatMaterial reqNew(TaAutUser user,  JSONObject json) throws Exception {
//		Integer			userId		= user.reqId();
//		Integer			manId		= user.reqPerManagerId();
		JSONObject		obj			= ToolData.reqJson(json, "obj", null);

		//--------------------------------------------------------------------------------------------
		Map<String, Object> attrUsr = API.reqMapParamsByClass(obj	, TaMatMaterial.class);
//		{"inf01":"name"}
//		attrUsr = {"T_Login_01":"name","T_n":1}
// 		attrUsr.get("T_Login_01)
		
		
		//----set value------------------------------------------------------------------------------------
		attrUsr.put(TaMatMaterial.ATT_I_STATUS_01, 1);
		
	

		TaMatMaterial ent = new TaMatMaterial(attrUsr);	
		TaMatMaterial.DAO.doPersist(ent);

		
		return ent;
	}
		//--cache for UI public
	private static CacheData<ResultPagination> cacheEnt_rs = new CacheData<ResultPagination>(100, DefTime.TIME_02_00_00_000);
	//------------function get list post by entType and entId-----------------------------------------------
	//---------------------------------------------------------------------------------------------------------


}
