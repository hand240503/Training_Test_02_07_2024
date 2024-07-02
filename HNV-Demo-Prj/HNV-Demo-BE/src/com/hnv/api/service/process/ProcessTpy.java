package com.hnv.api.service.process;

import java.util.List;

import org.hibernate.criterion.Restrictions;

import com.hnv.api.def.DefTime;
import com.hnv.db.tpy.TaTpyDocument;
import com.hnv.process.ThreadManager;

public class ProcessTpy {
	//------------------------------------------------Process for alert stock for date and Quantity-----------------------------------------
	//------------------------------------------------------------------
	public static void do_Document_RemoveNull(){			
		Thread t = new Thread(){
			public void run(){
				try {
					List<TaTpyDocument>  lst = TaTpyDocument.DAO.reqList(	
							Restrictions.eq(TaTpyDocument.ATT_I_ENTITY_ID, -1)
							);
					if(lst != null && !lst.isEmpty()) {
						TaTpyDocument.DAO.doRemove(lst);
					}
				} catch (Exception e) {	
					e.printStackTrace();
				}
			}				
		};
		ThreadManager.doExecuteInfini(t, DefTime.TIME_01_00_00_000, DefTime.TIME_48_00_00_000);
	}

}
