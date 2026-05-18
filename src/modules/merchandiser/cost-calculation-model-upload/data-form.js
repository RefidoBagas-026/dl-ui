import { Router } from "aurelia-router";
import {
  inject,
  bindable,
  BindingEngine,
  observable,
  computedFrom,
} from "aurelia-framework";
import { Service } from "./service";
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
  ServiceCore,
  Service
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
  @bindable previewData = [];
  @bindable headers = [];
  @bindable viewDataTable = false;
  @bindable dataMaterialUpload = [];
  @bindable dataMaterial = [];
  @bindable errorUpload;
  @bindable hasSCNO;
  @bindable hasQuantity;
  @bindable selectedCCType;

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

  CCTypeList = ["MOQ", "PRE-JOB", "OB", "TERIMA SUBCON","SUBCON KELUAR"];

  costCalculationGarment_MaterialsInfoUploads = {
    columns: [
      { header: "No." },
      { header: "PR Master" },
      { header: "CMT", value: "isFabricCM" },
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
    serviceCore,
    service,
  ) {
    this.router = router;
    this.bindingEngine = bindingEngine;
    this.efficiencyService = serviceEffeciency;
    this.rateService = rateService;
    this.element = element;
    this.selectedRate = "USD";
    this.serviceCore = serviceCore;
    this.service = service;
  }
  @bindable dataSection;
  @bindable dataBuyerAgent;
  @bindable dataBuyerBrand;

  async bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;
    this.create = this.context.create;
    this.dataSection = this.data.Section ? { Code: this.data.Section, Name: this.data.SectionName } : null;
    this.dataBuyerAgent = this.data.Buyer ? { Id: this.data.Buyer.Id, Code: this.data.Buyer.Code, Name: this.data.Buyer.Name } : null;
    this.dataBuyerBrand = this.data.BuyerBrand ? { Id: this.data.BuyerBrand.Id, Code: this.data.BuyerBrand.Code, Name: this.data.BuyerBrand.Name } : null;
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
    this.data.ConfirmPrice = this.data.ConfirmPrice;
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
    this.costCalculationGarment_MaterialsInfoUploads.options.CCId = this.data.Id;
    this.costCalculationGarment_MaterialsInfoUploads.options.BuyerCode = this.data.BuyerBrand ? this.data.BuyerBrand.Code : "";
    this.costCalculationGarment_MaterialsInfoUploads.options.SectionName = this.data.SectionName;
    this.costCalculationGarment_MaterialsInfoUploads.options.IsEditMaterial = this.isEdit;
    this.costCalculationGarment_MaterialsInfoUploads.options.IsCopyCC =  this.isCopy;
    this.hasQuantity = this.data.Quantity;
  }

  selectedSampleChanged(value){
    if(this.data.IsSample){
      this.isSample = true;
    }else{
      this.isSample = false;
    }
  }
  get preSalesContractLoader() {
    return PreSalesContractLoader;
  }

  get garmentMarketingLoader() {
    return GarmentMarketingLoader;
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
            this.costCalculationGarment_MaterialsInfoUploads.options.SectionName = newValue.Name;
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
            this.costCalculationGarment_MaterialsInfoUploads.options.SectionName = null;
        }
        if(this.create){
          if (newValue !== oldValue) {
              this.data.CostCalculationGarment_Materials.splice(0);
              this.context.itemsCollection.bind();
          }
        }

    }
  @bindable selectedGarmentMarketing;
  async selectedGarmentMarketingChanged(newValue, oldValue) {
    if (newValue) {
      this.data.MarketingName = newValue.Name;
      this.data.ResponsibleName = newValue.ResponsibleName;
    } else {
      this.selectedBookingOrder = null;
      this.selectedGarmentMarketing = null;
    }
  }

  @bindable selectedComodity;
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

  get bookingOrderLoader() {
    return BookingOrderLoader;
  }

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

  get dataSection() {
    return this.data.Section || this.data.SectionName
      ? `${this.data.Section} - ${this.data.SectionName}`
      : "-";
  }

  get dataBuyer() {
    return this.data.Buyer ? this.data.Buyer.Name : "-";
  }

  get dataBuyerBrand() {
    return this.data.BuyerBrand ? this.data.BuyerBrand.Name : "-";
  }

  @bindable selectedPreSalesContract;
  async selectedPreSalesContractChanged(newValue, oldValue) {
    if (newValue) {
      this.data.PreSCId = newValue.Id;
      this.data.PreSCNo = newValue.SCNo;
      this.data.Section = newValue.SectionCode;
      this.data.CCType = newValue.SCType;
      const section = await this.serviceCore.getSection(newValue.SectionId);
      this.data.SectionName = section.Name;
      this.data.ApprovalCC = section.ApprovalCC;
      this.data.ApprovalRO = section.ApprovalRO;
      this.data.ApprovalKadiv = section.ApprovalKadiv;

      this.hasSCNO = newValue.SCNo;
      this.data.Buyer = {
        Id: newValue.BuyerAgentId,
        Code: newValue.BuyerAgentCode,
        Name: newValue.BuyerAgentName,
      };

      this.data.BuyerCode = this.data.Buyer.Code;
      this.data.BuyerBrand = {
        Id: newValue.BuyerBrandId,
        Code: newValue.BuyerBrandCode,
        Name: newValue.BuyerBrandName,
      };

      this.data.BuyerBrandCode = this.data.BuyerBrand.Code;
    } else {
      this.data.PreSCId = 0;
      this.data.PreSCNo = null;
      this.data.Section = null;
      this.data.SectionName = null;
      this.data.ApprovalCC = null;
      this.data.ApprovalRO = null;
      this.data.ApprovalKadiv = null;
      this.data.Buyer = null;
      this.data.BuyerBrand = null;
      this.selectedBookingOrder = null;
      this.data.CCType = null;
      this.hasSCNO = null;
    }

    if ((oldValue && newValue) || (oldValue && !newValue)) {
      if (this.data.CostCalculationGarment_Materials && this.data.CostCalculationGarment_Materials.length > 0) {
          // this.dataMaterialUpload = this.data.CostCalculationGarment_Materials.filter(m => m.IsFromUpload);
          // this.dataMaterial = this.data.CostCalculationGarment_Materials.filter(m => !m.IsFromUpload);

          this.data.CostCalculationGarment_Materials.splice(0);
          this.error.CostCalculationGarment_Materials.splice(0);
          // this.dataMaterialUpload.splice(0);
          // this.dataMaterial.splice(0);
          // this.errorManual = [];
          this.errorUpload.splice(0);
          this.data.CostCalculationGarment_Materials = [...this.data.CostCalculationGarment_Materials];
          document.getElementById("fileCsv").value = "";
      }
    } else if (
      this.data.PreSCNoSource &&
      this.data.PreSCNo !== this.data.PreSCNoSource
    ) {
      const materialsFromPRMaster =
        this.data.CostCalculationGarment_Materials.filter(
          (m) => m.PRMasterItemId > 0
        );
      for (const materialFromPRmaster of materialsFromPRMaster) {
        materialFromPRmaster.IsPRMaster = null;
        materialFromPRmaster.PRMasterId = 0;
        materialFromPRmaster.PRMasterItemId = 0;
        materialFromPRmaster.POMaster = null;
      }
    }
    this.costCalculationGarment_MaterialsInfoUploads.options.SCId = this.data.PreSCId;
  }

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
              this.data.BuyerBrand = null;
              this.data.BuyerBrandId = null;
              this.data.BuyerBrandCode = null;
              this.data.BuyerBrandName = null;
              this.dataBuyerBrand = null;
              
          }
          if(this.create){
            if(newValue !==  oldValue){
              this.buyerBrand = null;
              this.dataBuyerBrand = null;
              this.data.BuyerBrand = null;
              this.data.BuyerBrandId = null;
              this.data.BuyerBrandCode = null;
              this.data.BuyerBrandName = null;
              this.data.CostCalculationGarment_Materials.splice(0);
              this.context.itemsCollection.bind();    
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
            this.costCalculationGarment_MaterialsInfoUploads.options.BuyerCode = newValue.Code;
          } else {
            this.data.BuyerBrand = null;
            this.data.BuyerBrandId = null;
            this.data.BuyerBrandCode = null;
            this.data.BuyerBrandName = null;
            this.selectedBookingOrder = null;
            this.data.BookingOrderId = 0;
            this.data.BookingOrderItemId = 0;
            this.data.BookingOrderNo = null;
            this.data.BOQuantity = 0;
            this.data.ConfirmDate = null;
            this.costCalculationGarment_MaterialsInfoUploads.options.BuyerCode = null;
            // this.data.CostCalculationGarment_Materials.splice(0);
            // this.context.itemsCollection.bind();
          }
  
        if(this.create){
        if (newValue !== oldValue) {
              this.data.CostCalculationGarment_Materials.splice(0);
              this.context.itemsCollection.bind();
          }
        }
    }
  
      buyerBrandView = (buyerBrand) => {
        if(this.create){  
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
  //
  @bindable selectedBookingOrder;
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

  @bindable selectedLeadTime = "";
  selectedLeadTimeChanged(newVal) {
    if (newVal === "25 hari") {
      this.data.LeadTime = 25;
    } else if (newVal === "40 hari") {
      this.data.LeadTime = 40;
    } else this.data.LeadTime = 0;
  }

  @bindable imageUpload;
  @bindable imageSrc;
  imageUploadChanged(newValue) {
    let imageInput = document.getElementById("imageInput");
    let reader = new FileReader();
    reader.onload = (event) => {
      let base64Image = event.target.result;
      this.imageSrc = this.data.ImageFile = base64Image;
    };
    reader.readAsDataURL(imageInput.files[0]);
  }

  @bindable selectedRate;

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

  @bindable quantity;
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
 
  @bindable fabricAllowance;
  fabricAllowanceChanged(newValue) {
    this.data.FabricAllowance = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.FabricAllowance = this.data.FabricAllowance;
      });
    }
  }

  @bindable accessoriesAllowance;
  accessoriesAllowanceChanged(newValue) {
    this.data.AccessoriesAllowance = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.AccessoriesAllowance = this.data.AccessoriesAllowance;
      });
    }
  }

  @bindable selectedSubconType;
  selectedSubconTypeChanged(newValue) {
    this.data.SubconType = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.SubconType = this.data.SubconType;
      });
      this.context.itemsCollection.bind();
    }
  }

  @bindable selectedSMV_Cutting;
  selectedSMV_CuttingChanged(newValue) {
    this.data.SMV_Cutting = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.SMV_Cutting = this.data.SMV_Cutting;
      });
      this.context.itemsCollection.bind();
    }
  }

  @bindable selectedSMV_Sewing;
  selectedSMV_SewingChanged(newValue) {
    this.data.SMV_Sewing = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.SMV_Sewing = this.data.SMV_Sewing;
      });
      this.context.itemsCollection.bind();
    }
  }

  @bindable selectedSMV_Finishing;
  selectedSMV_FinishingChanged(newValue) {
    this.data.SMV_Finishing = newValue;
    if (this.data.CostCalculationGarment_Materials) {
      this.data.CostCalculationGarment_Materials.forEach((item) => {
        item.SMV_Finishing = this.data.SMV_Finishing;
      });
      this.context.itemsCollection.bind();
    }
  }

  @bindable selectedUnit;
  async selectedUnitChanged(newVal) {
    this.data.Unit = newVal;
    this.data.UnitId = newVal.Id;
    this.data.UnitCode = newVal.Code;
    this.data.BuyerName = newVal.Name;
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
      this.data.UnitCode = newVal.Code;
      this.data.UnitId = newVal.Id;
      this.data.UnitName = newVal.Name;
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

  download() {
    this.service.downloadTemplateMaterialCC();
  }
  downloadErrorExcel(errors) {
    // Buat struktur data untuk Excel
    const errorData = errors.map((msg, index) => ({
        No: index + 1,
        Error: msg
    }));

    const worksheet = XLSX.utils.json_to_sheet(errorData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Error Upload");

    // Download file
    XLSX.writeFile(workbook, "Error_Upload.xlsx");
}

  async handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

      if (jsonData.length === 0) {
            alert("File kosong atau tidak memiliki data.");
            return;
        }
        // Expected header sesuai template
        const expectedHeaders = [
            "PR MASTER",//tidak wajib
            "CMT",//tidak wajib
            "Kode Barang",
            "Keterangan",
            "Detil Barang",
            "Usage per pcs",
            "Satuan Barang",
            "Rincian qty",//tidak wajib
            "Harga",
            "Satuan beli",
            "Konversi",
            "Ongkir %",
            "Remark RO"
        ];

        let actualHeaders = Object.keys(jsonData[0]);
        for (let header of expectedHeaders) {
            if (!actualHeaders.includes(header)) {
                alert(`Template tidak sesuai.`);
                return;
            }
        }
        // Hanya ambil header yang valid (tanpa __EMPTY, dst)
        const cleanData = jsonData.map(row => {
            const cleanedRow = {};
            expectedHeaders.forEach(header => {
                cleanedRow[header] = row.hasOwnProperty(header) ? row[header] : "";
            });
            return cleanedRow;
        });

        // Hapus semua isi jsonData
        jsonData.length = 0;

        // Isi ulang hanya baris yang tidak kosong total
        jsonData.push(
          ...cleanData.filter(row =>
            Object.values(row).some(val =>
              val !== null &&
              val !== undefined &&
              !(typeof val === "string" && val.trim() === "")
            )
          )
        );

       const mandatoryColumns = [
            "Kode Barang",
            "Keterangan",
            "Usage per pcs",
            "Satuan Barang",
            "Harga",
            "Satuan beli",
            "Konversi",
            "Ongkir %",
            "Remark RO"
        ];
        // Validasi kolom wajib tidak boleh kosong
        const errors = [];
        jsonData.forEach((row, rowIndex) => {
            mandatoryColumns.forEach(col => {
                const val = row[col];

                // Cek wajib terisi, tapi 0 harus dianggap valid
                const isEmpty =
                    val === null ||
                    val === undefined ||
                    (typeof val === "string" && val.trim() === "");

                if (isEmpty) {
                    errors.push(`Kolom "${col}" pada baris ${rowIndex + 2} tidak boleh kosong`);
                }
            });
        });

        if (errors.length > 0) {
            if (confirm("Terdapat data kosong, download file error?")) {
                this.downloadErrorExcel(errors);
            }
           
            return;
        }
      this.previewData = jsonData;
      this.headers = actualHeaders;
      await this.pushDataExcel(this.previewData);
    };

    document.getElementById("fileCsv").value = null;
    reader.readAsArrayBuffer(file);
    
  }
async pushDataExcel(value) {
  if (!Array.isArray(value) || value.length === 0) {
    alert("Tidak ada data Excel yang dibaca.");
    document.getElementById("fileCsv").value = "";
    return;
  }

  this.errorUpload = [];
  this.error = {};

  this.data.CostCalculationGarment_Materials = [];
  this.error.CostCalculationGarment_Materials = [];

  const payload = value.map((row, index) => ({
    IsAddPRMaster: row["PR MASTER"] != null && String(row["PR MASTER"]).trim() === "1",
    isFabricCM: row["CMT"] != null && String(row["CMT"]).trim() === "1",
    KodeBarang: (row["Kode Barang"] || "").toString().trim(),
    SatuanBeli: (row["Satuan beli"] || "").toString().trim(),
    SatuanBarang: (row["Satuan Barang"] || "").toString().trim(),
    Description: (row["Keterangan"] || "").toString(),
    ProductRemark: row["Detil Barang"] && row["Detil Barang"].toString().trim() !== "" ? row["Detil Barang"].toString() : "-",
    Quantity: parseFloat(row["Usage per pcs"]) || 0,
    Price: parseFloat(row["Harga"]) || 0,
    Conversion: parseFloat(row["Konversi"]) || 0,
    ShippingFeePortion: parseFloat(row["Ongkir %"]) || 0,
    Information: (row["Remark RO"] || "").toString(),
    MaterialIndex: index,
    QuantityOrder: this.data.Quantity || 0,
    FabricAllowance: this.data.FabricAllowance || 0,
    AccessoriesAllowance: this.data.AccessoriesAllowance || 0,
    Rate: this.data.Rate || 0,
    SMV_Cutting: this.data.SMV_Cutting || 0,
    SMV_Sewing: this.data.SMV_Sewing || 0,
    SMV_Finishing: this.data.SMV_Finishing || 0,
    THR: this.data.THR || 0,
    Wage: this.data.Wage || 0,
    SMV_Total: this.data.SMV_Total || 0,
    Efficiency: this.data.Efficiency || 0,
    CCType: this.data.CCType,
    SubconType: this.data.SubconType,
    IsFromUpload: true
  }));
  let resultData = [];

  try {
    resultData = await this.serviceCore.getMaterialFromUpload(payload);
  } catch (error) {
    console.error("Gagal memanggil service:", error);
    alert("Gagal mengambil data Product dan UOM. Periksa koneksi Anda.");
    return;
  }

  const materials = Array.isArray(resultData) ? resultData : [];

  for (const item of materials) {
    const hasProduct = !!item.Product || item.Product !== null; // Cek apakah Product ada (bisa null jika tidak ditemukan)

    const material = hasProduct
      ? {
          IsAddPRMaster: item.IsAddPRMaster,
          isFabricCM: item.isFabricCM || false,
          Category: item.Category || {},
          Product: item.Product || {},
          Description: item.Description,
          ProductRemark: item.ProductRemark,
          Quantity: item.Quantity || 0,
          UOMQuantity: item.UOMQuantity || null,
          Price: item.Price || 0,
          Conversion: item.Conversion || 0,
          ShippingFeePortion: item.ShippingFeePortion || 0,
          Information: item.Information,
          UOMPrice: item.UOMPrice || null,
          MaterialIndex: item.MaterialIndex || 0,
          QuantityOrder: item.QuantityOrder || 0,
          FabricAllowance: item.FabricAllowance || 0,
          AccessoriesAllowance: item.AccessoriesAllowance || 0,
          Rate: item.Rate || 0,
          SMV_Cutting: item.SMV_Cutting || 0,
          SMV_Sewing: item.SMV_Sewing || 0,
          SMV_Finishing: item.SMV_Finishing || 0,
          THR: item.THR || 0,
          Wage: item.Wage || 0,
          SMV_Total: item.SMV_Total || 0,
          Efficiency: item.Efficiency || 0,
          CCType: item.CCType,
          SubconType: item.SubconType,
          IsFromUpload: item.IsFromUpload
        }
      : {
          IsAddPRMaster: item.IsAddPRMaster,
          MaterialIndex: item.MaterialIndex,
          Product: { 
            Code: item.KodeBarang || "Tidak ditemukan",
            IsError: true,
            ErrorMessage: "Tidak ditemukan"
          },
          HasError: true,
          IsFromUpload: item.IsFromUpload
        };

    if (material && material.isFabricCM) {
      material.ShippingFeePortion = 0;
    }
    if (material && material.Category && ( material.Category.Name === "PROCESS" || material.Category.Name === "PROCESS SUBCON"))
    {
        let UOM = await this.serviceCore.getUomByUnit("PCS");
        material.UOMQuantity = UOM;
        material.UOMPrice = UOM;
        material.Quantity = 1;
        material.Conversion = 1;
        material.Price = 0;
    }

    this.data.CostCalculationGarment_Materials.push(material);
  }
  this.data.CostCalculationGarment_Materials = [...this.data.CostCalculationGarment_Materials];
}

viewData() {
    this.viewDataTable = !this.viewDataTable;
    if (this.viewDataTable && this.previewData.length === 0) {
        alert("Tidak ada data Excel yang dibaca.");
        this.viewDataTable = false;
    }
}

@computedFrom("data.BuyerBrand", "data.Section")
get itemOn(){
  const hasBuyerBrand = !!this.data.BuyerBrand;
  const hasSection = !!this.data.Section;
  if (hasBuyerBrand && hasSection) {
    return true;
  } else {    
    return false;
  }
}

}
