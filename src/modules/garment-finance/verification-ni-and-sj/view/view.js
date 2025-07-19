
import { inject, bindable } from 'aurelia-framework';
import { Service } from '../service';

export class View {
  static inject = [Service];
  static bindable = ['data'];

  @bindable data;

  table = null;
  dataChanged(newValue) {
    if (this.table && typeof this.table.refresh === 'function') {
      this.table.refresh();
    }
  }

  columns = [
    { field: 'inNo', title: 'No. Nota Intern' },
    { field: 'inDate', title: 'Tgl. Nota Intern', formatter: (value) => {
      if (!value) return '';
      const date = new Date(value);
      if (isNaN(date)) return value;
      const d = date.getDate().toString().padStart(2, '0');
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const y = date.getFullYear();
      return `${d}-${m}-${y}`;
    } },
    { field: 'currencyCode', title: 'Mata Uang' },
    { field: 'supplierName', title: 'Supplier' },
    { field: 'invoiceNo', title: 'Nomor Invoice' },
    { field: 'invoiceDate', title: 'Tanggal Invoice', formatter: (value) => {
      if (!value) return '';
      const date = new Date(value);
      if (isNaN(date)) return value;
      const d = date.getDate().toString().padStart(2, '0');
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const y = date.getFullYear();
      return `${d}-${m}-${y}`;
    } },
    { field: 'totalAmount', title: 'Total Amount', formatter: (value) => {
      if (value == null || value === '') return '';
      const num = Number(value);
      if (isNaN(num)) return value;
      return num.toFixed(2);
    } },
    { field: 'remark', title: 'Keterangan' },
    { field: 'CreatedBy', title: 'Admin Pembelian' }
  ];
  get rows() {
    return Array.isArray(this.data) ? this.data : [];
  }

  loader = (info) => {
    const arr = Array.isArray(this.data) ? this.data : [];
    return {
      total: arr.length,
      data: arr
    };
  };

  constructor(service) {
    this.service = service;
    // Kosongkan data untuk menunggu data dari parent
    this.data = [];
  }
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

  // ...existing code...
}
