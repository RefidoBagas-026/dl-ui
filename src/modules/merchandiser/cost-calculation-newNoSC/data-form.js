import { Router } from "aurelia-router";
import {
  inject,
  bindable,
  BindingEngine,
  computedFrom,
} from "aurelia-framework";
import { ServiceEffeciency } from "./service-efficiency";
import { RateService } from "./service-rate";
import { ServiceCore } from "./service-core";
import moment from "moment";
import SectionLoader from "../../../loader/garment-sections-loader";
import GarmentBuyerLoader from "../../../loader/garment-buyers-loader";
import GarmentBuyerBrandLoader from "../../../loader/garment-buyer-brands-loader";


import numeral from "numeral";
numeral.defaultFormat("0,0.00");
const rateNumberFormat = "0,0.000";
var PreSalesContractLoader = require("../../../loader/garment-pre-sales-contracts-loader");
var BookingOrderLoader = require("../../../loader/garment-booking-order-by-no-for-ccg-loader");
var GarmentMarketingLoader = require("../../../loader/garment-marketings-loader");
var SizeRangeLoader = require("../../../loader/size-range-loader");
var ComodityLoader = require("../../../loader/garment-comodities-loader");
var UOMLoader = require("../../../loader/uom-loader");
var UnitLoader = require("../../../loader/garment-units-gmt-loader");

@inject(
  Router,
  BindingEngine,
  ServiceEffeciency,
  RateService,
  Element,
  ServiceCore
)
export class DataForm {
  @bindable title;
  @bindable readOnly;
  @bindable disabled = "true";
  @bindable OLCheck;
  @bindable OTL1Check;
  @bindable OTL2Check;
  @bindable OTL3Check;
  @bindable Quantity;
  @bindable data = {};
  @bindable error = {};
  @bindable SelectedRounding;
  @bindable isCopy = false;
  @bindable isSample = false;
  @bindable dataSection;
  @bindable selectedGarmentMarketing;
  @bindable selectedComodity;
  @bindable dataBuyerAgent;
  @bindable dataBuyerBrand;
  @bindable selectedBookingOrder;
  @bindable selectedLeadTime = "";
  @bindable imageUpload;
  @bindable imageSrc;
  @bindable selectedRate;
  @bindable quantity;
  @bindable fabricAllowance;
  @bindable accessoriesAllowance;
  @bindable selectedSubconType;
  @bindable selectedSMV_Cutting;
  @bindable selectedSMV_Sewing;
  @bindable selectedSMV_Finishing;
  @bindable selectedUnit;
  @bindable selectedCCType;
  @bindable requiredBuyerAgent;
  @bindable requiredBrandKomoditi;
  @bindable requiredBookingOrder;
  

  get preSalesContractLoader() {
    return PreSalesContractLoader;
  }

  get garmentMarketingLoader() {
    return GarmentMarketingLoader;
  }
  
  get bookingOrderLoader() {
    return BookingOrderLoader;
  }
  

  leadTimeList = ["", "25 hari", "40 hari"];
  subconTypes = [
    "SUBCON SEWING",
    "SUBCON CUTTING SEWING",
    "SUBCON CUTTING SEWING FINISHING",
  ];

  defaultRate = { Id: 0, Value: 0, CalculatedValue: 0 };
  length0 = {
    label: {
      align: "left",
    },
  };
  length4 = {
    label: {
      align: "left",
      length: 4,
    },
  };
  length6 = {
    label: {
      align: "left",
      length: 6,
    },
  };
  length8 = {
    label: {
      align: "left",
      length: 8,
    },
  };
  CCTypeList = ["JOB ORDER", "SAMPLE", "TERIMA SUBCON","SUBCON KELUAR"];

  costCalculationGarment_MaterialsInfo = {
    columns: [
      { header: "No." },
      { value: "isFabricCM", titleCheck: "CMT", filter: (data) => data.IsPRMaster === false || !data.IsPRMaster },
      { header: "PR Master" },
      { header: "No. PO" },
      { header: "Kategori", value: "Category" },
      { header: "Kode Barang", value: "ProductCode" },
      { header: "Komposisi", value: "Composition" },
      { header: "Konstruksi", value: "Construction" },
      { header: "Yarn", value: "Yarn" },
      { header: "Width", value: "Width" },
      { header: "Deskripsi", value: "Description" },
      { header: "Detail Barang", value: "ProductRemark" },
      { header: "Kuantitas", value: "Quantity" },
      { header: "Satuan", value: "SatuanQuantity" },
      { header: "Price", value: "Price" },
      { header: "Satuan", value: "SatuanPrice" },
      { header: "Konversi", value: "Conversion" },
      { header: "Total", value: "Total" },
      { header: "Ongkir (%)", value: "ShippingFeePortion" },
      { header: "Jumlah Ongkir", value: "TotalShippingFee" },
      { header: "Kuantitas Budget", value: "BudgetQuantity" },
    ],
    onAdd: function () {
      this.data.CostCalculationGarment_Materials.push({
        IsFabricCM: this.data.isFabricCM,
        QuantityOrder: this.data.Quantity,
        FabricAllowance: this.data.FabricAllowance,
        AccessoriesAllowance: this.data.AccessoriesAllowance,
        Rate: this.data.Rate,
        SMV_Cutting: this.data.SMV_Cutting,
        SMV_Sewing: this.data.SMV_Sewing,
        SMV_Finishing: this.data.SMV_Finishing,
        THR: this.data.THR,
        Wage: this.data.Wage,
        SMV_Total: this.data.SMV_Total,
        Efficiency: this.data.Efficiency,
        CCType: this.data.CCType,
        SubconType: this.data.SubconType,
      });
      this.data.CostCalculationGarment_Materials.forEach(
        (m, i) => (m.MaterialIndex = i)
      );
    }.bind(this),
    onRemove: function () {
      this.data.CostCalculationGarment_Materials.forEach(
        (m, i) => (m.MaterialIndex = i)
      );
    }.bind(this),
    options: {},
  };
  radio = {
    Dollar: "Dollar",
    Rupiah: "Rupiah",
  };


  constructor(
    router,
    bindingEngine,
    serviceEffeciency,
    rateService,
    element,
    serviceCore
  ) {
    this.router = router;
    this.bindingEngine = bindingEngine;
    this.efficiencyService = serviceEffeciency;
    this.rateService = rateService;
    this.element = element;
    this.selectedRate = "USD";
    this.serviceCore = serviceCore;
  }

  
  async bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;
    this.dataSection = this.data.Section ? { Code: this.data.Section, Name: this.data.SectionName } : null;
    this.dataBuyerAgent = this.data.Buyer ? { Id: this.data.Buyer.Id, Code: this.data.Buyer.Code, Name: this.data.Buyer.Name } : null;
    this.dataBuyerBrand = this.data.BuyerBrand ? { Id: this.data.BuyerBrand.Id, Code: this.data.BuyerBrand.Code, Name: this.data.BuyerBrand.Name } : null;
    console.log(this.dataBuyerBrand);
    this.selectedCCType = this.data.CCType;
    this.selectedSubconType = this.data.SubconType ? this.data.SubconType : "";
    this.selectedSMV_Cutting = this.data.SMV_Cutting
      ? this.data.SMV_Cutting
      : 0;
    this.selectedSMV_Sewing = this.data.SMV_Sewing ? this.data.SMV_Sewing : 0;
    this.selectedSMV_Finishing = this.data.SMV_Finishing
      ? this.data.SMV_Finishing
      : 0;
    this.quantity = this.data.Quantity ? this.data.Quantity : 1;
    this.fabricAllowance = this.data.FabricAllowance
      ? this.data.FabricAllowance
      : 0;
    this.accessoriesAllowance = this.data.AccessoriesAllowance
      ? this.data.AccessoriesAllowance
      : 0;
    this.data.Risk = this.data.Risk ? this.data.Risk : 5;
    this.imageSrc = this.data.ImageFile =
      this.isEdit || this.isCopy ? this.data.ImageFile || "#" : "#";
    this.selectedLeadTime = this.data.LeadTime
      ? `${this.data.LeadTime} hari`
      : "";
    this.selectedUnit = this.data.Unit ? this.data.Unit : "";
    this.data.OTL1 = this.data.OTL1
      ? this.data.OTL1
      : Object.assign({}, this.defaultRate);
    this.data.OTL2 = this.data.OTL2
      ? this.data.OTL2
      : Object.assign({}, this.defaultRate);
    this.data.ConfirmPrice = this.data.ConfirmPrice
      ? this.data.ConfirmPrice.toLocaleString("en-EN", {
          minimumFractionDigits: 4,
        })
      : 0;
    this.create = this.context.create;
    if (!this.create) {
      this.selectedBookingOrder = {
        BookingOrderId: this.data.BookingOrderId,
        BookingOrderItemId: this.data.BookingOrderItemId,
        BookingOrderNo: this.data.BookingOrderNo,
        ConfirmDate: this.data.ConfirmDate,
        ConfirmQuantity: this.data.BOQuantity,
        ComodityName: this.data.Comodity.Name,
      };
      this.selectedGarmentMarketing = {
        Name: this.data.MarketingName,
        ResponsibleName: this.data.ResponsibleName,
      };

      this.selectedComodity = {
        Id: this.data.Comodity.Id,
        Code: this.data.Comodity.Code,
        Name: this.data.Comodity.Name,
      };
    } else {
      this.selectedBookingOrder = null;
      this.selectedGarmentMarketing = null;
      this.selectedComodity = null;
    }

    let promises = [];

    let wage;
    if (this.data.Wage) {
      wage = new Promise((resolve, reject) => {
        resolve(this.data.Wage);
      });
      this.data.Wage.Value = this.data.Wage.Value.toLocaleString("en-EN", {
        minimumFractionDigits: 2,
      });
    } else {
      this.data.Wage = this.defaultRate;
      wage = this.rateService
        .search({ filter: '{Name:"OL"}' })
        .then((results) => {
          let result = results.data[0] ? results.data[0] : this.defaultRate;
          result.Value = numeral(
            numeral(result.Value).format(rateNumberFormat)
          ).value();
          return result;
        });
      this.data.Wage.Value = this.data.Wage.Value.toLocaleString("en-EN", {
        minimumFractionDigits: 2,
      });
    }
    promises.push(wage);

    let THR;
    if (this.data.THR) {
      THR = new Promise((resolve, reject) => {
        resolve(this.data.THR);
      });
    } else {
      this.data.THR = this.defaultRate;
      THR = this.rateService
        .search({ filter: '{Name:"THR"}' })
        .then((results) => {
          let result = results.data[0] ? results.data[0] : this.defaultRate;
          result.Value = numeral(
            numeral(result.Value).format(rateNumberFormat)
          ).value();
          return result;
        });
    }
    promises.push(THR);

    let rate;
    if (this.data.Rate) {
      rate = new Promise((resolve, reject) => {
        resolve(this.data.Rate);
      });
    } else {
      this.data.Rate = this.defaultRate;
      rate = this.rateService
        .search({ filter: '{Name:"USD"}' })
        .then((results) => {
          let result = results.data[0] ? results.data[0] : this.defaultRate;
          result.Value = numeral(
            numeral(result.Value).format(rateNumberFormat)
          ).value();
          return result;
        });
    }
    promises.push(rate);

    let all = await Promise.all(promises);
    this.data.Wage = all[0];
    this.data.Wage.Value = this.data.Wage.Value.toLocaleString("en-EN", {
      minimumFractionDigits: 2,
    });
    this.data.THR = all[1];
    this.data.Rate = all[2];
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.IsFabricCM = this.data.isFabricCM;
        item.QuantityOrder = this.data.Quantity;
        item.FabricAllowance = this.data.FabricAllowance;
        item.AccessoriesAllowance = this.data.AccessoriesAllowance;
        item.Rate = this.data.Rate;
        item.SMV_Cutting = this.data.SMV_Cutting;
        item.SMV_Sewing = this.data.SMV_Sewing;
        item.SMV_Finishing = this.data.SMV_Finishing;
        item.THR = this.data.THR;
        item.Wage = this.data.Wage;
        item.SMV_Total = this.data.SMV_Total;
        item.Efficiency = this.data.Efficiency;
        item.CCType = this.data.CCType;
        item.SubconType = this.data.SubconType;
      });
    }
    this.isSample = this.data.IsSample;
    this.costCalculationGarment_MaterialsInfo.options.CCId = this.data.Id;
    this.costCalculationGarment_MaterialsInfo.options.BuyerCode = this.data.BuyerBrand ? this.data.BuyerBrand.Code : "";
    this.costCalculationGarment_MaterialsInfo.options.SectionName = this.data.SectionName;
  }

@computedFrom("data.BuyerBrand", "data.Section", "data.Comodity")
get toOpenBookingOrder() {
  const hasBuyerBrand = !!this.data.BuyerBrand;
  const hasComodity = !!this.data.Comodity;
  const hasSection = !!this.data.Section;
  if (hasBuyerBrand && hasComodity && hasSection) {
    return false;
  } else {    
    return true;
  }
}

  @computedFrom("dataBuyerAgent")
  get noBuyerAgent() {
    if(!this.dataBuyerAgent){
      return true;
    }else{
      this.requiredBuyerAgent = null;
      return false;
    }
  }
  
  selectedSampleChanged(value){
    if(this.data.IsSample){
      this.isSample = true;
    }else{
      this.isSample = false;
    }
  }
  

  sectionView = (section) => {
    return section ? `${section.Code} - ${section.Name}` : "";
  };
  
  selectedCCTypeChanged(newValue, oldValue) {
    console.log(newValue);
    this.data.CCType = newValue;
      if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.CCType = this.data.CCType;
      });
      this.context.itemsCollection.bind();
    }
  }
  dataSectionChanged(newValue, oldValue){
    this.context.BookingOrderViewModel.editorValue = "";
        if(newValue){
            this.data.Section = newValue.Code;
            this.data.SectionName = newValue.Name;
            this.data.ApprovalCC = newValue.ApprovalCC;
            this.data.ApprovalRO = newValue.ApprovalRO;
            this.data.ApprovalKadiv = newValue.ApprovalKadiv;
            this.costCalculationGarment_MaterialsInfo.options.SectionName = newValue.Name;
        }else{
          this.data.Section = null;
            this.data.SectionName = null;
            this.data.ApprovalCC = null;
            this.data.ApprovalRO = null;
            this.data.ApprovalKadiv = null;

            this.selectedBookingOrder = null;
            this.data.BookingOrderId = 0;
            this.data.BookingOrderItemId = 0;
            this.data.BookingOrderNo = null;
            this.data.BOQuantity = 0;
            this.data.ConfirmDate = null;
            this.costCalculationGarment_MaterialsInfo.options.SectionName = null;
        }
        if(!this.isEdit){
          if (newValue !== oldValue && this.data.CostCalculationGarment_Materials.length > 0) {
            for (let i = this.data.CostCalculationGarment_Materials.length - 1; i >= 0; i--) {
              if (this.data.CostCalculationGarment_Materials[i].IsPRMaster) {
                  this.data.CostCalculationGarment_Materials.splice(i, 1);
              }
            }
          }
        }

    }

  async selectedGarmentMarketingChanged(newValue, oldValue) {
    if (newValue) {
      this.data.MarketingName = newValue.Name;
      this.data.ResponsibleName = newValue.ResponsibleName;
    } else {
      this.selectedBookingOrder = null;
      this.selectedGarmentMarketing = null;
    }
  }

  async selectedComodityChanged(newVal, oldValue) {
    this.data.Comodity = newVal;
    this.context.BookingOrderViewModel.editorValue = "";
    if (newVal) {
      this.data.ComodityID = newVal.Id;
      this.data.ComodityCode = newVal.Code;
      this.data.Commodity = newVal.Name;
    } else {
      this.selectedComodity = null;
      this.selectedBookingOrder = null;
      this.data.BookingOrderId = 0;
      this.data.BookingOrderItemId = 0;
      this.data.BookingOrderNo = null;
      this.data.BOQuantity = 0;
      this.data.ConfirmDate = null;
    }
  }

  garmentMarketingView = (garmentmarketing) => {
    return `${garmentmarketing.Name} - ${garmentmarketing.ResponsibleName}`;
  };

 

  bookingOrderView = (bookingorder) => {
    return `${bookingorder.BookingOrderNo} | ${bookingorder.ComodityName} | ${
      bookingorder.Remark
    } | ${bookingorder.ConfirmQuantity} | ${moment(
      bookingorder.ConfirmDate
    ).format("DD MMM YYYY")}`;
  };

  get filter() {
    var filter = {};
    filter = {
      BuyerCode: this.data.BuyerBrandCode,
      SectionCode: this.data.Section,
      ComodityCode: this.data.ComodityCode,
    };
    return filter;
  }

  get sectionLoader() {
          return SectionLoader;
      }

  get sizeRangeLoader() {
    return SizeRangeLoader;
  }

  get comodityLoader() {
    return ComodityLoader;
  }
  comodityView = (comodity) => {
    return `${comodity.Code} - ${comodity.Name}`;
  };

  get comodityQuery() {
    var result = { _CreatedBy: "dev217" };
    return result;
  }

  get uomLoader() {
    return UOMLoader;
  }

  get unitLoader() {
    return UnitLoader;
  }

  unitView = (unit) => {
    return `${unit.Code} - ${unit.Name}`;
  };

  uomView = (uom) => {
    return uom ? `${uom.Unit}` : "";
  };

  filterBuyerBrand = {};

  get garmentBuyerLoader() { 
          return GarmentBuyerLoader;
      }


  dataBuyerAgentChanged(newValue, oldValue) {
    this.context.dataBuyerBrandViewModel.editorValue = "";
    this.context.BookingOrderViewModel.editorValue = "";
        if(newValue){
            this.data.Buyer = {
                Id: newValue.Id,
                Code: newValue.Code,
                Name: newValue.Name
            };
            this.filterBuyerBrand = {"BuyerCode": newValue.Code, "Active": true};
            if(newValue.Type){
                this.buyerBrand = null;
                this.data.BuyerBrandId = null;
                this.data.BuyerBrandCode = null;
                this.data.BuyerBrandName = null;
            }
        }else{
            this.data.Buyer = null;
            this.filterBuyerBrand = {};
            this.buyerBrand = null;
            this.data.BuyerBrand = [];
            this.data.BuyerBrandId = null;
            this.data.BuyerBrandCode = null;
            this.data.BuyerBrandName = null;
            this.dataBuyerBrand = null;
        }
        if(!this.isEdit){
          if(newValue !==  oldValue){
            this.buyerBrand = null;
            this.dataBuyerBrand = null;
            this.data.BuyerBrand = [];
            this.data.BuyerBrandId = null;
            this.data.BuyerBrandCode = null;
            this.data.BuyerBrandName = null;
          }
        }

    }

    buyerAgentView = (buyerAgent) => {
        return buyerAgent ? `${buyerAgent.Code} - ${buyerAgent.Name}` : "";
    }

     get garmentBuyerBrandLoader() { 
            return GarmentBuyerBrandLoader;
        }

    dataBuyerBrandChanged(newValue, oldValue) { 
      this.context.BookingOrderViewModel.editorValue = "";
        if(newValue){
          this.data.BuyerBrand = {
                Id: newValue.Id,
                Code: newValue.Code,
                Name: newValue.Name
            };
          this.data.BuyerBrandId = newValue.Id;
          this.data.BuyerBrandCode = newValue.Code;
          this.data.BuyerBrandName = newValue.Name;
          this.costCalculationGarment_MaterialsInfo.options.BuyerCode = newValue.Code;
        } else {
          this.data.BuyerBrand = [];
          this.data.BuyerBrandId = null;
          this.data.BuyerBrandCode = null;
          this.data.BuyerBrandName = null;
          this.selectedBookingOrder = null;
          this.data.BookingOrderId = 0;
          this.data.BookingOrderItemId = 0;
          this.data.BookingOrderNo = null;
          this.data.BOQuantity = 0;
          this.data.ConfirmDate = null;
          this.costCalculationGarment_MaterialsInfo.options.BuyerCode = null;
        }

      if(!this.isEdit){
      if (newValue !== oldValue && this.data.CostCalculationGarment_Materials.length > 0) {
          for (let i = this.data.CostCalculationGarment_Materials.length - 1; i >= 0; i--) {
            if (this.data.CostCalculationGarment_Materials[i].IsPRMaster) {
                this.data.CostCalculationGarment_Materials.splice(i, 1);
            }
          }
        }
      }
  }

    buyerBrandView = (buyerBrand) => {
      if(!this.isEdit){  
        if(buyerBrand.BuyerName != this.data.Buyer.Name){            
            return "";
          }
      }
        return buyerBrand ? `${buyerBrand.Code} - ${buyerBrand.Name}` : "";
    }

  get buyerQuery(){
    var result = { "Active" : true }
    return result;   
  }

  async selectedBookingOrderChanged(newValue, oldValue) {
    if (newValue) {
      this.data.BookingOrderId = newValue.BookingOrderId;
      this.data.BookingOrderItemId = newValue.BookingOrderItemId;
      this.data.BookingOrderNo = newValue.BookingOrderNo;
      this.data.BOQuantity = newValue.ConfirmQuantity;
      this.data.ConfirmDate = newValue.ConfirmDate;
    } else {
      this.data.BookingOrderId = 0;
      this.data.BookingOrderItemId = 0;
      this.data.BookingOrderNo = null;
      this.data.BOQuantity = 0;
      this.data.ConfirmDate = null;
    }
  }

  selectedLeadTimeChanged(newVal) {
    if (newVal === "25 hari") {
      this.data.LeadTime = 25;
    } else if (newVal === "40 hari") {
      this.data.LeadTime = 40;
    } else this.data.LeadTime = 0;
  }

  imageUploadChanged(newValue) {
    let imageInput = document.getElementById("imageInput");
    let reader = new FileReader();
    reader.onload = (event) => {
      let base64Image = event.target.result;
      this.imageSrc = this.data.ImageFile = base64Image;
    };
    reader.readAsDataURL(imageInput.files[0]);
  }

  @computedFrom("data.Id")
  get isEdit() {
    return (this.data.Id || 0) != 0;
  }
  @computedFrom("error.CostCalculationGarment_MaterialTable")
  get hasError() {
    return (
      (this.error.CostCalculationGarment_MaterialTable
        ? this.error.CostCalculationGarment_MaterialTable.length
        : 0) > 0
    );
  }

  get lineLoader() {
    return lineLoader;
  }

  async quantityChanged(newValue) {
    this.data.Quantity = newValue;
    this.data.Efficiency = await this.efficiencyService.getEffByQty(
      this.data.Quantity
    );
    this.data.Efficiency.Value = this.data.Efficiency.Value.toLocaleString(
      "en-EN",
      { minimumFractionDigits: 2 }
    );
    let index = this.data.Efficiency.Value
      ? 100 /
        this.data.Efficiency.Value.toLocaleString("en-EN", {
          minimumFractionDigits: 2,
        })
      : 0;
    this.data.Index = numeral(numeral(index).format())
      .value()
      .toLocaleString("en-EN", { minimumFractionDigits: 2 });
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.QuantityOrder = this.data.Quantity;
        item.Efficiency = this.data.Efficiency;
      });
      this.context.itemsCollection.bind();
    }
  }

  fabricAllowanceChanged(newValue) {
    this.data.FabricAllowance = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.FabricAllowance = this.data.FabricAllowance;
      });
    }
  }

  accessoriesAllowanceChanged(newValue) {
    this.data.AccessoriesAllowance = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.AccessoriesAllowance = this.data.AccessoriesAllowance;
      });
    }
  }

  selectedSubconTypeChanged(newValue) {
    this.data.SubconType = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.SubconType = this.data.SubconType;
      });
      this.context.itemsCollection.bind();
    }
  }

  selectedSMV_CuttingChanged(newValue) {
    this.data.SMV_Cutting = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.SMV_Cutting = this.data.SMV_Cutting;
      });
      this.context.itemsCollection.bind();
    }
  }

  selectedSMV_SewingChanged(newValue) {
    this.data.SMV_Sewing = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.SMV_Sewing = this.data.SMV_Sewing;
      });
      this.context.itemsCollection.bind();
    }
  }

  selectedSMV_FinishingChanged(newValue) {
    this.data.SMV_Finishing = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.SMV_Finishing = this.data.SMV_Finishing;
      });
      this.context.itemsCollection.bind();
    }
  }

  async selectedUnitChanged(newVal, oldVal) {
    if (newVal) {
      let UnitCode = newVal.Code;

      let promises = [];
      let OTL1 = this.rateService
        .search({
          filter: JSON.stringify({ Name: "OTL 1", UnitCode: UnitCode }),
        })
        .then((results) => {
          let result = results.data[0] ? results.data[0] : this.defaultRate;
          result.Value = numeral(
            numeral(result.Value).format(rateNumberFormat)
          ).value();
          return result;
        });
      promises.push(OTL1);

      let OTL2 = this.rateService
        .search({
          filter: JSON.stringify({ Name: "OTL 2", UnitCode: UnitCode }),
        })
        .then((results) => {
          let result = results.data[0] ? results.data[0] : this.defaultRate;
          result.Value = numeral(
            numeral(result.Value).format(rateNumberFormat)
          ).value();
          return result;
        });
      promises.push(OTL2);

      let results = await Promise.all(promises);

      this.data.OTL1 = results[0];
      this.data.OTL2 = results[1];
      this.data.Unit = newVal;
      this.data.UnitId = newVal.Id;
      this.data.UnitCode = newVal.Code;
      this.data.UnitName = newVal.Name;
    }else{
      this.data.OTL1 = Object.assign({}, this.defaultRate);
      this.data.OTL2 = Object.assign({}, this.defaultRate);
      this.data.Unit = null;
      this.data.UnitId = 0;
      this.data.UnitCode = null;
      this.data.UnitName = null;
    }
  }

  @computedFrom("data.SMV_Cutting", "data.SMV_Sewing", "data.SMV_Finishing")
  get SMV_Total() {
    let SMV_Total =
      this.data.SMV_Cutting + this.data.SMV_Sewing + this.data.SMV_Finishing;
    SMV_Total = numeral(SMV_Total).format();
    this.data.SMV_Total = numeral(SMV_Total).value();

    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.SMV_Total = this.data.SMV_Total;
      });
    }

    return SMV_Total;
  }

  @computedFrom(
    "data.CommissionPortion",
    "data.ConfirmPrice",
    "data.Freight",
    "data.Insurance",
    "data.Rate"
  )
  get commissionRate() {
    let CommissionRate =
      (this.data.CommissionPortion / 100) *
      (this.data.ConfirmPrice - this.data.Insurance - this.data.Freight) *
      this.data.Rate.Value;
    CommissionRate = numeral(CommissionRate).format();
    this.data.CommissionRate = numeral(CommissionRate).value();
    return CommissionRate;
  }

  @computedFrom("data.OTL1", "data.SMV_Total", "data.SubconType")
  get calculatedRateOTL1() {
    let calculatedRateOTL1 = 0;
    if (this.data.CCType == "SUBCON KELUAR") {
      switch (this.data.SubconType) {
        case "SUBCON SEWING":
          calculatedRateOTL1 = this.data.SMV_Total
            ? this.data.OTL1.Value *
              (this.data.SMV_Cutting + this.data.SMV_Finishing)
            : 0;
          break;
        case "SUBCON CUTTING SEWING":
          calculatedRateOTL1 = this.data.SMV_Total
            ? this.data.OTL1.Value * this.data.SMV_Finishing
            : 0;
          break;
      }
    } else {
      calculatedRateOTL1 = this.data.SMV_Total
        ? this.data.OTL1.Value * this.data.SMV_Total
        : 0;
    }

    calculatedRateOTL1 = numeral(calculatedRateOTL1).format();
    this.data.OTL1.CalculatedValue = numeral(calculatedRateOTL1).value();
    return calculatedRateOTL1;
  }

  @computedFrom("data.OTL2", "data.SMV_Total", "data.SubconType")
  get calculatedRateOTL2() {
    let calculatedRateOTL2 = 0;

    if (this.data.CCType == "SUBCON KELUAR") {
      switch (this.data.SubconType) {
        case "SUBCON SEWING":
          calculatedRateOTL2 = this.data.SMV_Total
            ? this.data.OTL2.Value *
              (this.data.SMV_Cutting + this.data.SMV_Finishing)
            : 0;
          break;
        case "SUBCON CUTTING SEWING":
          calculatedRateOTL2 = this.data.SMV_Total
            ? this.data.OTL2.Value * this.data.SMV_Finishing
            : 0;
          break;
      }
    } else {
      calculatedRateOTL2 = this.data.SMV_Total
        ? this.data.OTL2.Value * this.data.SMV_Total
        : 0;
    }
    calculatedRateOTL2 = numeral(calculatedRateOTL2).format();
    this.data.OTL2.CalculatedValue = numeral(calculatedRateOTL2).value();
    return calculatedRateOTL2;
  }

  @computedFrom(
    "data.Wage",
    "data.SMV_Sewing",
    "data.Efficiency" + "data.SMV_Cutting",
    "data.SMV_Finishing",
    "data.THR",
    "data.SMV_Total"
  )

  @computedFrom(
    "data.ConfirmPrice",
    "data.Insurance",
    "data.Freight",
    "data.Rate",
    "data.CommissionRate"
  )

  get NETFOB() {
    let NETFOB =
      (this.data.ConfirmPrice - this.data.Insurance - this.data.Freight) *
        this.data.Rate.Value -
      this.data.CommissionRate;
    NETFOB = numeral(NETFOB).format();
    this.data.NETFOB = numeral(NETFOB).value();
    return NETFOB;
  }

  get freightCost() {
    let freightCost = 0;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        freightCost += item.TotalShippingFee;
      });
    }
    freightCost = numeral(freightCost).format();
    this.data.FreightCost = numeral(freightCost).value();

    return freightCost;
  }

  get NETFOBP() {
    let allMaterialCost = 0;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        allMaterialCost += item.Total;
      });
    }
    let subTotal =
      allMaterialCost !== 0
        ? ((allMaterialCost +
            this.data.OTL1.CalculatedValue +
            this.data.OTL2.CalculatedValue) *
            (100 + this.data.Risk)) /
            100 +
          this.data.FreightCost
        : 0;
    let NETFOBP =
      this.data.NETFOB && subTotal !== 0
        ? ((this.data.NETFOB - subTotal) / subTotal) * 100
        : 0;
    NETFOBP = numeral(NETFOBP).format();
    this.data.NETFOBP = numeral(NETFOBP).value();
    return NETFOBP;
  }

  enterDelegate(event) {
    if (event.charCode === 13) {
      event.preventDefault();
      return false;
    } else return true;
  }
}
