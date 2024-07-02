/******************************Search Page function*******************************/
$("#searchPage").on("pageshow", function() {
	switchLanguage();	
	search(false);
});



/***************************************************************************************************************************/
/******* VARIABLES *********************************************************************************************************/
/***************************************************************************************************************************/
var recherche;
var isDotationSearched;

/***************************************************************************************************************************/
/******* FONCTIONS *********************************************************************************************************/
/***************************************************************************************************************************/

function setRechercheVar(form, back){
	if($(form).find("input").val() == ""){
		return false;
	}
	console.log("recherche: " + $(form).find("input").val().toLowerCase());
	recherche = $(form).find("input").val().toLowerCase();

	return true;
}

function saveString(formulaire) {
	recherche = formulaire.text.value.toLowerCase();
	if(recherche == "") {
		return false;
	}
	else {
		changeHistoryUsedValue(false);
		return true;
	}
}

function search(back) {
	
	C8O.log.debug("début de la recherche");	
	$("#searched").html("Intitulé de la recherche : " + recherche + "<br /><br />");
	// Enregistrement de l'intitulé pour l'historique
	//if(!back) { saveSearchInHistory(recherche); }
	// Lancement des requêtes
	//C8O.call({ __project: "Tablette_Superviseur_Facade_API", __sequence: "PLA_ObtenirPlanGalleys", SEARCH: "true", __localCache:'{"enabled":true, "policy":"priority-server", "ttl":86400000}'});	
	C8O.call({ __project: "Tablette_Superviseur_Facade_API", __sequence: "VOL_PRH_PLA_PRA", SEARCH: "true", __localCache:'{"enabled":true, "policy":"priority-server", "ttl":86400000}'});
		
}

function displaySearchResult(xml, data) {
	switch(data.__sequence) {
		case "PRH_ObtenirListePrestationsParClasse":	
			C8O.call({ __project: "Tablette_Superviseur_Facade_API", __sequence: "CHK_GetCheckPointsCompany", SEARCH: "true", __localCache:'{"enabled":true, "policy":"priority-server", "ttl":86400000}'});	
			C8O.log.debug("Recherche dans les prestations...")
			$(xml).find("CLASSE").each(function(classeIndex, classeElement) {
				var codeClasse = $(classeElement).find("CODE_CLASSE").text();
				$(classeElement).find("PRESTATION").each(function(index, element) {	
					if( prh_verif(element) ) {
						var prestaHtml = new Array();
						if($("#sPrestationsContainer").length == 0){
							$("#searchResult").append("<div class='main-module'><section class='white-gloss raduis-all shadow-all' id='sPrestations'><div class='module-title'>Prestations : </div></section></div>");
							prestaHtml.push("<table>");
							prestaHtml.push("<thead>");
							prestaHtml.push("<tr><th style='opacity: 1;'>"+$.i18n("K_CLASS")+"</th>");
							prestaHtml.push("<th style='opacity: 1;'>"+$.i18n("K_PRESTA_NAME")+"</th>");
							prestaHtml.push("<th style='opacity: 1;'>"+$.i18n("K_PRESTA_LIB")+"</th>");
							prestaHtml.push("<th style='opacity: 1;'>"+$.i18n("K_TRONCON")+"</th>");
							prestaHtml.push("<th style='opacity: 1;'>"+$.i18n("K_SERVICE")+"</th>");
							prestaHtml.push("<th style='opacity: 1;'>"+$.i18n("K_ORDERED_QTY")+"</th>");
							prestaHtml.push("<th style='opacity: 1;'>"+$.i18n("K_ADJUSTMENTS")+"</th>");
							prestaHtml.push("<th style='opacity: 1;'>"+$.i18n("K_OB_QTY")+"</th></tr>");
							prestaHtml.push("</thead>");
							prestaHtml.push("<tbody id='sPrestationsContainer'>");
							prestaHtml.push("</tbody>");
							prestaHtml.push("</table>");
							$("#sPrestations").append(prestaHtml.join(""));	
							
							prestaHtml = new Array();		
						}
						prestaHtml.push('<tr data-article="'+$(element).find("CODEART").text()+'" class="code-article">');
						prestaHtml.push("<td>"+codeClasse+"</td>");
						prestaHtml.push("<td class='presta-code'>"+$(element).find("CODEART").text()+"</td>");
						prestaHtml.push("<td>"+$(element).find("LIBART").text()+"</td>");
						prestaHtml.push("<td>"+$(element).find("NOTRONC").text()+"</td>");
						prestaHtml.push("<td>"+$(element).find("ORDSER").text()+"</td>");
						prestaHtml.push("<td>"+$(element).find("CDEINIT").text()+"</td>");
						prestaHtml.push("<td class='presta-aju'>"+$(element).find("AJUST").text()+"</td>");
						prestaHtml.push("<td>"+$(element).find("FINABORD").text()+"</td>");		
						prestaHtml.push("</tr>");
						$("#sPrestationsContainer").append(prestaHtml.join(""));		
					}
				});
			});
			break;
		
		case "CHK_GetCheckPointsCompany":		
			$(xml).find("LOCATION").each(function(indexLoc, valueLoc){
				var labelLoc = $(valueLoc).find("LABEL:eq(0)").text();
				if(localStorage["centerId"] == "" && labelLoc == "K_AQUAI"){
					return;
				}		
				$(valueLoc).find("CHECKPOINT").each(function(indexChk, valueChk){
					if( checkPoint_verif(valueChk) ){
						if($("#sCheckpoints").length == 0){
							$("#searchResult").append("<div class='main-module'><section id='sCheckpoints' class='white-gloss raduis-all shadow-all'><div class='module-title'>Checkpoints : </div></section></div>");
						}
						var htmlString = new Array();
						htmlString.push("<div class='s-checkpoint'>");
						htmlString.push("<span>"+$.i18n(labelLoc)+"</span>");
						htmlString.push("<span>"+$(valueChk).find("LABEL").text()+"</span>");
						htmlString.push("<span>"+$(valueChk).find("COMMENT").text()+"</span>");
						htmlString.push("</div>");
						$("#sCheckpoints").append(htmlString.join(""));
					}
				});
			});
			break;
			
		case "GAP_GetGapsByFlight":
			C8O.call({ __project: "Tablette_Superviseur_Facade_API", __sequence: "PRH_ObtenirListePrestationsParClasse", SEARCH: "true", __localCache:'{"enabled":true, "policy":"priority-server", "ttl":86400000}'});	
			$(xml).find("DATAGAP").each(function(indexGap, valueGap){
				if( gap_verif(valueGap) ){
					var htmlString = new Array();
					if($("#gapsContainer").length == 0){
						htmlString.push("<div class='main-module'><section class='white-gloss raduis-all shadow-all' id='sGaps'><div class='module-title'>Ecarts : </div>");
						htmlString.push("<table class='shadow-table full-width'>");
						htmlString.push("<thead><tr><th>"+$.i18n("K_GAP_PATH")+"</th>");
						htmlString.push("<th>"+$.i18n("K_GAP_COMMENT")+"</th></tr></thead>");
						htmlString.push("<tbody id='gapsContainer'></tbody></table>");
						htmlString.push("</section></div>");
						$("#searchResult").append(htmlString.join(""));
						htmlString = new Array();
					}
					
					htmlString.push("<tr><td class='path'>"+displayTranslatedPath( $(valueGap).find("PATH").text() )+"</td>");
					htmlString.push("<td class='comment'>"+$(valueGap).find("COMMENT").text()+"</td></tr>");
					$("#gapsContainer").append(htmlString.join(""));
				}
			});
			break;
		case "VOL_PRH_PLA_PRA":
			C8O.call({ __project: "Tablette_Superviseur_Facade_API", __sequence: "GAP_GetGapsByFlight", SEARCH: "true", FLIGHT: C8O.FLIGHTID, __localCache:'{"enabled":true, "policy":"priority-server", "ttl":86400000}'});
			var commentaire = $(xml).find("DATAFLIGHT > COMMENT").text();
			if(commentaire.toLowerCase().indexOf(recherche) != -1){
				var stringHtml = new Array();
				stringHtml.push("<div class='main-module'><section id='sComment' class='white-gloss raduis-all shadow-all'><div class='module-title'>Commentaire : </div>");
				stringHtml.push("<div>"+commentaire+"</div>");
				stringHtml.push("</section></div>");
				$("#searchResult").append(stringHtml.join(""));
			}
			break;
			
		case "DOF":
			C8O.log.debug("Recherche dans les dotations...")
			$(xml).find("LOGEMENT").each(function(index, element) {
				if( dof_verif(element) ) {
					if($("#dotations").length == 0) {
						$("#searchResult").append("<div id='dotations' style='display: table;'><p>LOGEMENTS : </p></div>");
					}
					$("#dotations").append(
						'<div class="logementItem cardDOF">' + 
							'<div class="cardDOF-image" imageUrl="'+$(element).find("PHOTO_URL").text()+'" data-c8o-call="Tablette_Superviseur_Facade_API.DOF"'+
							'data-c8o-variables=\'{"CODEGAL":"' +$(xml).find("CODEGAL").text()+ '", "CODELOGEMENT":"'+element.getAttribute("codelogement")+'"}\'>'+
								'<div class="texteLogement">'+
									'<p>' + element.getAttribute("codelogement") + '</p>'+
									'<p>' + displayCorrectCodedot( $(element).find("CODEDOT") ) +'</p>'+
								'</div>'+
							'</div>'+
						'</div>'
					);
				}
			});			
			break;

		case "PLA_ObtenirPlanGalleys":
			C8O.log.debug("Recherche dans les galleys...")
			$("#searchResult").append("<div id='galleys' style='display: table;'><p>GALLEYS : </p></div>");
			if(!$(xml).find("GALLEY")) {
				C8O.log.debug("Données du plan d'armement manquantes");
			}

			$(xml).find("GALLEY").each(function(index, element) {
				
				C8O.call({ 
					__project: "Tablette_Superviseur_Facade_API", 
					__sequence: "DOF", 
					CODEGAL: $(element).find("CODEGAL").text(), 
					SEARCH: "true",
					__localCache:'{"enabled":true, "policy":"priority-server", "ttl":86400000}' });
				
				if( pla_verif(element) ) {
					$("#galleys").append(
						'<li class="galleyCard card"' +
							'data-c8o-call="Tablette_Superviseur_Facade_API.DOF" '+
						    'data-c8o-variables=\'{"PDT_VERSION":"'+ $(xml).find("VERSION").text() +'", "CODECLI":"'+ $(xml).find("CODECLI").text() +'", "CODEPDT":"'+ $(xml).find("CODEPDT").text() +'", "CODEVAP":"'+ $(xml).find("CODEVAP").text() +'", "VPHYSAP":"'+ $(xml).find("VPHYSAP").text() +'", "CODEGAL":"'+ $(element).find("CODEGAL").text() +'"}\'>'+
							'<p>'+$(element).find("CODEGAL").text()+'</p><p>'+$(element).find("COUNT_LOG").text()+' logements</p>'+
						'</li>'
					);
				}
			});
			if($(".galleyCard").length == 0) {
				C8O.log.debug("aucun galley");
				$("#galleys").remove();
			}			
			break;
	}
}

/*****************************FILTRES**************************/
function gap_verif(element){
	if( $(element).find("COMMENT").text().toLowerCase().indexOf(recherche) != -1 ){
		return true;
	}
	return false;
}

function checkPoint_verif(element){

	if($(element).find("LABEL").text().toLowerCase().indexOf(recherche) != -1){
		return true;
	}
	if($(element).find("COMMENT").text().toLowerCase().indexOf(recherche) != -1){
		return true;
	}
	
	return false;
}

function prh_verif(element) {
	if($(element).find("LIBART").text().toLowerCase().indexOf(recherche) != -1) {
		return true;
	}
	if($(element).find("CODEART").text().toLowerCase().indexOf(recherche) != -1) {
		return true;
	}
	/*if($(element).find("REPAS_SPECIAUX").text().toLowerCase().indexOf(recherche) != -1) {
		return true;
	} */
	return false;
}

function pla_verif(element) {
	/*if($(element).find("LIB1").text().toLowerCase().indexOf(recherche) != -1) {
		return true;
	}
	if($(element).find("LIB2").text().toLowerCase().indexOf(recherche) != -1) {
		return true;
	}*/
	if($(element).find("CODEGAL").text().toLowerCase().indexOf(recherche) != -1) {
		return true;
	}
	return false;
}

function dof_verif(element) {
	isDotationSearched = false;
	if($(element).find("CODELOG").text().toLowerCase().indexOf(recherche) != -1) {
		return true;
	}
	if($(element).find("CODEDOT").text().toLowerCase().indexOf(recherche) != -1) {
		isDotationSearched = true;
		return true;
	}
	if($(element).find("DOTATION > LIB1").text().toLowerCase().indexOf(recherche) != -1) {
		isDotationSearched = true;
		return true;
	}
	return false;
}

function displayCorrectCodedot(codedot) {
	C8O.log.debug(codedot);
	var returnStr="";
	if(codedot.length == 0) {
		return "";
	}
	else if(codedot.length == 1) {
		return codedot[0].textContent;
	}
	else {
		if(isDotationSearched) {
			for(var i=0; i<codedot.length; i++) {
				if(codedot[i].textContent.indexOf(recherche) != -1) {
					returnStr = codedot[i].textContent; 
					returnStr = returnStr + " (+";
					returnStr = returnStr + (parseInt(codedot.length) - 1).toString();
					returnStr = returnStr + ")";
					return returnStr;
				}
			}
		}
		returnStr = codedot[0].textContent; 
		returnStr = returnStr + " (+";
		returnStr = returnStr + (parseInt(codedot.length) - 1).toString();
		returnStr = returnStr + ")";
		return returnStr;
	}
	
}

function convertIntoString(domElement) {
	var stringTemp = "";
	stringTemp =  "<" + domElement.nodeName + ">" + domElement.textContent + "</" + domElement.nodeName + ">";
	return stringTemp;
}

function displayTranslatedPath(element){
	var paths = element.split("/");
	finalString = new Array();;
	for(var i = 0; i<paths.length; i++){
		finalString.push( $.i18n(paths[i].trim()) );
	}
	return finalString.join(" / ");
}

