// we want font-awesome to load as soon as possible to show the fa-spinner
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/styles.css';
import '../styles/styles.components.css';
import '../styles/styles.login.css';
import '../styles/styles.theme.css';
import '../styles/dashboard.css';
import '../styles/splash-screen.css';
import 'bootstrap';
import authConfig from "../auth-config";
import { Config } from "aurelia-api";
import { AuthService } from 'aurelia-authentication';
let authService;

// comment out if you don't want a Promise polyfill (remove also from webpack.common.js)
import * as Bluebird from 'bluebird';
Bluebird.config({ warnings: false });

// === Idle Timeout / Auto-Logout ===
const IDLE_TIMEOUT_MINUTES = 1;
let idleTimer;
let warningTimer;
let warningPopup;
let countdownInterval;

let idleEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
let warningActive = false;

function enableIdleEvents() {
    if (!idleEventsActive) {
        idleEvents.forEach(event => {
            window.addEventListener(event, resetIdleTimer);
        });
        idleEventsActive = true;
    }
}

function disableIdleEvents() {
    if (idleEventsActive) {
        idleEvents.forEach(event => {
            window.removeEventListener(event, resetIdleTimer);
        });
        idleEventsActive = false;
    }
}

// function updateLastLogin() {
//     console.log(authService);
//     console.log(authEndpoint);
//     if (authEndpoint && authService) {
//         authEndpoint.update('me', null, {})
//             .then(() => {
//                 authService.getMe()
//                     .then((result) => {
//                         // result.data berisi user terbaru
//                         // Jika ingin update state global, tambahkan di sini
//                         resetIdleTimer();
//                     });
//             })
//             .catch((error) => {
//                 console.error('Error updating last login time:', error);
//                 resetIdleTimer(); // Tetap reset timer meski gagal
//             });
//     } else {
//         resetIdleTimer();
//     }
// }


function showWarningPopup() {
    // Jangan tampilkan popup jika sudah di halaman login
    if (window.location.hash.indexOf('#/login') !== -1) return;
    // Jika popup sudah ada, jangan buat lagi
    if (document.getElementById('idle-warning-popup')) return;
    warningActive = true;
    const warningDurationSeconds = 3600; 
    const warningEndAt = Date.now() + (warningDurationSeconds * 1000);
    warningPopup = document.createElement('div');
    warningPopup.id = 'idle-warning-popup';
    warningPopup.style.position = 'fixed';
    warningPopup.style.top = '0';
    warningPopup.style.left = '0';
    warningPopup.style.width = '100vw';
    warningPopup.style.height = '100vh';
    warningPopup.style.background = 'rgba(0,0,0,0.3)';
    warningPopup.style.display = 'flex';
    warningPopup.style.justifyContent = 'center';
    warningPopup.style.alignItems = 'center';
    warningPopup.style.zIndex = '9999';
    warningPopup.innerHTML = `
        <div style="background:white;padding:32px;border-radius:8px;box-shadow:0 2px 8px #0003;text-align:center;">
            <h3>Anda akan logout otomatis dalam <span id="idle-countdown">${formatDuration(warningDurationSeconds)}</span></h3>
            <p>Silakan klik tombol di bawah jika Anda masih aktif.</p>
            <button class="btn btn-primary" id="idle-warning-btn" style="padding:8px 24px;font-size:16px;">I'm here</button>
        </div>
    `;
    document.body.appendChild(warningPopup);
    document.getElementById('idle-warning-btn').onclick = () => {
        resetIdleTimer();
        hideWarningPopup();
    };
    let blinkOn = true;
    countdownInterval = setInterval(() => {
        const remainingMs = Math.max(0, warningEndAt - Date.now());
        const secondsLeft = Math.ceil(remainingMs / 1000);
        const countdownSpan = document.getElementById('idle-countdown');
        if (countdownSpan) {
            countdownSpan.textContent = formatDuration(secondsLeft);

            if (secondsLeft <= 300 && remainingMs > 0) {
                countdownSpan.style.color = '#d9534f';
                countdownSpan.style.fontWeight = '700';
                blinkOn = !blinkOn;
                countdownSpan.style.opacity = blinkOn ? '1' : '0.2';
            } else {
                countdownSpan.style.color = '';
                countdownSpan.style.fontWeight = '';
                countdownSpan.style.opacity = '1';
            }
        }
        if (remainingMs <= 0) {
            clearInterval(countdownInterval);
            hideWarningPopup();
            // Logout otomatis
            if (authService) {
                authService.logout().then(() => {
                    window.location.href = '#/login';
                });
            } else {
                window.localStorage.clear();
                window.location.href = '#/login';
            }
        }
    }, 1000);
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function hideWarningPopup() {
    if (warningPopup) {
        warningPopup.remove();
        warningPopup = null;
    }
    clearInterval(countdownInterval);
    warningActive = false;
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    clearTimeout(warningTimer);
    if (warningActive) return; // Jangan reset timer jika popup warning sedang tampil
    hideWarningPopup();
    idleTimer = setTimeout(() => {
        showWarningPopup(); // Munculkan popup setelah 15 menit
    }, IDLE_TIMEOUT_MINUTES * 60 * 1000);
}

function setupIdleTimeout() {
    idleEvents.forEach(event => {
        window.addEventListener(event, resetIdleTimer);
    });
    resetIdleTimer();
}

export async function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature('au-components')
        .feature('components')
        .feature('converters')
        .plugin("aurelia-api", config => {
            var offset = new Date().getTimezoneOffset() / 60 * -1;
            var defaultConfig = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-timezone-offset': offset
                }
            }


            var core = "https://com-danliris-service-core-dev.azurewebsites.net/v1/";
            //var auth = "https://com-danliris-service-auth-dev.azurewebsites.net/v1/";
            //var auth = "http://localhost:5263/v1/";
            var auth = "https://com-danliris-service-auth-v8-dev.azurewebsites.net/v1/";

            var production = "https://dl-production-webapi-dev.azurewebsites.net/v1/";
            var productionAzure = "https://com-danliris-service-finishing-printing-dev.azurewebsites.net/v1/";
            var purchasing = "https://dl-purchasing-webapi-dev.azurewebsites-dev.net/v1/";
            var purchasingAzure = "https://com-danliris-service-purchasing-dev.azurewebsites.net/v1/";
            var garmentPurchasing = "https://dl-purchasing-garment-webapi.azurewebsites.net/v1/";
            var inventory = "https://dl-inventory-webapi.azurewebsites.net/v1/";
            var inventoryAzure = "https://com-danliris-service-inventory-dev.azurewebsites.net/v1/";
            var garmentMasterPlan = "https://dl-garment-master-plan-webapi-dev.azurewebsites.net/v1/";
            var spMasterPlan = "https://dl-sp-master-plan-webapi-dev.mybluemix.net/v1/";
            var spinning = "https://com-danliris-service-spinning-dev.azurewebsites.net/";
            var intPurchasing = "https://com-danliris-service-internal-transfer-dev.azurewebsites.net/v1/";
            var customsReport = "https://com-danliris-service-support-dev.azurewebsites.net/v1/";
            var merchandiser = "https://com-danliris-service-md-dev.azurewebsites.net/v1/";
            const dealTracking = 'https://com-danliris-service-deal-tracking-dev.azurewebsites.net/v1/';
            const sales = "https://com-danliris-service-sales-dev.azurewebsites.net/v1/";
            var weaving = "https://com-danliris-service-weaving-dev.azurewebsites.net/";
            var finance = "https://com-danliris-service-finance-accounting-dev.azurewebsites.net/v1/";
            var garmentProduction = "https://com-danliris-service-garment-dev.azurewebsites.net/";
            var packingInventory = "https://com-danliris-service-packing-inventory-dev.azurewebsites.net/v1/";
            var dyeing = "https://dyeing-printing-etl-service-dev.azurewebsites.net/api/";
           
            const garmentShipping = "https://garment-etl-service-dev.azurewebsites.net/api/";
            var ItInven = "https://it-inventory-etl-service-v8.azurewebsites.net/api/";
            var danlirisReport = "https://com-danliris-service-it-inventory.azurewebsites.net/v1/";
            console.log(defaultConfig);
            config.registerEndpoint('auth', auth);
            config.registerEndpoint('core', core);
            config.registerEndpoint('production', production, defaultConfig);
            config.registerEndpoint('production-azure', productionAzure, defaultConfig);
            config.registerEndpoint('purchasing', purchasing, defaultConfig);
            config.registerEndpoint('purchasing-azure', purchasingAzure, defaultConfig);
            config.registerEndpoint('garment-purchasing', garmentPurchasing, defaultConfig);
            config.registerEndpoint('inventory', inventory, defaultConfig);
            config.registerEndpoint('inventory-azure', inventoryAzure, defaultConfig);
            config.registerEndpoint('garment-master-plan', garmentMasterPlan, defaultConfig);
            config.registerEndpoint('spinning', spinning, defaultConfig);
            config.registerEndpoint('int-purchasing', intPurchasing, defaultConfig);
            config.registerEndpoint('customs-report', customsReport, defaultConfig);
            config.registerEndpoint('merchandiser', merchandiser, defaultConfig);
            config.registerEndpoint('deal-tracking', dealTracking, defaultConfig);
            config.registerEndpoint('sales', sales, defaultConfig);
            config.registerEndpoint('weaving', weaving, defaultConfig);
            config.registerEndpoint('finance', finance, defaultConfig);
            config.registerEndpoint('garment-production', garmentProduction, defaultConfig);
            config.registerEndpoint('packing-inventory', packingInventory, defaultConfig);
            config.registerEndpoint('dyeing', dyeing, { headers: { Accept: '*/*', 'Sec-Fetch-Site': 'cross-site' }, mode: 'cors' });
            config.registerEndpoint('garment-shipping', garmentShipping, defaultConfig);
            config.registerEndpoint('ItInven', ItInven, { headers: { Accept: '*/*', 'Sec-Fetch-Site': 'cross-site' }, mode: 'cors' });
            config.registerEndpoint('dl-report', danlirisReport, defaultConfig);
        })
        .plugin("aurelia-authentication", baseConfig => {
            baseConfig.configure(authConfig);
            authService = aurelia.container.get(AuthService);

            if (baseConfig.client && baseConfig.client.client) {
                var offset = new Date().getTimezoneOffset() / 60 * -1;
                baseConfig.client.client.withDefaults({
                    headers: {
                        'x-timezone-offset': offset
                    }
                })
            }
        })
        .plugin('aurelia-dialog', config => {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 5;
        })
        .plugin('aurelia-dragula')
        .plugin('aurelia-bootstrap')
        .plugin('aurelia-google-analytics', (config) => {
            config.init('UA-138671841-2');
            config.attach({
                logging: {
                    // Set to `true` to have some log messages appear in the browser console.
                    enabled: true
                },
                pageTracking: {
                    // Set to `false` to disable in non-production environments.
                    enabled: true,
                    // Configure fragments/routes/route names to ignore page tracking for
                    ignore: {
                        fragments: [], // Ignore a route fragment, login fragment for example: ['/login']
                        routes: [], // Ignore a route, login route for example: ['login']
                        routeNames: [] // Ignore a route name, login route name for example: ['login-route']
                    },
                    // Optional. By default it gets the title from payload.instruction.config.title.
                    getTitle: (payload) => {
                        // For example, if you want to retrieve the tile from the document instead override with the following.
                        return document.title;
                    },
                    // Optional. By default it gets the URL fragment from payload.instruction.fragment.
                    getUrl: (payload) => {
                        // For example, if you want to get full URL each time override with the following.
                        return window.location.href;
                    }
                },
                clickTracking: {
                    // Set to `false` to disable in non-production environments.
                    enabled: true,
                    // Optional. By default it tracks clicks on anchors and buttons.
                    filter: (element) => {
                        // For example, if you want to also track clicks on span elements override with the following.
                        return element instanceof HTMLElement &&
                            (element.nodeName.toLowerCase() === 'a' ||
                                element.nodeName.toLowerCase() === 'button' ||
                                element.nodeName.toLowerCase() === 'span');
                    }
                },
                exceptionTracking: {
                    // Set to `false` to disable in non-production environments.
                    enabled: true
                }
            });
        })
        .developmentLogging();

    // Uncomment the line below to enable animation.
    // aurelia.use.plugin('aurelia-animator-css');
    // if the css animator is enabled, add swap-order="after" to all router-view elements

    // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
    // aurelia.use.plugin('aurelia-html-import-template-loader')

    await aurelia.start();
    //authEndpoint = aurelia.container.get(Config).getEndpoint('auth');
    aurelia.setRoot('app');

    // Mark app as ready for splash screen
    setTimeout(() => {
        if (window.splashManager) {
            window.splashManager.markAppReady();
        }
    }, 1000);

    // Setup idle timeout
    setupIdleTimeout();

    // if you would like your website to work offline (Service Worker), 
    // install and enable the @easy-webpack/config-offline package in webpack.config.js and uncomment the following code:
    /*
    const offline = await System.import('offline-plugin/runtime');
    offline.install();
    */
}
