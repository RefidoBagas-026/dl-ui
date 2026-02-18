import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Dialog } from "../../../au-components/dialog/dialog";
import { AuthService } from "aurelia-authentication";
import { RejectReason } from "./dialog-template/reject-reason";
import moment from 'moment';
import numeral from 'numeral';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

numeral.defaultFormat("0,0.00");

@inject(Router, Service, Dialog, AuthService)
export class View {
    readOnly = true;
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
        columns: [
            {header: "Supplier", value: "supplierName"},
            { header: "Nama Barang", value: "productName" },
            { header: "Brand", value: "brandName" },
            { header: "Description", value: "description" },
            { header: "Currency", value: "currency" },
            { header: "Jumlah", value: "quantity" },
            { header: "Satuan", value: "uomUnit" },
            { header: "Harga Satuan", value: "productPrice" },
            { header: "Total Harga", value: "totalPrice" }
        ]
    }

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
            case "level1":
                this.type = "Level1";
                break;
            // case "level2":
            //     this.type = "Level2";
            //     break;
            // case "directurkeu":
            //     this.type = "Directur";
            //     break;
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

        if (this.data.items) {
            let no = 0;
            for (let item of this.data.items) {
                item.no = ++no;
                item.productPrice = numeral(item.product.price).format();
                item.quantity = numeral(item.quantity).format();
                item.totalPrice = numeral(item.totalPrice).format();
                item.productName = `${item.product.code} - ${item.product.name}`;
                item.uomUnit = item.product.uom.unit;
                item.currency = item.currency.code;

            }
        }

    
        if (this.data.dispositionDate) {
            this.data.dispositionDateFormatted = moment(this.data.dispositionDate).format("DD MMMM YYYY");
        }

        this.editCallback = this.approve;
        this.deleteCallback = this.reject;
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

    approve(event) {
        if (confirm("Approve Disposition?")) {
            const jsonPatch = [
                { op: "replace", path: `/IsApproved${this.type}`, value: true },
                { op: "replace", path: `/Approved${this.type}By`, value: this.me.username },
                { op: "replace", path: `/Approved${this.type}Date`, value: new Date() }
            ];

            this.service.replace(this.data._id, jsonPatch)
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
            .Rejected(this.data._id, String(reason).trim())
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