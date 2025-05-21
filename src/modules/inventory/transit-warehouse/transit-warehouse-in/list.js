import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class List {
    context = ["Rincian"];
    columns = [
        { field: "DONo", title: "Nomor Surat Jalan" },
        { field: "Supplier", title: "Supplier" },
        {
            field: "DODate", title: "Tanggal SJ", formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "BCNo", title: "Nomor BC" },
        { field: "BCDate", title: "Tanggal BC"},
        { field: "Quantity", title: "Quantity" }
    ];

    loader = (info) => {
        var order = {};
        if (info.sort)
            order[info.sort] = info.order;
        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order
        }

        return this.service.search(arg)
            .then(result => {
                var data = {}
                data.total = result.info.total;
                data.data = result.data;
                data.data.forEach(s => {
                    s.Supplier= s.Supplier.Code + " "+ s.Supplier.Name;
                    s.BCDate = s.BCDate && moment(s.BCDate).isAfter('1900-01-01') 
                                ? moment(s.BCDate).format("DD MMM YYYY") 
                                : "-";
                });
                return {
                    total: result.info.total,
                    data: result.data
                }
            });
    }

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    contextClickCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        switch (arg.name) {
            case "Rincian":
                this.router.navigateToRoute('view', { id: data.Id });
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}