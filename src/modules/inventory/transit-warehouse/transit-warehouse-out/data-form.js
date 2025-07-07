import { bindable, inject, computedFrom } from "aurelia-framework";
import { Service } from "./service";
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

    constructor(service) {
        this.service = service;
    }
    get UomLoader() {
        return UomLoader;
    }

    ItemsColumns = ["Barang", "Qty Sisa", "Qty Keluar",
        "Satuan", "Keterangan"];

    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        deleteText: "Hapus",
        editText: "Ubah"
    };

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
        this.Options = {
            isCreate: this.context.isCreate,
            isView: this.context.isView,
            isEdit: this.context.isEdit,
            readOnly: this.readOnly
        }
        if (this.data.Supplier) {
            this.selectedSupplier = this.data.Supplier;
        }
        if (this.data.DONo) {
            var doNo = await this.service.getINById(this.data.INId);
            this.selectedDONo = doNo;
            this.data.DONo=doNo.DONo;
            this.data.INId=doNo.Id;
            this.data.Supplier=doNo.Supplier;
            this.data.DODate=doNo.DODate;
            for(var item of this.data.Items){
                var doItem = doNo.Items.find(x => x.Id === item.INItemId);
                if(doItem){
                        item.RemainingQty= doItem.RemainingQuantity;
                        item.INItemId= doItem.Id;
                        item.IsSave= true;
                        //this.data.Items.push(item);
                }
            }
        }
    }

    async selectedDONoChanged(newValue) {
        if (this.context.isCreate) {
            if (newValue) {
                this.data.Items.splice(0);
                this.data.DONo = newValue.DONo;
                this.data.INId = newValue.Id;
                this.data.Supplier = newValue.Supplier;
                this.data.DODate = newValue.DODate;

                var doNo= await this.service.getINById(this.data.INId);
                
                for(var item of doNo.Items){
                    if(item.RemainingQuantity != 0){
                        this.data.Items.push({
                            ProductName: item.ProductName,
                            RemainingQty: item.RemainingQuantity,
                            Uom: item.Uom,
                            Remark: item.Remark,
                            INItemId: item.Id,
                        });
                    }
                }

            }
            else {
                this.data.DONo = null;
                this.data.INId = 0;
                this.data.Supplier = null;
                this.data.DODate = null;
                this.data.Items.splice(0);
            }
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

    get addItems() {
        return (event) => {
            this.data.Items.push({})
        };
    }

    get removeItems() {
        return (event) => {
            this.error = null;
        };
    }

    get PickUpName() {
        return (this.data.PickUpName || "").toUpperCase();
    }
    set PickUpName(value) {
        this.data.PickUpName = value.toUpperCase();
    }

    get Section() {
        return (this.data.Section || "").toUpperCase();
    }
    set Section(value) {
        this.data.Section = value.toUpperCase();
    }
}