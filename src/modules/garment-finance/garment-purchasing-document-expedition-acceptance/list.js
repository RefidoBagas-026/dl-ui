import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import moment from "moment";
import numeral from "numeral";
import { Dialog } from "../../../au-components/dialog/dialog";
import { CashierReason } from "./dialog-template/cashier-reason";
import { Service as FinanceService} from "./service";
import { Service as PurchasingService } from "./purchasing-service";

// import PurchasingDocumentExpeditionService from "../shared/purchasing-document-expedition-service";
import { PermissionHelper } from "../../../utils/permission-helper";
import {
  //VERIFICATION,
  CASHIER,
  ACCOUNTING,
  RETUR,
} from "../shared/permission-constants";

@inject(Router, FinanceService,PurchasingService, Dialog, PermissionHelper)
export class List {
  //sebelumnya hapus
  context = ["Rincian", "Retur"];

   dppvatFormatter(value, data, index) {
    const inNo = String(data.InternalNoteNo).trim();
    const isPaid = this.paidINNos ? this.paidINNos.has(inNo) : false;
    return isPaid ? "Sudah" : "Belum";
  }

  fromPurchasingColumns = [
    {
      field: "SentDate",
      title: "Tanggal Penyerahan",
      formatter: function (value, data, index) {
        return value ? moment(value).format("DD MMM YYYY") : "-";
      },
    },
    {
      field: "AcceptedDate",
      title: "Tanggal Penerimaan",
      formatter: function (value, data, index) {
        return value ? moment(value).format("DD MMM YYYY") : "-";
      },
    },
    { field: "InternalNoteNo", title: "No. Nota Intern" },
    {
      field: "InternalNoteDate",
      title: "Tanggal Nota Intern",
      formatter: function (value, data, index) {
        return value ? moment(value).format("DD MMM YYYY") : "-";
      },
    },
    { field: "SupplierName", title: "Supplier" },
    {
      field: "Amount",
      title: "Total Bayar",
      formatter: function (value, data, index) {
        return numeral(value).format("0,000.00");
      },
      align: "right",
    },
    { field: "CurrencyCode", title: "Mata Uang" },
    { field: "Remark", title: "Keterangan" },
    {
      field: "DPPVATIsPaid",
      title: "DPPVAT",
      formatter: this.dppvatFormatter.bind(this),
    },
  ];

  fromVerificationColumns = [
    {
      field: "SentDate",
      title: "Tanggal Penyerahan",
      formatter: function (value, data, index) {
        return value ? moment(value).format("DD MMM YYYY") : "-";
      },
    },
    {
      field: "AcceptedDate",
      title: "Tanggal Penerimaan",
      formatter: function (value, data, index) {
        return value ? moment(value).format("DD MMM YYYY") : "-";
      },
    },
    {
      field: "VerificationAcceptedDate",
      title: "Tanggal Verifikasi",
      formatter: function (value, data, index) {
        return value ? moment(value).format("DD MMM YYYY") : "-";
      },
    },
    { field: "InternalNoteNo", title: "No. Nota Intern" },
    {
      field: "InternalNoteDate",
      title: "Tanggal Nota Intern",
      formatter: function (value, data, index) {
        return value ? moment(value).format("DD MMM YYYY") : "-";
      },
    },
    { field: "SupplierName", title: "Supplier" },
    {
      field: "Amount",
      title: "Total Bayar",
      formatter: function (value, data, index) {
        return numeral(value).format("0,000.00");
      },
      align: "right",
    },
    { field: "CurrencyCode", title: "Mata Uang" },
    { field: "Remark", title: "Keterangan" },
   {
      field: "DPPVATIsPaid",
      title: "DPPVAT",
      formatter: this.dppvatFormatter.bind(this),
    },
  ];

  returFromVerificationColumns = [
    {
      field: "VerificationAcceptedDate",
      title: "Tanggal Verifikasi",
      formatter: function (value, data, index) {
        return value ? moment(value).format("DD MMM YYYY") : "-";
      },
    },
    { field: "InternalNoteNo", title: "No. Nota Intern" },
    {
      field: "InternalNoteDate",
      title: "Tanggal Nota Intern",
      formatter: function (value, data, index) {
        return value ? moment(value).format("DD MMM YYYY") : "-";
      },
    },
    { field: "SupplierName", title: "Supplier" },
    {
      field: "Amount",
      title: "Total Bayar",
      formatter: function (value, data, index) {
        return numeral(value).format("0,000.00");
      },
      align: "right",
    },
    { field: "CurrencyCode", title: "Mata Uang" },
    { field: "SendToPurchasingRemark", title: "Alasan" },
    {
      field: "DPPVATIsPaid",
      title: "DPPVAT",
      formatter: this.dppvatFormatter.bind(this),
    },
  ];

  constructor(router, financeService, purchasingService, dialog, permissionHelper) {
    this.service  = financeService;
    this.purchasingService = purchasingService;
    this.router = router;
    this.dialog = dialog;

    this.permissions = permissionHelper.getUserPermissions();
    this.initPermission();

    //this.isVerification = this.activeRole.key == "VERIFICATION";
    this.isRetur = this.activeRole.key == "RETUR";
  }


  initPermission() {
    //this.roles = [VERIFICATION, CASHIER, ACCOUNTING, RETUR];
    this.roles = [CASHIER, ACCOUNTING, RETUR];
    this.accessCount = 0;
    // console.log("this.permissions", this.permissions);
    // console.log("this.roles", this.roles);

    for (let i = this.roles.length - 1; i >= 0; i--) {
      for (let code of this.roles[i].code) {
        if (this.permissions.hasOwnProperty(code)) {
          this.roles[i].hasPermission = true;
          this.accessCount++;
          this.activeRole = this.roles[i];
          // console.log("this.roles[i]", this.roles[i]);
        }
      }
    }

    if (this.permissions.hasOwnProperty("C9")) {
      this.accessCount = 0;
      this.roles = this.roles.map((role) => {
        role.hasPermission = true;
        this.accessCount++;
        return role;
      });
      this.activeRole = this.roles[0];
    }
  }

  changeRole(role) {
    if (role.key !== this.activeRole.key) {
      this.activeRole = role;
      // console.log("this.activeRole",this.activeRole)
      this.tableList.refresh();
    }
  }
  //   changeTable(role) {
  //     this.code = role.key === "CASHIER" ? true : false;
  //   }
  changeTable(role) {
    this.isVerification = role.key == "VERIFICATION";
    this.isRetur = role.key == "RETUR";
    this.tableList.refresh();
  }

  loader = (info) => {
    let order = {};
    // console.log("this.activeRole", this.activeRole);

    let position = 3;
    if (this.activeRole) position = this.activeRole.position;

    if (info.sort) order[info.sort] = info.order;
    let arg = {
      page: parseInt(info.offset / info.limit, 10) + 1,
      size: info.limit,
      keyword: info.search,
      order: order,
      position: position, // VERIFICATION_DIVISION
    };

    return this.service.search(arg).then((result) => {
      return {
        total: result.info.total,
        data: result.data,
      };
    });
  };

  contextShowCallback(index, name, data) {
    switch (name) {
      case "Rincian":
        switch (this.activeRole.key) {
          case "RETUR":
            return data.ReturnDetailExist === true ? true : false;
          default:
            return false;
        }
        //sebelumnya hapus
      case "Retur":
        switch (this.activeRole.key) {
          case "RETUR":
            return false;
          default:
            const inNo = String(data.InternalNoteNo).trim();
            const isPaid = this.paidINNos
              ? this.paidINNos.has(inNo)
              : false;
            return !isPaid;
        }
    }
  }

async attached() {
  try {
    const result = await this.purchasingService.getPurchasing();
    
    this.paidINNos = new Set(
      (result || []).map(x => String(x).trim())
    );
  } catch (error) {
    this.paidINNos = new Set();
  }
}

  contextClickCallback(event) {
    let arg = event.detail;
    let data = arg.data;
    switch (arg.name) {
      case "Retur":
        switch (this.activeRole.key) {
          case "VERIFICATION":
            this.service
              .voidVerification(data.Id)
              .then((result) => {
                this.tableList.refresh();
              })
              .catch((e) => {
                this.error = e;
              });
            break;
          case "CASHIER":
            this.dialog.show(CashierReason, {message: "Silakan masukkan alasan retur:" })
              .then(response => {
                if (!response.wasCancelled) {
                  const remark = response.output;
                  if (!remark || String(remark).trim() === "") {
                    alert('Alasan tidak boleh kosong.');
                    return;
                  }
                  this.service
                    .sendToPurchasingRejected(data.Id, String(remark).trim())
                    .then((result) => {
                      this.tableList.refresh();
                    })
                    .catch((e) => {
                      this.error = e;
                    });
                }
              });
            break;
          case "ACCOUNTING":
            this.service
              .voidAccounting(data.Id)
              .then((result) => {
                this.tableList.refresh();
              })
              .catch((e) => {
                this.error = e;
              });
            break;
          case "RETUR":
            this.service
              .voidRetur(data.Id)
              .then((result) => {
                this.tableList.refresh();
              })
              .catch((e) => {
                this.error = e;
              });
            break;
          default:
            break;
        }
        break;
      case "Rincian":
        switch (this.activeRole.key) {
          case "RETUR":
            this.router.navigateToRoute("view", { id: data.Id });
            break;
        }
    }
  }

  create() {
    this.router.navigateToRoute("create");
  }
}
