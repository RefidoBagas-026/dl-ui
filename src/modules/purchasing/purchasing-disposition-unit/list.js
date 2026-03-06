import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class List {
    dataToBePosted = [];

    context = ["Rincian", "Cetak PDF"]

    columns = [

        {
            field: "isPosting", title: "Post", checkbox: true, sortable: false,
            formatter: function (value, data, index) {
                this.checkboxEnabled = !data.IsPosted;
                return ""
            }
         },
        
        { field: "DispositionNo", title: "Nomer Disposisi" },
       
        {
            field: "DispositionDate", title: "Tanggal Disposisi", formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "TypeDisposition", title: "Tipe Disposisi" },
        { field: "IsPostedLabel", title: "Status Posting" },
        { field: "IsApprovedUnit1Label", title: "Approval Pimpinan 1" },
        { field: "IsApprovedUnit2Label", title: "Approval Pimpinan 2" },
        { field: "IsApprovedGMLabel", title: "Approval GM Purchasing" },
        { field: "ReasonRejected", title: "Alasan Reject" }
    ];

    rowFormatter(data, index) {
        if (data.ReasonRejected) {
            return { classes: "" };
        } else if (data.IsApprovedUnit1 && data.IsApprovedUnit2 && data.IsApprovedGeneralManager) {
            return { classes: "success" };
        } else {
            return { classes: "danger" };
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
                result.data.map(data => {
                    data.IsPostedLabel  = data.IsPosted ? "SUDAH" : "BELUM";
                    data.IsApprovedUnit1Label = data.IsApprovedUnit1 ? "SUDAH" : "BELUM";
                    data.IsApprovedUnit2Label = data.IsApprovedUnit2 ? "SUDAH" : "BELUM";
                    data.IsApprovedGMLabel = data.IsApprovedGeneralManager ? "SUDAH" : "BELUM";
                    return data;
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
        const encoded = Base64Helper.encode(data.Id);
        switch (arg.name) {
            case "Rincian":
                this.router.navigateToRoute('view', { id: encoded });
                break;
            case "Cetak PDF":
                this.service.getPdfById(data.Id);
                break;
        }
    }

    contextShowCallback(index, name, data) {
        switch (name) {
            case "Cetak PDF":
                return data.Id;
            default:
                return true;
        }
    }

    create() {
        this.router.navigateToRoute('create');
    }

    posting() {
        if (this.dataToBePosted.length > 0) {
        this.service.post(this.dataToBePosted).then(result => {
            this.table.refresh();
        }).catch(e => {
            this.error = e;
        })
        }
    }
}