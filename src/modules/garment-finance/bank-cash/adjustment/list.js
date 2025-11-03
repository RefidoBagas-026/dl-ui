import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';
import numeral from 'numeral';
import { Base64Helper } from '../../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class List {

    context = ["Detail", "Cetak"]

    columns = [
        { field: "AdjustmentNo", title: "No Penyesuaian" },
        {
            field: "Date", title: "Tanggal", formatter: function (value) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "Remark", title: "Keterangan" },
        {
        field: "Amount", title: "Amount", align: "right", formatter: function (value, data, index) {
            return value ? numeral(value).format("0,000.00") : numeral(0).format("0,000.00");
        }
    },
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
        var idEncode = Base64Helper.encode(data.Id);
        switch (arg.name) {
            case "Detail":
                this.router.navigateToRoute('view', { id: idEncode });
                break;
            case "Cetak":
                this.service.getPdfById(data.Id);
                break;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }
}
