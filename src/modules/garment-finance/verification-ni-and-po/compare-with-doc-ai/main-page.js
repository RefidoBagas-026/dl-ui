import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class MainPage {
  hasCancel = true;
  hasSave = true;

  constructor(router) {
    this.router = router;
  }

  bind() {
    this.error = {};
  }

  // You can add logic here if needed
  cancel(event) {
    var r = confirm("Apakah anda yakin akan keluar?")
    if (r == true) {
      this.router.navigateToRoute('view');
    }
  }

  save(event) {

  }
}
