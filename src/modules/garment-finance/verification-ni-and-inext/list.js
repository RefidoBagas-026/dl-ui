import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';
import { ApprovalEnum } from './enum/approval-enum';
import { ScanResultRemarkEnum } from './enum/scan-result-remark-enum';
var moment = require("moment");

@inject(Router, Service)
export class List {
  navigateToMainPage() {
    this.router.navigateToRoute('main-page');
  }

  constructor(router, service) {
    this.router = router;
    this.service = service;

    // Bind viewModel reference untuk button onclick
    window.viewModel = this;
  }

  context = ["Rincian", "Cetak PDF"];

  contextClickCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    if (arg.name === "Rincian") {
      this.router.navigateToRoute('view', { id: idEncode });
    } else if (arg.name === "Cetak PDF") {
      this.service.getPdfById(data.Id);
    }
  }

  contextShowCallback(index, name, data) {
    switch (name) {
      case "Cetak PDF":
        if (data.approvalStatusEnum === ApprovalEnum.REJECTED)
          return false;
        else
          return true;
      case "Rincian":
        return true;
    }
  }

  // Lifecycle method untuk memastikan tabel ter-render dengan benar
  attached() {
    // Pastikan event handler lama dihapus agar tidak duplikat
    this.detached();
    // Refresh tabel setelah DOM ready
    if (this.table) {
      setTimeout(() => {
        this.table.refresh();
      }, 100);
    }

    // Event handler untuk tombol detail (expand/collapse manual)
    $(document).on('click', '[data-toggle="detail"]', (e) => {
      e.preventDefault();
      var $btn = $(e.currentTarget);
      var $tr = $btn.closest('tr');
      var index = $btn.data('index');
      // Cek apakah sudah ada detail row
      if ($tr.next().hasClass('detail-row')) {
        $tr.next().remove();
        $btn.find('i').removeClass('fa-eye-slash').addClass('fa-eye');
      } else {
        // Tutup detail lain jika ingin single expand
        $tr.siblings('.detail-row').remove();
        $tr.siblings().find('td .fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
        // Ambil data row dari loadedData
        var rowData = this.loadedData ? this.loadedData[index] : null;
        var detailHtml = this.detailFormatter(index, rowData);
        $tr.after(`<tr class="detail-row"><td colspan="${$tr.children().length}">${detailHtml}</td></tr>`);
        $btn.find('i').removeClass('fa-eye').addClass('fa-eye-slash');
      }
    });

    // Event handler untuk tombol hapus
    $(document).on('click', '[data-toggle="delete"]', (e) => {
      e.preventDefault();
      var $btn = $(e.currentTarget);
      var index = $btn.data('index');
      var rowData = this.loadedData ? this.loadedData[index] : null;
      if (rowData && rowData.Id) {
        this.deleteRowById(rowData.Id, index);
      } else {
        alert('Id data tidak ditemukan!');
      }
    });
  }

  // Lifecycle method untuk cleanup
  detached() {
    // Remove event handler
    $(document).off('click', '[data-toggle="detail"]');
    $(document).off('click', '[data-toggle="delete"]');
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
        // Simpan data hasil load ke property agar bisa diakses event handler
        this.loadedData = data.data;
        window.listData = data.data;
        data.data.forEach(item => {
          // Pastikan field yang diperlukan ada
          item.invoiceNo = item.invoiceNo || item.INNo || 'N/A';
          item.inNo = item.inNo || 'N/A';
          item.supplierName = item.supplierName || 'N/A';
          item.totalAmountAfterTax = item.totalAmountAfterTax || 0;
          item.approvalStatus = item.approvalStatusEnum === ApprovalEnum.UNDEFINED ? 'BELUM POSTING' : item.approvalStatus;
        });
        return {
          total: data.total,
          data: data.data
        };
      });
  }

  // Konfigurasi options untuk table
  tableOptions = {
    showRefresh: true,
    // Nonaktifkan detailView bawaan agar tombol custom yang berfungsi
    // detailView: true,
    // detailViewIcon: true,
    // detailViewAlign: 'right',
    // iconsPrefix: 'fa',
    // icons: {
    //   detailOpen: 'fa-eye',
    //   detailClose: 'fa-eye-slash'
    // },
    // detailFormatter: this.detailFormatter.bind(this)
  };

  // Konfigurasi kolom tabel
  columns = [
    {
      field: "isPosting", title: "Post", checkbox: true, sortable: false,
      formatter: function (value, data, index) {
        this.checkboxEnabled = data.remarkEnum === ScanResultRemarkEnum.INVOICE_DATA_NOT_MATCH && data.approvalStatusEnum === ApprovalEnum.UNDEFINED;
        return ""
      }
    },
    { field: 'index', title: 'No', formatter: (value, row, index) => index + 1, width: 80, align: 'center', sortable: false },
    { field: 'invoiceNo', title: 'Invoice', width: 150, align: 'left', sortable: true },
    { field: 'inNo', title: 'No NI', width: 150, align: 'left', sortable: true },
    { field: 'supplierName', title: 'Nama Supplier', width: 200, align: 'left', sortable: true },
    {
      field: 'vatRate', title: 'Nilai PPN', width: 120, align: 'right', sortable: true, formatter: (value) => {
        if (value == null || value === '') return '';
        const num = Number(value);
        if (isNaN(num)) return value;
        // Hilangkan .00; kalau punya desimal lain tampilkan tanpa trailing zero berlebihan
        let display = num.toFixed(2); // two decimals
        if (display.endsWith('.00')) {
          display = display.slice(0, -3);
        } else {
          display = parseFloat(display).toString(); // trim trailing zeros
        }
        return display + '%';
      }
    },
    {
      field: 'totalVat', title: 'Jumlah PPN', width: 120, align: 'right', sortable: true, formatter: (value) => {
        if (value == null || value === '') return '';
        const num = Number(value);
        if (isNaN(num)) return value;
        return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
    {
      field: 'totalAmountAfterTax', title: 'Total Amount', width: 120, align: 'right', sortable: true, formatter: (value) => {
        if (value == null || value === '') return '';
        const num = Number(value);
        if (isNaN(num)) return value;
        return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
    { field: 'remark', title: 'Keterangan', width: 150, align: 'left', sortable: true },
    { field: 'approvalStatus', title: 'Status Approval', width: 150, align: 'left', sortable: true },
    {
      field: 'actions',
      title: 'Aksi',
      width: 100,
      align: 'center',
      sortable: false,
      formatter: (value, row, index) => {
        return `
          <button class="btn btn-sm btn-success" data-toggle="detail" data-index="${index}" title="Lihat Detail">
            <i class="fa fa-eye"></i>
          </button>
          <span style="margin-left:3px;"></span>
          <button class="btn btn-sm btn-danger" data-toggle="delete" data-index="${index}" title="Hapus">
            <i class="fa fa-trash"></i>
          </button>
        `;
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
              <th width="40">No</th>
              <th width="150">Nama Barang</th>
              <th width="120">Quantity</th>
              <th width="150">Keterangan</th>
            </tr>
          </thead>
          <tbody>
    `;

    items.forEach((item, idx) => {
      const quantity = item.quantity || 0;

      html += `
        <tr>
          <td>${idx + 1}</td>
          <td>${item.productName || 'N/A'}</td>
          <td style="text-align:right">${quantity.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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

  rowFormatter(data, index) {
    if (data.approvalStatusEnum === ApprovalEnum.APPROVED)
      return { classes: "success" }
    else if (data.remarkEnum === ScanResultRemarkEnum.INVOICE_DATA_NOT_MATCH && data.approvalStatusEnum !== ApprovalEnum.REQUESTED)
      return { classes: "danger" }
    else if (data.approvalStatusEnum === ApprovalEnum.REQUESTED)
      return { classes: "warning" }
    else
      return { classes: "" };
  }

  posting() {
    if (this.dataToBePosted.length > 0) {
      this.service.approvalSubmitRequest(this.dataToBePosted).then(result => {
        this.dataToBePosted = [];
        this.table.refresh();
      }).catch(e => {
        this.error = e;
      })
    }
  }

  // Function untuk create (tidak digunakan untuk saat ini)
  // Function untuk menghapus row berdasarkan id
  deleteRowById(id, index) {
    if (!id) {
      alert('Id tidak valid!');
      return;
    }
    if (confirm('Yakin ingin menghapus data ini?')) {
      this.service.delete(id)
        .then(() => {
          alert('Data berhasil dihapus.');
          if (this.table) {
            this.table.refresh();
          }
        })
        .catch(err => {
          alert('Gagal menghapus data: ' + (err && err.message ? err.message : err));
        });
    }
  }
  create() {
    console.log('Create clicked');
  }
}
