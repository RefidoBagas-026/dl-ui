const { PLATFORM } = require('aurelia-pal');

module.exports = [{
  route: "weaving/master-yarn-number",
  name: "master-ring",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-yarn-number/index', 'weaving'),
  nav: true,
  title: "Master Nomor Benang",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M1": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-material-type",
  name: "master-material-type",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-material-type/index', 'weaving'),
  nav: true,
  title: "Master Material",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M2": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-yarn-origin",
  name: "master-yarn-origin",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-yarn-origin/index', 'weaving'),
  nav: true,
  title: "Master Asal Benang",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M3": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-yarn",
  name: "master-yarn",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-yarn/index', 'weaving'),
  nav: true,
  title: "Master Benang",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M4": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-machine-type",
  name: "master-machine-type",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-machine-type/index', 'weaving'),
  nav: true,
  title: "Master Tipe Mesin",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M5": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-machine",
  name: "master-machine",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-machine/index', 'weaving'),
  nav: true,
  title: "Master Mesin",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M6": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/shift",
  name: "weaving-shift",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-shift/index', 'weaving'),
  nav: true,
  title: "Master Shift",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M7": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-beam",
  name: "weaving-master-beam",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-beam/index', 'weaving'),
  nav: true,
  title: "Master Beam",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M8": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-defect",
  name: "master-defect",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-defect/index', 'weaving'),
  nav: true,
  title: "Master Cacat Kain",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M9": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-operator",
  name: "master-operator",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-operator/index', 'weaving'),
  nav: true,
  title: "Master Operator",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M10": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-fabric-construction",
  name: "master-fabric-construction",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-fabric-construction/index', 'weaving'),
  nav: true,
  title: "Master Kebutuhan Benang",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M11": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/master-broken-cause-warping",
  name: "master-broken-cause-warping",
  moduleId: PLATFORM.moduleName('./modules/weaving/master-broken-cause-warping/index', 'weaving'),
  nav: true,
  title: "Master Penyebab Putus Warping",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M12": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/order-production",
  name: "order-production",
  moduleId: PLATFORM.moduleName('./modules/weaving/order-production/index', 'weaving'),
  nav: true,
  title: "Surat Perintah Produksi",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M13": 1 },
    iconClass: "fa fa-dashboard"
  }
},
// {
//   route: "weaving/estimated-production",
//   name: "estimated-production",
//   moduleId: PLATFORM.moduleName('./modules/weaving/estimated-production/index', 'weaving'),
//   nav: true,
//   title: "Estimasi Produksi",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M14": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
{
  route: "weaving/order-production-report",
  name: "order-production-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/order-production-report/index', 'weaving'),
  nav: true,
  title: "Laporan Surat Perintah Produksi",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M15": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/machine-planning",
  name: "machine-planning",
  moduleId: PLATFORM.moduleName('./modules/weaving/machine-planning/index', 'weaving'),
  nav: true,
  title: "Perencanaan Mesin",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M16": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/machine-planning-report",
  name: "machine-planning-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/machine-planning-report/index', 'weaving'),
  nav: true,
  title: "Laporan Perencanaan Mesin",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M17": 1 },
    iconClass: "fa fa-dashboard"
  }
},
// {
//   route: "weaving/stock-beam",
//   name: "stock-beam",
//   moduleId: PLATFORM.moduleName('./modules/weaving/stock-beam-upload/index', 'weaving'),
//   nav: true,
//   title: "Laporan Visualisasi Stock Beam",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M18": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/monitoring-trouble-machine",
//   name: "monitoring-trouble-machine",
//   moduleId: PLATFORM.moduleName('./modules/weaving/monitoring-trouble-machine/index', 'weaving'),
//   nav: true,
//   title: "Monitoring Trouble Mesin",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M19": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/daily-operation-warping",
//   name: "daily-operation-warping",
//   moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-warping/index', 'weaving'),
//   nav: true,
//   title: "Daily Operation Mesin Warping",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M20": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },

//GROUPING WEAVING
{
  route: "weaving/daily-operation-warping",
  name: "daily-operation-warping",
  moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-warping/index', 'weaving'),
  nav: true,
  title: "Daily Operation Mesin Warping",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M20": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/warping-productions-report",
  name: "warping-productions-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/warping-productions-report/index', 'weaving'),
  nav: true,
  title: "Laporan Produksi Warping Per Operator",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M22": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/warping-broken-report",
  name: "warping-broken-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/warping-broken-report/index', 'weaving'),
  nav: true,
  title: "Laporan Putus Benang Warping",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M23": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/warping-daily-operation-report",
  name: "warping-daily-operation-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/warping-daily-operation-report/index', 'weaving'),
  nav: true,
  title: "Laporan Operasional Harian Warping",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M21": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/monitoring-trouble-machine",
  name: "monitoring-trouble-machine",
  moduleId: PLATFORM.moduleName('./modules/weaving/monitoring-trouble-machine/index', 'weaving'),
  nav: true,
  title: "Monitoring Trouble Mesin",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M19": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/daily-operation-sizing",
  name: "daily-operation-sizing",
  moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-sizing-new/index', 'weaving'),
  nav: true,
  title: "Operasional Mesin Harian Sizing",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M24": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/warping-SPU-report",
  name: "warping-SPU-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/warping-SPU-report/index', 'weaving'),
  nav: true,
  title: "Laporan SPU",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M26": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/daily-operation-sizing-report",
  name: "daily-operation-sizing",
  moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-sizing-report-new/index', 'weaving'),
  nav: true,
  title: "Laporan Operasional Mesin Harian Sizing",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M25": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/daily-operation-reaching",
  name: "weaving-daily-operation-reaching",
  moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-reaching-upload/index', 'weaving'),
  nav: true,
  title: "Operasional Mesin Harian Reaching",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M27": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/daily-operation-reaching-report",
  name: "weaving-daily-operation-reaching-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/reaching-daily-operation-report/index', 'weaving'),
  nav: true,
  title: "Laporan Operational Harian Reaching",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",
  
    permission: { "M28": 1 },
    iconClass: "fa fa-dashboard"
  }
},


{
  route: "weaving/stock-beam",
  name: "stock-beam",
  moduleId: PLATFORM.moduleName('./modules/weaving/stock-beam-upload/index', 'weaving'),
  nav: true,
  title: "Laporan Visualisasi Stock Beam",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PREPARATION",

    permission: { "M18": 1 },
    iconClass: "fa fa-dashboard"
  }
},










// {
//   route: "weaving/daily-operation-warping",
//   name: "daily-operation-warping",
//   moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-warping/index', 'weaving'),
//   nav: true,
//   title: "Laporan Visualisasi Stock Beam",
//   auth: true,
//   settings: {
//     group: "weaving",
//     subGroup: "PREPARATION",
//     subDetailGroup: "REACHING",
    
//     permission: { "M20": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
{
  route: "weaving/daily-operation-loom",
  name: "weaving-daily-operation-loom",
  moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-loom-upload/index', 'weaving'),
  nav: true,
  title: "Daily Operation Mesin Loom",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PRODUKSI LOOM",
  
    permission: { "M29": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/daily-operation-loom-report",
  name: "weaving-daily-operation-loom-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-loom-report/index', 'weaving'),
  nav: true,
  title: "Laporan Operasional Mesin Harian Loom",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PRODUKSI LOOM",
  
    permission: { "M30": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/estimated-production",
  name: "estimated-production",
  moduleId: PLATFORM.moduleName('./modules/weaving/estimated-production/index', 'weaving'),
  nav: true,
  title: "Estimasi Produksi",
  auth: true,
  settings: {
    group: "weaving",
    subGroup: "PPIC",
  
    permission: { "M14": 1 },
    iconClass: "fa fa-dashboard"
  }
},
//-----------------------



// {
//   route: "weaving/warping-productions-report",
//   name: "warping-productions-report",
//   moduleId: PLATFORM.moduleName('./modules/weaving/warping-productions-report/index', 'weaving'),
//   nav: true,
//   title: "Laporan Produksi Warping Per Operator",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M22": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/warping-daily-operation-report",
//   name: "warping-daily-operation-report",
//   moduleId: PLATFORM.moduleName('./modules/weaving/warping-daily-operation-report/index', 'weaving'),
//   nav: true,
//   title: "Laporan Operasional Harian Warping",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M21": 1 },
//     iconClass: "fa fa-dashboard"
//   }
//  },
// {
//   route: "weaving/daily-operation-warping-report",
//   name: "daily-operation-warping",
//   moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-warping-report/index', 'weaving'),
//   nav: true,
//   title: "Laporan Operasional Mesin Harian Warping",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M21": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/warping-productions-report",
//   name: "warping-productions-report",
//   moduleId: PLATFORM.moduleName('./modules/weaving/warping-productions-report/index', 'weaving'),
//   nav: true,
//   title: "Laporan Produksi Warping Per Operator",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M22": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/warping-broken-report",
//   name: "warping-broken-report",
//   moduleId: PLATFORM.moduleName('./modules/weaving/warping-broken-report/index', 'weaving'),
//   nav: true,
//   title: "Laporan Putus Benang Warping",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M23": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/daily-operation-sizing",
//   name: "daily-operation-sizing",
//   moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-sizing-new/index', 'weaving'),
//   nav: true,
//   title: "Operasional Mesin Harian Sizing",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M24": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/daily-operation-sizing-report",
//   name: "daily-operation-sizing",
//   moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-sizing-report-new/index', 'weaving'),
//   nav: true,
//   title: "Laporan Operasional Mesin Harian Sizing",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M25": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/warping-SPU-report",
//   name: "warping-SPU-report",
//   moduleId: PLATFORM.moduleName('./modules/weaving/warping-SPU-report/index', 'weaving'),
//   nav: true,
//   title: "Laporan SPU",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M26": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/daily-operation-reaching",
//   name: "weaving-daily-operation-reaching",
//   moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-reaching-upload/index', 'weaving'),
//   nav: true,
//   title: "Operasional Mesin Harian Reaching",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M27": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/daily-operation-reaching-report",
//   name: "weaving-daily-operation-reaching-report",
//   moduleId: PLATFORM.moduleName('./modules/weaving/reaching-daily-operation-report/index', 'weaving'),
//   nav: true,
//   title: "Laporan Operasional Mesin Harian Reaching",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M28": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/daily-operation-loom",
//   name: "weaving-daily-operation-loom",
//   moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-loom-upload/index', 'weaving'),
//   nav: true,
//   title: "Operasional Mesin Harian Loom",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M29": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
// {
//   route: "weaving/daily-operation-loom-report",
//   name: "weaving-daily-operation-loom-report",
//   moduleId: PLATFORM.moduleName('./modules/weaving/daily-operation-loom-report/index', 'weaving'),
//   nav: true,
//   title: "Laporan Operasional Mesin Harian Loom",
//   auth: true,
//   settings: {
//     group: "weaving",
//     // permission: {
//     //   W1: 1,
//     //   W2: 1,
//     //   "*": 1
//     // },
//     permission: { "M30": 1 },
//     iconClass: "fa fa-dashboard"
//   }
// },
{
  route: "weaving/production-results",
  name: "production-results",
  moduleId: PLATFORM.moduleName('./modules/weaving/production-results/index', 'weaving'),
  nav: true,
  title: "Hasil Produksi",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M31": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/production-results-report",
  name: "production-results-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/production-results-report/index', 'weaving'),
  nav: true,
  title: "Laporan Hasil Produksi",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M32": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/weaving-efficiency-report",
  name: "weaving-efficiency-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/weaving-efficiency-report/index', 'weaving'),
  nav: true,
  title: "Laporan Efisiensi Weaving",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M33": 1 },
    iconClass: "fa fa-dashboard"
  }
},
{
  route: "weaving/fabric-defect-report",
  name: "fabric-defect-report",
  moduleId: PLATFORM.moduleName('./modules/weaving/fabric-defect-report/index', 'weaving'),
  nav: true,
  title: "Laporan Cacat Kain",
  auth: true,
  settings: {
    group: "weaving",
    // permission: {
    //   W1: 1,
    //   W2: 1,
    //   "*": 1
    // },
    permission: { "M34": 1 },
    iconClass: "fa fa-dashboard"
  }
},
];
