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

        // Setup options for templates
        if (!this.itemsInfo.options) {
            this.itemsInfo.options = {};
        }
        this.itemsInfo.options.readOnly = this.readOnly;
        this.itemsInfo.options.isEdit = true;
        
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

    list() {
        this.router.navigateToRoute("list");
    }

    cancelCallback(event) {
        this.list();
    }

    approve(event) {
        if (confirm("Approve Nota Debet?")) {
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