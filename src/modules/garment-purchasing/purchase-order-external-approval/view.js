import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Dialog } from "../../../au-components/dialog/dialog";
import { AuthService } from "aurelia-authentication";
import { RejectReason } from "./dialog-template/reject-reason";
import moment from 'moment';
import numeral from 'numeral';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

var IncomeTaxLoader = require('../../../loader/income-tax-loader');
var VatTaxLoader = require('../../../loader/vat-tax-loader');
var accountSignatureLoader = require('../../../loader/garment-account-signature-loader');

numeral.defaultFormat("0,0.00");

@inject(Router, Service, Dialog, AuthService)
export class View {
    readOnly = true;
    
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
    
    length4 = {
        label: {
            align: "left",
            length: 4
        }
    };
    length6 = {
        label: {
            align: "left",
            length: 6
        }
    };
    length7 = {
        label: {
            align: "left",
            length: 7
        }
    };

    formOptions = {
        cancelText: "Kembali",
        editText: "Approve",
        deleteText: "Reject"
    };

    itemsInfo = {
        columns: ["Tanggal", "Keterangan", "Jumlah", "Kena PPN", "PPh", "Total"],
        options: {}
    }

    termPaymentImportOptions = ['T/T PAYMENT', 'CMT', 'FREE FROM BUYER', 'SAMPLE'];
    termPaymentLocalOptions = ['DAN LIRIS', 'CMT', 'FREE FROM BUYER', 'SAMPLE'];
    typePaymentOptions = ['T/T AFTER', 'FREE', 'CASH', 'T/T BEFORE'];
    typePaymentStorageOptions = ['CMT', 'FREE FROM BUYER', 'SAMPLE'];
    categoryOptions = ['FABRIC', 'ACCESSORIES'];
    qualityStandardTypeOptions = ['JIS', 'AATCC', 'ISO', 'AS'];
    freightCostByOptions = ['Penjual', 'Pembeli'];

    constructor(router, service, dialog, authService) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;
        this.authService = authService;
    }

    async activate(params, routeConfig, navigationInstruction) {
        const instruction = navigationInstruction.getAllInstructions()[0];
        const parentInstruction = instruction.parentInstruction;
        this.title = parentInstruction.config.title;
        const type = parentInstruction.config.settings.type;

        switch (type) {
            case "other":
                this.type = "Other";
                break;
            case "manager":
                this.type = "Manager";
                break;
            case "gm":
                this.type = "GeneralManager";
                break;
            default: break;
        }

        if (this.authService.authenticated) {
            this.me = this.authService.getTokenPayload();
        }
        else {
            this.me = null;
        }

        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
        this.error = {};

        if (this.data.Currency) {
            this.selectedCurrency = this.data.Currency;
        }

        if (this.data.Supplier) {
            this.selectedSupplier = this.data.Supplier;
            this.data.SupplierId = this.data.Supplier.Id;
            this.data.Supplier.usevat = this.data.IsUseVat;
            
            if (this.data.IsIncomeTax) {
                this.data.Supplier.usetax = true;
            }
        }

        if (this.data.IncomeTax) {
            this.selectedIncomeTax = this.data.IncomeTax;
            this.data.IncomeTaxRate = this.data.IncomeTax.Rate;
        }

        if (this.data.Vat) {
            this.selectedVatTax = this.data.Vat;
        }

        if (!this.itemsInfo.options) {
            this.itemsInfo.options = {};
        }
        this.itemsInfo.options.readOnly = this.readOnly;
        this.itemsInfo.options.isEdit = true;
        this.itemsInfo.options.checkOverBudget = true;
        
        if (this.data.Currency) {
            this.itemsInfo.options.CurrencyCode = this.data.Currency.Code;
        }

        if (this.data.DispositionDate) {
            this.data.DispositionDateFormatted = moment(this.data.DispositionDate).format("DD MMMM YYYY");
        }

        this.editCallback = this.approve;
        this.deleteCallback = this.reject;
    }

    async bind(context) {
        this.context = context;
    }

   get supplierType() {
    if (!this.data || !this.data.Supplier) {
        return "";
    }
    return this.data.Supplier.Import ? "Import" : "Lokal";
    }

    get supplierIsImport() {
        if (this.data.Supplier) {
            if (this.data.Supplier.Import)
                return true
            else
                return false
        }
        else
            return false
    }

    get supplierIsStorage() {
        if (this.data.Supplier) {
            if (this.data.Supplier.Name.toLowerCase() === "gudang")
                return true
            else
                return false
        }
        else
            return false
    }

    get hasOverBudgetItems() {
        if (this.data && this.data.Items && this.data.Items.length > 0) {
            return this.data.Items.some(item => item.IsOverBudget === true);
        }
        return false;
    }

    get isFabric() {
        if (this.data && this.data.Category) {
            return this.data.Category === "FABRIC";
        }
        return false;
    }

    supplierView = (supplier) => {
        var code = supplier.code ? supplier.code : supplier.Code;
        var name = supplier.name ? supplier.name : supplier.Name;
        return `${code} - ${name}`
    }

    currencyView = (currency) => {
        var code = currency.code ? currency.code : currency.Code;
        return code;
    }

    incomeTaxView = (incomeTax) => {
        var rate = incomeTax.rate ? incomeTax.rate : incomeTax.Rate;
        var name = incomeTax.name ? incomeTax.name : incomeTax.Name;
        return `${name} - ${rate}`
    }

    vatTaxView = (vatTax) => {
        var rate = vatTax.rate ? vatTax.rate : vatTax.Rate;
        return `${rate}`
    }

    ApprovedManagerView = (unit) => {
        return `${unit.UserName}`;
    }

    // ApprovedGeneralManagerView = (unit) => {
    //     return `${unit.UserName}`;
    // }

    get incomeTaxLoader() {
        return IncomeTaxLoader;
    }

    get vatTaxLoader() {
        return VatTaxLoader;
    }

    get accountSignatureLoader1() {
        return (keyword) => accountSignatureLoader(keyword);
    }

    // get accountSignatureLoader2() {
    //     return (keyword) => accountSignatureLoader(keyword);
    // }

    list() {
        this.router.navigateToRoute("list");
    }

    cancelCallback(event) {
        this.list();
    }

    approve(event) {
        if (confirm("Approve PO Eksternal?")) {
            const jsonPatch = [
                { op: "replace", path: `/IsApproved${this.type}`, value: true },
                { op: "replace", path: `/Approved${this.type}By`, value: this.me.username },
                { op: "replace", path: `/Approved${this.type}Date`, value: new Date() }
            ];

            this.service.replace(this.data.Id, jsonPatch)
                .then(result => {
                    this.list();
                })
                .catch(e => {
                    this.error = e;
                    if (e.statusCode === 500) {
                        alert("Gagal menyimpan, silakan coba lagi!");
                    }
                });
        }
    }

    reject(event) {
       this.dialog.show(RejectReason, {message: "Silakan masukkan alasan reject:" })
        .then(response => {
        if (!response.wasCancelled) {
            const reason = response.output;
            if (!reason || String(reason).trim() === "") {
            alert('Alasan tidak boleh kosong.');
            return;
            }
            this.service
            .Rejected(this.data.Id, String(reason).trim())
            .then((result) => {
                this.list();
            })
            .catch((e) => {
                this.error = e;
            });
        }
        });
    }
}