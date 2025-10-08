import { Aurelia, inject } from 'aurelia-framework';
import { AuthService } from "aurelia-authentication";
import { Service } from './modules/auth/account/service';
import '../styles/signin.css';
import { PasswordValidator } from './utils/password-validator';

@inject(AuthService, Service)
export class ChangePass {
    // username = "dev";
    // password = "Standar123";

    username = "";
    // password="";
    error = false;
    disabledButton = false;
    statusMessage = null;

    constructor(authService, service) {
        this.authService = authService;
        this.service = service;
    }

    async activate(params) {
        console.log("param", params);
        this.username = params.Username;
    }

    save() {
        this.error = false;
        this.disabledButton = true;
        this.data = {};
        if (this.password1 == this.password2) {

            // this.statusMessage = PasswordValidator.validate(this.password1);

            // if (this.statusMessage) {
            //     alert(this.statusMessage);
            //     this.disabledButton = false;
            // } else {
                this.data.username = this.username;
                this.data.password = this.password1;

                this.service.updatePass(this.data)
                    .then(result => {
                        alert("Kata Sandi Berhasil DiUbah");
                        this.authService.logout("#/login");
                    })
                    .catch(e => {
                        this.error = e;
                        this.disabledButton = false;
                    })
            // }
        } else {
            alert("Kata Sandi dan Konfirmasi Kata Sandi harus sama.")
            this.disabledButton = false;
        }
    }

    // validatePass(password) {

    //     // Validasi null atau kosong
    //     if (password == null || password.trim() === "" || password === undefined) {
    //         return "Password harus diisi.";
    //     }

    //     // Validasi panjang minimal
    //     if (password.length < 8) {
    //         return "Password minimal harus 8 karakter.";
    //     }

    //     // Validasi karakter tidak valid (opsional)
    //     if (/[\u0000-\u001F]/.test(password)) {
    //         return "Password mengandung karakter tidak valid.";
    //     }

    //     // Validasi hanya huruf atau hanya angka
    //     if (/^[a-zA-Z]+$/.test(password)) {
    //         return "Password tidak boleh hanya huruf.";
    //     }

    //     if (/^\d+$/.test(password)) {
    //         return "Password tidak boleh hanya angka.";
    //     }

    //     // Validasi karakter yang berulang lebih dari 3 kali berturut-turut
    //     if (/(.)\1{3,}/.test(password)) {
    //         return "Password tidak boleh mengandung karakter yang sama lebih dari 3 kali berturut-turut.";
    //     }

    //     return null; // Password valid
    // }
} 