import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import { activationStrategy } from 'aurelia-router';
import { AuthService } from "aurelia-authentication";
import { Base64Helper } from '../../../utils/base-64-coded-helper';
import moment from 'moment';
import numeral from "numeral";

@inject(Router, Service, AuthService)
export class List {
    context = ["Detail"];
    columns = [
    
            
            { field: "DispositionNo", title: "Nomor Disposisi Pembayaran" },
            
            {
            field: "CreatedUtc", title: "Tanggal Disposisi", formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
            },
            { field: "Category", title: "Kategori"},
            { field: "SupplierName", title: "Supplier" },
            {
                field: "DueDate", title: "Tanggal Jatuh Tempo", formatter: function (value, data, index) {
                    return moment(value).format("DD MMM YYYY");
                }
            },
             { field: "CurrencyName", title: "Mata Uang"},
            { field: "AmountDisposition", title: "Nominal Disposisi", sortable: false,formatter:function(value, data, index) {
                return numeral(value).format("0,000.00");
            }},
            { field: "IsPostedLabel", title: "Status Posting" },
    ];
    filter = {};

     loader = (info) => {
        var order = {};
        if (info.sort)
            order[info.sort] = info.order;
        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order,
            filter: JSON.stringify(this.filter)
        }

        return this.service.search(arg)
            .then(result => {
                if (result.data && result.data.Data && Array.isArray(result.data.Data)) {
                    result.data.Data.map(data => {
                        data.IsPostedLabel  = data.IsPosted ? "SUDAH" : "BELUM";
                        return data;
                    });
                } else {
                    result.data.Data = [];
                }
                return {
                    total: result.data ? result.data.Total : 0,
                    data: result.data ? result.data.Data : []
                }
            });
        }

    constructor(router, service, authService) {
        this.service = service;
        this.router = router;
        this.authService = authService;
    }

    determineActivationStrategy() {
        return activationStrategy.replace;
    }

    activate(params, routeConfig, navigationInstruction) {
        const instruction = navigationInstruction.getAllInstructions()[0];
        const parentInstruction = instruction.parentInstruction;
        this.title = parentInstruction.config.title;
        const type = parentInstruction.config.settings.type;
        this.type = type;

        let username = null;
        if (this.authService.authenticated) {
            const me = this.authService.getTokenPayload();
            username = me.username;
        }

        switch (type) {
            case "manager":
                this.filter = {
                    IsPosted: true,
                    IsApprovedManager: false,
                    ApprovedManagerBy: username 
                };
                break;
            case "gm":
                this.filter = {
                    IsApprovedManager: true,
                    IsApprovedGeneralManager: false
                };
                break;
            default:
                break;
        }
    }

    contextCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        const encoded = Base64Helper.encode(data.Id);
        switch (arg.name) {
            case "Detail":
                this.router.navigateToRoute('view', { id: encoded });
                break;
        }
    }
}