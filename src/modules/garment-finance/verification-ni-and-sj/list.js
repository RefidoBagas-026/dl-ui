import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
var moment = require("moment");

@inject(Router, Service)
export class List {
  
  constructor(router, service) {
    this.router = router;
    this.service = service;
    
    // Bind viewModel reference untuk button onclick
    window.viewModel = this;
  }

  // Lifecycle method untuk memastikan tabel ter-render dengan benar
  attached() {
    // Refresh tabel setelah DOM ready
    if (this.table) {
      setTimeout(() => {
        this.table.refresh();
      }, 100);
    }

    // Event handler untuk tombol detail
    $(document).on('click', '[data-toggle="detail"]', (e) => {
      e.preventDefault();
      var index = $(e.currentTarget).data('index');
      this.toggleDetails(index);
    });
  }

  // Lifecycle method untuk cleanup
  detached() {
    // Remove event handler
    $(document).off('click', '[data-toggle="detail"]');
  }

  // Loader data dari service
  loader = (info) => {
    var order = {};
    if (info.sort)
      order[info.sort] = info.order;

    var arg = {
      page: parseInt(info.offset / info.limit, 10) + 1,
      size: info.limit,
      keyword: info.search,
      order: order
    };

    return this.service.search(arg)
      .then(result => {
        // Mapping data untuk menampilkan kolom yang sesuai
        var data = {};
        data.total = result.info.total;
        data.data = result.data;
        
        data.data.forEach(item => {
          // Pastikan field yang diperlukan ada
          item.invoiceNo = item.invoiceNo || item.INNo || 'N/A';
          item.supplierName = item.supplierName || 'N/A';
        });

        return {
          total: data.total,
          data: data.data
        };
      });
  }

  // Konfigurasi options untuk table
  tableOptions = {
    pagination: true,
    showColumns: true,
    search: true,
    showToggle: true,
    striped: true,
    sortable: true,
    searchOnEnterKey: false,
    showRefresh: true,
    smartDisplay: true,
    detailView: true,
    detailViewIcon: false,
    detailViewByClick: false,
    detailFormatter: this.detailFormatter.bind(this)
  };

  // Konfigurasi kolom tabel
  columns = [
    { field: 'index', title: 'No', formatter: (value, row, index) => index + 1, width: 80, align: 'center', sortable: false },
    { field: 'invoiceNo', title: 'Invoice', width: 200, align: 'left', sortable: true },
    { field: 'supplierName', title: 'Nama Supplier', width: 250, align: 'left', sortable: true },
    { 
      field: 'actions', 
      title: 'Aksi', 
      width: 100, 
      align: 'center',
      sortable: false,
      formatter: (value, row, index) => {
        return `<button class="btn btn-sm btn-default" data-toggle="detail" data-index="${index}" title="Lihat Detail">
                  <i class="fa fa-search"></i>
                </button>`;
      }
    }
  ];

  // Function untuk format detail view (child table)
  detailFormatter(index, row) {
    var items = row.items || [];
    
    if (items.length === 0) {
      return '<div class="alert alert-info">Tidak ada item</div>';
    }

    var html = `
      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th width="50">No</th>
              <th width="200">No SJ</th>
              <th width="150">Tgl SJ</th>
              <th width="100">Qty</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
    `;

    items.forEach((item, idx) => {
      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${item.internalNoteDONo || 'N/A'}</td>
          <td>${item.scanResultDONo || 'N/A'}</td>
          <td>${item.internNoteQuantity || 0}</td>
          <td>${item.remarkDescription || 'N/A'}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    return html;
  }

  // Function untuk toggle details (menggunakan bootstrap-table detail view)
  toggleDetails(index) {
    console.log('Toggle details for index:', index);
    
    // Menggunakan bootstrap-table API untuk toggle detail
    if (this.table && this.table.bootstrapTable) {
      this.table.bootstrapTable('expandRow', index);
    }
  }

  // Function untuk create (tidak digunakan untuk saat ini)
  create() {
    console.log('Create clicked');
  }
}
