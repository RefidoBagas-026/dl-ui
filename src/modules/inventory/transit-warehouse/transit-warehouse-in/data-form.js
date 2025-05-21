import { bindable, inject, computedFrom } from "aurelia-framework";
import { Service} from "./service";
import moment from 'moment';

const SupplierLoader = require('../../../../loader/garment-supplier-loader');
const UomLoader = require("../../../../loader/uom-loader");

@inject(Service)
export class DataForm {
    @bindable readOnly = false;
    @bindable isCreate = false;
    @bindable isView = false;
    @bindable isEdit = false;
    @bindable title;
    @bindable data = {};
    @bindable selectedSupplier;

    constructor(service) {
        this.service = service;
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

    get UomLoader() {
        return UomLoader;
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;

        if (this.data.Supplier) {
            this.selectedSupplier = this.data.Supplier;
        }
        if(!this.data.BCDate || !moment(this.data.BCDate).isAfter('1900-01-01') ) {
            this.data.BCDate = null;
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

    selectedSupplierChanged(newValue){
        if(newValue){
            this.data.Supplier=newValue;
        }
        else{
            this.data.Supplier=null;
        }
    }
}