import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, PurchasingService } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service, PurchasingService)
export class Edit {
    // @bindable errorManual = [];
    // @bindable errorUpload = [];
    constructor(router, service, prService) {
        this.router = router;
        this.service = service;
        this.prService = prService;
        this.data = {};
        this.error = {};
        this.dataMaterialUpload = [];
        this.dataMaterial = [];
    }

    async activate(params) {
        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);

        if (this.data) {
            this.selectedPreSalesContract = {
                SCNo: this.data.PreSCNo
            }

            // this.selectedBookingOrder = {
            //     BookingOrderId :this.data.BookingOrderId,
            //     BookingOrderItemId : this.data.BookingOrderItemId,
            //     BookingOrderNo : this.data.BookingOrderNo, 
            //     ConfirmDate : this.data.ConfirmDate,
            //     ConfirmQuantity : this.data.BOQuantity,
            //     ComodityName : this.data.Commodity,
            // }

            const prMasterIds = this.data.CostCalculationGarment_Materials
                .filter((m, i) => m.PRMasterId > 0 && this.data.CostCalculationGarment_Materials.findIndex(d => d.PRMasterId === m.PRMasterId) === i)
                .map(m => `Id==${m.PRMasterId}`);

            const prMasterItemIds = this.data.CostCalculationGarment_Materials
                .filter((item, index) => item.PRMasterItemId > 0 && this.data.CostCalculationGarment_Materials.findIndex(d => d.PRMasterItemId === item.PRMasterItemId) === index)
                .map(item => item.PRMasterItemId);

            if (prMasterIds.length > 0) {
                let prMasterFilter = {};
                prMasterFilter[`(${prMasterIds.join("||")})`] = true;

                const prMasterResult = await this.prService.search({
                    size: 10000,
                    select: JSON.stringify({ "Id": "1", "Items.Id": "1", "Items.Quantity": "1" }),
                    filter: JSON.stringify(prMasterFilter)
                });
                let prMasters = [];
                for (const d of prMasterResult.data) {
                    for (const i of d.Items) {
                        prMasters.push({
                            PRMasterId: d.Id,
                            PRMasterItemId: i.Id,
                            Quantity: i.Quantity
                        });
                    }
                }

                let materialsFilter = {};
                materialsFilter[`(CostCalculationGarmentId == ${id})`] = false;

                const ccMaterialsResults = await this.service.getMaterials({
                    size: 0,
                    select: "new(PRMasterId, PRMasterItemId, BudgetQuantity)",
                    prmasteritemids: JSON.stringify(prMasterItemIds),
                    filter: JSON.stringify(materialsFilter)
                });
                const ccMaterials = ccMaterialsResults.data;

                this.data.CostCalculationGarment_Materials.forEach(material => {
                    if (material.PRMasterItemId > 0) {
                        const quantity = prMasters.find(pr => pr.PRMasterItemId === material.PRMasterItemId).Quantity;
                        const budgetQuantities = ccMaterials.filter(m => m.PRMasterItemId === material.PRMasterItemId).reduce((acc, cur) => acc + cur.BudgetQuantity, 0);
                        material.AvailableQuantity = quantity - budgetQuantities;
                    }
                });
            }
        }
    }

    cancelCallback(event) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    saveCallback(event) {
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
        this.service.update(this.data)
            .then(result => {
                const encoded = Base64Helper.encode(this.data.Id);
                this.router.navigateToRoute('view', { id: encoded });
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
