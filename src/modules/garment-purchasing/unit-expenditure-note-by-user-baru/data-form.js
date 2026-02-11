import {
  inject,
  bindable,
  containerless,
  computedFrom,
  BindingEngine,
} from "aurelia-framework";
import { Service } from "./service";
import { AuthService } from "aurelia-authentication";
var UnitDeliveryOrderLoader = require("../../../loader/garment-unit-delivery-order-for-unit-expenditure-note-loader");

@containerless()
@inject(Service, BindingEngine, AuthService)
export class DataForm {
  @bindable readOnly = false;
  @bindable data = {};
  @bindable error = {};
  @bindable title;
  @bindable options = {};
  @bindable unitDeliveryOrder;
  
  expenditureTypeOptions = ["PROSES"];
  controlOptions = {
    label: {
      align: "right",
      length: 5,
    },
    control: {
      length: 5,
      align: "right",
    },
  };

  constructor(service, bindingEngine, authService) {
    this.service = service;
    this.bindingEngine = bindingEngine;
    this.authService = authService;
  }

  bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;
    this.isItem = false;
    this.data.ExpenditureTo = "PROSES";
    this.options.ExpenditureType = this.data.ExpenditureType;


    if (this.data.Items) 
    if (this.data.Items.length > 0) {
      this.isItem = true;
      
    }

    this.options.readOnly = this.readOnly;
    this.options.expenditureType = this.data.ExpenditureType;

    this.readOnlySender = true;
    if (this.data && this.data.Items) {
      this.options.checkedAll = this.data.Items.reduce(
        (acc, curr) => acc && curr.IsSave,
        true
      );
    }

    if ( Array.isArray(this.data.Items) &&
        this.data.Items.length &&
        !this.data.Items[0].Details
      ) {
      const map = new Map();

      this.data.Items.forEach(item => {
        const key = `${item.ProductId}_${item.ProductCode}_${item.BuyerId}_${item.ProductRemark}`;

        if (!map.has(key)) {
          map.set(key, {
            
            ProductId: item.ProductId,
            ProductCode: item.ProductCode,
            ProductName: item.ProductName,
            BuyerCode: item.BuyerCode,
            BuyerId: item.BuyerId,
            ProductRemark: item.ProductRemark,
            UomId: item.UomId,
            UomUnit: item.UomUnit,
            DesignColor: item.DesignColor,
            IsSave: item.IsSave,
            IsDisabled: item.IsDisabled,
            Quantity: 0,       
            Details: [],
            index:0,
          });
        }

        const group = map.get(key);
        group.Quantity += item.Quantity;
        group.index += 1;
        group.Details.push({
          index:group.index,
          Id : item.Id,
          UId : item.UId,
          UnitDOItemId: item.UnitDOItemId,
          URNItemId: item.URNItemId,
          DODetailId: item.DODetailId,
          POItemId: item.POItemId,
          EPOItemId: item.EPOItemId,
          PRItemId: item.PRItemId,
          DOItemId : item.DOItemId,
          UENId: item.UENId,
          RONo: item.RONo,
          RONOItem: item.RONOItem,
          ProductId: item.ProductId,
          ProductCode: item.ProductCode,
          ProductName: item.ProductName,
          ProductRemark: item.ProductRemark,
          UomId: item.UomId,
          UomUnit: item.UomUnit,
          PricePerDealUnit: item.PricePerDealUnit,
          OldQuantity: item.OldQuantity,
          BuyerId: item.BuyerId,
          BuyerCode: item.BuyerCode,
          DesignColor: item.DesignColor,
          FabricType: item.FabricType,
          DOCurrencyRate: item.DOCurrencyRate,
          Conversion : item.Conversion,
          POSerialNumber: item.POSerialNumber,
          selectedDOItem: item.POSerialNumber,
          Quantity: item.Quantity,
          PricePerDealUnit: item.PricePerDealUnit,
          UomUnit: item.UomUnit,
          Colour: item.Colour,
          Rack: item.Rack,
          Level: item.Level,
          Box: item.Box,
          Area: item.Area,
          IsSave : item.Quantity > 0,
          IsDisabled: item.IsDisabled
        });
      });
      this.data.Items = Array.from(map.values());
    }
  }
  

  @computedFrom("data.Id")
  get isEdit() {
    return (this.data.Id || "").toString() != "";
  }

  @computedFrom("data.ExpenditureType")
  get filterUnitDeliveryOrder() {
    let username = null;
    if (this.authService.authenticated) {
      const me = this.authService.getTokenPayload();
      username = me.username;
    }
    var unitDeliveryOrderFilter = {
      IsUsed: false,
    };
    unitDeliveryOrderFilter[`UnitDOType== "${this.data.ExpenditureType}"`] = true;
    //unitDeliveryOrderFilter[`CreatedBy== "${username}"`] = true;
    return unitDeliveryOrderFilter;
  }

  expenditureTypeChanged(e) {
    var selectedCategory = e.srcElement.value;
    if (selectedCategory) {
      this.data.ExpenditureType = selectedCategory;
      this.options.expenditureType = this.data.ExpenditureType;
      this.options.ExpenditureType = this.data.ExpenditureType;
    }
    this.context.DONoViewModel._suggestions = [];
    this.context.DONoViewModel.editorValue = "";
    this.unitDeliveryOrder = null;
    this.data.UnitRequest = null;
    this.data.Items = [];
    this.data.UnitSender = null;
    this.data.Storage = null;
    this.isItem = false;
    this.data.StorageRequest = null;
    this.data.RoJob = null;
    this.error = null;
    this.context.error.Items = [];
    this.context.error = [];
  }

  get unitDeliveryOrderLoader() {
    return UnitDeliveryOrderLoader;
  }

  async unitDeliveryOrderChanged(newValue) {
    var selectedUnitDeliveryOrder = newValue;
    
    this.options.expenditureType = this.data.ExpenditureType;
    this.dataItems = [];
    this.data.Items = [];
    if (this.error && this.error.Items) {
      this.error.Items = [];
    }
    if (selectedUnitDeliveryOrder == null) {
      this.data.Items = [];
      this.error = null;
      this.data.UnitRequest = null;
      this.data.UnitSender = null;
      this.data.Storage = null;
      this.data.StorageRequest = null;
      this.isItem = false;
      this.data.UnitDOId = null;
      this.data.UnitDONo = "";

    } else if (selectedUnitDeliveryOrder) {
      this.data.UnitDOId = selectedUnitDeliveryOrder.Id;
      this.data.UnitDONo = selectedUnitDeliveryOrder.UnitDONo;
      this.data.UnitSender = selectedUnitDeliveryOrder.UnitSender;
      this.data.UnitDODate = selectedUnitDeliveryOrder.UnitDODate;
      this.data.UnitSender.toString = function () {
        return [this.Code, this.Name]
          .filter((item, index) => {
            return item && item.toString().trim().length > 0;
          })
          .join(" - ");
      };
      this.data.UnitRequest = selectedUnitDeliveryOrder.UnitRequest;
      this.data.UnitRequest.toString = function () {
        return [this.Code, this.Name]
          .filter((item, index) => {
            return item && item.toString().trim().length > 0;
          })
          .join(" - ");
      };
      this.data.Storage = selectedUnitDeliveryOrder.Storage;
      this.data.Storage.toString = function () {
        return [this.code, this.name]
          .filter((item, index) => {
            return item && item.toString().trim().length > 0;
          })
          .join(" - ");
      };
      this.data.StorageRequest = selectedUnitDeliveryOrder.StorageRequest;
      this.data.StorageRequest.toString = function () {
        return [this.code, this.name]
          .filter((item, index) => {
            return item && item.toString().trim().length > 0;
          })
          .join(" - ");
      };
      this.dataUnitDO = await this.service.getUnitDOId(this.data.UnitDOId);
      this.data.RoJob = this.dataUnitDO.RONo;

      this.data.Items = [];
      for (var item of selectedUnitDeliveryOrder.Items) {
        var Items = {};
        if (item.Quantity > 0) {
          Items.UnitDOItemId = item.Id;
          Items.URNItemId = item.URNItemId;
          Items.DODetailId = item.DODetailId;
          Items.POItemId = item.POItemId;
          Items.EPOItemId = item.EPOItemId;
          Items.PRItemId = item.PRItemId;
          Items.DOItemId = item.DOItemId;
          Items.RONo = item.RONo;
          Items.POSerialNumber = item.POSerialNumber;
          Items.ProductId = item.ProductId;
          Items.ProductCode = item.ProductCode;
          Items.ProductName = item.ProductName;
          Items.ProductRemark = item.ProductRemark;
          Items.RONOItem = item.RONo;
          Items.UomId = item.UomId;
          Items.UomUnit = item.UomUnit;
          Items.PricePerDealUnit = item.PricePerDealUnit;
          Items.Quantity = item.Quantity;
          Items.OldQuantity = item.Quantity;
          Items.BuyerId = item.Buyer.Id || 0;
          Items.BuyerCode = item.Buyer.Code || null;
          Items.DesignColor = item.DesignColor;
          Items.FabricType = item.FabricType;
          Items.IsSave = Items.Quantity > 0;
          Items.IsDisabled = !(Items.Quantity > 0);
          Items.Conversion = item.Conversion;
          Items.DOCurrencyRate = item.DOCurrencyRate;
          Items.Rack = item.Rack;
          Items.Level = item.Level;
          Items.Box = item.Box;
          Items.Colour = item.Colour;
          Items.Area = item.Area;
          this.data.Items.push(Items);
        }
      }
      this.isItem = true;
    } else {
      this.data = null;
      this.data.RoJob = null;
      this.selectedUnitDeliveryOrder = null;
      this.data.UnitRequest = null;
      this.data.UnitSender = null;
      this.data.Storage = null;
      this.data.StorageRequest = null;
      this.data.Items = null;
    }
    this.context.error.Items = [];
    this.context.error = [];
  }

  items = {
    columns: [
      "Kode Buyer",
      "Kode Barang",
      "Nama Barang",
      "Keterangan Barang",
      "Design / Color",
      "Jumlah Keluar",
      "Satuan",
      "",
    ],
  };
}
