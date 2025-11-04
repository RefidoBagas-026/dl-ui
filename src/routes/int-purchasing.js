const { PLATFORM } = require('aurelia-pal');

module.exports = [
    {
        route: '/int-purchasing/transfer-request',
        name: 'transfer-request',
        moduleId: PLATFORM.moduleName('./modules/int-purchasing/transfer-request/index', 'int-purchasing'),
        nav: true,
        title: 'Transfer Request',
        auth: true,
        settings: {
            group: "int-purchasing",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: '/int-purchasing/transfer-request-report',
        name: 'transfer-request-report',
        moduleId: PLATFORM.moduleName('./modules/int-purchasing/transfer-request-report/index', 'int-purchasing'),
        nav: true,
        title: 'Laporan Transfer Request',
        auth: true,
        settings: {
            group: "int-purchasing",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: ['int-purchasing/internal-transfer-order'],
        name: 'internal-transfer-order',
        moduleId: PLATFORM.moduleName('./modules/int-purchasing/internal-transfer-order/index', 'int-purchasing'),
        nav: true,
        title: 'Transfer Order Internal',
        auth: true,
        settings: {
            group: "int-purchasing",
            //permission: { "C9": 1, "F1": 1, "F2": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: ['int-purchasing/internal-transfer-order-report'],
        name: 'internal-transfer-order',
        moduleId: PLATFORM.moduleName('./modules/int-purchasing/internal-transfer-order-report/index', 'int-purchasing'),
        nav: true,
        title: 'Laporan Transfer Order Internal',
        auth: true,
        settings: {
            group: "int-purchasing",
            //permission: { "C9": 1, "F1": 1, "F2": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: '/int-purchasing/external-transfer-order',
        name: 'external-transfer-order',
        moduleId: PLATFORM.moduleName('./modules/int-purchasing/external-transfer-order/index', 'int-purchasing'),
        nav: true,
        title: 'Transfer Order Eksternal',
        auth: true,
        settings: {
            group: "int-purchasing",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {

        route: ['int-purchasing/transfer-delivery-order'],
        name: 'transfer-delivery-order',
        moduleId: PLATFORM.moduleName('./modules/int-purchasing/transfer-delivery-order/index', 'int-purchasing'),
        nav: true,
        title: 'DO',
        auth: true,
        settings: {
            group: "int-purchasing",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: ['int-purchasing/transfer-shipping-order'],
        name: 'transfer-shipping-order',
        moduleId: PLATFORM.moduleName('./modules/int-purchasing/transfer-shipping-order/index', 'int-purchasing'),
        nav: true,
        title: 'Surat Jalan',
        auth: true,
        settings: {
            group: "int-purchasing",
            //permission: { "C9": 1, "F1": 1, "F2": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
]
