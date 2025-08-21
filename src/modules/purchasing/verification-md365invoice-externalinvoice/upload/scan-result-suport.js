import { bindable } from 'aurelia-framework';

// Komponen pendukung: menampilkan tabel PO, SJ, dan Faktur Pajak
export class ScanResultSuport {
  @bindable result;

  activate(model) {
    if (model && 'result' in model) this.result = model.result;
    this._build();
  }

  bind() {
    this._build();
  }

  resultChanged() {
    this._build();
  }

  _build() {
    const root = this.result ? (this.result.data || this.result.Data || this.result) : null;
    const poArr = root && root.PurchaseOrder && (root.PurchaseOrder.PurchaseOrder || root.PurchaseOrder.purchaseOrder) || [];
    const doArr = root && root.DeliveryOrder && (root.DeliveryOrder.DeliveryOrder || root.DeliveryOrder.deliveryOrder) || [];
    const taxContainer = root && (root.TaxInvoice || root.taxInvoice) || null;
    let taxObj = null;
    if (taxContainer) {
      // Typical shape: { TaxInvoice: { TaxInvoiceNumber, TaxInvoiceDate, ValueAddedTax, ... } }
      taxObj = taxContainer.TaxInvoice || taxContainer.taxInvoice || null;
      // Fallback: sometimes API might already provide flattened object at this level
      if (!taxObj && (taxContainer.TaxInvoiceNumber || taxContainer.TaxInvoiceDate || taxContainer.ValueAddedTax)) {
        taxObj = taxContainer;
      }
    }

    this.poRows = Array.isArray(poArr) ? poArr : [];
    this.doRows = Array.isArray(doArr) ? doArr : [];
    this.taxRows = taxObj ? [taxObj] : [];

    this.tableOptions = {
      pagination: false,
      search: false,
      showColumns: false,
      showToggle: false,
      pageSize: 50,
      locale: 'id-ID'
    };

    this.poColumns = [
      { field: 'PurchaseOrderNumber', title: 'Nomor PO' }
    ];

    this.doColumns = [
      { field: 'DeliveryOrderNumber', title: 'Nomor Surat Jalan' }
    ];

    this.taxColumns = [
      { field: 'TaxInvoiceNumber', title: 'No. Faktur Pajak' },
      { field: 'TaxInvoiceDate', title: 'Tanggal Faktur', formatter: (v) => this.formatDate(v) },
      { field: 'ValueAddedTax', title: 'PPN', align: 'right', formatter: (v) => this.formatNumber(v) }
    ];
  }

  get hasPO() { return Array.isArray(this.poRows) && this.poRows.length > 0; }
  get hasDO() { return Array.isArray(this.doRows) && this.doRows.length > 0; }
  get hasTax() { return Array.isArray(this.taxRows) && this.taxRows.length > 0; }

  formatNumber(v) {
    if (v == null) return '';
    const n = Number(v);
    if (isNaN(n)) return v;
    return n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  formatDate(v) {
    if (!v) return '';
    const d = new Date(v);
    if (isNaN(d)) return v;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    return `${dd}-${mm}-${yy}`;
  }
}

export default ScanResultSuport;
