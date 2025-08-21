import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class Create {
    constructor(router) {
        this.router = router;
    }

    bind() {
        // data awal kosong; detail akan muncul saat invoice dipilih di autocomplete
        this.data = {};
        this.error = {};
    }

    cancel(event) {
        if (confirm(`Apakah Anda yakin akan kembali?`))
            this.router.navigateToRoute('list');
    }

    save(event) {
        // belum ada implementasi logic pengecekan, tombol ini hanya placeholder
    }
}