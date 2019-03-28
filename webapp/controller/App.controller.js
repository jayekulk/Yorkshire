sap.ui.define([
	"Yorkshire_Home/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";

	return Controller.extend("Yorkshire_Home.controller.App", {

     	onInit : function () {
     			
     			var	oListSelector = this.getOwnerComponent().oListSelector;	
     				
     			var oViewModel = new JSONModel({
					busy : true,
					delay : 0
				});
				this.setModel(oViewModel, "appView");
				
     				
				// Makes sure that master view is hidden in split app
				// after a new list entry has been selected.
				/*oListSelector.attachListSelectionChange(function () {
					this.byId("splitapp").hideMaster();
				}, this);*/
     	}
	});

});