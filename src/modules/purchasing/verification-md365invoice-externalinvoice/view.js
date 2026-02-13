import { inject, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router)
export class View {
  // ===== CONSTANTS =====
  static DEFAULT_DATE = "1900-01-01T12:00:00";
  // Opsi umum
  tableOptions = {
    pagination: false,
    showColumns: false,
    search: false,
    showToggle: false,
    striped: false,
    sortable: false,
    searchOnEnterKey: false,
    showRefresh: false,
    smartDisplay: false,
    // JANGAN taruh formatNoMatches di sini kalau hanya ingin untuk tabel tertentu
  };

  hasCancel = true;
  data = null;
  id = null;
  controlOptions = {}; // Options for form controls

  // ITEMS
  showItemsTable = false;
  itemsData = [];
  itemsColumns = [
    { header: 'Nama Barang', value: 'itemName' },
    { header: 'Qty', value: 'quantity' },
    { header: 'Harga Satuan', value: 'unitPrice' },
    { header: 'Total', value: 'lineAmount' }
  ];

  // PO
  showPOsTable = false;
  poData = [];
  poColumns = [
    {
      field: 'PONo',
      title: 'Nomor PO',
      formatter: (value, row) => (row && row.message) ? row.message : value
    }
  ];
  // opsi khusus PO (di-set di constructor)

  // SURAT JALAN
  showSJTable = false;
  sjData = [];
  sjColumns = [
    {
      field: 'productReceipts',
      title: 'Nomor Surat Jalan',
      formatter: (value, row) => (row && row.message) ? row.message : value
    }
  ];
  // opsi khusus SJ (di-set di constructor)

  constructor(router) {
    this.router = router;

    // Tombol "i"
    this.actionFormatter = (value, row) =>
      `<button type="button" class="btn btn-primary btn-sm" data-action="info" data-id="${row.Id}">i</button>`;

    this.onTableClick = this.onTableClick.bind(this);

    // === OPSI KHUSUS TIAP TABEL ===
    // Hanya tabel PO & SJ yang mengganti pesan kosong
    this.poTableOptions = {
      ...this.tableOptions,
      formatNoMatches: () => 'Data sudah sesuai'
    };
    this.sjTableOptions = {
      ...this.tableOptions,
      formatNoMatches: () => 'Data sudah sesuai'
    };
  }

  // ===== COMPUTED PROPERTIES FOR BETTER PERFORMANCE =====

  /**
   * Safe getter for data to prevent null reference errors
   * @returns {Object} The data object or empty object if null/undefined
   */
  @computedFrom('data')
  get safeData() {
    return this.data || {};
  }
  
  /**
   * Filters purchase orders where PONo differs from PONoScanResult
   * Uses computedFrom for performance optimization
   */
  @computedFrom('safeData.purchaseOrders', 'safeData.purchaseOrders.length')
  get filteredPurchaseOrders() {
    const { purchaseOrders } = this.safeData;
    if (!purchaseOrders || !Array.isArray(purchaseOrders)) {
      return [];
    }
    return purchaseOrders.filter(item => 
      item && item.PONo !== item.PONoScanResult
    );
  }

  /**
   * Filters product receipts where productReceipts differs from productReceiptsScanResult
   * Uses computedFrom for performance optimization
   */
  @computedFrom('safeData.productReceipts', 'safeData.productReceipts.length')
  get filteredProductReceipts() {
    const { productReceipts } = this.safeData;
    if (!productReceipts || !Array.isArray(productReceipts)) {
      return [];
    }
    return productReceipts.filter(item => 
      item && item.productReceipts !== item.productReceiptsScanResult
    );
  }

  /**
   * Determines if faktur pajak date should highlight differences
   * Returns false if date is default value (1900-01-01T12:00:00)
   */
  @computedFrom('safeData.fakturPajakDate')
  get highlightDifferencesFakturPajakDate() {
    return this.isValidDate(this.safeData.fakturPajakDate);
  }

  /**
   * Determines if invoice date should highlight differences
   * Returns false if date is default value (1900-01-01T12:00:00)
   */
  @computedFrom('safeData.invoiceDate')
  get highlightDifferencesInvoiceDate() {
    return this.isValidDate(this.safeData.invoiceDate);
  }

  @computedFrom('safeData.invoiceNo')
  get highlightDifferencesInvoiceNo() {
    return this.safeData.invoiceNo ? true : false;
  }

  @computedFrom('safeData.fakturPajak')
  get highlightDifferencesFakturPajak() {
    return this.safeData.fakturPajak ? true : false;
  }

  /**
   * Returns cleaned faktur pajak date (null if default value)
   * Prevents display of meaningless default dates
   */
  @computedFrom('safeData.fakturPajakDate')
  get cleanedFakturPajakDate() {
    const { fakturPajakDate } = this.safeData;
    return this.isValidDate(fakturPajakDate) ? fakturPajakDate : null;
  }

  /**
   * Returns cleaned invoice date (null if default value)  
   * Prevents display of meaningless default dates
   */
  @computedFrom('safeData.invoiceDate')
  get cleanedInvoiceDate() {
    const { invoiceDate } = this.safeData;
    return this.isValidDate(invoiceDate) ? invoiceDate : null;
  }

  /**
   * Helper method to check if date is valid (not the default 1900-01-01T12:00:00)
   * @param {string} dateString - The date string to validate
   * @returns {boolean} - True if date is valid and not default
   */
  isValidDate(dateString) {
    if (!dateString) return false;
    
    // Check if it's the default invalid date
    return dateString !== View.DEFAULT_DATE;
  }

  activate(params) {
    const idParam = params && params.id;
    const decodedId = Base64Helper.decode(idParam);

    this.id = typeof decodedId === 'string' ? Number(decodedId) : decodedId;

    const list = Array.isArray(window.listData) ? window.listData : [];
    this.data = list.find(d => String(d.Id) === String(this.id)) || null;

    console.log('[View] Semua data invoice:', list);
    console.log('[View] Data invoice yang dipilih:', this.data);
  }

  attached() {
    const table = document.querySelector('table');
    if (table) table.addEventListener('click', this.onTableClick);
  }

  detached() {
    const table = document.querySelector('table');
    if (table) table.removeEventListener('click', this.onTableClick);
  }

  onTableClick(evt) {
    const btn = evt.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');

    if (action === 'info') {
      this.showInfo(id);

      const list = Array.isArray(window.listData) ? window.listData : [];
      const row = list.find(x => String(x.Id) === String(id));

      // ===== ITEMS =====
      if (row && Array.isArray(row.items)) {
        if (this.showItemsTable && this.itemsData === row.items) {
          this.showItemsTable = false;
          this.itemsData = [];
        } else {
          this.itemsData = row.items;
          this.showItemsTable = true;
        }
      } else {
        this.itemsData = [];
        this.showItemsTable = false;
      }

      // ===== PO =====
      // Boleh kosong; pesan kosong akan diganti oleh formatNoMatches
      this.poData = (row && Array.isArray(row.purchaseOrders)) ? row.purchaseOrders : [];
      this.showPOsTable = true;

      // ===== SURAT JALAN =====
      // Boleh kosong; pesan kosong akan diganti oleh formatNoMatches
      this.sjData = (row && Array.isArray(row.productReceipts)) ? row.productReceipts : [];
      this.showSJTable = true;
    }
  }

  showInfo(id) {
    const list = Array.isArray(window.listData) ? window.listData : [];
    const row = list.find(x => String(x.Id) === String(id));
    if (!row) return;
    const idDecode = Base64Helper.decode(row.Id);
    this.router.navigateToRoute('view', { id: idDecode });
  }

  cancel() {
    if (confirm('Apakah Anda yakin akan kembali?')) {
      this.router.navigateToRoute('list');
    }
  }
}
