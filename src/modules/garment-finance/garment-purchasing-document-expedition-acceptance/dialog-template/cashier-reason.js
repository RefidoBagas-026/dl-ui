import { inject, useView } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
@useView('./cashier-reason.html')
export class CashierReason {
  constructor(controller) {
    this.controller = controller;
    this.remark = '';
  }

  activate(data) {
    this.title = data.title || 'Alasan';
    this.message = data.message || '';
  }
}
