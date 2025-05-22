import { bindable, inject, computedFrom } from "aurelia-framework";
import { Service} from "./service";
import moment from 'moment';

const DONoLoader = require('../../../../loader/transit-warehouse-in-loader');
const UomLoader = require("../../../../loader/uom-loader");
const SupplierLoader = require('../../../../loader/garment-supplier-loader');

@inject(Service)
export class DataForm {
    @bindable readOnly = false;
    @bindable isCreate = false;
    @bindable isView = false;
    @bindable isEdit = false;
    @bindable title;
    @bindable data = {};
    @bindable selectedDONo;

    doNoQuery = {
        "BCNo==null":false,
        "IsDeleted": false,
    }

    constructor(service) {
        this.service = service;
    }
    get UomLoader() {
        return UomLoader;
    }
    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        deleteText: "Hapus",
        editText: "Ubah"
    };
    typeCustoms = ["","BC 23", "BC 27", "BC 40"];
    controlOptions = {
        label: {
            length: 2
        },
        control: {
            length: 5
        }
    };

    get doNoLoader() {
        return DONoLoader;
    }

    async bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;

        if (this.data.Supplier) {
            this.selectedSupplier = this.data.Supplier;
        }
        if(!this.data.BCDate || !moment(this.data.BCDate).isAfter('1900-01-01') ) {
            this.data.BCDate = null;
        }
        if(this.data.DONo){
            var doNo = await this.service.getINById(this.data.INId);
            this.selectedDONo = doNo;
        }
    }

    selectedDONoChanged(newValue){
        if(newValue){
            this.data.DONo=newValue.DONo;
            this.data.INId=newValue.Id;
            this.data.Supplier=newValue.Supplier;
            this.data.Uom=newValue.Uom;
            this.data.Quantity=newValue.Quantity;
            this.data.RemainingQty=newValue.RemainingQuantity;
            this.data.DODate=newValue.DODate;
        }
        else{
            this.data.DONo=null;
            this.data.INId=0;
            this.data.Supplier=null;
            this.data.Uom=null;
            this.data.Quantity=0;
            this.data.RemainingQty=0;
            this.data.DODate=null;
        }
    }

    supplierView = (unit) => {
        var unitName = unit.Name || unit.name;
        var unitCode = unit.Code || unit.code;
        return `${unitCode} - ${unitName}`;
    }

    get supplierLoader() {
        return SupplierLoader;
    }

    get remainingQty() {
        if (this.data.INId && this.data.Quantity && this.data.RemainingQty) {
            return this.data.RemainingQty - this.data.Quantity;
        }
        return 0;
    }
}