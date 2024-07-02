
var do_gl_WebSQL_Connect = function (dbName, dbVer){
	var db = null;
	if(window.openDatabase){
		db = openDatabase(dbName, dbVer, 'dbHNV', 2000000);						
	}
	return db;
}

var can_gl_WebSQL_Table_Exist = function (db, taName){
	if (db){
		var ok = false;
		db.readTransaction(function(tx) {
//			if (!param) param=[];
			tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name=?", [taName], function (t, data) {						
				if (data.rows.length>0) ok = true;
			});
		});
		return ok;
	}else{
		return null;
	}
}

var do_gl_WebSQL_Table_New = function (db, taName, taCols){
	if (db){
		db.transaction(function(tx) {
			tx.executeSql("CREATE TABLE if not exists "+ taName + " " + taCols, [], function(tx){
				console.log('---Table created!----') ;
			}, function(e){
				console.log(e) ;
			});
		});
	}
}

var do_gl_WebSQL_Table_Execute = function (db, sql, param){
	if (db){
		db.transaction(function(tx) {
			if (!param) param=[];
			//"INSERT INTO Items ( ScannedData) VALUES (?)"
			//[col1, col2]
			tx.executeSql(sql, param, 
			function(tx){
				console.log('---Table modified!----') ;
			}, 
			function(e){
				console.log(e) ;
			});
		});
	}
}

var req_gl_WebSQL_Table_Select = function (db, sql, param, fCallback){
	if (db){
		var datas = null;
		db.readTransaction(function(tx) {
			if (!param) param=[];
			//t.executeSql('SELECT title, author FROM docs WHERE id=?', [id], function (t, data) {
			tx.executeSql(sql, param, function (t, data) {
				datas = data;
				fCallback(datas.rows);
				//data.rows //data.rows.item(i).author				
			}, 
			function(e){
				console.log(e) ;
				fCallback(null);
			});
		});
	}
	return null;
}

var do_gl_WebSQL_Table_Delete = function (db, taName){
	if (db){
		db.transaction(function(tx) {
			tx.executeSql("DROP TABLE "+ taName, [], function(tx){
				console.log('---Table delete!----') ;
			}, function(e){
				console.log(e) ;
			});
		});
	}
}

