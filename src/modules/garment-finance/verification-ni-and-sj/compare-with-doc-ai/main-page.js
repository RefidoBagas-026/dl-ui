import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class MainPage {
  constructor(router) {
    this.router = router;
  }

  cancel(event) {
    var r = confirm("Apakah anda yakin akan keluar?");
    if (r == true) {
      this.router.navigateToRoute('list');
    }
  }
}
