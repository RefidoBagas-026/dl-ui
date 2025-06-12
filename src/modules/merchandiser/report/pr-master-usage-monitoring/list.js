import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';

var moment = require('moment');
var BuyerLoader = require('../../../../loader/garment-buyers-loader');
var CategoryLoader = require('../../../../loader/garment-category-loader');

@inject(Router, Service)
export class List {
    constructor(router, service) {

        this.service = service;
        this.router = router;
        this.today = new Date();
    }
    get buyerLoader() {
        return BuyerLoader;
    }
    get categoryLoader() {
        return CategoryLoader;
    }
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
        { field: "PRNo", title: "No PR", sortable: false },
        { field: "RONo", title: "RONo", sortable: false },
        { field: "PONo", title: "No. PO", sortable: false },
        { field: "Category", title: "Kategori", sortable: false },
        { field: "ProductCode", title: "Kode Barang", sortable: false },
        { field: "Composition", title: "Komposisi", sortable: false },
        { field: "Width", title: "Width", sortable: false },
        { field: "ProductName", title: "Nama Barang", sortable: false },
        { field: "Qty", title: "Jumlah", sortable: false },
        { field: "Uom", title: "Satuan", sortable: false },
        { field: "Price", title: "Price", sortable: false },
        { field: "Currency", title: "Satuan Harga", sortable: false },
        { field: "Conversion", title: "Konversi", sortable: false },
        { field: "Total", title: "Total", sortable: false },
        { field: "ArrivalQuantity", title: "Qty Kedatangan", sortable: false },
        { field: "ROJob", title: "RO JOB", sortable: false },
        { field: "UENQty", title: "Qty Pemakaian", sortable: false },
        { field: "RemainingQty", title: "Qty Sisa", sortable: false },
    ];

    search() {
        this.error = {};

        if (!this.buyer )
            this.error.buyer = "buyer harus diisi";

        if (!this.category)
            this.error.category = "category harus diisi";

        if (Object.getOwnPropertyNames(this.error).length === 0) {
            this.info.page = 1;
            this.info.total = 0;
            this.searching();
        }
        
    }
    info = { page: 1, size: 25 };
    async searching() {
        this.data = [];
        var order = {};
        let args = {
            page: this.info.page,
            size: this.info.size,
            buyer: this.buyer ? this.buyer.Code : "",
            article: this.article ? this.article : "",
            category: this.category ? this.category.Name : "",
        };
        this.service.search(args)
            .then(result => {
                this.data = result.data;
                var temp = [];
                this.info.total = result.info.total;
                var count = 0;
                var countPO =0;
                for (var item of this.data) {
                    item.RemainingQty = item.RemainingQty.toFixed(2);
                    item.ROJob = item.ROJob ? item.ROJob : "-";
                    if (!temp[item.PRNo + item.RONo ]) {
                        count = 1;
                        temp[item.PRNo + item.RONo  ] = count;
                    }
                    else {
                        count++;
                        temp[item.PRNo + item.RONo ] = count;
                        item.PRNo = null;
                    }

                    if (!temp[item.RONo + item.PONo ]) {
                        countPO = 1;
                        temp[item.RONo + item.PONo  ] = countPO;
                    }
                    else {
                        countPO++;
                        temp[item.RONo + item.PONo] = countPO;
                        item.PONo = null;
                    }

                }
                console.log("temp", temp);
                var index = 0;
                for (var a of this.data) {
                    if (a.PRNo != null) {
                        index++;
                        a.row_count = temp[a.PRNo + a.RONo ];
                    }
                    if (a.PONo != null) {
                        a.row_countPO = temp[a.RONo + a.PONo];
                    }
                    a.index = index;
                }
                this.fillTable();
            });

    }

    fillTable() {
        const columns = [
            { field: "index", title: "No", sortable: false },
            { field: "PRNo", title: "No PR", sortable: false },
            { field: "RONo", title: "RONo", sortable: false },
            { field: "PONo", title: "No. PO", sortable: false },
            { field: "Category", title: "Kategori", sortable: false },
            { field: "ProductCode", title: "Kode Barang", sortable: false },
            { field: "Composition", title: "Komposisi", sortable: false },
            { field: "Width", title: "Width", sortable: false },
            { field: "ProductName", title: "Nama Barang", sortable: false },
            { field: "Qty", title: "Jumlah", sortable: false },
            { field: "Uom", title: "Satuan", sortable: false },
            { field: "Price", title: "Price", sortable: false },
            { field: "Currency", title: "Satuan Harga", sortable: false },
            { field: "Conversion", title: "Konversi", sortable: false },
            { field: "Total", title: "Total", sortable: false },
            { field: "ArrivalQuantity", title: "Qty Kedatangan", sortable: false },
            { field: "ROJob", title: "RO JOB", sortable: false },
            { field: "UENQty", title: "Qty Pemakaian", sortable: false },
            { field: "RemainingQty", title: "Qty Sisa", sortable: false },
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
            if (this.data[rowIndex].PRNo) {
                console.log(this.data[rowIndex]);
                var rowSpan = this.data[rowIndex].row_count;
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "index", rowspan: rowSpan, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "PRNo", rowspan: rowSpan, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "RONo", rowspan: rowSpan, colspan: 1 });
                
            }

            if (this.data[rowIndex].PONo) {
                console.log(this.data[rowIndex]);
                var rowSpanPO = this.data[rowIndex].row_countPO;
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "PONo", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index: rowIndex, field: "Category", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "ProductCode", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "Composition", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "Width", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "ProductName", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "Qty", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "Uom", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "Price", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "Currency", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "Conversion", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "Total", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "ArrivalQuantity", rowspan: rowSpanPO, colspan: 1 });
                $(this.table).bootstrapTable('mergeCells', { index : rowIndex, field: "RemainingQty", rowspan: rowSpanPO, colspan: 1 });

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
        this.error = {};

        if (!this.buyer )
            this.error.buyer = "buyer harus diisi";

        if (!this.category)
            this.error.category = "category harus diisi";

        if (Object.getOwnPropertyNames(this.error).length === 0) {
            let args = {
                buyer: this.buyer ? this.buyer.Code : "",
                article: this.article ? this.article : "",
                category: this.category ? this.category.Name : "",
            };

            this.service.getXls(args)
                .catch(e => {
                    alert(e.replace(e, "Error: ", ""));
                });
        }
    }
    
    buyerView = (buyer) => {
        return `${buyer.Code} - ${buyer.Name}`;
    }
}