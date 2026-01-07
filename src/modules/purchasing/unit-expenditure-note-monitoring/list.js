import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';


var PRLoader = require('../../../loader/purchase-request-all-loader');
var UENLoader = require('../../../loader/unit-expenditure-note-all-loader');


@inject(Router, Service)
export class List {
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

    columns = [
        { field: "index", title: "No" , sortable: false},
        { field: "ReceiptName", title: "Penerima" , sortable: false },
        { field: "UnitName", title: "Bagian", sortable: false },
        { field: "PRNo", title: "Nomor PR" , sortable: false},
        { field: "ProductName", title: "Nama Barang", sortable: false },
        { field: "ProductCode", title: "Kode Barang", sortable: false },
   
        { field: "ExpenditureDate", title: "Tanggal Bon Keluar", sortable: false, formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "UENNo", title: "Nomor Bon Keluar" , sortable: false},
        { field: "Quantity", title: "Jumlah", sortable: false,formatter:(value,data)=>{
            return value.toLocaleString('en-EN', { minimumFractionDigits: 2 });
        }  },
        { field: "Uom", title: "Satuan", sortable: false },

        { field: "PricePerDealUnit", title: "Harga Satuan", sortable: false,formatter:(value,data)=>{
            return value.toLocaleString('en-EN', { minimumFractionDigits: 2 });
        }  },

        { field: "TotalPrice", title: "Harga Total", sortable: false,formatter:(value,data)=>{
            return value.toLocaleString('en-EN', { minimumFractionDigits: 2 });
        }  },
        
    ];

    constructor(router, service) {
        this.service = service;
        this.router = router;
        this.today = new Date();
    }
    search() {
        this.error = {};

        if (!this.dateFrom) {
            this.error.dateFrom = "Dari Tgl wajib diisi";
        }
        if (!this.dateTo) {
            this.error.dateTo = "Sampai Tgl wajib diisi";
        }
        if (this.dateFrom && this.dateTo && this.dateFrom > this.dateTo) {
            this.error.dateTo = "Sampai Tgl harus lebih besar atau sama dengan Dari Tgl";
        }

        if (Object.getOwnPropertyNames(this.error).length === 0) {
            this.flag = true;
            this.prTable.refresh();
        }
    }

    reset() {
        this.pr=null;
        this.unitExpenditureNote = null;
        this.dateTo = undefined;
        this.dateFrom = undefined;
        this.error = {};

        this.flag = false;
        //this.prTable.refresh();
    }

    loader = (info) => {
        var order = {};

        if (info.sort)
            order[info.sort] = info.order;

        let args = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            uENNo:this.unitExpenditureNote? this.unitExpenditureNote.UENNo:"",
            prNo: this.pr ? this.pr.no : "",
            dateTo: this.dateTo? moment(this.dateTo).format("MM/DD/YYYY"):"",
            dateFrom: this.dateFrom? moment(this.dateFrom).format("MM/DD/YYYY"):"",

        };

        return this.flag ?
            (
                this.service.search(args)
                    .then(result => {
                        console.log(result.data.Data);
                        var index=0;
                        for(var a of result.data.Data){
                            index++;
                            a.index=index;
                        }
                        return {
                            total: result.info.total,
                            data: result.data.Data
                        };
                    })
            ) : { total: 0, data: [] };
    }

    xls() {
        this.error = {};
        if (!this.dateFrom) {
            this.error.dateFrom = "Dari Tgl wajib diisi";
        }
        if (!this.dateTo) {
            this.error.dateTo = "Sampai Tgl wajib diisi";
        }
        if (this.dateFrom && this.dateTo && this.dateFrom > this.dateTo) {
            this.error.dateTo = "Sampai Tgl harus lebih besar atau sama dengan Dari Tgl";
        }
        if (Object.getOwnPropertyNames(this.error).length === 0) {
            let args = {
            uENNo:this.unitExpenditureNote? this.unitExpenditureNote.UENNo:"",
            prNo: this.pr ? this.pr.no : "",
            dateTo: this.dateTo? moment(this.dateTo).format("MM/DD/YYYY"):"",
            dateFrom: this.dateFrom? moment(this.dateFrom).format("MM/DD/YYYY"):"",

        };

            this.service.generateExcel(args)
                .catch(e => {
                    alert(e.replace(e, "Error: ", ""));
                });
        }
    }

    get prLoader() {
        return PRLoader;
    }

    get uenLoader() {
        return UENLoader;
    }
    prView = (tr) => {
      return `${tr.no}`;
    }
    uenView = (unitExpenditureNote) => {
        return `${unitExpenditureNote.UENNo}`;
    }
   

    dateFromChanged(e) {
        var _startDate = new Date(e.srcElement.value);
        var _endDate = new Date(this.dateTo);


        if (_startDate > _endDate)
            this.dateTo = e.srcElement.value;

    }
}