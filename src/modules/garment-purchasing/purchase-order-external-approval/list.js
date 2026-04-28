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
        { field: "CreatedBy", title: "Dibuat Oleh" }
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
            order: order,
            filter: JSON.stringify(this.filter)
        }

        // return this.service.search(arg)
        //     .then(result => {
        //         result.data.map(data => {
        //             data.SupplierName = data.Supplier ? data.Supplier.Name : "";
        //             data.TotalAmount = data.TotalAmount;
        //             return data;
        //         });
        //         return {
        //             total: result.info.total,
        //             data: result.data
        //         }
        //     });

            if (this.type === "manager") {
                return this.service.searchManager(arg)
                .then(result => {
                    for (var _data of result.data) {
                        var prNo = _data.Items.map(function (item) {
                            return `<li>${item.PRNo}</li>`;
                        });
                        prNo = prNo.filter(function (elem, index, self) {
                            return index == self.indexOf(elem);
                        })
                        _data.purchaseRequestNo = `<ul>${prNo.join()}</ul>`;
                        if (_data.IsOverBudget) {
                            if (_data.IsApprovedAnggaran) {
                                _data.approveStatus = "SUDAH";
                            } else {
                                _data.approveStatus = "BELUM";
                            }
                        } else {
                            _data.approveStatus = "-";
                        }
                    }
                    return {
                        total: result.info.total,
                        data: result.data
                    }
                });
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
                    if (_data.IsOverBudget) {
                        if (_data.IsApprovedAnggaran) {
                            _data.approveStatus = "SUDAH";
                        } else {
                            _data.approveStatus = "BELUM";
                        }
                    } else {
                        _data.approveStatus = "-";
                    }
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
            case "other":
                this.filter = {
                    IsPosted: true,
                    ApproveOther: true,
                    IsApprovedOther: false,
                    IsOverBudget: true,
                    ApprovedOtherBy: username
                };
                break;
            case "manager":
                this.filter = {
                    IsApprovedManager: false,
                    ApprovedManagerBy: username
                };
                break;
            case "gm":
                this.filter = {
                    IsApprovedManager: true,
                    IsApprovedGeneralManager: false
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