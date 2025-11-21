import { inject, bindable, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';

@inject(Router, Service)
export class Create {
    @bindable errorManual = [];
    @bindable errorUpload = [];
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.data = {};
        this.error = {};
        this.create = true;
        this.dataMaterialUpload = [];
        this.dataMaterial = [];
        
    }

    list() {
        this.router.navigateToRoute('list');
    }

    cancelCallback(event) {
        this.list();
    }

    saveCallback() {
        if(!this.data.IsSample){
            this.data.SampleDescription = null;
         }
         // Gabungkan materials dari upload & manual dengan aman
        const uploadMaterials = Array.isArray(this.dataMaterialUpload) ? this.dataMaterialUpload : [];
        const manualMaterials = Array.isArray(this.dataMaterial) ? this.dataMaterial : [];

        this.data.CostCalculationGarment_Materials = [
            ...uploadMaterials,
            ...manualMaterials
        ];
        
        this.data.CostCalculationGarment_Materials.forEach(
            (m, i) => (m.MaterialIndex = i)
        );
        this.service.create(this.data)
            .then(result => {
                alert("Data berhasil dibuat");
                this.list();
            })
            .catch(e => {

            const uploadCount = this.dataMaterialUpload.length || 0;
            const manualCount = this.dataMaterial.length || 0;

            this.errorUpload = [];
            this.errorManual = [];

            if (e && Array.isArray(e.CostCalculationGarment_Materials)) {

                e.CostCalculationGarment_Materials.forEach((materialError, index) => {

                    // === TABEL 1 (UPLOAD NORMAL) ===
                    if (index < uploadCount) {

                        const item = this.dataMaterialUpload[index];
                        const kodeBarang = item.Product ? item.Product.Code : "Unknown";

                        if (materialError.Category) {
                            this.errorUpload[index] = {
                                Category: `Kategori dengan Kode Barang ${kodeBarang} tidak ditemukan`
                            };
                        } else {
                            this.errorUpload[index] = materialError;
                        }

                        return;
                    }

                    // === TABEL 2 (UPLOAD PR MASTER + MANUAL) ===

                    const manualIndex = index - uploadCount; // mulai dari 0
                    const manualItem = this.dataMaterial[manualIndex];
                    const kodeBarangManual = manualItem.Product ? manualItem.Product.Code : "Unknown";

                    console.log(manualItem);
                    const isUploadPRMaster =
                        manualItem.IsFromUpload === true;

                    if (materialError.Category && isUploadPRMaster) {
                        this.errorManual[manualIndex] = {
                            Category: `Kategori dengan Kode Barang ${kodeBarangManual} tidak ditemukan`
                        };
                    } else {
                        this.errorManual[manualIndex] = materialError || {};
                    }
                });
            }


            // --- Pesan Error Lain ---
            if (e && e.message && e.message.includes("CategoryComodity")) {
                const parts = e.message.split(":");
                alert((parts[1] || e.message).trim());
            }
            else if (e.statusCode === 500) {
                alert("Gagal menyimpan, silakan coba lagi!");
            }
            else {
                this.error = e;
            }

            if (this.data.CostCalculationGarment_Materials &&
                this.data.CostCalculationGarment_Materials.length > 0) {

                this.dataMaterialUpload = this.data.CostCalculationGarment_Materials
                    .filter(m => m.IsFromUpload && !m.IsAddPRMaster);

                this.dataMaterial = this.data.CostCalculationGarment_Materials
                    .filter(m => !m.IsFromUpload || m.IsAddPRMaster);

                this.dataMaterialUpload.forEach((item, idx) => {
                    item.MaterialIndex = idx;
                });

                this.dataMaterial.forEach((item, idx) => {
                    item.MaterialIndex = idx;
                });
            }
        });
    }
}
