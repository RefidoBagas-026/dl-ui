import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import { activationStrategy } from 'aurelia-router';
import { AuthService } from "aurelia-authentication";
import { Base64Helper } from '../../../utils/base-64-coded-helper';
import moment from 'moment';

@inject(Router, Service, AuthService)
export class List {
    context = ["Detail"];
    columns = [
                {
                      field: "date", title: "Tgl. PR", formatter: function (value, data, index) {
                        return moment(value).format("DD MMM YYYY");
                      }
                    },
                    { field: "no", title: "No. PR" },
                    { field: "DivisionName", title: "Divisi" },
                    { field: "UnitName", title: "Unit" },
                    { field: "CategoryName", title: "Kategori" },
                    {
                      field: "isPosted", title: "Posted",
                      formatter: function (value, row, index) {
                        return value ? "SUDAH" : "BELUM";
                      }
                    },
                { field: "CreatedBy", title: "Dibuat Oleh" },
    ];
    filter = {};

    loader = (info) => {
        var order = {};

        if (info.sort)
            order[info.sort] = info.order;

        var arg = {
            page: parseInt(info.offset / info.limit, 10) + 1,
            size: info.limit,
            keyword: info.search,
            select:["date", "no", "unit.division.name","unit.name", "category.name", "isPosted","CreatedBy" ,"isUpdatePricePurchasing", "isApprovedManager", "isApprovedGM", "isApprovedAnggaran"],
            order: order,
            filter: JSON.stringify(this.filter)
        }


        return this.service.search(arg)
            .then(result => {
                for (var data of result.data) {
                    data.Id = data.Id || data._id || 0;
                    data.DivisionName = data.unit.division.name;
                    data.UnitName = data.unit.name;
                    data.CategoryName = data.category.name;
                }
                return {
                    total: result.info.total,
                    data: result.data
                }
            });
        }

    constructor(router, service, authService) {
        this.service = service;
        this.router = router;
        this.authService = authService;
    }

    determineActivationStrategy() {
        return activationStrategy.replace;
    }

    activate(params, routeConfig, navigationInstruction) {
        const instruction = navigationInstruction.getAllInstructions()[0];
        const parentInstruction = instruction.parentInstruction;
        this.title = parentInstruction.config.title;
        const type = parentInstruction.config.settings.type;
        this.type = type;

        let username = null;
        if (this.authService.authenticated) {
            const me = this.authService.getTokenPayload();
            username = me.username;
        }

        switch (type) {
            case "unit1":
                this.filter = {
                    IsApprovedUnit1: false,
                    IsPosted: true,
                    ApprovedUnit1By: username
                };
                break;
            case "unit2":
                this.filter = {                 
                    IsApprovedUnit1: true,
                    IsApprovedUnit2: false
                };
                break;
             case "purchasing":
                this.filter = {                  
                    IsApprovedUnit2: true,
                    IsUpdatePricePurchasing: false,
                };
                break;
            case "manager":
                this.filter = {                  
                    IsUpdatePricePurchasing: true,
                    IsApprovedManager: false
                };
                break;
            case "gm":
                this.filter = {
                    IsApprovedManager: true,
                    IsApprovedGeneralManager: false
                };
                break;
            
            case "anggaran":
                this.filter = {   
                    IsApprovedGeneralManager: true,
                    IsApprovedAnggaran: false,

                };
                break;
            default:
                break;
        }
    }

    contextCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        const encoded = Base64Helper.encode(data.Id);
        switch (arg.name) {
            case "Detail":
                this.router.navigateToRoute('view', { id: encoded });
                break;
        }
    }
}