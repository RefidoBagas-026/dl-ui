import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';



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
        { field: "PRNo", title: "Nomor PR" , sortable: false},
        { field: "ProductName", title: "Nama Barang", sortable: false },
        { field: "ProductCode", title: "Kode Barang", sortable: false },
   

        { field: "OpeningBalance", title: "Saldo Awal", sortable: false,formatter:(value,data)=>{
            return value.toLocaleString('en-EN', { minimumFractionDigits: 2 });
        }  },
         { field: "Incoming", title: "Pemasukan", sortable: false,formatter:(value,data)=>{
            return value.toLocaleString('en-EN', { minimumFractionDigits: 2 });
        }  },
         { field: "Outgoing", title: "Pengeluaran", sortable: false,formatter:(value,data)=>{
            return value.toLocaleString('en-EN', { minimumFractionDigits: 2 });
        }  },
        { field: "RemainingStock", title: "Sisa", sortable: false,formatter:(value,data)=>{
            return value.toLocaleString('en-EN', { minimumFractionDigits: 2 });
        }  },
        
        { field: "Uom", title: "Satuan", sortable: false },
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
            dateTo: this.dateTo? moment(this.dateTo).format("MM/DD/YYYY"):"",
            dateFrom: this.dateFrom? moment(this.dateFrom).format("MM/DD/YYYY"):"",

        };

            this.service.generateExcel(args)
                .catch(e => {
                    alert(e.replace(e, "Error: ", ""));
                });
        }
    }

    dateFromChanged(e) {
        var _startDate = new Date(e.srcElement.value);
        var _endDate = new Date(this.dateTo);


        if (_startDate > _endDate)
            this.dateTo = e.srcElement.value;

    }
}