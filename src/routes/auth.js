const { PLATFORM } = require('aurelia-pal');

module.exports = [
    {
        route: 'auth/accounts',
        name: 'accounts',
        moduleId: PLATFORM.moduleName('./modules/auth/account/index', 'auth'),
        nav: true,
        title: 'Account',
        auth: true,
        settings: {
            group: "Auth",
            permission : {"A1":1},
            //permission : {"*":1},
            iconClass: 'fa fa-dashboard'
        }
    },
  
    // {
    //     route: 'auth/roles',
    //     name: 'roles',
    //     moduleId: PLATFORM.moduleName('./modules/auth/role/index', 'auth'),
    //     nav: true,
    //     title: 'Role',
    //     auth: true,
    //     settings: {
    //         group: "Auth",
    //         permission : {"A2":1},
    //         //permission : {"*":1},
    //         iconClass: 'fa fa-dashboard'
    //     }
    // },

    {
        route: 'auth/roles2',
        name: 'roles2',
        moduleId: PLATFORM.moduleName('./modules/auth/role2/index', 'auth'),
        nav: true,
        title: 'Role',
        auth: true,
        settings: {
            group: "Auth",
            permission : {"A2":1},
            //permission : {"*":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'auth/menu',
        name: 'menu',
        moduleId: PLATFORM.moduleName('./modules/auth/menu/index', 'auth'),
        nav: true,
        title: 'Menu',
        auth: true,
        settings: {
            group: "Auth",
            permission : {"A3":1},
            //permission : {"*":1},
            iconClass: 'fa fa-dashboard'
        }
    },
    {
        route: 'auth/monitoring-account',
        name: 'monitoring-account',
        moduleId: PLATFORM.moduleName('./modules/auth/monitoring-account/index', 'auth'),
        nav: true,
        title: 'Monitoring Account',
        auth: true,
        settings: {
            group: "Auth",
            permission : {"A4":1},
            //permission : {"*":1},
            iconClass: 'fa fa-dashboard'
        }
    }
]
