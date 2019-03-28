sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"Yorkshire_Home/model/models",
	"Yorkshire_Home/controller/ListSelector"
], function(UIComponent, Device, models, ListSelector) {
	"use strict";

	return UIComponent.extend("Yorkshire_Home.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			
			// call the Custon ListSelector method.
			this.oListSelector = new ListSelector();
			
			
			this.setModel(models.createDeviceModel(), "device");
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			/* Initialization of Router*/
			this.getRouter().initialize();
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
		},
		
		destroy : function () {
				this.oListSelector.destroy();
				//this._oErrorHandler.destroy();
				// call the base component's destroy function
				UIComponent.prototype.destroy.apply(this, arguments);
			}
		
		
	});
});