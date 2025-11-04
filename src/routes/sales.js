const { PLATFORM } = require('aurelia-pal');

module.exports = [
    {
        route: 'sales/finishing-printing-pre-sales-contract',
        name: 'finishing-printing-sales-pre-contract',
        moduleId: PLATFORM.moduleName('./modules/sales/finishing-printing-pre-sales-contract/index', 'sales'),
        nav: true,
        title: 'Pre Sales Contract - Dyeing & Printing',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F1":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/finishing-printing-cost-calculation',
        name: 'finishing-printing-cost-calculation',
        moduleId: PLATFORM.moduleName('./modules/sales/finishing-printing-cost-calculation/index', 'sales'),
        nav: true,
        title: 'Cost Calculation - Dyeing & Printing',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F2":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/finishing-printing-cost-calculation-approval-ppic',
        name: 'finishing-printing-cost-calculation-approval-ppic',
        moduleId: PLATFORM.moduleName('./modules/sales/finishing-printing-cost-calculation-approval-ppic/index', 'sales'),
        nav: true,
        title: 'Cost Calculation - Dyeing & Printing - Approval PPIC',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F3":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/finishing-printing-cost-calculation-approval-md',
        name: 'finishing-printing-cost-calculation-approval-md',
        moduleId: PLATFORM.moduleName('./modules/sales/finishing-printing-cost-calculation-approval-md/index', 'sales'),
        nav: true,
        title: 'Cost Calculation - Dyeing & Printing - Approval Md',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F4":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: '/sales/finishing-printing-cost-calculation-copy',
        name: 'finishing-printing-cost-calculation-copy',
        moduleId: PLATFORM.moduleName('./modules/sales/finishing-printing-cost-calculation/copy/index', 'sales'),
        nav: true,
        title: 'Copy Cost Calculation - Dyeing & Printing',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F5":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: '/sales/shin-finishing-printing-sales-contract-copy',
        name: 'shin-finishing-printing-sales-contract-copy',
        moduleId: PLATFORM.moduleName('./modules/sales/shin-finishing-printing-sales-contract/copy/index', 'sales'),
        nav: true,
        title: 'Copy Sales Contract - Dyeing & Printing',
        auth: true,
        settings: {
            group: "sales",
            // permission: { /*"A2": 1,*/ "C9": 1 },
            permission :{"F6":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/shin-finishing-printing-sales-contract',
        name: 'shin-finishing-printing-sales-contract',
        moduleId: PLATFORM.moduleName('./modules/sales/shin-finishing-printing-sales-contract/index', 'sales'),
        nav: true,
        title: 'Sales Contract - Dyeing & Printing (New)',
        auth: true,
        settings: {
            group: "sales",
            // permission: { /*"A2": 1,*/ "C9": 1 },
            permission :{"F7":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    // {
    //     route: 'sales/reports/shin-finishing-printing-sales-contract-reports',
    //     name: 'shin-finishing-printing-sales-contract-report',
    //     moduleId: PLATFORM.moduleName('./modules/sales/reports/shin-finishing-printing-sales-contract-report/index', 'sales'),
    //     nav: true,
    //     title: 'Laporan Sales Contract - Dyeing & Printing (New)',
    //     auth: true,
    //     settings: {
    //         group: "sales",
    //         permission: { "A2": 1, "C9": 1 },
    //         iconClass: 'fa fa-dashboard'
    //     }
    // },
    {
        route: 'sales/finishing-printing-sales-contract',
        name: 'finishing-printing-sales-contract',
        moduleId: PLATFORM.moduleName('./modules/sales/finishing-printing-sales-contract/index', 'sales'),
        nav: true,
        title: 'Sales Contract - Dyeing & Printing',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F8":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/reports/finishing-printing-sales-contract-reports',
        name: 'finishing-printing-sales-contract-report',
        moduleId: PLATFORM.moduleName('./modules/sales/reports/finishing-printing-sales-contract-report/index', 'sales'),
        nav: true,
        title: 'Laporan Sales Contract - Dyeing & Printing',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F9":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/weaving-sales-contract',
        name: 'weaving-sales-contract',
        moduleId: PLATFORM.moduleName('./modules/sales/weaving-sales-contract/index', 'sales'),
        nav: true,
        title: 'Sales Contract - Weaving',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F10":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/spinning-sales-contract',
        name: 'spinning-sales-contract',
        moduleId: PLATFORM.moduleName('./modules/sales/spinning-sales-contract/index', 'sales'),
        nav: true,
        title: 'Sales Contract - Spinning',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F11":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/delivery-note-production',
        name: 'delivery-note-production',
        moduleId: PLATFORM.moduleName('./modules/sales/delivery-note-production/index', 'sales'),
        nav: true,
        title: 'Surat Order Produksi - Spinning',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F12":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/reports/weaving-sales-contract-reports',
        name: 'weaving-sales-contract-report',
        moduleId: PLATFORM.moduleName('./modules/sales/reports/weaving-sales-contract-report/index', 'sales'),
        nav: true,
        title: 'Laporan Sales Contract - Weaving',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F13":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/reports/spinning-sales-contract-reports',
        name: 'spinning-sales-contract-report',
        moduleId: PLATFORM.moduleName('./modules/sales/reports/spinning-sales-contract-report/index', 'sales'),
        nav: true,
        title: 'Laporan Sales Contract - Spinning',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F14":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/shin-production-order',
        name: 'shin-production-order',
        moduleId: PLATFORM.moduleName('./modules/sales/shin-production-order/index', 'sales'),
        nav: true,
        title: 'Surat Perintah Produksi (New)',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F15":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/shin-production-order-list-view',
        name: 'shin-production-order-list-view',
        moduleId: PLATFORM.moduleName('./modules/sales/shin-production-order-list-view/index', 'sales'),
        nav: true,
        title: 'Surat Perintah Produksi (New) All User',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F16":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/shin-production-order-approval-md',
        name: 'shin-production-order-approval-md',
        moduleId: PLATFORM.moduleName('./modules/sales/shin-production-order-approval-md/index', 'sales'),
        nav: true,
        title: 'Validasi Surat Perintah Produksi (New) - Kabag Md',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F17":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/shin-production-order-approval-sample',
        name: 'shin-production-order-approval-sample',
        moduleId: PLATFORM.moduleName('./modules/sales/shin-production-order-approval-sample/index', 'sales'),
        nav: true,
        title: 'Validasi Surat Perintah Produksi (New) - Sample',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F18":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/production-order',
        name: 'production-order',
        moduleId: PLATFORM.moduleName('./modules/sales/production-order/index', 'sales'),
        nav: true,
        title: 'Surat Perintah Produksi',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F19":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/production-order-list-view',
        name: 'production-order-list-view',
        moduleId: PLATFORM.moduleName('./modules/sales/production-order-list-view/index', 'sales'),
        nav: true,
        title: 'Surat Perintah Produksi All User',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "F1": 1, "F2": 1, "C9": 1 },
            permission :{"F20":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/reports/production-order-reports',
        name: 'production-order-report',
        moduleId: PLATFORM.moduleName('./modules/sales/reports/production-order-report/index', 'sales'),
        nav: true,
        title: 'Monitoring Surat Perintah Produksi',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F21":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/do-sales',
        name: 'do-sales',
        moduleId: PLATFORM.moduleName('./modules/sales/do-sales/index', 'sales'),
        nav: true,
        title: 'DO Penjualan',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F22":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/do-stock',
        name: 'do-stock',
        moduleId: PLATFORM.moduleName('./modules/sales/do-stock/index', 'sales'),
        nav: true,
        title: 'DO Stock',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F23":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/do-aval',
        name: 'do-aval',
        moduleId: PLATFORM.moduleName('./modules/sales/do-aval/index', 'sales'),
        nav: true,
        title: 'DO Aval',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F24":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/sales-invoice',
        name: 'sales-invoice',
        moduleId: PLATFORM.moduleName('./modules/sales/sales-invoice/index', 'sales'),
        nav: true,
        title: 'Faktur Penjualan Lokal',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F25":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/sales-invoice-export',
        name: 'sales-invoice-export',
        moduleId: PLATFORM.moduleName('./modules/sales/sales-invoice-export/index', 'sales'),
        nav: true,
        title: 'Faktur Penjualan Ekspor',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F26":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/do-return',
        name: 'do-return',
        moduleId: PLATFORM.moduleName('./modules/sales/do-return/index', 'sales'),
        nav: true,
        title: 'DO Retur',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F27":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/reports/sales-monthly-reports',
        name: 'sales-monthly-report',
        moduleId: PLATFORM.moduleName('./modules/sales/reports/sales-monthly-report/index', 'sales'),
        nav: true,
        title: 'Sales Monthly Report / Laporan Sales Per Bulan',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F28":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/deal-tracking',
        name: 'deal-tracking',
        moduleId: PLATFORM.moduleName('./modules/sales/deal-tracking/index', 'sales'),
        nav: true,
        title: 'Deal Tracking',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1, "PGA": 1, "PA": 1, "PM": 1, "PE": 1 },
            permission :{"F29":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/order-status-report',
        name: 'order-status-report',
        moduleId: PLATFORM.moduleName('./modules/sales/reports/order-status-report/index', 'sales'),
        nav: true,
        title: 'Laporan Status Order',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F30":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'sales/reports/do-sales-dp-monitoring',
        name: 'do-sales-dp-monitoring',
        moduleId: PLATFORM.moduleName('./modules/sales/reports/do-sales-dp-monitoring/index', 'sales'),
        nav: true,
        title: 'Monitoring DO Penjualan Dyeing Printing',
        auth: true,
        settings: {
            group: "sales",
            // permission: { "A2": 1, "C9": 1 },
            permission :{"F34":1},
            iconClass: 'fa fa-dashboard'
        }
    },
];
