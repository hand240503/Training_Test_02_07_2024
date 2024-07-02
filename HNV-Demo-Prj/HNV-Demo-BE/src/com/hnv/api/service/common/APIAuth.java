package com.hnv.api.service.common;

import java.util.List;
import java.util.Set;

import org.hibernate.criterion.Restrictions;

import com.hnv.api.def.DefTime;
import com.hnv.common.tool.ToolSet;
import com.hnv.common.util.CacheData;
import com.hnv.db.aut.TaAutAuthService;
import com.hnv.db.aut.TaAutUser;
import com.hnv.def.DefRight;

public class APIAuth{	
	public static int R_ADMIN			= 100;
	public static int R_AUT_ALL_GET		= 101;
	public static int R_AUT_ALL_NEW		= 102;
	public static int R_AUT_ALL_MOD		= 103;
	public static int R_AUT_ALL_DEL		= 104;
	public static int R_AUT_ALL_EXE		= 105;
	
	public static int RO_ADM_SUPER		= 100;
	public static int RO_ADM			= 101;
	
	
	public static int R_AUT_USER_GET		= 1000001;
	public static int R_AUT_USER_NEW		= 1000002;
	public static int R_AUT_USER_MOD		= 1000003;
	public static int R_AUT_USER_DEL		= 1000004;
	public static int R_AUT_USER_EXE		= 1000005;
	
	public static int R_PRJ_PROJECT_GET		= 40000001;
	public static int R_PRJ_PROJECT_NEW		= 40000002;
	public static int R_PRJ_PROJECT_MOD		= 40000003;
	public static int R_PRJ_PROJECT_DEL		= 40000004;
	public static int R_PRJ_PROJECT_EXE		= 40000005;
	
	public static int R_PRJ_DATA_GET		= 40000101;
	public static int R_PRJ_DATA_NEW		= 40000102;
	public static int R_PRJ_DATA_MOD		= 40000103;
	public static int R_PRJ_DATA_DEL		= 40000104;
	public static int R_PRJ_DATA_EXE		= 40000105;
	
	public static int R_NSO_POST_GET		= 17000001;
	public static int R_NSO_POST_NEW		= 17000002;
	public static int R_NSO_POST_MOD		= 17000003;
	public static int R_NSO_POST_DEL		= 17000004;
	public static int R_NSO_POST_EXE		= 17000005;
	
	public static int R_TPY_CATEGORY_GET	= 7000001;
	public static int R_TPY_CATEGORY_NEW	= 7000002;
	public static int R_TPY_CATEGORY_MOD	= 7000003;
	public static int R_TPY_CATEGORY_DEL	= 7000004;
	public static int R_TPY_CATEGORY_EXE	= 7000005;
	
	public static int R_TPY_FAVORITE_GET	= 7001001;
	public static int R_TPY_FAVORITE_NEW	= 7001002;
	public static int R_TPY_FAVORITE_MOD	= 7001003;
	public static int R_TPY_FAVORITE_DEL	= 7001004;
	public static int R_TPY_FAVORITE_EXE	= 7001005;
	
	public static int R_MSG_MESSAGE_GET		= 50000201;
	public static int R_MSG_MESSAGE_NEW		= 50000202;
	public static int R_MSG_MESSAGE_MOD		= 50000203;
	public static int R_MSG_MESSAGE_DEL		= 50000204;
	public static int R_MSG_MESSAGE_EXE		= 50000205;
	
	public static int R_JOB_HOLIDAY_GET		= 2001001;
	public static int R_JOB_HOLIDAY_NEW		= 2001002;
	public static int R_JOB_HOLIDAY_MOD		= 2001003;
	public static int R_JOB_HOLIDAY_DEL		= 2001004;
	public static int R_JOB_HOLIDAY_EXE		= 2001005;
	
	public static int R_JOB_REPORT_GET		= 2002001;
	public static int R_JOB_REPORT_NEW		= 2002002;
	public static int R_JOB_REPORT_MOD		= 2002003;
	public static int R_JOB_REPORT_DEL		= 2002004;
	public static int R_JOB_REPORT_EXE		= 2002005;
	
	public static int R_SOR_ORDER_GET		= 11000001;
	public static int R_SOR_ORDER_NEW		= 11000002;
	public static int R_SOR_ORDER_MOD		= 11000003;
	public static int R_SOR_ORDER_DEL		= 11000004;
	public static int R_SOR_ORDER_EXE		= 11000005;
	
	//----------------------------------------------------------------------------------------------------------------------
	public static boolean canAuthorizeWithOneRight (TaAutUser user, Integer...rights){
		if (rights==null ) return true;
		return user.canHaveOneRight(rights);
	}
	
	public static boolean canAuthorizeWithRights (TaAutUser user, Integer... rCodes){
		if (rCodes!=null && rCodes[0]==DefRight.RIGHT_ ) return true;
		return user.canHaveRights(rCodes);		
	}
	
	
	public static boolean canAuthorizeWithRights (TaAutUser user, String rCodes){
		if (rCodes==null) return true;
		Set<Integer> rCs = ToolSet.reqSetInt(rCodes);
		if (rCs.size()==0) return true;
		
		return user.canHaveRights(rCs);		
	}
	
	//---cache theo user + SvClass + svName -- cache trong khoảng 1h
	//---user list role + lst right
	//---hệ thống lst 
	
	private static CacheData<List<TaAutAuthService>> cacheAuthService 	= new CacheData<List<TaAutAuthService>>();
	private static CacheData<String> cacheAuth 							= new CacheData<String>();
	static {
		cacheAuth.doCheckTimeAuto(DefTime.TIME_01_00_00_000);
	}
	
	public static boolean canAuthorize (TaAutUser user, String svClass, String svName) throws Exception{
		svClass		= svClass.toLowerCase();
		svName		= svName.toLowerCase();
		String sv	= svClass + "."+ svName;	
		String key = user.reqId()+ "/" + sv;
		if (cacheAuth.canHave(key)) return true;
		
		//---check with other way
		return canAuthorizeWithDB (user, sv);
	}
	
	public static boolean canAuthorizeWithDB (TaAutUser user, String sv)throws Exception{
		List<TaAutAuthService> 		autSv 	= cacheAuthService.reqData(sv);
		
		
		if (autSv==null){
			autSv = TaAutAuthService.DAO.reqList(Restrictions.ilike(TaAutAuthService.ATT_T_INFO_01, "%"+sv+"%"));
		}
			
		//---don't find any => no limit for service
		/*if (autSv==null || autSv.size()==0) {
			String key = user.reqId()+ "/" + sv;
			cacheAuth.reqPut(key, "");
			return true;
		}*/
		
		//---don't find any => then service is limit
		if (autSv==null || autSv.size()==0) {
			return false;
		}
		
		//---check
		for (TaAutAuthService a:autSv){
			if (a.canAuthorize(user)) {
				String key = user.reqId()+ "/" + sv;
				cacheAuth.reqPut(key, "");
				return true;
			}
		}
		
		
		return false;
	}

}
