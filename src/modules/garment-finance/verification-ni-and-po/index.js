// index.js
//import './template/custom-table';

export class Index {
  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'view'],
        moduleId: './data-views/view',
        name: 'view',
        nav: false,
        title: 'View: Verification NI and PO'
      },
      {
        route: 'main-page',
        moduleId: './compare-with-doc-ai/main-page',
        name: 'main-page',
        nav: false,
        title: 'Main Page'
      },
    ]);

    this.router = router;
  }
}
