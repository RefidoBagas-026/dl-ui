import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class List {
    dataToBePosted = [];
    info = { page: 1, keyword: '' };


     rowFormatter(data, index) {
        if (!data.IsPosted) {
        return { classes: "" }; // putih / default
    }
        if (data.ReasonRejected) {
            return { classes: "" };
        } else if ((!data.IsOverBudget ||data.IsApprovedGeneralManager) && (!data.IsOverBudget ||data.IsApprovedAnggaran) && (!data.IsOverBudget || data.IsApprovedManager))
            return { classes: "success" }
        else
            return { classes: "danger" }
    }



    context = ["Rincian", "Cetak PDF", "Cetak PDF Over Budget"]

    columns = [
        {
            field: "isPosting", title: "Post", checkbox: true, sortable: false,
            formatter: function (value, data, index) {
                this.checkboxEnabled = !data.IsPosted;
                return ""
            }
        },
        { field: "EPONo", title: "Nomor PO Eksternal" },
        {
            field: "OrderDate", title: "Tanggal PO Eksternal", formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "Supplier.Name", title: "Nama Supplier" },
        { field: "purchaseRequestNo", title: "Nomor Purchase Request" },
        {
            field: "IsPosted", title: "Status Post",
            formatter: function (value, row, index) {
                return value ? "SUDAH" : "BELUM";
            }
        },
        {
            field: "IsOverBudget", title: "Over Budget?",
            formatter: function (value, row, index) {
                return value ? "YA" : "TIDAK";
            }
        },
        { field: "IsApprovedOtherLabel", title: "Approval Other" },
        { field: "IsApprovedManagerLabel", title: "Approval Manager" },
        { field: "IsApprovedGMManagerLabel", title: "Approval GM" },
        { field: "IsApprovedAnggaranLabel", title: "Approval Anggaran" },
        { field: "ReasonRejected", title: "Alasan Reject" }
    ];

    loader = (info) => {
        var order = {};
        if (info.sort)
            order[info.sort] = info.order;
        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            //select: ["date", "no", "supplier.name", "items.prNo", "isPosted", "isApproved", "isOverBudget"],
            order: order
        }
        
        return this.service.search(arg)
            .then(result => {
                for (var _data of result.data) {
                    var prNo = _data.Items.map(function (item) {
                        return `<li>${item.PRNo}</li>`;
                    });
                    prNo = prNo.filter(function (elem, index, self) {
                        return index == self.indexOf(elem);
                    })
                    _data.purchaseRequestNo = `<ul>${prNo.join()}</ul>`;
                    _data.IsApprovedManagerLabel = _data.IsOverBudget ? (_data.IsApprovedManager ? "SUDAH" : "BELUM") : "-";
                    _data.IsApprovedGMManagerLabel = _data.IsOverBudget ? (_data.IsApprovedGeneralManager ? "SUDAH" : "BELUM") : "-";
                    _data.IsApprovedAnggaranLabel = _data.IsOverBudget ? (_data.IsApprovedAnggaran ? "SUDAH" : "BELUM") : "-";
                    _data.IsApprovedOtherLabel = _data.ApproveOther ? (_data.IsApprovedOther ? "SUDAH" : "BELUM") : "-";
                }
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
            case "Cetak PDF Over Budget":
                this.service.getPdfOverBudgetById(data.Id);
                    break;
        }
    }

    contextShowCallback(index, name, data) {
        console.log(index, name, data);
        switch (name) {
            case "Cetak PDF":
                return data.IsPosted;
            case "Cetak PDF Over Budget":
                return data.IsOverBudget && data.IsPosted;
            default:
                return true;
        }
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

    create() {
        this.router.navigateToRoute('create');
    }
}