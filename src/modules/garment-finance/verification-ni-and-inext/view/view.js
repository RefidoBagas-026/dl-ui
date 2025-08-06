import { inject, bindable } from 'aurelia-framework';
import { Service } from '../service';

export class View {

  static inject = [Service];
  static bindable = ['data'];

  @bindable data;

  table = null;

  // Helper function untuk format tanggal dengan nama bulan lengkap bahasa Inggris
  static formatDateWithIndonesianMonth(value) {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date)) return value;
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const d = date.getDate().toString().padStart(2, '0');
    const m = monthNames[date.getMonth()];
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  }
  dataChanged(newValue) {
    if (this.table && typeof this.table.refresh === 'function') {
      this.table.refresh();
    }
  }

  columns = [
    { field: 'inNo', title: 'No. Nota Intern' },
    { field: 'inDate', title: 'Tgl. Nota Intern', formatter: (value) => {
      return View.formatDateWithIndonesianMonth(value);
    } },
    { field: 'currencyCode', title: 'Mata Uang' },
    { field: 'supplierName', title: 'Supplier' },
    { field: 'invoiceNo', title: 'Nomor Invoice' },
    { field: 'invoiceDate', title: 'Tanggal Invoice', formatter: (value) => {
      return View.formatDateWithIndonesianMonth(value);
    } },
    { field: 'totalAmount', title: 'Total Amount', formatter: (value) => {
      if (value == null || value === '') return '';
      const num = Number(value);
      if (isNaN(num)) return value;
      return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } },
    { field: 'remark', title: 'Keterangan' },
    { field: 'CreatedBy', title: 'Admin Pembelian' },
    { 
      field: 'info', 
      title: '', 
      formatter: (value, row, index) => {
        return `<button class='btn btn-info btn-sm' style='color:white' data-toggle="detail" data-index="${index}"><i class='fa fa-info'></i></button>`;
      },
      width: 40,
      align: 'center',
      sortable: false
    }
  ];

  attached() {
    $(document).on('click', '[data-toggle="detail"]', (e) => {
      e.preventDefault();
      var $btn = $(e.currentTarget);
      var $tr = $btn.closest('tr');
      var index = $btn.data('index');
      // Cek apakah sudah ada detail row
      if ($tr.next().hasClass('detail-row')) {
        $tr.next().remove();
      } else {
        // Ambil data row dari this.data
        var rowData = this.data[index];
        var detailHtml = this.detailFormatter(index, rowData);
        $tr.after(`<tr class="detail-row"><td colspan="${$tr.children().length}">${detailHtml}</td></tr>`);
      }
    });
  }
  
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

  // Detail formatter untuk menampilkan detail di bawah baris tabel
  detailFormatter(index, row) {
    // Kolom detail sama dengan NI dan SJ
    const itemsColumns = [
      { header: "Nomor Surat Jalan", value: "deliveryOrder.doNo" },
      { header: "Nomor PO Eksternal", value: "ePONo" },
      { header: "Nomor Ref PR", value: "pOSerialNumber" },
      { header: "Nomor RO", value: "roNo" },
      { header: "Term Pembayaran", value: "deliveryOrder.paymentMethod" },
      { header: "Tipe Pembayaran", value: "deliveryOrder.paymentType" },
      { header: "Tanggal Jatuh Tempo", value: "paymentDueDate" },
      { header: "Barang", value: "product.Code" },
      { header: "Jumlah", value: "doQuantity" },
      { header: "Satuan", value: "uoms.Unit" },
      { header: "Harga Satuan", value: "pricePerDealUnit" },
      { header: "Harga Total", value: "priceTotal" },
      { header: "Diterima Unit", value: "unit.Name" }
    ];

    // Ambil details dari items[0]
    let details = (row.items && row.items[0] && row.items[0].details) ? row.items[0].details : [];
    // Pastikan pOSerialNumber diambil dari detail.poSerialNumber jika ada
    details = details.map(detail => ({
      ...detail,
      pOSerialNumber: detail.pOSerialNumber || detail.poSerialNumber || ''
    }));

    let html = '<div style="padding:10px; background:#f5f5f5; border-radius:4px;">';
    html += '<strong>Detail Data:</strong><br>';
    html += '<table class="table table-bordered table-sm" style="background:#fff;">';
    html += '<thead><tr>';
    itemsColumns.forEach(col => {
      html += `<th>${col.header}</th>`;
    });
    html += '</tr></thead><tbody>';
    details.forEach(detail => {
      html += '<tr>';
      itemsColumns.forEach(col => {
        // Support nested property path dan fallback untuk Jumlah & Satuan
        let val = detail;
        if (col.value === 'doQuantity') {
          val = detail.doQuantity !== undefined ? detail.doQuantity : (detail.quantity !== undefined ? detail.quantity : '');
          // Format dua digit desimal
          val = val !== '' && !isNaN(val) ? Number(val).toFixed(2) : val;
        } else if (col.value === 'uoms.Unit') {
          val = (detail.uoms && detail.uoms.Unit) ? detail.uoms.Unit : (detail.uomUnit && detail.uomUnit.Unit ? detail.uomUnit.Unit : '');
        } else if (col.value === 'paymentDueDate') {
          // Format tanggal dd-mmm-yyyy dengan nama bulan lengkap bahasa Inggris
          val = View.formatDateWithIndonesianMonth(detail.paymentDueDate);
        } else {
          col.value.split('.').forEach(k => {
            val = val && val[k] !== undefined ? val[k] : '';
          });
        }
        html += `<td>${val}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    html += '</div>';
    return html;
  }
}
