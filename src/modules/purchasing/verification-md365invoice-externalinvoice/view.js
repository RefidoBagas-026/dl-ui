import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class View {
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

  activate(params) {
    const idParam = params && params.id;
    this.id = typeof idParam === 'string' ? Number(idParam) : idParam;

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
    this.router.navigateToRoute('view', { id: row.Id });
  }

  cancel() {
    if (confirm('Apakah Kakak yakin akan keluar?')) {
      this.router.navigateToRoute('list');
    }
  }
}
