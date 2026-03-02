import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import { activationStrategy } from 'aurelia-router';
import { AuthService } from "aurelia-authentication";
import { Base64Helper } from '../../../utils/base-64-coded-helper';
import moment from 'moment';

@inject(Router, Service, AuthService)
export class List {
    context = ["Detail"];
    columns = [
    
            
            { field: "DebetNoteNo", title: "Nomer Nota Debet" },
            
            {
                field: "CreatedUtc", title: "Tanggal Nota Debet", formatter: function (value, data, index) {
                    return moment(value).format("DD MMM YYYY");
                }
            },
            { field: "SupplierName", title: "Nama Supplier" },
            { field: "TotalAmount", title: "Total Amount" },
            { field: "CreatedBy", title: "Dibuat Oleh" }
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
                result.data.map(data => {
                    data.SupplierName = data.Supplier ? data.Supplier.Name : "";
                    data.TotalAmount = data.TotalAmount;
                    return data;
                });
                return {
                    total: result.info.total,
                    data: result.data
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
            case "gm":
                this.filter = {
                    IsPosted: true,
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