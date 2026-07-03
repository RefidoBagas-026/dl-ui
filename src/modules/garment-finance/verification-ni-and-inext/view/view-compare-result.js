import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Base64Helper } from '../../../../utils/base-64-coded-helper';
import { Service } from '../service';
import { activationStrategy } from 'aurelia-router';
import { ApprovalEnum } from '../enum/approval-enum';

@inject(Router, Service)
export class View {
  constructor(router, service) {
    this.router = router;
    this.service = service;

    this.descriptionOptions = [
      { label: 'Kesalahan Sistem', selected: false },
      { label: 'Kesalahan User Input', selected: false },
      { label: 'Kuantitas Akumulatif', selected: false }
    ];
  }

  @bindable data;

  async activate(params) {
    var idDecode = Base64Helper.decode(params.id);
    this.idEncode = params.id;
    this.data = await this.service.getById(idDecode);
    this.initializeDescriptionOptions();
  }

  cancel() {
    if (confirm('Apakah Anda yakin akan kembali?')) {
      this.router.navigateToRoute('list');
    }
  }

  determineActivationStrategy() {
    return activationStrategy.replace; //replace the viewmodel with a new instance
    // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
    // or activationStrategy.noChange to explicitly use the default behavior
  }

  save(event) {
    if (confirm("Simpan Keterangan?")) {
      this.syncDescriptionFromOptions();

      const jsonPatch = [
        { op: "replace", path: '/Description', value: this.data.description },
      ];

      this.service.replace(this.data.Id, jsonPatch)
        .then(result => {
          alert("Keterangan berhasil disimpan");
          this.router.navigateToRoute('view', { id: this.idEncode }, { replace: true, trigger: true });
        })
        .catch(e => {
          this.error = e;
          if (e.statusCode === 500) {
            alert("Gagal menyimpan, silakan coba lagi!");
          }
        });
    }
  }

  initializeDescriptionOptions() {
    const savedDescriptions = (this.data.description || '')
      .split(';')
      .map(item => item.trim())
      .filter(item => item);

    this.descriptionOptions.forEach(option => {
      option.selected = savedDescriptions.includes(option.label);
    });

    this.syncDescriptionFromOptions();
  }

  onDescriptionOptionChanged() {
    this.syncDescriptionFromOptions();
  }

  syncDescriptionFromOptions() {
    const selectedDescriptions = this.descriptionOptions
      .filter(option => option.selected)
      .map(option => option.label);

    this.data.description = selectedDescriptions.join('; ');
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
