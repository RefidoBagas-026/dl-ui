import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class View {
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
  };
  hasCancel = true;
  data = null;
  id = null;

  showItemsTable = false;
  itemsData = [];
  itemsColumns = [
    { header: 'Nama Barang', value: 'itemName' },
    { header: 'Qty', value: 'quantity' },
    { header: 'Harga Satuan', value: 'unitPrice' },
    { header: 'Total', value: 'lineAmount' }
  ];

  showPOsTable = false;
  poData = [];
  poColumns = [
    { field: 'PONo', title: 'Nomor PO' }
  ];

  showSJTable = false;
  sjData = [];
  sjColumns = [
    { field: 'productReceipts', title: 'Nomor Surat Jalan' }
  ];

  constructor(router) {
    this.router = router;

    // Formatter untuk kolom tombol 'i' di au-table / bootstrap-table
    // Sisipkan data-id agar mudah diketahui baris mana yang diklik.
    this.actionFormatter = (value, row) =>
      `<button type="button" class="btn btn-primary btn-sm" data-action="info" data-id="${row.Id}">i</button>`;

    // Ikat handler agar bisa dilepas saat detached
    this.onTableClick = this.onTableClick.bind(this);
  }

  activate(params) {
  const idParam = params && params.id;
    this.id = typeof idParam === 'string' ? Number(idParam) : idParam;

    const list = Array.isArray(window.listData) ? window.listData : [];
    this.data =
      list.find(d => String(d.Id) === String(this.id)) || null;

    console.log('[View] Semua data invoice:', list);
    console.log('[View] Data invoice yang dipilih:', this.data);
  }

  attached() {
    // Delegasi klik ke tabel (ganti selector sesuai ref elemen tabel Kakak)
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
      // Ambil items dari invoice yang dipilih dan toggle tabel
      const list = Array.isArray(window.listData) ? window.listData : [];
      const row = list.find(x => String(x.Id) === String(id));
      if (row && Array.isArray(row.items)) {
        // Jika sudah tampil dan id sama, maka hide
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

      // Ambil purchaseOrders dari invoice yang dipilih dan tampilkan tabel PO
      if (row && Array.isArray(row.purchaseOrders)) {
        this.poData = row.purchaseOrders;
        this.showPOsTable = true;
      } else {
        this.poData = [];
        this.showPOsTable = false;
      }
    }
  }

  showInfo(id) {
    const list = Array.isArray(window.listData) ? window.listData : [];
    const row = list.find(x => String(x.Id) === String(id));
    if (!row) return;

    // Contoh aksi: navigasi ke halaman view/detail lain
    this.router.navigateToRoute('view', { id: row.Id });
  }

  cancel() {
    if (confirm('Apakah Kakak yakin akan keluar?')) {
      this.router.navigateToRoute('list');
    }
  }
}
