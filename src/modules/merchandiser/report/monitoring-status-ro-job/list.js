import { inject, bindable } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class List {

    constructor(router, service) {
        this.service = service;
        this.router = router;
        this.today = new Date();
    }
   
    info = { page: 1, size: 99999 };
    
    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 4
        }
    };


    activate() {
       
    }

    

    search(){
        this.info.page = 1;
        this.info.total=0;
        this.searching();        
}

    // searching() {
    //     var info = {
    //         page: this.info.page,
    //         size: this.info.size,
    //         dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
    //         dateTo : this.dateFrom ? moment(this.dateTo).format("YYYY-MM-DD") : "",
    //     }

    //     this.service.search(info)
    //         .then(result => {
    //               this.data = result.data;
    //            });        
    // }

    searching() {
    var info = {
        page: this.info.page,
        size: this.info.size,
        dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
        dateTo : this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
    };

    this.service.search(info).then(result => {
        this.data = result.data;
        this.info.total = result.total;
    });
}


    formatDate(value) {
    if (!value) return "-";

    let m = moment(value);

    if (!m.isValid() || m.year() === 1) return "-";

    return m.format("DD MMMM YYYY");
}


          
    ExportToExcel() {
        var info = {
            dateFrom : this.dateFrom ? moment(this.dateFrom).format("YYYY-MM-DD") : "",
            dateTo : this.dateFrom ? moment(this.dateTo).format("YYYY-MM-DD") : "",
        }
        
        this.service.generateExcel(info);
    }

    reset() {
        this.dateFrom = null;
        this.dateTo = null;
        this.data = [];
    }

    changePage(e) {
        var page = e.detail;
        this.info.page = page;
        this.searching();
    }

    dateFromChanged(e) {
        var _startDate = new Date(e.srcElement.value);
        var _endDate = new Date(this.dateTo);

        if (_startDate > _endDate)
            this.dateTo = e.srcElement.value;
    } 
}