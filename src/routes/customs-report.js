const { PLATFORM } = require('aurelia-pal');

module.exports = [
    {
        route: '/customs-report/customs-report-in',
        name: 'customs-report-in',
        moduleId: PLATFORM.moduleName('./modules/customs-report/customs-report-in/index', 'customs-report'),
        nav: true,
        title: 'Laporan Pemasukan Barang per Dokumen Pabean',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: '/customs-report/customs-report-out',
        name: 'customs-report-out',
        moduleId: PLATFORM.moduleName('./modules/customs-report/customs-report-out/index', 'customs-report'),
        nav: true,
        title: 'Laporan Pengeluaran Barang per Dokumen Pabean',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: '/customs-report/wip',
        name: 'customs-report',
        moduleId: PLATFORM.moduleName('./modules/customs-report/wip/index', 'customs-report'),
        nav: true,
        title: 'Laporan Posisi WIP',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }

    },
    {
        route: '/customs-report/fact-item-mutation-bb-central',
        name: 'customs-report-item-mutation-bb-central',
        moduleId: PLATFORM.moduleName('./modules/customs-report/fact-item-mutation-bb-central/index', 'customs-report'),
        nav: true,
        title: 'Laporan Pertanggungjawaban Mutasi Bahan Baku Pusat',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }

    },
    {
        route: '/customs-report/fact-item-mutation-bb-unit',
        name: 'customs-report-item-mutation-bb-unit',
        moduleId: PLATFORM.moduleName('./modules/customs-report/fact-item-mutation-bb-unit/index', 'customs-report'),
        nav: true,
        title: 'Laporan Pertanggungjawaban Mutasi Bahan Baku Unit',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }

    },
    {
        route: '/customs-report/fact-item-mutation-bp-central',
        name: 'customs-report-item-mutation-bp-central',
        moduleId: PLATFORM.moduleName('./modules/customs-report/fact-item-mutation-bp-central/index', 'customs-report'),
        nav: true,
        title: 'Laporan Pertanggungjawaban Mutasi Bahan Penolong Pusat',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }

    },
    {
        route: '/customs-report/fact-item-mutation-bp-unit',
        name: 'customs-report-item-mutation-bp-unit',
        moduleId: PLATFORM.moduleName('./modules/customs-report/fact-item-mutation-bp-unit/index', 'customs-report'),
        nav: true,
        title: 'Laporan Pertanggungjawaban Mutasi Bahan Penolong Unit',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }

    },
    {
        route: '/customs-report/finished-good',
        name: 'customs-report-finished-good',
        moduleId: PLATFORM.moduleName('./modules/customs-report/finished-good/index', 'customs-report'),
        nav: true,
        title: 'Laporan Pertanggungjawaban Mutasi Barang Jadi',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }

    },
    {
        route: '/customs-report/machine-mutation',
        name: 'customs-report',
        moduleId: PLATFORM.moduleName('./modules/customs-report/machine-mutation/index', 'customs-report'),
        nav: true,
        title: 'Laporan Pertanggungjawaban Mutasi Mesin dan Peralatan',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }

    },
    {
        route: '/customs-report/scrap',
        name: 'customs-report-scrap',
        moduleId: PLATFORM.moduleName('./modules/customs-report/scrap/index', 'customs-report'),
        nav: true,
        title: 'Laporan Pertanggungjawaban Barang Reject dan Scrap',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }

    },
     {
        route: '/customs-report/cctv',
        name: 'customs-report-cctv',
        moduleId: PLATFORM.moduleName('./modules/customs-report/cctv/index', 'customs-report'),
        nav: true,
        title: 'CCTV',
        auth: true,
        settings: {
            group: "customs-report",
            //permission: { "C5": 1, "C9": 1 },
            iconClass: 'fa fa-dashboard'
        }

    }
]
