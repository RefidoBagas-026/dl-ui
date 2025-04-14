import { inject, bindable } from "aurelia-framework";
const ExpenditureGoodLoader = require("../../../../loader/garment-expenditure-good-loader");
const ExpenditureGoodSampleLoader = require("../../../../loader/garment-expenditure-good-sample-loader");
const LeftOverFinishedGoodsLoader = require("../../../../loader/garment-leftover-warehouse-expenditure-finished-goods-loader");
const UomLoader = require("../../../../loader/uom-loader");
import { Service } from "../service";

@inject(Service)
export class Detail {
  @bindable selectedBon;
  constructor(service) {
    this.service = service;

     // Add event listener to clear cache on page reload
     window.addEventListener('beforeunload', () => {
      localStorage.removeItem('bonNoList');
    });
  }

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.items = context.context.items;
    this.error = context.error;
    this.options = context.options;

    if (this.data.bonNo) {
      this.selectedBon = this.data.bonNo;
    }

    // Get the existing cache
    this.bonNoList = JSON.parse(localStorage.getItem('bonNoList')) || [];
  }

  get expenditureGoodLoader() {
    return ExpenditureGoodLoader;
  }

  get uomLoader() {
    return UomLoader;
  }

  get productFilter() {
    return {
      ProductTypeId: this.context.context.options.transactionTypeId,
    };
  }

  get bonLoader() {
    return async (keyword) => {
      var info = {
        keyword: keyword,
        filterProduction: {
          ExpenditureType: "LAIN-LAIN",
          IsLocalSalesNote: false,
        },
        filterSample: {
          IsReceived: false,
          ExpenditureType: "PENGIRIMAN LOKAL",
          IsLocalSalesNote: false,
        },
        filterLeftOver: {
          ExpenditureTo: "JUAL LOKAL",
          IsLocalSalesNote: false,
        },
      };

      var noList = [];

      //Get data from Production
      await ExpenditureGoodLoader(keyword, info.filterProduction).then((result) => {
        for (var a of result) {
          var dup = noList.find(
            (d) => d.ExpenditureGoodNo == a.ExpenditureGoodNo
          );
          if (!dup) {
            var selected = this.items.find(
              (x) => x.data.bonNo == a.ExpenditureGoodNo
            );

            if (!selected) {
              var no = {};
              no.bonNo = a.ExpenditureGoodNo;
              no.quantity = a.TotalQuantity;
              no.uom = {
                id: 43,
                unit: "PCS",
              };
              no.bonFrom = "PRODUKSI";
              no.roNo = a.RONo;
              no.comodity = a.Comodity;
              noList.push(no);
            }
          }
        }
      });

      //Get data from Sample
      await ExpenditureGoodSampleLoader(keyword, info.filterSample).then((result) => {
        for (var a of result) {
          var dup = noList.find(
            (d) => d.ExpenditureGoodNo == a.ExpenditureGoodNo
          );
          if (!dup) {
            var selected = this.items.find(
              (x) => x.data.bonNo == a.ExpenditureGoodNo
            );

            if (!selected) {
              var no = {};
              no.bonNo = a.ExpenditureGoodNo;
              no.quantity = a.TotalQuantity;
              no.uom = {
                id: 43,
                unit: "PCS",
              };
              no.bonFrom = "SAMPLE";
              no.roNo = a.RONo;
              no.comodity = a.Comodity;
              noList.push(no);
            }
          }
        }
      });

      //get data from Leftover
      await LeftOverFinishedGoodsLoader(keyword, info.filterLeftOver).then(
        (result) => {
          for (var a of result) {
            var dup = noList.find(
              (d) => d.FinishedGoodExpenditureNo == a.FinishedGoodExpenditureNo
            );
            if (!dup) {
              var selected = this.items.find(
                (x) => x.data.bonNo == a.FinishedGoodExpenditureNo
              );

              if (!selected) {
                var no = {};
                no.bonNo = a.FinishedGoodExpenditureNo;
                no.quantity = parseFloat(a.Description);
                no.uom = {
                  id: 43,
                  unit: "PCS",
                };
                no.bonFrom = "SISA";
                no.detailItems = [];

                //mapping detail
                for (var item of a.Items) {
                  var detail = {};
                  detail.quantity = item.ExpenditureQuantity;
                  detail.uom = {
                    id: 43,
                    unit: "PCS",
                  };
                  detail.roNo = item.RONo;
                  detail.comodity = item.LeftoverComodity;
                  no.detailItems.push(detail);
                }

                noList.push(no);
              }
            }
          }
        }
      );
      
      return noList.filter(item => !this.bonNoList.includes(item.bonNo));
    };
  }

  get total() {
    this.data.amount = this.data.quantity * this.data.price;

    return this.data.amount;
  }

  selectedBonChanged(newValue) {
    if (newValue) {
      this.data.bonNo = newValue.bonNo;
      this.data.quantity = newValue.quantity;
      this.data.uom = newValue.uom;
      this.data.bonFrom = newValue.bonFrom;
      this.data.roNo = newValue.roNo;
      this.data.comodity = newValue.comodity;
      
      // Check if the selected item has detailItems
      if(newValue.detailItems){
        this.data.detailItems = newValue.detailItems;
      }

      // Push the new value into the cache
      this.bonNoList.push(newValue.bonNo);

      // Save the updated cache back to localStorage
      localStorage.setItem('bonNoList', JSON.stringify( this.bonNoList))
      
    } else {
      this.data.bonNo = null;
      this.data.quantity = 0;
      this.data.uom = null;
      this.data.bonFrom = null;
      this.data.comodity = null;
      this.data.roNO = null;
      this.data.detailItems = [];
    }
  }
}
