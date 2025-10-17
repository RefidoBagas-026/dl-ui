import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class View {
  constructor(router) {
    this.router = router;
  }

  @bindable data;

  activate(params) {
    this.data = window.listData.find(item => item.Id === Number(params.id));
  }

  cancel() {
    if (confirm('Apakah Anda yakin akan kembali?')) {
      this.router.navigateToRoute('list');
    }
  }

  @computedFrom('data')
  get safeData() {
    return this.data || {};
  }

  @computedFrom('safeData.invoiceNo')
  get highlightDifferencesInvoiceNo() {
    return this.safeData.invoiceNo ? true : false;
  }

  @computedFrom('safeData.isPayVat', 'safeData.useVat')
  get highlightDifferencesTax() {
    return this.safeData.isPayVat && this.safeData.useVat;
  }

  @computedFrom('safeData.isPayVat', 'safeData.useVat')
  get taxComparisonRemark() {
    if (!this.safeData.isPayVat && !this.safeData.useVat) {
      return 'Tidak ada pajak yang digunakan pada transaksi ini';
    }
    if (!this.safeData.isPayVat) {
      return 'Pajak tidak dibayar pada transaksi ini';
    }
    if (!this.safeData.useVat) {
      return 'VAT tidak digunakan pada transaksi ini';
    }
    return '';
  }

  @computedFrom('safeData.isPayVat', 'safeData.useVat')
  get taxRemarkType() {
    if (!this.safeData.isPayVat && !this.safeData.useVat) {
      return 'info';
    }
    return 'info';
  }

  itemsInfoReadOnly = {
    columnsReadOnly: [
      { header: "No Surat Jalan" },
      { header: "Nama Barang" },
      { header: "Quantity" },
      { header: "Keterangan" },
    ]
  }

}
