const { PLATFORM } = require('aurelia-pal');

module.exports = [
    {
        route: ['', 'Welcome'],
        name: 'welcome',
        moduleId: PLATFORM.moduleName('./welcome', 'general'),
        nav: false,
        title: 'Home',
        auth: true,
        settings: {
            permission: { "*": 0 }

        }
    }
    ]
