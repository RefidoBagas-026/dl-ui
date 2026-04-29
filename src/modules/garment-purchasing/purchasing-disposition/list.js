import {inject} from 'aurelia-framework';
import {Service} from "./service";
import {Router} from 'aurelia-router';
import moment from 'moment';
import numeral from "numeral";
import {Base64Helper} from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class List {
    info = { page: 1, keyword: '' };

    context = ["Rincian", "Cetak PDF"]

    columns = [
        {
            field: "isPosting", title: "Post", checkbox: true, sortable: false,
            formatter: function (value, data, index) {
                this.checkboxEnabled = !data.IsPosted;
                return ""
            }
         },
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
        { field: "IsApprovedManagerLabel", title: "Approval Manager" },
        { field: "IsApprovedGMLabel", title: "Approval GM" },
        { field: "ReasonRejected", title: "Alasan Reject" }
        
    ];

     rowFormatter(data, index) {
         if (!data.IsPosted) {
        return { classes: "" }; // putih / default
        }
        if (data.ReasonRejected) {
            return { classes: "" };
        } else if (data.IsApprovedGeneralManager && data.IsApprovedManager) {
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
            order: order
        }

        return this.service.search(arg)
            .then(result => {
                if (result.data && result.data.Data && Array.isArray(result.data.Data)) {
                    result.data.Data.map(data => {
                        data.IsPostedLabel  = data.IsPosted ? "SUDAH" : "BELUM";
                        data.IsApprovedManagerLabel = data.IsApprovedManager ? "SUDAH" : "BELUM";
                        data.IsApprovedGMLabel = data.IsApprovedGeneralManager ? "SUDAH" : "BELUM";
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
                return true;
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