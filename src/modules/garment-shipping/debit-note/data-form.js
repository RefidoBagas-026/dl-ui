import { inject, bindable, containerless, computedFrom, BindingEngine } from 'aurelia-framework'
import { Service } from "./service";

const BuyerLoader = require('../../../loader/garment-buyers-loader');
const AccountBankLoader = require('../../../loader/account-banks-loader');
const SupplierLoader = require("../../../loader/garment-supplier-loader");
@inject(Service)
export class DataForm {

    @bindable readOnly = false;
    @bindable isEdit = false;
    @bindable title;
    @bindable isView = false;
    @bindable selectedLoader = "buyer";
    selectedLoaderChanged(newValue, oldValue) {
        console.log(this.readOnly);
        if (!this.readOnly && !this.isEdit) {
            if (newValue === "buyer") {
                this.data.supplier = null;
                this.data.buyer = null;
            } else if (newValue === "supplier") {
                this.data.buyer = null;
                this.data.supplier = null;
            }
        }
        this.data.selectedLoader = newValue;
    }
    loaderSelections = [
        { value: "buyer", label: "Buyer" },
        { value: "supplier", label: "Supplier" }
    ];

    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 5
        }
    };

    items = {
        columns: [
            "Description",
            "Jenis Item Debit Note",
            // "Currency",
            "Amount"
        ],
        onAdd: function () {
            this.data.items.push({});
        }.bind(this),
        options: {
        }
    };

    get buyerLoader() {
        return BuyerLoader;
    }

    get bankLoader() {
        return AccountBankLoader;
    }
    get supplierLoader() {
        return SupplierLoader;
    }
    buyerView = (data) => {
        return `${data.Code || data.code} - ${data.Name || data.name}`;
    }

    bankView = (data) => {
        return `${data.BankName || data.bankName} - ${data.Currency ? data.Currency.Code : data.currency.code } - ${data.AccountNumber || data.accountNumber}`;
    }

    supplierView = (data) => {
        return `${data.Code || data.code} - ${data.Name || data.name}`;
    }

    get bankQuery(){
        var result = { "DivisionName" : "G" }
        return result;
    }

    bind(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;

        if(this.data.loaderType === "supplier"){
            this.data.supplier = this.data.buyer;
        }
        this.selectedLoader = this.data.loaderType ? this.data.loaderType : "buyer";

        
        console.log(this.data);
    }

    get totalAmount() {
        this.data.totalAmount = (this.data.items || []).reduce((acc, cum) => acc + cum.amount, 0);

        return this.data.totalAmount;
    }
    @bindable bankCharge
    get nettNego(){

        this.data.totalAmount = (this.data.items || []).reduce((acc, cum) => acc + cum.amount, 0);
        this.data.nettNego = this.data.totalAmount - this.data.bankCharge ;
        return this.data.nettNego;
    }
}
