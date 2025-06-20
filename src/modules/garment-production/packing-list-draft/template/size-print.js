import { inject, useView, bindable } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import { Service } from '../service';

@inject(DialogController, Service)
@useView("modules/garment-production/packing-list-draft/template/size-print.html")
export class SizeIndex {

  @bindable readOnly = true;
  @bindable indexText;
  @bindable sizes;
  @bindable PLId;

    constructor(controller, service) {
        this.controller = controller;
        this.answer = null;
        this.service = service;
    }
    formOptions = {
        cancelText: "Back",
        saveText: "Save",
    }
    attached() {
      this._onPopState = () => {
        this.controller.cancel();
      };
      window.addEventListener('popstate', this._onPopState);
    }

    detached() {
      window.removeEventListener('popstate', this._onPopState);
    }
    activate(params) {
        // this.IdPL = params.PLId;
        // this.sizes = [];

    //     this.service.getById(this.IdPL).then(result => {
    //       this.data = result;
    //       console.log(result);
    //       this.service.getSizeByPLId(this.IdPL).then(resultSize => {
    //         console.log("Loaded sizes:",this.IdPL)
    //         if (resultSize && Array.isArray(resultSize.indexSize)) {
    //           // Gunakan data dari getSizeByPLId
    //           const indexSizes = resultSize.indexSize;
    //           this.sizes = indexSizes.map(s => ({
    //             sizeName: s.sizeName,
    //             idx: s.idx || 0
    //           }));
    //         } else {
    //           console.log("tidak ada sizeIndex");
    //           // Data indexSizes kosong/null → ambil dari getById
    //           const uniqueSizes = new Set();
    //           const finalSizes = [];

    //           if (result.items) {
    //             for (const item of result.items) {
    //               for (const detail of item.details || []) {
    //                 for (const size of detail.sizes || []) {
    //                   const sizeName = size.size.size;
    //                   console.log(sizeName);
    //                   if (sizeName && !uniqueSizes.has(sizeName)) {
    //                     uniqueSizes.add(sizeName);
    //                     finalSizes.push({
    //                       sizeName: sizeName,
    //                       idx: 0
    //                     });
    //                   }
    //                 }
    //               }
    //             }
    //           }

    //           this.sizes = finalSizes;
    //         }

    //         console.log("Loaded sizes:", this.sizes);
    //     });
    // });
    this.IdPL = params.PLId;
    this.sizes = [];

    this.service.getById(this.IdPL).then(result => {
      this.data = result;
      console.log(result);

      this.service.getSizeByPLId(this.IdPL).then(resultSize => {
        console.log("Loaded sizes:", this.IdPL);
        
        const sizeMapFromPL = new Map();

        // Ambil semua sizeName unik dari getById
        if (result.items) {
          for (const item of result.items) {
            for (const detail of item.details || []) {
              for (const size of detail.sizes || []) {
                const sizeName = size.size.size;
                if (sizeName && !sizeMapFromPL.has(sizeName)) {
                  sizeMapFromPL.set(sizeName, { sizeName, idx: 0 });
                }
              }
            }
          }
        }

        if (resultSize && Array.isArray(resultSize.indexSize) && resultSize.indexSize.length > 0) {
          // Susun ulang berdasarkan idx dari getSizeByPLId
          const idxMap = new Map(resultSize.indexSize.map(s => [s.sizeName, s.idx || 0]));

          // Ambil dari sizeMapFromPL dan urutkan berdasarkan idx dari getSizeByPLId
          this.sizes = Array.from(sizeMapFromPL.values())
            .map(s => ({
              sizeName: s.sizeName,
              idx: idxMap.get(s.sizeName) || 0
            }))
            .sort((a, b) => a.idx - b.idx);

        } else {
          console.log("tidak ada sizeIndex");

          // Tidak ada resultSize.indexSize → tetap pakai size dari getById, idx default 0
          this.sizes = Array.from(sizeMapFromPL.values());
        }

        console.log("Loaded sizes:", this.sizes);
      });
    });
  }

    sizeColumns = [
        { header: "Size Name" },
        { header: "Index" },
      ]

    saveCallback(event) {
      // Cek jika ada idx = 0
      const emptyIndexes = this.sizes.filter(s => s.idx === 0);
      if (emptyIndexes.length > 0) {
        const names = emptyIndexes.map(s => s.sizeName).join(", ");
        alert(`Index untuk size berikut belum diisi (masih 0): ${names}. Silakan lengkapi terlebih dahulu.`);
        return;
      }

      // Cek jika ada idx yang duplikat
      const idxValues = this.sizes.map(s => s.idx);
      const duplicates = idxValues.filter((val, idx, self) => self.indexOf(val) !== idx);
      if (duplicates.length > 0) {
        const duplicateSizes = this.sizes.filter(s => duplicates.includes(s.idx));
        const duplicateDetails = duplicateSizes.map(s => `${s.sizeName} = ${s.idx}`).join(", ");
        alert(`Index tidak boleh sama. Duplikasi ditemukan pada: ${duplicateDetails}. Silakan ubah nilainya.`);
        return;
      }
      console.log("this Id", this.IdPL);
      // Jika valid, lanjutkan proses simpan
      const dataToSave = {
        packingListId: this.IdPL,
        
        indexSize: this.sizes.map(size => ({
          sizeName: size.sizeName,
          idx: size.idx
        }))
      };

      this.service.saveSize(dataToSave)
        .then(response => {
          alert("Data berhasil disimpan!");
          this.controller.cancel();
        })
        .catch(error => {
          console.error("Gagal menyimpan:", error);
          alert("Terjadi kesalahan saat menyimpan.");
        });
    }

      cancelCallback(event){
        this.controller.cancel();
      }
}
