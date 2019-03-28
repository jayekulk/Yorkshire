/*global location */
sap.ui.define([
	"Yorkshire_Home/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"Yorkshire_Home/model/formatter"
], function(BaseController, JSONModel, formatter) {
	"use strict";

	return BaseController.extend("Yorkshire_Home.controller.Detail_open", {

		formatter: formatter,

		onInit: function() {

			var oModel = new JSONModel(jQuery.sap.getModulePath("Yorkshire_Home.mockdata", "/Objects.json"));
			this.getView().setModel(oModel, "lineItemsModel");

			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				lineItemListTitle: "Work Items"
			});
			this.getView().setModel(oViewModel, "detailView");

			this.getRouter().getRoute("object_open").attachPatternMatched(this._onObjectMatched, this);

			//this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));

		},

		onBeforeRendering: function() {
			// WorkItem Panel Clicable
			var panel = this.byId("workitemPanel_1");
			panel.addDelegate({
				onclick: function(oEvent) {
					//if (oEvent.target === panel.$().find(".sapMPanelHdr").get(0)) {
					if(oEvent.target.innerText==="Open"){	
						panel.setExpanded(!panel.getExpanded());
					}
				}
			});
		},
		

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		_onObjectMatched: function(oEvent) {
			
			    
				var oView = this.getView();
				oView.bindElement({
					path: "/Objects/" + oEvent.getParameter("arguments").index,
					model: "lineItemsModel"
				});
				oView.updateBindings();
				
			 var data= oView.mElementBindingContexts.lineItemsModel.getModel().getData().Objects;
			 var objectId = oEvent.getParameter("arguments").ObjectId;
			 for(var i=0; i<data.length ;i++){
			 	var objectId = data[i];
			 	if(objectId === "")
			 }
			 	
			 }
			//	var sObjectId =  oEvent.getParameter("arguments").objectId;
			//	this.getView().getModel().metadataLoaded().then( function() {

			/*	var sObjectId =  "ObjectID_1";
				
				var sObjectPath = this.getModel().createKey("Objects", {
					ObjectID :  sObjectId
				});
				this._bindView("/" + sObjectPath);*/
			//	}.bind(this));
		}

	});

});