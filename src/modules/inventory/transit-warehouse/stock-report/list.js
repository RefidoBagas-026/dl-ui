import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';

var moment = require('moment');

@inject(Router, Service)
export class List {
    constructor(router, service) {

        this.service = service;
        this.router = router;
        this.today = new Date();
    }
    dateFrom = null;
    dateTo = null;

    activate() {
    }
    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 4
        }
    };

    tableOptions = {
        search: false,
        showToggle: false,
        showColumns: false
    }
    // item.vatTaxCorrectionNo,vatDate,item.supplier,item.correctionType,item.productCode, item.productName, item.quantity, item.uom, item.pricePerDealUnitAfter, item.priceTotalAfter, item.user
    columns = [
        { field: "index", title: "No", sortable: false },
        { field: "DONo", title: "No Surat Jalan", sortable: false },
        {
            field: "DODate", title: "Tanggal Surat Jalan", sortable: false, formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "SupplierName", title: "Supplier", sortable: false },
        {
            field: "ArrivalDate", title: "Tanggal Masuk", sortable: false, formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "ProductName", title: "Nama Barang", sortable: false },
        { field: "QuantityIN", title: "Qty Masuk", sortable: false },
        { field: "PickUpDate", title: "Tgl Keluar ", sortable: false },
        { field: "QuantityOUT", title: "Qty Keluar", sortable: false },
        { field: "RemainingQuantity", title: "Qty Sisa", sortable: false },
        { field: "UomUnit", title: "Satuan", sortable: false },
    ];

    search() {
        this.info.page = 1;
        this.info.total = 0;
        this.searching();
    }
    info = { page: 1, size: 25 };
    async searching() {
        this.data = [];
        var order = {};
        let args = {
            page: this.info.page,
            size: this.info.size,
            dateTo: this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
        };
        this.service.search(args)
            .then(result => {
                this.data = result.data;
                var temp = [];
                this.info.total = result.info.total;
                var count = 0;
                var count2 = 0;
                for (var item of this.data) {
                    if (!temp[item.DONo + item.SupplierName + item.DODate]) {
                        count = 1;
                        temp[item.DONo + item.SupplierName + item.DODate] = count;
                    }
                    else {
                        count++;
                        temp[item.DONo + item.SupplierName + item.DODate] = count;
                        item.DONo = null;
                    }

                    if (!temp[item.DONo + item.SupplierName + item.DODate + item.ProductName + item.QuantityIN + item.RemainingQuantity]) {
                        count2 = 1;
                        temp[item.DONo + item.SupplierName + item.DODate + item.ProductName + item.QuantityIN + item.RemainingQuantity] = count2;
                    }
                    else {
                        count2++;
                        temp[item.DONo + item.SupplierName + item.DODate + item.ProductName + item.QuantityIN + item.RemainingQuantity] = count2;
                        item.DONo = null;
                    }
                }
                var index = 0;
                for (var a of this.data) {
                    if (a.DONo != null) {
                        index++;
                        a.row_count = temp[a.DONo + a.SupplierName + a.DODate];
                        a.mergeOfQty = temp[a.DONo + a.SupplierName + a.DODate + a.ProductName + a.QuantityIN + a.RemainingQuantity];
                    }

                    a.index = index;
                }
                this.fillTable();
            });

    }

    fillTable() {
        const columns = [
            { field: "index", title: "No", sortable: false },
            {
                field: "DONo", title: "No Surat Jalan", sortable: false, cellStyle: (value, row, index, field) => {
                    return { css: { "vertical-align": "center" } }
                }
            },
            {
                field: "DODate", title: "Tanggal Surat Jalan", sortable: false, formatter: function (value, data, index) {
                    return moment(value).format("DD MMM YYYY");
                }
            },
            { field: "SupplierName", title: "Supplier", sortable: false },
            {
                field: "ArrivalDate", title: "Tanggal Datang", sortable: false, formatter: function (value, data, index) {
                    return moment(value).format("DD MMM YYYY");
                }
            },
            { field: "ProductName", title: "Nama Barang", sortable: false },
            { field: "QuantityIN", title: "Qty Masuk", sortable: false },
            { field: "PickUpDate", title: "Tgl Keluar ", sortable: false },
            { field: "QuantityOUT", title: "Qty Keluar", sortable: false },
            { field: "RemainingQuantity", title: "Qty Sisa", sortable: false },
            { field: "UomUnit", title: "Satuan", sortable: false }
        ];

        var bootstrapTableOptions = {
            undefinedText: '',
            columns: columns,
            data: this.data,
            rowStyle: this.rowFormatter
        };

        bootstrapTableOptions.height = $(window).height() - $('.navbar').height() - $('.navbar').height() - 25;
        $(this.table).bootstrapTable('destroy').bootstrapTable(bootstrapTableOptions);

        for (const rowIndex in this.data) {
            if (this.data[rowIndex].DONo) {
                var rowSpan = this.data[rowIndex].row_count;
                var spanQty = this.data[rowIndex].mergeOfQty;
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "index", rowspan: rowSpan, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "DONo", rowspan: rowSpan, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "SupplierName", rowspan: rowSpan, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "DODate", rowspan: rowSpan, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "ArrivalDate", rowspan: rowSpan, colspan: 1 });
                // $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "QuantityIN", rowspan: spanQty, colspan: 1 });
                // $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "RemainingQuantity", rowspan: spanQty, colspan: 1 });
                // $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "UomUnit", rowspan: spanQty, colspan: 1 });

            }
        }

    }

    changePage(e) {
        var page = e.detail;
        this.info.page = page;
        this.searching();
    }

    reset() {
        this.dateTo = undefined;
        this.error = {};

        this.flag = false;
        this.table.refresh();
    }

    xls() {
        this.error = {};

        if (Object.getOwnPropertyNames(this.error).length === 0) {
            let args = {
                dateTo: this.dateTo ? moment(this.dateTo).format("MM/DD/YYYY") : "",
                dateFrom: this.dateFrom ? moment(this.dateFrom).format("MM/DD/YYYY") : "",

            };
            this.service.getXls(args)
                .catch(e => {
                    alert(e.replace(e, "Error: ", ""));
                });
        }
    }
}