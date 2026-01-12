import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import { filter } from 'bluebird';
var moment = require("moment");

@inject(Router, Service)
export class List {
    constructor(router, service) {
        this.service = service;
        this.router = router;
    }
   
    columns = [
        { field: "UnitCode", title: "Unit" },
        { field: "ComodityName", title: "Komoditi" },
        { field: "Price", title: "Tarif" },
        { field: "IsApproved", title: "Status Approval" , formatter: function(value, data, index) {
            return value ? "APPROVED" : "BELUM APPROVED";
        } }
    ]

    rowFormatter(data, index) {
        if (data.IsApproved) {
          return { classes: "success" };
        }else{
          return { css: {"background-color": "#fff"} };
        }
    }
    loader = (info) => {
        var order = {};
        if (info.sort)
            order[info.sort] = info.order;

        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            order: order,
        }

        return this.service.search(arg)
            .then(result => {
                result.data.sort((a, b) => {
                    return (b.IsApproved === false) - (a.IsApproved === false);
                });
                for(var a of result.data){
                    a.UnitCode=a.Unit.Code;
                    a.ComodityName=a.Comodity.Name;
                    a.Price=a.Price.toLocaleString('en-EN');
                }
                return {
                    total: result.info.count,
                    data: result.data
                }
            });
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

    edit() {
        this.router.navigateToRoute('edit');
    }
}