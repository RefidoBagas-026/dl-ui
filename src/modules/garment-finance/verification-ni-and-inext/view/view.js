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
    return this.safeData.isPayVat && this.safeData.useVat ? true : false;
  }

  itemsInfoReadOnly = {
    columnsReadOnly: [
      { header: "Kode Barang" },
      { header: "Nama Barang" },
      { header: "Quantity" },
      { header: "Keterangan" },
    ]
  }

}
