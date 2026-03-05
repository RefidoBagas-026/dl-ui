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
        { field: "no", title: "Nomor PO Eksternal" },
        {
            field: "orderDate", title: "Tanggal PO Eksternal", formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "supplier.name", title: "Supplier" },
        {
            field: "paymentMethod", title: "Jenis PO",
            formatter: function (value, data, index) {

                if(data.paymentMethod === "CASH") {
                    return `${data.paymentMethod} ${data.poCashType}`;
                } else {
                    return `${data.paymentMethod}`;
                }
            }
        },
        { field: "purchaseRequestNo", title: "Nomor Purchase Request", sortable: false },
        {
            field: "isPosted", title: "Status Post",
            formatter: function (value, row, index) {
                return value ? "SUDAH" : "BELUM";
            }
        },
        { field: "CreatedBy", title: "Dibuat Oleh" },
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
                for (var _data of result.data) {
                    _data.Id = _data._id ? _data._id : _data.Id;
                    var prNo = _data.items.map(function (item) {
                        return `<li>${item.prNo}</li>`;
                    });
                    var uniqueArray = prNo.filter(function (item, pos) {
                        return prNo.indexOf(item) == pos;
                    })
                    _data.purchaseRequestNo = `<ul>${uniqueArray.join()}</ul>`;
                }
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
            case "level1":
                this.filter = {
                    isPosted: true,
                    isApprovedLevel1: false,
                    isValid : false,
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