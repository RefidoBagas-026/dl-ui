import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service as InternNoteService } from '../service';

@inject(InternNoteService, Router)
export class View {
  search = '';
  selectedData = null;
  loading = false;
  searchTimeout = null;
  expandedInvoice = null;

  constructor(service, router) {
    this.service = service;
    this.router = router;
  }

  activate(params) {
    this.id = params.id;
    // Tambahkan logic pengambilan data berdasarkan id di sini
  }

  searchChanged() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    if (!this.search || this.search.length < 3) {
      this.selectedData = null;
      this.loading = false;
      return;
    }
    this.loading = true;
    this.searchTimeout = setTimeout(() => {
      this.service.search({
        page: 1,
        size: 1,
        keyword: this.search
      }).then(result => {
        let data = null;
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data[0];
          } else {
            data = result.data;
          }
        }
        if (data && data.Id) {
          // Otomatis ambil detail lengkap setelah pencarian sukses
          this.service.getById(data.Id).then(detailResult => {
            if (detailResult && detailResult.data) {
              this.selectedData = detailResult.data;
            } else {
              this.selectedData = data;
            }
            this.loading = false;
          }).catch(() => {
            this.selectedData = data;
            this.loading = false;
          });
        } else {
          this.selectedData = null;
          this.loading = false;
        }
      }).catch(() => {
        this.selectedData = null;
        this.loading = false;
      });
    }, 300);
  }

  toggleDetail(inv) {
    this.expandedInvoice = this.expandedInvoice === inv ? null : inv;
  }

  showDetail(inv) {
    if (!inv || !inv.garmentInvoice || !inv.garmentInvoice.Id) return;
    this.loading = true;
    // Ambil data detail lengkap berdasarkan ID Nota Intern (selectedData.Id)
    this.service.getById(this.selectedData.Id)
      .then(result => {
        if (result && result.data) {
          this.selectedData = result.data;
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  }

  navigate() {
    this.router.navigateToRoute('main-page');
  }
}
