import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
var moment = require("moment");

@inject(Router, Service)
export class List {
    constructor(router, service) {
        this.service = service;
        this.router = router;
        this.selectedItems = [];
    }

   


    context = ["Rincian"];
   
    columns = [
        {
        field: "toApprove",//ini sbnrnya field  yang tidak ada di database
        //title: "Approve",
        checkbox: true,
        sortable: false,
        formatter: function (value, data, index) {
        this.checkboxEnabled = true;///jika ada data (dari data.Id) maka checkbox bisa di centang)
        return "";
      },
        },
        { field: "UnitCode", title: "Unit" },
        { field: "ComodityName", title: "Komoditi" },
        { field: "Price", title: "Tarif" }
    ]

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

                for(var a of result.data){
                    a.UnitCode=a.Unit.Code;
                    a.ComodityName=a.Comodity.Name;
                    a.Price=a.Price.toLocaleString('en-EN');
                }

                 // Auto select all data
                this.dataToBePosted = [...result.data]; // Copy semua data ke dataToBePosted
            

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

    posting() {
    console.log("Cancel action initiated");
    var items = this.selectedItems.map(s => s.Id);//baca respon json Id
        //console.log("Selected this.selectedItems:", this.selectedItems);

    //console.log("Selected item IDs:", items);

    //console.log("Selected item IDs 2:", this.selectedItems.map(s => s.Id));
    
    var data = {};
    // data.IsApproved = false;
    data.Ids = items;
    // var aa =data.Ids;
    // console.log("Selected item aa: ", aa);
    //data.Reason = ""; // Atau bisa diisi default reason jika perlu
    //this.service.cancellation(data)-->original code
    this.service.approve(items)
        .then(result => {
            //console.log("Response Ids:", result.Ids);
            //console.log("Response Id:", result.Id);
            alert("Data berhasil disimpan");
             this.error = {};
             this.table.refresh();
             this.selectedItems = [];
        })
        .catch(e => {
            if (e.message) {
                alert("Terjadi Kesalahan Pada Sistem!\nHarap Simpan Kembali!");
            }
            this.error = e;
        });
              }
}