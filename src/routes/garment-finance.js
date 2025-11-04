const { PLATFORM } = require('aurelia-pal');

module.exports = [
  {
    route: '/garment-finance/garment-purchasing-to-verification',
    name: 'garment-purchasing-to-verification',
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-purchasing-to-verification/index', 'garment-finance'),
    nav: true,
    title: 'Ekspedisi Penyerahan ke Verifikasi',
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      // permission: { "B11": 1, "C9": 1, "PG": 1, "APG": 1 },
      permission: { "J1": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
  {
    route: '/garment-finance/garment-purchasing-document-expedition-acceptance',
    name: 'garment-purchasing-document-expedition-acceptance',
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-purchasing-document-expedition-acceptance/index', 'garment-finance'),
    nav: true,
    title: 'Penerimaan Dokumen Pembelian Garment',
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      // permission: { "B13": 1, "C9": 1, "B12": 1, "B11": 1, "PG": 1, "APG": 1, "B9": 1, "B4": 1, "B1": 1 },
      permission: { "J2": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
  {
    route: '/garment-finance/garment-purchasing-verification',
    name: 'garment-purchasing-verification',
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-purchasing-verification/index', 'garment-finance'),
    nav: true,
    title: 'Verifikasi Nota Intern',
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      // permission: { "B13": 1, "C9": 1, "B9": 1 },
      permission: { "J3": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
  //====>dokumen intelegent AI <====//
{
    route: "/garment-finance/verification-ni-and-po",
    name: "verification-ni-and-po",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/verification-ni-and-po/index', 'garment-finance'),
    nav: true,
    title: "Verifikasi NI dan PO",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      // permission: { "C9": 1, "PG": 7 },
      permission: { "J52": 1 },
      iconClass: "fa fa-dashboard",
    },
  },
{
    route: "/garment-finance/verification-ni-and-sj",
    name: "verification-ni-and-sj",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/verification-ni-and-sj/index', 'garment-finance'),
    nav: true,
    title: "Verifikasi NI dan SJ",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      permission: { "J53": 1 },
      iconClass: "fa fa-dashboard",
    },
  },
  {
    route: "/garment-finance/verification-ni-and-inext",
    name: "verification-ni-and-inext",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/verification-ni-and-inext/index', 'garment-finance'),
    nav: true,
    title: "Verifikasi NI dan Invoice External Garment",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      permission: { "J54": 1 },
      iconClass: "fa fa-dashboard",
    },
  },
{
    route: '/garment-finance/garment-purchasing-expedition-report',
    name: 'garment-purchasing-expedition-report',
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-purchasing-expedition-report/index', 'garment-finance'),
    nav: true,
    title: 'Laporan Ekspedisi Pembelian Garment',
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      // permission: { "B13": 1, "C9": 1, "B12": 1, "B11": 1, "PG": 1, "APG": 1, "B9": 1, "B4": 1, "B1": 1 },
      permission: { "J4": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
  {
    route: "/garment-finance/dpp-vat-bank-expenditure-note",
    name: "garment-finance-dpp-vat-bank-expenditure-note",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/dpp-vat-bank-expenditure-note/index', 'garment-finance'),
    nav: true,
    title: "Bukti Pengeluaran Bank DPP + PPN",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      // permission: { "C9": 1, "B4": 1, "B11": 1 },
      permission: { "J5": 1 },
      iconClass: 'fa fa-dashboard'
    },
  },
  {
    route: "/garment-finance/garment-bank-expenditure-note-dpp-ppn-report",
    name: "garment-bank-expenditure-note-dpp-ppn-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-bank-expenditure-note-dpp-ppn-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Bukti Pengeluaran Bank DPP + PPN",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      // permission: { "C9": 1, "B4": 1, "B11": 1 },
      permission: { "J6": 1 },
      iconClass: 'fa fa-dashboard'
    },
  },
  {
    route: "/garment-finance/garment-purchasing-pph-bank-expenditure-note",
    name: "garment-purchasing-pph-bank-expenditure-note",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-purchasing-pph-bank-expenditure-note/index', 'garment-finance'),
    nav: true,
    title: "Pengajuan Pembayaran PPH",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      // permission: { "C9": 1, "B4": 1, "B11": 1 },
      permission: { "J7": 1 },
      iconClass: "fa fa-dashboard",
    },
  },
  {
    route: "/garment-finance/garment-pph-bank-expenditure-note-report",
    name: "garment-pph-bank-expenditure-note-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-pph-bank-expenditure-note-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Pengajuan Pembayaran PPH",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi ni",
      // permission: { "C9": 1, "B4": 1, "B11": 1 },
      permission: { "J8": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
  {
    route: "/garment-finance/garment-disposition-to-verification",
    name: "garment-disposition-to-verification",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-disposition-to-verification/index', 'garment-finance'),
    nav: true,
    title: "Ekspedisi Penyerahan Disposisi ke Verifikasi",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi disposisi",
      // permission: {
      //   PG: 1,
      //   APG: 1,
      //   C9: 1,
      // },
      permission: { "J9": 1 },
      iconClass: "fa fa-clone",
    }
  },
  {
    route: "/garment-finance/garment-disposition-verification",
    name: "garment-disposition-verification",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-disposition-verification/index', 'garment-finance'),
    nav: true,
    title: "Verifikasi Disposisi Garment",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi disposisi",
      // permission: {
      //   B9: 1,
      //   B13: 1,
      //   B4: 1,
      //   B11: 1,
      //   C9: 1,
      // },
      permission: { "J10": 1 },
      iconClass: "fa fa-clone",
    },
  },
  {
    route: "garment-finance/garment-disposition-document-expedition-acceptance",
    name: "garment-disposition-document-expedition-acceptance",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-disposition-document-expedition-acceptance/index', 'garment-finance'),
    nav: true,
    title: "Penerimaan Dokumen Disposisi Pembayaran",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi disposisi",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "C9": 1, "PG": 1, "APG": 1 },
      permission: { "J11": 1 },
      iconClass: "fa fa-dashboard",
    },
  },
  // {
  //   route: "/garment-finance/reports/garment-down-payment",
  //   name: "garment-down-payment",
  //   moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/garment-down-payment/index', 'garment-finance'),
  //   nav: true,
  //   title: "Laporan Uang Muka",
  //   auth: true,
  //   settings: {
  //     group: "g-finance",
  //     subGroup: "ekspedisi disposisi",
  //     permission: {
  //       P1: 1,
  //       P2: 1,
  //       P3: 1,
  //       P4: 1,
  //       P5: 1,
  //       P6: 1,
  //       P7: 1,
  //       PI: 1,
  //       PG: 1,
  //       PK: 1,
  //       C9: 1,
  //     },
  //     iconClass: "fa fa-clone",
  //   }
  // },
  {
    route: "/garment-finance/payment-disposition-note",
    name: "payment-disposition-note",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/payment-disposition-note/index', 'garment-finance'),
    nav: true,
    title: "Bukti Pembayaran Disposisi",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi disposisi",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "C9": 1 },
      permission: { "J12": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/reports/garment-disposition-payment-expedition",
    name: "garment-disposition-payment-expedition-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/garment-disposition-payment-expedition/index', 'garment-finance'),
    nav: true,
    title: "Laporan Ekspedisi Disposisi Pembayaran",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi disposisi",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J13": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/reports/down-payment-report",
    name: "down-paymant-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/down-payment-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Uang Muka",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi disposisi",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J14": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "/garment-finance/garment-purchasing-debt-balance",
    name: "garment-purchasing-debt-balance",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-purchasing-debt-balance/index', 'garment-finance'),
    nav: true,
    title: "Kartu Hutang",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report",
      // permission: { "C9": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1 },
      permission: { "J16": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
  {
    route: "/garment-finance/reports/garment-debt-balance-local",
    name: "garment-debt-balance-local",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/garment-debt-balance-local/index', 'garment-finance'),
    nav: true,
    title: "Saldo Hutang Lokal",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report",
      // permission: { "B13": 1, "C9": 1 , "B4": 1, "B11": 1, "B1": 1, "B12": 1},
      permission: { "J17": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
  {
    route: "/garment-finance/reports/garment-purchasing-debt-balance-local-foreign",
    name: "garment-purchasing-debt-balance-local-foreign",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/garment-purchasing-debt-balance-local-foreign/index', 'garment-finance'),
    nav: true,
    title: "Saldo Hutang Lokal Valas",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report",
      // permission: { "B13": 1, "C9": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1 },
      permission: { "J18": 1 },      
      iconClass: 'fa fa-dashboard'
    }
  },
  {
    route: "/garment-finance/reports/garment-debt-balance-import",
    name: "garment-debt-balance-import",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/garment-debt-balance-import/index', 'garment-finance'),
    nav: true,
    title: "Saldo Hutang Impor",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report",
      // permission: { "B13": 1, "C9": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1 },
      permission: { "J19": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
  {
    route: "/garment-finance/reports/garment-debt-detail-report",
    name: "garment-debt-detail-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/garment-debt-detail-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Rincian Hutang",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report",
      // permission: { "B13": 1, "C9": 1 , "B4": 1, "B11": 1, "B1": 1, "B12": 1},
      permission: { "J20": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
  // {
  //     route: '/garment-finance/garment-purchasing-expedition-report',
  //     name: 'garment-purchasing-expedition-report',
  //     moduleId: PLATFORM.moduleName('./modules/garment-finance/garment-purchasing-expedition-report/index', 'garment-finance'),
  //     nav: true,
  //     title: 'Laporan Ekspedisi Pembelian Garment',
  //     auth: true,
  //     settings: {
  //         group: "g-finance",
  //         permission: { "B13": 1, "C9": 1 },
  //         iconClass: 'fa fa-dashboard'
  //     }
  // },
  {
    route: "garment-finance/bank-cash/bank-cash-receipts",
    name: "bank-cash-receipts",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/bank-cash-receipts/index', 'garment-finance'),
    nav: true,
    title: "Penerimaan Kas Bank",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J21": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/bank-cash/bank-cash-receipt-details-memo",
    name: "bank-cash-receipt-details",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/bank-cash-receipt-details-memo/index', 'garment-finance'),
    nav: true,
    title: "Rincian Penerimaan Kas Bank - Export",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J22": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/bank-cash/report/debtor-card-report",
    name: "debtor-card-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/report/debtor-card-report/index', 'garment-finance'),
    nav: true,
    title: "Report Kartu Debitur Export",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J27": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/reports/export-sales-debtor-report",
    name: "export-sales-debtor-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/export-sales-debtor-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Debitur Penjualan Export",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J28": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/reports/export-sales-debtor-IDR-report",
    name: "export-sales-debtor-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/export-sales-debtor-IDR-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Debitur Penjualan Export (IDR)",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J29": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/reports/export-sales-debtor-summary-report",
    name: "export-sales-debtor-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/export-sales-debtor-summary-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Saldo Akhir Debitur Penjualan Export ",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J30": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/adjustments",
    name: "memorials",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/adjustment/index', 'garment-finance'),
    nav: true,
    title: "Jurnal Penyesuaian",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "kas bank",
      //permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: {"J50":1},
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/memorials",
    name: "memorials",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/memorial/index', 'garment-finance'),
    nav: true,
    title: "Memorial",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J23": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/bank-cash/memorial-detail",
    name: "memorial-details",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/memorial-detail/index', 'garment-finance'),
    nav: true,
    title: "Rincian Memorial - Export",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J24": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/report/export-sales-journal",
    name: "export-sales-journal",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/report/export-sales-journal/index', 'garment-finance'),
    nav: true,
    title: "Jurnal Penjualan Export",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      //permission: { "J31": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
      route: "garment-finance/local-sales-note-approval",
      name: "garment-finance/local-sales-note-approval",
      moduleId: "modules/garment-finance/local-sales-note-approval/index",
      nav: true,
      title: "Approval Penjualan Lokal",
      auth: true,
      settings: {
          group: "g-finance",
          subGroup: "approval",
          // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
          permission: { "J40": 1 },
          iconClass: "fa fa-dashboard"
      }
  },
  {
    route: "garment-finance/bank-cash/bank-cash-receipt-detail-locals",
    name: "bank-cash-receipt-detail-locals",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/bank-cash-receipt-detail-locals/index', 'garment-finance'),
    nav: true,
    title: "Rincian Penerimaan Kas Bank - Lokal",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J25": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/memorial-detail-local",
    name: "memorial-details-local",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/memorial-detail-local/index', 'garment-finance'),
    nav: true,
    title: "Rincian Memorial - Lokal",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J26": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/reports/export-sales-outstanding-report",
    name: "export-sales-outstanding",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/export-sales-outstanding-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Outstanding Penjualan Export ",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J32": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/report/bank-cash-receipt-monthly-recap",
    name: "bank-cash-receipt-monthly-recap",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/report/bank-cash-receipt-monthly-recap/index', 'garment-finance'),
    nav: true,
    title: "Rekap Memo per Bulan - Export",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J33": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/bank-cash/report/local-debtor-card-report",
    name: "local-debtor-card-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/report/local-debtor-card-report/index', 'garment-finance'),
    nav: true,
    title: "Report Kartu Debitur Lokal",
    auth: true,
      settings: {
          group: "g-finance",
          subGroup: "report kas bank",
          // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
          permission: { "J34": 1 },
          iconClass: "fa fa-dashboard"
      }
  },
  {
    route: "garment-finance/report/local-bank-cash-receipt-monthly-recap",
    name: "local-bank-cash-receipt-monthly-recap",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/report/local-bank-cash-receipt-monthly-recap/index', 'garment-finance'),
    nav: true,
    title: "Rekap Memo per Bulan - Lokal",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J35": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/report/local-sales-journal",
    name: "local-sales-journal",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/report/local-sales-journal/index', 'garment-finance'),
    nav: true,
    title: "Jurnal Penjualan Lokal",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      //permission: { "J36": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/report/local-sales-debtor-report",
    name: "local-sales-debtor-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/local-sales-debtor-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Debitur Penjualan Lokal",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J37": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/report/local-sales-debtor-summary-report",
    name: "local-sales-debtor-summary-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/report/local-sales-debtor-summary-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Saldo Akhir Debitur Penjualan Lokal",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J38": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/reports/local-sales-outstanding-report",
    name: "local-sales-outstanding",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/bank-cash/report/local-outstanding-sales-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Outstanding Penjualan Lokal ",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "report kas bank",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J39": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "garment-finance/reports/garment-monitoring-disposition-payment",
    name: "down-paymant-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/garment-monitoring-disposition-payment/index', 'garment-finance'),
    nav: true,
    title: "Laporan Bukti Pembayaran Disposisi",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi disposisi",
      // permission: { "B9": 1, "B13": 1, "B4": 1, "B11": 1, "B1": 1, "B12": 1, "PG": 1, "APG": 1, "C9": 1 },
      permission: { "J15": 1 },
      iconClass: "fa fa-dashboard",
    }
  },
  {
    route: "/garment-finance/reports/garment-disposition-by-invoice-report",
    name: "garment-disposition-by-invoice-report",
    moduleId: PLATFORM.moduleName('./modules/garment-finance/reports/garment-disposition-by-invoice-report/index', 'garment-finance'),
    nav: true,
    title: "Laporan Disposisi Pembayaran per Invoice",
    auth: true,
    settings: {
      group: "g-finance",
      subGroup: "ekspedisi disposisi",
      // permission: { "B13": 1, "C9": 1 , "B4": 1, "B11": 1, "B1": 1, "B12": 1},
      permission: { "J51": 1 },
      iconClass: 'fa fa-dashboard'
    }
  },
]
