import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
//import { Service } from "./service";
import { Service as PurchasingService} from "./service";
import { Service as CoreService } from "./core-service";
import { Dialog } from "../../../au-components/dialog/dialog";
import { AuthService } from "aurelia-authentication";
import moment from 'moment';
import numeral from 'numeral';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

numeral.defaultFormat("0,0.00");

@inject(Router, PurchasingService, Dialog, AuthService, CoreService)
export class View {
    readOnly = true;
    hasPriceDifference = false;
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
        //deleteText: "Reject"
    };

    constructor(router, purchasingService, dialog, authService, coreService) {
        this.router = router;
        this.purchasingService = purchasingService;
        this.dialog = dialog;
        this.authService = authService;
        this.coreService = coreService;
    }

    async activate(params, routeConfig, navigationInstruction) {
        this._activateArgs = { params, routeConfig, navigationInstruction };
        const instruction = navigationInstruction.getAllInstructions()[0];
        const parentInstruction = instruction.parentInstruction;
        this.title = parentInstruction.config.title;
        const type = parentInstruction.config.settings.type;

        switch (type) {
            case "unit1":
                this.type = "Unit1";
                break;
            case "unit2":
                this.type = "Unit2";
                break;
            case "purchasing":
                this.type = "Purchasing";
                break;
            case "manager":
                this.type = "Manager";
                break;
            case "gm":
                this.type = "GeneralManager";
                break;
            case "anggaran":
                this.type = "Anggaran";
                break;
            default: break;
        }

        if (this.type === "Unit1" || this.type === "Unit2") {
            // UNTUK UNIT1, UNIT2
            this.itemsInfo = {
                columns: [
                    { header: "Barang", value: "productName" },
                    { header: "Jumlah", value: "quantity" },
                    { header: "Satuan", value: "uomUnit" },
                    { header: "Keterangan", value: "remark" }
                ]
            };
        } else {
            // UNTUK PURCHASING, MANAGER, GENERAL MANAGER, ANGGARAN
            const columns = [
                { header: "Barang", value: "productName" },
                { header: "Jumlah", value: "quantity" },
                { header: "Satuan", value: "uomUnit" },
                { header: "Mata Uang", value: "currency" },
                { header: "Harga Satuan", value: "pricePerDealUnit" },
                { header: "Total Harga", value: "totalPrice" },
                { header: "Keterangan", value: "remark" }
            ];
            if (this.type === "Anggaran") {
                columns.splice(5, 0, { header: "Harga Master", value: "masterPrice" });
            }
            this.itemsInfo = { columns };
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
        this.data = await this.purchasingService.getById(id);
        this.rawData = JSON.parse(JSON.stringify(this.data));

        // Build master price map from core product API (Anggaran only)
        let productMap = {};
        if (this.type === "Anggaran") {
            try {
                const productIds = (this.data.items || []).map(item => parseInt(item.product._id));
                const productResult = await this.coreService.getProductsByIds(productIds);
                const products = (productResult && productResult.data) || [];
                for (let p of products) {
                    productMap[p.Id] = p.Price;
                }
            } catch (e) {
                // leave productMap empty on error
            }
        }

        this.hasPriceDifference = false;

        if (this.data.items) {
            let no = 0;
            for (let item of this.data.items) {
                item.No = ++no;
                item._rawPricePerDealUnit = item.pricePerDealUnit;
                item._rawQuantity = item.quantity;
                const rawMasterPrice = productMap[parseInt(item.product._id)] || 0;
                item._rawMasterPrice = rawMasterPrice;

                if (this.type === "Anggaran" && rawMasterPrice > 0 && item.pricePerDealUnit !== rawMasterPrice) {
                    this.hasPriceDifference = true;
                }

                item.pricePerDealUnit = numeral(item.pricePerDealUnit).format();
                item.quantity = numeral(item.quantity).format();
                item.totalPrice = numeral(item.totalPrice).format();
            }
        }

        for (let item of this.data.items) {
            item.productName = item.product.name;
            item.uomUnit = item.product.uom.unit;
            item.currency = item.currency.code;
            if (this.type === "Anggaran") {
                item.masterPrice = numeral(productMap[parseInt(item.product._id)] || 0).format();
            }
        }

        if (this.data.date) {
            this.data.date = moment(this.data.date).format("DD MMMM YYYY");
        }
        if (this.data.expectedDeliveryDate) {
            this.data.expectedDeliveryDate = moment(this.data.expectedDeliveryDate).format("DD MMMM YYYY");
        }

        this.data.unit = [this.data.unit.division && this.data.unit.division.name, this.data.unit.name]
            .filter(v => v && v.toString().trim().length > 0)
            .join(" - ");
        this.data.budget = [this.data.budget.code, this.data.budget.name]
            .filter(v => v && v.toString().trim().length > 0)
            .join(" - ");
        this.data.category = [this.data.category.code, this.data.category.name]
            .filter(v => v && v.toString().trim().length > 0)
            .join(" - ");

        if (!this.hasPriceDifference) {
            this.editCallback = this.approve;
        }
        //this.deleteCallback = this.reject;
    }

    async bind(context) {
        this.context = context;
    }

    list() {
        this.router.navigateToRoute("list");
    }

    cancelCallback(event) {
        this.list();
    }

    unitChanged(e) {
        if (this.data.unit)
        {
            this.data.unitId = this.data.unit.Id || this.data.unit._id || {};
            this.data.unit._id = this.data.unitId;

            if(this.data.unit.Division)
                this.data.unit.Division._id = this.data.unit.Division.Id || "";
        }
    }

    budgetChanged(e) {
        if (this.data.budget)
            this.data.budgetId = this.data.budget._id ? this.data.budget._id : {};
    }

    categoryChanged(e) {
        if (this.data.category)
            this.data.categoryId = this.data.category._id ? this.data.category._id : {};
    }

    approve(event) {
        if (confirm("Approve Purchase Request?")) {
            let jsonPatch;

            if (this.type === "Purchasing") {
                jsonPatch = [
                    { op: "replace", path: `/IsUpdatePricePurchasing`, value: true },
                    { op: "replace", path: `/UpdatePricePurchasingBy`, value: this.me.username },
                    { op: "replace", path: `/UpdatePricePurchasingDate`, value: new Date() }
                ];
            } else {
                jsonPatch = [
                    { op: "replace", path: `/IsApproved${this.type}`, value: true },
                    { op: "replace", path: `/Approved${this.type}By`, value: this.me.username },
                    { op: "replace", path: `/Approved${this.type}Date`, value: new Date() }
                ];
            }

            this.purchasingService.replace(this.data.Id, jsonPatch)
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

    async attached() {
    }

    updateHarga() {
        if (confirm("Update harga satuan sesuai harga master?")) {
            (this.data.items || []).forEach((item, index) => {
                if (item._rawMasterPrice > 0 && item._rawPricePerDealUnit !== item._rawMasterPrice) {
                    this.rawData.items[index].pricePerDealUnit = item._rawMasterPrice;
                    this.rawData.items[index].totalPrice = item._rawMasterPrice * item._rawQuantity;
                }
            });

            this.purchasingService.update(this.rawData.Id, this.rawData)
                .then(() => {
                    const { params, routeConfig, navigationInstruction } = this._activateArgs;
                    this.activate(params, routeConfig, navigationInstruction);
                    this.categoryChanged();
                    this.unitChanged();
                    this.budgetChanged();

                })
                .catch(e => {
                    this.error = e;
                    if (e.statusCode === 500) {
                        alert("Gagal update harga, silakan coba lagi!");
                    }
                });
        }
    }

    
}