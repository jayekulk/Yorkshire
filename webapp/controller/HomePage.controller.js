var _self;
sap.ui.define([
	"Yorkshire_Home/controller/BaseController"
], function(Controller) {
	"use strict";

	return Controller.extend("Yorkshire_Home.controller.HomePage", {
		
		onInit : function (evt) {
			 _self = this;
		},

		onDCTpress: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("DCT_Dashboard");
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
		}

	});
});