import { inject, useView } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
@useView('./reject-reason-dialog.html')
export class RejectReasonDialog {
    constructor(controller) {
        this.controller = controller;
        this.error = {};
        this.reason = '';
    }

    activate(data) {
        this.title = (data && data.title) || 'Reject Verifikasi';
        this.reason = (data && data.reason) || '';
        this.error = {};
    }

    submit() {
        const reason = (this.reason || '').trim();
        if (!reason) {
            this.error.reason = 'Alasan reject harus diisi';
            return;
        }

        this.error = {};
        this.controller.ok(reason);
    }
}
