import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';

@inject(Router, Service)
export class List {
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.data = [];
    }
        // Context menu hanya Rincian
        context = ["Rincian"];

        // Show context menu selalu true (bisa ditambah logika jika perlu)
        contextShowCallback(index, name, data) {
            return name === "Lihat Detail";
        }
        // Callback untuk context menu, hanya aksi Lihat Detail
        contextClickCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        if(arg.name === "Rincian") {
            this.router.navigateToRoute('view', { id: data.Id });
        }
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
                var data = {};
                data.total = result.info.total;
                data.data = result.data;
                this.loadedData = data.data;
                window.listData = data.data; // simpan ke global agar bisa diakses di view
                return {
                    total: data.total,
                    data: data.data
                };
            });
    }

    // Formatter tanggal Indonesia
    formatTanggal(value) {
        if (!value) return '';
        const date = new Date(value);
        if (isNaN(date)) return value;
        const bulan = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
    }

    tableOptions = {
        pagination: true,
        search: true,
        showColumns: true,
        sortable: true,
    };

    columns = [
        // { field: 'invoiceId', title: 'Invoice ID', width: 150, align: 'left', sortable: true, visible: false },
        { field: 'invoiceNo', title: 'Nomor Invoice', width: 150, align: 'left', sortable: true },
        { field: 'invoiceDate', title: 'Tanggal Invoice', width: 150, align: 'left', sortable: true, formatter: (value) => this.formatTanggal(value) },
        { field: 'fakturPajak', title: 'Faktur Pajak', width: 150, align: 'left', sortable: true },
        // { field: 'lineAmountSum', title: 'Line Amount Sum', width: 150, align: 'right', sortable: true, visible: false },
        { field: 'totalInvoiceSum', title: 'Jumlah Total Invoice', width: 150, align: 'right', sortable: true },
        { field: 'currencyCode', title: 'Mata Uang', width: 100, align: 'left', sortable: true },
        { field: 'fakturPajakDate', title: 'Tanggal Faktur Pajak', width: 150, align: 'left', sortable: true, formatter: (value) => this.formatTanggal(value) },
        { field: 'PPHValue', title: 'PPH', width: 100, align: 'right', sortable: true },
        { field: 'PPNValue', title: 'PPN', width: 100, align: 'right', sortable: true },
        { field: 'remarkDescription', title: 'Keterangan', width: 200, align: 'left', sortable: true },
        {
            field: 'actions',
            title: 'Aksi',
            width: 187,
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

    create() {
        this.router.navigateToRoute('create');
    }

    attached() {
        // Remove previous event handlers to avoid duplicates
        this.detached();
        // Refresh table after DOM ready
        if (this.table) {
            setTimeout(() => {
                this.table.refresh();
            }, 100);
        }

        // Event handler for detail button (expand/collapse manual)
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

        // Event handler for delete button
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

    detached() {
        $(document).off('click', '[data-toggle="detail"]');
        $(document).off('click', '[data-toggle="delete"]');
    }

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
                  <th width="80">Qty</th>
                  <th width="120">Harga Satuan</th>
                  <th width="120">Harga Total</th>
                </tr>
              </thead>
              <tbody>
        `;
        items.forEach((item, idx) => {
            const quantity = item.quantity || 0;
            const pricePerUnit = item.unitPrice || 0;
            const totalPrice = item.lineAmount || (quantity * pricePerUnit);
            html += `
              <tr>
                <td>${idx + 1}</td>
                <td>${item.itemName || 'N/A'}</td>
                <td style="text-align:right">${quantity.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td style="text-align:right">${pricePerUnit.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td style="text-align:right">${totalPrice.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
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
                    let msg = 'Gagal menghapus data.';
                    if (err && err.message) {
                        msg += '\n' + err.message;
                    }
                    if (confirm(msg + '\nKlik OK untuk refresh tabel.')) {
                        if (this.table) {
                            this.table.refresh();
                        }
                    }
                });
        }
    }
}
