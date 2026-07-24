import { bindable, computedFrom } from 'aurelia-framework'
import { ApprovalEnum } from './enum/approval-enum';

export class DataForm {
    @bindable data = {};
    @bindable title;

    bind(context) {
        this.context = context;
        this.data = this.context.data;
    }


    @computedFrom('data')
    get safeData() {
        return this.data || {};
    }

    @computedFrom('safeData.isPayVat', 'safeData.useVat')
    get highlightDifferencesTax() {
        return this.safeData.isPayVat && this.safeData.useVat;
    }

    @computedFrom('safeData.isPayVat', 'safeData.useVat')
    get taxComparisonRemark() {
        if (!this.safeData.isPayVat && !this.safeData.useVat) {
            return 'Tidak ada pajak yang digunakan pada transaksi ini';
        }
        if (!this.safeData.isPayVat) {
            return 'Pajak tidak dibayar pada transaksi ini';
        }
        if (!this.safeData.useVat) {
            return 'VAT tidak digunakan pada transaksi ini';
        }
        return '';
    }

    @computedFrom('safeData.isPayVat', 'safeData.useVat')
    get taxRemarkType() {
        if (!this.safeData.isPayVat && !this.safeData.useVat) {
            return 'info';
        }
        return 'info';
    }

    @computedFrom("safeData.approvalStatusEnum")
    get isRejected() {
        return this.safeData.approvalStatusEnum === ApprovalEnum.REJECTED;
    }

    @computedFrom("safeData.description")
    get descriptionData() {
        return this.safeData.description && this.safeData.description.trim() !== '' ? this.safeData.description : this.safeData.additionalDescription;
    }

    @computedFrom("safeData.additionalDescription")
    get hasAdditionalDescription() {
        return (this.safeData.description && this.safeData.description.trim() !== '') &&
            (this.safeData.additionalDescription && this.safeData.additionalDescription.trim() !== '');
    }

    itemsInfoReadOnly = {
        columnsReadOnly: [
            { header: "Nama Barang" },
            { header: "Quantity" },
            { header: "Keterangan" },
        ]
    }

    deliveryOrdersInfoReadOnly = [
        { header: "Surat Jalan" },
        { header: "Keterangan" }
    ]

    auInputOptions = {
        label: {
            length: 4,
            align: "center"
        },
        control: {
            length: 5
        }
    };
}
