import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';
import { ApprovalEnum } from './enum/approval-enum';
import { Dialog } from '../../../au-components/dialog/dialog';
import { RejectReasonDialog } from './dialog/reject-reason-dialog';


@inject(Router, Service, Dialog)
export class View {
    hasApproval = false;

    constructor(router, service, dialog) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;
    }

    async activate(params) {
        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
        this.hasApproval = this.data.approvalStatusEnum === ApprovalEnum.REQUESTED;
    }

    cancel(event) {
        var r = confirm("Apakah Anda yakin akan kembali?")
        if (r == true) {
            this.router.navigateToRoute('list');
        }
    }

    approve(event) {
        if (confirm("Approve Anda yakin approve Nota Intern VS Invoice Eksternal ini?")) {
            const jsonPatch = [
                { op: "replace", path: '/ApprovalStatus', value: ApprovalEnum.APPROVED },
            ];

            this.service.replace(this.data.Id, jsonPatch)
                .then(() => {
                    alert("Approve berhasil");
                    this.router.navigateToRoute('list');
                })
                .catch(e => {
                    this.error = e;
                    if (e.statusCode === 500) {
                        alert("Gagal menyimpan, silakan coba lagi!");
                    }
                });
        }
    }

    reject(event) {
        this.dialog.show(RejectReasonDialog, {
            title: 'Reject Verifikasi NI dan Invoice External'
        }).then(response => {
            if (response.wasCancelled) {
                return;
            }

            const reason = (response.output || '').trim();
            const jsonPatch = [
                { op: 'replace', path: '/ApprovalStatus', value: ApprovalEnum.REJECTED },
                { op: 'replace', path: '/ApprovalDescription', value: reason }
            ];

            return this.service.replace(this.data.Id, jsonPatch)
                .then(() => {
                    alert('Reject berhasil');
                    this.router.navigateToRoute('list');
                })
                .catch(e => {
                    this.error = e;
                    if (e.statusCode === 500) {
                        alert('Gagal menyimpan, silakan coba lagi!');
                    }
                });
        });
    }

}
