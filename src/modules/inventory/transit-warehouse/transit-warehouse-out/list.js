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
        { field: "PickUpName", title: "Yang Mengambil" },
        { field: "Section", title: "Bagian" },
        {
            field: "PickUpDate", title: "Tanggal Ambil", formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        // { field: "Quantity", title: "Quantity" },
        // { field: "Uom.Unit", title: "Satuan" },
        // { field: "RemainingQty", title: "Sisa Bisa Diambil" },
        // { field: "Uom.Unit", title: "Satuan" },
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