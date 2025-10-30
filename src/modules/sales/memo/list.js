import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';
import numeral from 'numeral';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class List {
    context = ["Rincian"];
    columns = [
        { field: "DocumentNo", title: "No. Memo" },
        { field: "SalesInvoiceNo", title: "No. Memo" },
        {
            field: "Date", title: "Tanggal", formatter: function (value, data, index) {
                return moment.utc(value).local().format('DD MMM YYYY');
            },
        },
        { field: "MemoType", title: "Jenis Memo" },
        { field: "CurrencyCodes", title: "Mata Uang" },
        { field: "BuyerName", title: "Buyer" }
    ];

    loader = (info) => {
        let order = {};

        if (info.sort)
            order[info.sort] = info.order;
        else
            order["Date"] = "desc";

        let arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order
        };

        return this.service.search(arg)
            .then(result => {
                return {
                    total: result.info.total,
                    data: result.data
                }
            });
        // return {
        //     total: 0,
        //     data: []
        // }
    }

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    contextCallback(event) {
        let arg = event.detail;
        let data = arg.data;
        const encoded = Base64Helper.encode(data.Id);
        switch (arg.name) {
            case "Rincian":
                this.router.navigateToRoute('view', { id: encoded });
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}
