sap.ui.define([
	"Yorkshire_Home/controller/BaseController"
], function(Controller) {
	"use strict";

	return Controller.extend("Yorkshire_Home.controller.DCT_Dashboard", {

		onBackPress: function(oEvent) {
			 window.history.go(-1);
			/*var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("appHome", {}, true);
			}*/
		},

		onHomePress: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("HomePage");
		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		onSearchPress: function(oEvent) {
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("Yorkshire_Home.view.Enterprise_Search", this);
				this.getView().addDependent(this._oPopover);
			}
			this._oPopover.openBy(oEvent.getSource());
		},
		
		onExit: function() {
			if (this._oPopover) {
				this._oPopover.destroy();
			}
		},
		
		handleOpenSolution: function(oEvent){
			
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("master_open");
			
		},
		
		handleRejectSolution: function(oEvent){
		
		
			
		}
		
		
	
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		

	});

});