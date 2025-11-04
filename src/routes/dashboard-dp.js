const { PLATFORM } = require('aurelia-pal');

module.exports = [
    {
        route: "/dashboard-dp/main",
        name: "Daily Operation Mesin - Unggah File",
        moduleId: PLATFORM.moduleName('./modules/dashboard-dp/main/index', 'dashboard-dp'),
        nav: true,
        title: "Unggah File",
        auth: true,
        settings: {
          group: "daily-operation-mesin",
          permission: { C9: 1, B1: 1, B12: 1 },
          iconClass: "fa fa-dashboard",
        },
    },
]