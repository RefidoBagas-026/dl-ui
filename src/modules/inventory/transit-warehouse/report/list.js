import {inject} from 'aurelia-framework';
import {Service} from "./service";
import {Router} from 'aurelia-router';

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
        { field: "index", title: "No" , sortable: false},
        { field: "DONo", title: "No Surat Jalan" , sortable: false },
        { field: "SupplierName", title: "Supplier" , sortable: false },
        { field: "DODate", title: "Tanggal Surat Jalan", sortable: false, formatter: function (value, data, index) {
                return moment(value).format("DD MMM YYYY");
            }
        },
        { field: "BCNo", title: "No BC" , sortable: false },
        { field: "BCType", title: "Tipe BC" , sortable: false },
        { field: "BCDate", title: "Tanggal BC", sortable: false},
        { field: "QuantityIN", title: "Qty Masuk" , sortable: false },
        { field: "QuantityOUT", title: "Qty Keluar" , sortable: false },
        { field: "RemainingQuantity", title: "Qty Sisa" , sortable: false },
        { field: "UomUnit", title: "Satuan" , sortable: false },
    ];

    search() {
        this.error = {};


        if (Object.getOwnPropertyNames(this.error).length === 0) {
            this.flag = true;
            this.table.refresh();
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
                        var index=0;
                        for(var a of result.data){
                            index++;
                            a.index=index;
                            a.BCDate = a.BCDate && moment(a.BCDate).isAfter('1900-01-01') 
                                ? moment(a.BCDate).format("DD MMM YYYY") 
                                : "-";
                        }
                        return {
                            total: result.info.total,
                            data: result.data
                        };
                    })
            ) : { total: 0, data: [] };
    }
    

    

    xls() {
        this.error = {};

        if (Object.getOwnPropertyNames(this.error).length === 0) {
            let args = {
            dateTo: this.dateTo? moment(this.dateTo).format("MM/DD/YYYY"):"",
            dateFrom: this.dateFrom? moment(this.dateFrom).format("MM/DD/YYYY"):"",

        };

            this.service.getXls(args)
                .catch(e => {
                    alert(e.replace(e, "Error: ", ""));
                });
        }
    }
}