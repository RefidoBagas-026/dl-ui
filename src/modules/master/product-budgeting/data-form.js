import { inject, bindable, computedFrom } from 'aurelia-framework';
import { PermissionHelper } from '../../../utils/permission-helper';

var CurrencyLoader = require('../../../loader/currency-loader');
var UomLoader = require('../../../loader/uom-loader');

@inject(PermissionHelper)
export class DataForm {
    @bindable title;
    @bindable readOnly;
    @bindable Currency;
    @bindable UOM;
    @bindable Price;
    @bindable ManufactureType;
    
    @bindable Code;
    @bindable Name;
    @bindable OriginType;
    @bindable OriginTypeLists = ['IMPORT', 'LOCAL'];
    @bindable ManufactureTypeLists = ['FOB', 'CMT'];
    
    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        deleteText: "Hapus",
        editText: "Ubah",
    }

    constructor(permissionHelper) {
        this.permissions = permissionHelper.getUserPermissions();
        console.log(this.permissions);
        this.isPermitted = this.isPermittedRole();
    }

    isPermittedRole() {
        // this.roles = [VERIFICATION, CASHIER, ACCOUNTING];
        let roleRules = ["C9", "B1"];

        for (var key in this.permissions) {
            let hasPermittedRole = roleRules.find((roleRule) => roleRule == key)
            if (hasPermittedRole)
                return true;
        }

        return false;
    }

    @computedFrom("data.Id")
    get isEdit() {
        return (this.data.Id || '').toString() != '';
    }

    get isActive(){
        return this.data.IsPosted == true;
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        if (this.data.Id) {
            this.Currency = this.data.Currency;
            this.UOM = this.data.UOM;
            this.Price = this.data.Price;
            this.originPrice = this.data.Price;
            this.Code = this.data.Code;
            this.Name = this.data.Name;
            this.ManufactureType = this.data.ManufactureType;
            this.OriginType = this.data.OriginType;
            //this.isActive = this.data.IsPosted;
        }

       

        this.error = this.context.error;

        this.cancelCallback = this.context.cancelCallback;
        this.deleteCallback = this.context.deleteCallback;
        this.editCallback = this.context.editCallback;
        this.saveCallback = this.context.saveCallback;
    }

    ManufactureTypeChanged(newValue) {
        if (this.readOnly || this.isEdit) {
            return;
        }

        if (newValue) {
            this.data.ManufactureType = newValue;
            this.generateCode();
        }
    }

    NameChanged(newValue) {
        if (this.readOnly || this.isEdit) {
            return;
        }

        const formattedName = newValue
            ? newValue.toUpperCase()
            : null;

        if (formattedName && formattedName !== newValue) {
            this.Name = formattedName;w
        }

        this.data.Name = formattedName;
        this.generateCode();
    }

    generateNameCode() {
        return this.data.Name
            ? this.data.Name
                .trim()
                .split(/\s+/)
                .filter(word => /^[A-Za-z0-9]/.test(word))
                .map(word => word.charAt(0).toUpperCase())
                .join("")
                .substring(0, 4)
            : "";
    }

    generateCode() {
        const nameCode = this.generateNameCode();
        if(this.ManufactureType == "FOB"){
            if (this.OriginType == "IMPORT") {
                this.Code = `FUI-${nameCode}`;
                this.data.Code = this.Code;
            } else if (this.OriginType == "LOCAL") {
                this.Code = `FUL-${nameCode}`;
                this.data.Code = this.Code;
            }
            // this.Code = `FL-${nameCode}`;
        }else if(this.ManufactureType == "CMT"){
            if (this.OriginType == "IMPORT") {
                this.Code = `CUI-${nameCode}`;
                this.data.Code = this.Code;
            } else if (this.OriginType == "LOCAL") {
                this.Code = `CUL-${nameCode}`;
                this.data.Code = this.Code;
            }
        }
    }
    UOMChanged() {
        if (this.UOM) {
            this.data.UOM = this.UOM
        } else {
            this.UOM = {};
        }
    }

    CurrencyChanged() {
        if (this.Currency) {
            this.data.Currency = this.Currency;
        } else {
            this.Currency = {};
        }
    }

    PriceChanged() {
        console.log(this.originPrice);
        if (this.Price) {
            this.data.Price = this.Price;
            this.data.originPrice = this.originPrice;
        } else {
            this.Currency = {};
        }
    }

    OriginTypeChanged(newValue) {
        if (this.readOnly || this.isEdit) {
            return;
        }
        if (newValue) {
            this.data.OriginType = newValue;
        }
        this.generateCode();
    }

    get currencyLoader() {
        return CurrencyLoader;
    }

    get uomLoader() {
        return UomLoader;
    }

    columns = [
        { header: "Kategori - Divisi", value: "CategoryDivision" }
    ];

    get addItems() {
        return (event) => {
            this.data.MappingCategories.push({})
        };
    }
}
