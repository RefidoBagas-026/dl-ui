import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from 'moment';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class List {
  dataToBePosted = [];

  rowFormatter(data, index) {
    if (data.isPosted && data.isUpdatePricePurchasing && data.isApprovedManager && data.isApprovedGeneralManager && data.isApprovedAnggaran)
      return { classes: "success" }
    else if (data.isPosted)
      return { classes: "danger" }
    else
      return {}
  }

  context = ["Rincian", "Cetak PDF"]

  columns = [
    {
      field: "date", title: "Tgl. PR", formatter: function (value, data, index) {
        return moment(value).format("DD MMM YYYY");
      }
    },
    {
        field: "CreatedUtc", title: "Tgl. Buat", formatter: function (value, data, index) {
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
    { field: "IsUnit1Label", title: "Approval Pimpinan 1" },
    { field: "IsUnit2Label", title: "Approval Pimpinan 2" },
    { field: "IsUpdatePriceLabel", title: "Approval Pembelian" },
    { field: "IsApprovedManagerLabel", title: "Approval Manager" },
    { field: "IsApprovedGMLabel", title: "Approval GM Pembelian" },
    { field: "IsApprovedAnggaranLabel", title: "Approval Anggaran" },
    { field: "CreatedBy", title: "Dibuat Oleh" },

  ];

  loader = (info) => {
    var order = {};
    if (info.sort)
      order[info.sort] = info.order;
    // console.log(info)
    var arg = {
      page: parseInt(info.offset / info.limit, 10) + 1,
      size: info.limit,
      keyword: info.search,
      select:["date", "no", "unit.division.name","unit.name","CreatedBy" ,"category.name", "isPosted", "isUpdatePricePurchasing", "isApprovedUnit1", "isApprovedUnit2", "isApprovedManager", "isApprovedGeneralManager", "isApprovedAnggaran"],
      order: order
    }

    return this.service.search(arg)
      .then(result => {
        for (var data of result.data) {
            data.Id = data.Id || data._id || 0;
            data.DivisionName = data.unit.division.name;
            data.UnitName = data.unit.name;
            data.IsUpdatePriceLabel = data.isUpdatePricePurchasing ? "SUDAH" : "BELUM";
            data.IsUnit1Label = data.isApprovedUnit1 ? "SUDAH" : "BELUM";
            data.IsUnit2Label = data.isApprovedUnit2 ? "SUDAH" : "BELUM";
            data.IsApprovedManagerLabel = data.isApprovedManager ? "SUDAH" : "BELUM";
            data.IsApprovedGMLabel = data.isApprovedGeneralManager ? "SUDAH" : "BELUM";
            data.IsApprovedAnggaranLabel = data.isApprovedAnggaran ? "SUDAH" : "BELUM";
            data.CategoryName = data.category.name;
            data.CreatedBy = data.CreatedBy;
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
    const encoded = Base64Helper.encode(data._id);
    switch (arg.name) {
      case "Rincian":
        this.router.navigateToRoute('view', { id: encoded });
        break;
      case "Cetak PDF":
        this.service.getPdfById(data._id);
        break;
    }
  }

  contextShowCallback(index, name, data) {
    switch (name) {
      case "Cetak PDF":
        return data.isPosted;
      default:
        return true;
    }
  }
  create() {
    this.router.navigateToRoute('create');
  }
}
