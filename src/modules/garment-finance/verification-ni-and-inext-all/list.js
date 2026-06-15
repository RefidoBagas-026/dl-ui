import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import { Base64Helper } from '../../../utils/base-64-coded-helper';
import { ApprovalEnum } from './enum/approval-enum';

@inject(Router, Service)
export class List {
    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    columns = [
        { field: 'index', title: 'No', formatter: (value, row, index) => index + 1, width: 80, align: 'center', sortable: false },
        { field: 'invoiceNo', title: 'Invoice', width: 150, align: 'left', sortable: true },
        { field: 'inNo', title: 'No NI', width: 150, align: 'left', sortable: true },
        { field: 'supplierName', title: 'Nama Supplier', width: 200, align: 'left', sortable: true },
        {
            field: 'vatRate', title: 'Nilai PPN', width: 120, align: 'right', sortable: true, formatter: (value) => {
                if (value == null || value === '') return '';
                const num = Number(value);
                if (isNaN(num)) return value;

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
                `;
            }
        }
    ];

    tableOptions = {
        showRefresh: true
    };

    rowFormatter(data, index) {
        if (data.approvalStatusEnum === ApprovalEnum.APPROVED)
            return { classes: "success" }
        else if (data.approvalStatusEnum === ApprovalEnum.REJECTED)
            return { classes: "danger" }
        else if (data.approvalStatusEnum === ApprovalEnum.REQUESTED)
            return { classes: "warning" }
        else
            return { classes: "" };
    }

    context = ["Rincian", "Cetak PDF"];

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
                data.data.forEach(item => {
                    item.invoiceNo = item.invoiceNo || 'N/A';
                    item.inNo = item.inNo || 'N/A';
                    item.supplierName = item.supplierName || 'N/A';
                    item.totalAmountAfterTax = item.totalAmountAfterTax || 0;
                });
                return {
                    total: data.total,
                    data: data.data
                };
            });
    }

    contextClickCallback(event) {
        var arg = event.detail;
        var data = arg.data;
        const encoded = Base64Helper.encode(data.Id);
        switch (arg.name) {
            case "Rincian":
                this.router.navigateToRoute('view', { id: encoded });
                break;
            case "Cetak PDF":
                this.service.getPdfById(data.Id);
                break;
        }
    }

    attached() {
        this.detached();

        if (this.table) {
            setTimeout(() => {
                this.table.refresh();
            }, 100);
        }

        $(document).on('click', '[data-toggle="detail"]', (e) => {
            e.preventDefault();
            var $btn = $(e.currentTarget);
            var $tr = $btn.closest('tr');
            var index = $btn.data('index');
            if ($tr.next().hasClass('detail-row')) {
                $tr.next().remove();
                $btn.find('i').removeClass('fa-eye-slash').addClass('fa-eye');
            } else {
                $tr.siblings('.detail-row').remove();
                $tr.siblings().find('td .fa-eye-slash').removeClass('fa-eye-slash').addClass('fa-eye');
                var rowData = this.loadedData ? this.loadedData[index] : null;
                var detailHtml = this.detailFormatter(index, rowData);
                $tr.after(`<tr class="detail-row"><td colspan="${$tr.children().length}">${detailHtml}</td></tr>`);
                $btn.find('i').removeClass('fa-eye').addClass('fa-eye-slash');
            }
        });
    }

    detached() {
        $(document).off('click', '[data-toggle="detail"]');
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
}
