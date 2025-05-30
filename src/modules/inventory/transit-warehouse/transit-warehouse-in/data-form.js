import { bindable, inject, computedFrom } from "aurelia-framework";
import { Service} from "./service";
import moment from 'moment';

const SupplierLoader = require('../../../../loader/garment-supplier-loader');

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

    ItemsColumns = [
        { header: "Barang", value: "ProductName" },
        { header: "Jumlah", value: "Quantity" },
        { header: "Satuan", value: "UomUnit" },
        { header: "Keterangan", value: "Remark" }
    ]

    get addItems() {
        return (event) => {
            this.data.items.push({})
        };
    }

    get DONo(){
        return (this.data.DONo || "").toUpperCase();
    }
    set DONo(value){
        this.data.DONo=value.toUpperCase();
    }
    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
        this.Options = {
            isCreate: this.context.isCreate,
            isView: this.context.isView,
            isEdit: this.context.isEdit,
        }
        if (this.data.Supplier) {
            this.selectedSupplier = this.data.Supplier;
        }
    }

    supplierView = (supp) => {
        var suppName = supp.Name || supp.name;
        var suppCode = supp.Code || supp.code;
        return `${suppCode} - ${suppName}`;
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

    get removeItems() {
        return (event) => {
            this.error = null;
        };
    }
}