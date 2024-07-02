package com.hnv.db.aut;


import java.io.Serializable;
import java.util.Date;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.hnv.api.main.Hnv_CfgHibernate;
import com.hnv.db.EntityAbstract;
import com.hnv.db.EntityDAO;

@Entity
@Table(name = "TA_AUT_STUDENT")
public class TaAutStudent extends EntityAbstract<TaAutStudent>{
	private static final long serialVersionUID = 1L;
	
	public static final int	STAT_NEW 			= 0;
	public static final int	STAT_ACTIVE 		= 1; 
	public static final int	STAT_REVIEW 		= 5; 
	public static final int	STAT_DELETED 		= 10;
	
	//---------------------------List of Column from DB-----------------------------
	public static final String	COL_I_ID                              =	"I_ID";
	public static final String	COL_I_STATUS                          =	"I_Status";
	public static final String	COL_I_TYPE_01                         =	"I_Type_01";
	public static final String	COL_I_TYPE_02                         =	"I_Type_02";
	public static final String	COL_T_INFO_01                         =	"T_Info_01";
	public static final String	COL_T_INFO_02                         =	"T_Info_02";
	public static final String	COL_T_INFO_03                         =	"T_Info_03";
	public static final String	COL_T_INFO_04                         =	"T_Info_04";
	public static final String	COL_D_DATE_01                         =	"D_Date_01";
	public static final String	COL_D_DATE_02                         =	"D_Date_02";
	
	//---------------------------List of ATTR of class-----------------------------
	public static final String	ATT_I_ID                              =	"I_ID";
	public static final String	ATT_I_STATUS                          =	"I_Status";
	public static final String	ATT_I_TYPE_01                         =	"I_Type_01";
	public static final String	ATT_I_TYPE_02                         =	"I_Type_02";
	public static final String	ATT_T_INFO_01                         =	"T_Info_01";
	public static final String	ATT_T_INFO_02                         =	"T_Info_02";
	public static final String	ATT_T_INFO_03                         =	"T_Info_01";
	public static final String	ATT_T_INFO_04                         =	"T_Info_02";
	public static final String	ATT_D_DATE_01                         =	"D_Date_01";
	public static final String	ATT_D_DATE_02                         =	"D_Date_02";
	
	//-------every entity class must initialize its DAO from here -----------------------------
	private 	static 	final boolean[] 			RIGHTS		= {true, true, true, true, false}; //canRead, canAdd, canUpd, canDel, del physique or flag only 
	private 	static 	final boolean[]				HISTORY		= {false, false, false}; //add, mod, del

	public static final EntityDAO<TaAutStudent> DAO;
	static{
		DAO = new EntityDAO<TaAutStudent>(Hnv_CfgHibernate.reqFactoryEMSession(Hnv_CfgHibernate.ID_FACT_MAIN), TaAutStudent.class,RIGHTS, HISTORY, "TA_AUT_STUDENT", 1000);

	}
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name=COL_I_ID, nullable = false)
	private	Integer         I_ID;
         
	@Column(name=COL_I_STATUS, nullable = true)
	private	Integer         I_Status;
     
	@Column(name=COL_I_TYPE_01, nullable = true)
	private	Integer         I_Type_01;
    
	@Column(name=COL_I_TYPE_02, nullable = true)
	private	Integer         I_Type_02;
       
	@Column(name=COL_T_INFO_01, nullable = true)
	private	String          T_Info_01;
    
	@Column(name=COL_T_INFO_02, nullable = true)
	private	String          T_Info_02;
	
	@Column(name=COL_T_INFO_03, nullable = true)
	private	String          T_Info_03;
    
	@Column(name=COL_T_INFO_04, nullable = true)
	private	String          T_Info_04;
    
	@Column(name=COL_D_DATE_01, nullable = true)
	private	Date            D_Date_01;
    
	@Column(name=COL_D_DATE_02, nullable = true)
	private	Date            D_Date_02;

	
	public TaAutStudent() {}
	
	@Override
	public void doMergeWith(TaAutStudent ent) {

		if (ent == this) return;
		this.I_Status               = ent.I_Status;
		this.I_Type_01              = ent.I_Type_01;
		this.I_Type_02              = ent.I_Type_02;
		this.T_Info_01              = ent.T_Info_01;
		this.T_Info_02              = ent.T_Info_02;
		this.T_Info_03              = ent.T_Info_03;
		this.T_Info_04              = ent.T_Info_04;
		this.D_Date_01              = ent.D_Date_01;
		this.D_Date_02              = ent.D_Date_02;
	}

	@Override
	public Serializable reqRef() {
		return this.I_ID;
	}
	
	@Override
	public boolean equals(Object o)  {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		boolean ok = false;
		
		ok = (I_ID == ((TaAutStudent)o).I_ID);
		if (!ok) return ok;

				
		if (!ok) return ok;
		return ok;
	}

	@Override
	public int hashCode() {
		return this.I_ID;

	}
	
	public TaAutStudent(Map<String, Object> attrs) throws Exception {
		this.reqSetAttrFromMap(attrs);
		doInitDBFlag();
	}
	


}
