import {
  inject,
  bindable,
  containerless,
  computedFrom,
  BindingEngine,
} from "aurelia-framework";
import { Service } from "./service";
import { AuthService } from "aurelia-authentication";
var UnitLoader = require('../../../loader/unit-loader');
import moment from "moment";

@containerless()
@inject(Service, BindingEngine, AuthService)
export class DataForm {
  @bindable readOnly = false;
  @bindable data = {};
  @bindable error = {};
  @bindable title;
  @bindable options = {};
  @bindable unitDeliveryOrder;
  @bindable unit;

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
    

    this.isEdit = this.data.Id ? true : false;

    if (!this.data.Items) {
      this.data.Items = [];
    }

    if (this.data.Items)
    if (this.data.Items && this.data.Items.length > 0) {
      this.isItem = true;
    }

    this.options.readOnly = this.readOnly;
      
      this.options.add = this.addItems;


    this.options.remove = (item) => {
      if (!this.data.Items) return;
      var index = this.data.Items.indexOf(item);
      if (index > -1) this.data.Items.splice(index, 1);
    };

    this.readOnlySender = true;
    this.auInputOptions = this.controlOptions;
    // this.expenditureDateSubscription = this.bindingEngine
    //   .propertyObserver(this.data, 'ExpenditureDate')
    //   .subscribe(() => {
    //     this.expenditureDateChanged();
    //   });

   
    if (this.data.unit) {
      this.unit = this.data.unit;
      if (this.data.unit.division) {
        this.options.divisionId = this.data.unit.division._id || this.data.unit.division.Id;
      }
      this.options.unitId = this.data.unit._id || this.data.unit.Id || this.data.unitId;
    }
   
  
  }


  unitChanged(newValue, oldValue) {
        var _selectedUnit = newValue;

        if (_selectedUnit) {
            this.data.unit = _selectedUnit;
            
            this.data.unit._id = _selectedUnit.Id || _selectedUnit._id;
            this.data.unit.name = _selectedUnit.Name || _selectedUnit.name;
            this.data.unit.code = _selectedUnit.Code || _selectedUnit.code;
            this.data.unitId = _selectedUnit.Id || _selectedUnit._id || "";
            
            var division = _selectedUnit.Division || _selectedUnit.division;
            if (division) {
                this.data.unit.division = division;
                this.data.unit.division._id = division.Id || division._id;
                this.data.unit.division.name = division.Name || division.name;
                this.data.unit.division.code = division.Code || division.code;
                this.options.divisionId = division.Id || division._id;
            } else {
                this.options.divisionId = null;
            }
            this.options.unitId = _selectedUnit.Id || _selectedUnit._id;
            this.isItem = true;
        }
        else {
            this.data.unitId = null;
            this.options.divisionId = null;
            this.options.unitId = null;

            this.isItem = false;
        }

        if (this.deliveryOrderAU) {
            this.deliveryOrderAU.editorValue = "";
        }
        // this.data.deliveryOrderId = undefined;
        // this.data.storageId=undefined;
        // this.storage=null;
        // this.data.isInventory=false;
    }
  

  get unitLoader() {
          return UnitLoader;
      }

  get items() {
    if (this.isItem) {
      return {
        columns: [
          "No PR",
          "Barang",
          "Stock",
          "Jumlah Keluar",
          "Satuan",
          "Keterangan",
        ],
      };
    }

    return { columns: [] };
  }

  get addItems() {
    return (event) => {
      if (!this.data.Items) this.data.Items = [];
      this.data.Items.push({});
    };
  }

  canEditOrDelete() {
    const d = this.data || {};
    const items = Array.isArray(d.Items) ? d.Items : [];

    if (items.length === 0) return false;

    return items.every(i => i && (i.IsStorage === true || i.isStorage === true));
}


 unitView = (unit) => {
        if (!unit) return "";
        if (unit.division) {
            return `${unit.division.name} - ${unit.name}`;
        } else if (unit.Division) {
            return `${unit.Division.Name} - ${unit.Name}`;
        }
        return unit.name || unit.Name || "";
    }


  unbind() 
  {
    if (this.expenditureDateSubscription) {
      this.expenditureDateSubscription.dispose();
    }
  }
  }

