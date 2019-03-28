/*global history */

sap.ui.define([
	"Yorkshire_Home/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"sap/ui/Device",
	"Yorkshire_Home/model/formatter"
], function(BaseController, JSONModel, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
	"use strict";

	return BaseController.extend("Yorkshire_Home.controller.Master_open", {

		formatter: formatter,

		onInit: function() {
			
				$.sap.Global = {};
			/*var data = {
				"Objects":
				[
				{
					"LineItemID": "LineItemID_1",
					"ObjectID": "ObjectID_1",
					"Name": "Line Item 1",
					"Attribute": "Attribute A",
					"UnitOfMeasure": "UoM",
					"UnitNumber": 23
				},
				{
					"LineItemID": "LineItemID_1",
					"ObjectID": "ObjectID_1",
					"Name": "Line Item 1",
					"Attribute": "Attribute A",
					"UnitOfMeasure": "UoM",
					"UnitNumber": 23
				}
			]
			};
			var oModel = new JSONModel(data);
			this.getView().setModel(oModel);*/
			
		//	var _self = this;
			//this.getOwnerComponent().getModel("i18n")
			
			var oModel = new JSONModel(jQuery.sap.getModulePath("Yorkshire_Home.mockdata", "/Objects.json"));
			this.getView().setModel(oModel,"objectsModel");
			
			var value ="06";
			
			//Extra model.
			var oViewModel = new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					title: "Open Solution"+" "+"("+value+")",
					noDataText: "No Data Text",
					sortBy: "Name",
					groupBy: "None"
				});
			this.getView().setModel(oViewModel, "masterView");
			
			//for Search
			this._oListFilterState = {
					aFilter : [],
					aSearch : []
				};
			
			var oList = this.byId("list");	
			this._oList = oList;
			var iOriginalBusyDelay = oList.getBusyIndicatorDelay();
			oList.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for the list
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				});
				
			//to get listSelector Object activate	
				this.getView().addEventDelegate({
					onBeforeFirstShow: function () {
						this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
					}.bind(this)
				});
				
				
			//Master-detail Matched
			this.getRouter().getRoute("master_open").attachPatternMatched(this._onMasterMatched, this);
			
			
				
		},



		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/*onUpdateFinished: function(oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			this.byId("pullToRefresh").hide();
		},*/

		/**
		 * Event handler for the master search field. Applies current
		 * filter value and triggers a new search. If the search field's
		 * 'refresh' button has been pressed, no new search is triggered
		 * and the list binding is refresh instead.
		 * @param {sap.ui.base.Event} oEvent the search event
		 * @public
		 */
		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}

			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("Number", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			this._oList.getBinding("items").refresh();
		},

		/**
		 * Event handler for the sorter selection.
		 * @param {sap.ui.base.Event} oEvent the select event
		 * @public
		 */
		onSort: function(oEvent) {
			var sKey = oEvent.getSource().getSelectedItem().getKey(),
				aSorters = this._oGroupSortState.sort(sKey);
				//aSorters = this._oGroupSortState.group(sKey); //for grouping

			this._applyGroupSort(aSorters);
		},


		/**
		 * Event handler for the filter button to open the ViewSettingsDialog.
		 * which is used to add or remove filters to the master list. This
		 * handler method is also called when the filter bar is pressed,
		 * which is added to the beginning of the master list when a filter is applied.
		 * @public
		 */
		onFilterSettings: function() {
			if (!this._oViewSettingsDialog) {
				this._oViewSettingsDialog = sap.ui.xmlfragment("Yorkshire_Home.view.FilterDialog", this);
				this.getView().addDependent(this._oViewSettingsDialog);
				// forward compact/cozy style into Dialog
				//this._oViewSettingsDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			}
			this._oViewSettingsDialog.open();
		},

		/**
		 * Event handler called when ViewSettingsDialog has been confirmed, i.e.
		 * has been closed with 'OK'. In the case, the currently chosen filters
		 * are applied to the master list, which can also mean that the currently
		 * applied filters are removed from the master list, in case the filter
		 * settings are removed in the ViewSettingsDialog.
		 * @param {sap.ui.base.Event} oEvent the confirm event
		 * @public
		 */
		onConfirmViewSettingsDialog: function(oEvent) {
			var aFilterItems = oEvent.getParameters().filterItems,
				aFilters = [],
				aCaptions = [];

			// update filter state:
			// combine the filter array and the filter string
			aFilterItems.forEach(function(oItem) {
				switch (oItem.getKey()) {
					case "Filter1":
						aFilters.push(new Filter("UnitNumber", FilterOperator.LE, 100));
						break;
					case "Filter2":
						aFilters.push(new Filter("UnitNumber", FilterOperator.GT, 100));
						break;
					default:
						break;
				}
				aCaptions.push(oItem.getText());
			});

			this._oListFilterState.aFilter = aFilters;
			this._updateFilterBar(aCaptions.join(", "));
			this._applyFilterSearch();
		},

		/**
		 * Event handler for the list selection event
		 * @param {sap.ui.base.Event} oEvent the list selectionChange event
		 * @public
		 */
		onSelectionChange: function(oEvent) {
			debugger;
			var oList = oEvent.getSource(),
				bSelected = oEvent.getParameter("selected");

			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}

		},

		/**
		 * Event handler for the bypassed event, which is fired when no routing pattern matched.
		 * If there was an object selected in the master list, that selection is removed.
		 * @public
		 */
		onBypassed: function() {
			this._oList.removeSelections(true);
		},

		/**
		 * Used to create GroupHeaders with non-capitalized caption.
		 * These headers are inserted into the master list to
		 * group the master list's items.
		 * @param {Object} oGroup group whose text is to be displayed
		 * @public
		 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
		 */
	/*	createGroupHeader: function(oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.text,
				upperCase: false
			});
		},
*/
		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser historz
		 * @public
		 */
		onNavBack: function() {
			history.go(-1);
		},

		
		/**
		 * If the master route was hit (empty hash) we have to set
		 * the hash to to the first item in the list as soon as the
		 * listLoading is done and the first item in the list is known
		 * @private
		 */
		_onMasterMatched: function(evt) {
					debugger;
				    /*this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
					function (mParams) {
						if (mParams.list.getMode() === "None") {
							return;
						}*/
						
					//	var sObjectId = mParams.firstListitem.getBindingContext().getProperty("ObjectID
					
						var sObjectId = "ObjectID_1";
						this.getRouter().navTo("object_open", {objectId : sObjectId}, true);
						
						
						
					/*}.bind(this)
					function (mParams) {
						if (mParams.error) {
							return;
						}
						this.getRouter().getTargets().display("detailNoObjectsAvailable");
					}.bind(this)
				);*/
			
		},

		/**
		 * Shows the selected item on the detail page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showDetail: function(oItem) {
			debugger;
			var objectID = oItem.getBindingContext("objectsModel").sPath;
			var index = objectID.slice(9);
			var ObjectID = oItem.getBindingContext("objectsModel").getModel().getData().Objects[index].ObjectID;
			var bReplace = !Device.system.phone;
			this.getRouter().navTo("object_open", {
				
				//objectId: oItem.getBindingContext().getProperty("ObjectID")
				objectId:ObjectID,
				index:index
				
				
			}, bReplace);
		},

		/**
		 * Sets the item count on the master list header
		 * @param {integer} iTotalItems the total number of items in the list
		 * @private
		 */
/*		_updateListItemCount: function(iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getModel("masterView").setProperty("/title", sTitle);
			}
		},*/

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @private
		 */
		_applyFilterSearch: function() {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
				oViewModel = this.getView().getModel("masterView");
			this.getView().byId("list").getBinding("items").filter(aFilters, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getView().getModel("i18n").getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getView().getModel("i18n").getResourceBundle().getText("masterListNoDataText"));
			}
		},

		/**
		 * Internal helper method to apply both group and sort state together on the list binding
		 * @param {sap.ui.model.Sorter[]} aSorters an array of sorters
		 * @private
		 */
	/*	_applyGroupSort: function(aSorters) {
			this._oList.getBinding("items").sort(aSorters);
		},*/

		/**
		 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
		 * @param {string} sFilterBarText the selected filter value
		 * @private
		 */
		_updateFilterBar: function(sFilterBarText) {
			var oViewModel = this.getModel("masterView");
			oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
			oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
		}

	});

});