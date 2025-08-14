// Splash Screen Progress Controller - Standalone version
(function() {
    'use strict';

    class SplashScreenManager {
        constructor() {
            this.progressBar = null;
            this.progressText = null;
            this.splashScreen = null;
            this.currentProgress = 0;
            this.resources = [];
            this.loadedResources = 0;
            this.totalResources = 0;
            this.isInitialized = false;
        }

        init() {
            if (this.isInitialized) return;
            
            this.createSplashScreen();
            this.startProgressSimulation();
            this.trackResourceLoading();
            this.isInitialized = true;
        }

        createSplashScreen() {
            // Create splash screen HTML
            const splashHTML = `
                <div id="splash-screen" class="splash-screen">
                    <div class="splash-logo-container">
                        <svg class="splash-logo" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <!-- Outer circle -->
                            <circle class="logo-circle" cx="100" cy="100" r="90" 
                                    fill="none" stroke="#ffffff" stroke-width="3" opacity="0.8"/>
                            
                            <!-- Inner circle -->
                            <circle class="logo-circle" cx="100" cy="100" r="70" 
                                    fill="none" stroke="#ffffff" stroke-width="2" opacity="0.6"/>
                            
                            <!-- Letter L design based on your logo -->
                            <g class="logo-letter">
                                <!-- Main L curve -->
                                <path d="M 60 60 Q 80 45 100 60 Q 120 75 140 60 Q 160 45 170 70 Q 165 90 150 100 Q 130 110 120 130 Q 110 150 100 140 Q 90 130 85 110 Q 80 90 70 85 Q 60 80 60 60 Z" 
                                      fill="#ffffff" opacity="0.9"/>
                                
                                <!-- Inner curve detail -->
                                <path d="M 80 80 Q 95 70 110 80 Q 125 90 130 100 Q 125 110 115 115 Q 105 120 100 110 Q 95 100 90 95 Q 85 90 80 80 Z" 
                                      fill="#1a4d72" opacity="0.8"/>
                                
                                <!-- Bottom curl -->
                                <circle cx="120" cy="130" r="15" fill="#ffffff" opacity="0.7"/>
                                <circle cx="120" cy="130" r="8" fill="#1a4d72" opacity="0.8"/>
                                
                                <!-- Left curl -->
                                <circle cx="70" cy="85" r="12" fill="#ffffff" opacity="0.7"/>
                                <circle cx="70" cy="85" r="6" fill="#1a4d72" opacity="0.8"/>
                                
                                <!-- Right top curve -->
                                <circle cx="150" cy="75" r="10" fill="#ffffff" opacity="0.7"/>
                                <circle cx="150" cy="75" r="5" fill="#1a4d72" opacity="0.8"/>
                            </g>
                            
                            <!-- Decorative dots -->
                            <circle cx="50" cy="100" r="3" fill="#ffffff" opacity="0.6">
                                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="150" cy="100" r="3" fill="#ffffff" opacity="0.6">
                                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="100" cy="50" r="3" fill="#ffffff" opacity="0.6">
                                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1s" repeatCount="indefinite"/>
                            </circle>
                            <circle cx="100" cy="150" r="3" fill="#ffffff" opacity="0.6">
                                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1.5s" repeatCount="indefinite"/>
                            </circle>
                        </svg>
                    </div>
                    
                    <div class="progress-container">
                        <div class="progress-bar-wrapper">
                            <div class="progress-bar-fill" id="progress-fill"></div>
                        </div>
                        <div class="progress-text" id="progress-text">
                            <span class="loading-dots">Memuat aplikasi</span>
                        </div>
                    </div>
                </div>
            `;

            // Hide existing splash screen
            const existingSplash = document.querySelector('.splash');
            if (existingSplash) {
                existingSplash.style.display = 'none';
            }

            // Insert new splash screen
            document.body.insertAdjacentHTML('afterbegin', splashHTML);
            
            this.splashScreen = document.getElementById('splash-screen');
            this.progressBar = document.getElementById('progress-fill');
            this.progressText = document.getElementById('progress-text');
        }

        trackResourceLoading() {
            // Track stylesheets and scripts
            const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
            const scripts = document.querySelectorAll('script[src]');
            
            this.totalResources = stylesheets.length + scripts.length + 5; // +5 for app loading
            
            // Track existing resources
            stylesheets.forEach(link => {
                if (link.sheet && link.sheet.cssRules) {
                    this.onResourceLoaded();
                } else {
                    link.addEventListener('load', () => this.onResourceLoaded());
                    link.addEventListener('error', () => this.onResourceLoaded());
                }
            });

            // Additional resource tracking for images that might load later
            setTimeout(() => {
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    if (img.complete) {
                        this.onResourceLoaded();
                    } else {
                        img.addEventListener('load', () => this.onResourceLoaded());
                        img.addEventListener('error', () => this.onResourceLoaded());
                    }
                });
            }, 500);
        }

        onResourceLoaded() {
            this.loadedResources++;
            const resourceProgress = Math.min((this.loadedResources / this.totalResources) * 40, 40); // Max 40% for resources
            this.updateProgress(Math.max(this.currentProgress, resourceProgress));
        }

        startProgressSimulation() {
            const steps = [
                { progress: 10, text: 'Memuat aplikasi', delay: 300 },
                { progress: 25, text: 'Menginisialisasi framework', delay: 600 },
                { progress: 40, text: 'Memuat komponen', delay: 800 },
                { progress: 60, text: 'Menyiapkan antarmuka', delay: 700 },
                { progress: 80, text: 'Konfigurasi sistem', delay: 500 },
                { progress: 90, text: 'Finalisasi', delay: 400 }
            ];

            let currentStep = 0;
            
            const runStep = () => {
                if (currentStep < steps.length) {
                    const step = steps[currentStep];
                    setTimeout(() => {
                        this.updateProgress(step.progress, step.text);
                        currentStep++;
                        runStep();
                    }, step.delay);
                }
            };

            setTimeout(runStep, 200);
        }

        updateProgress(progress, text) {
            if (!this.progressBar) return;
            
            this.currentProgress = Math.max(this.currentProgress, progress);
            this.progressBar.style.width = this.currentProgress + '%';
            
            if (text && this.progressText) {
                this.progressText.innerHTML = '<span class="loading-dots">' + text + '</span>';
            }
        }

        markAppReady() {
            this.updateProgress(100, 'Aplikasi siap');
            
            setTimeout(() => {
                if (this.splashScreen) {
                    this.splashScreen.classList.add('hide');
                    
                    setTimeout(() => {
                        if (this.splashScreen && this.splashScreen.parentNode) {
                            this.splashScreen.parentNode.removeChild(this.splashScreen);
                        }
                    }, 500);
                }
            }, 800);
        }

        hide() {
            this.markAppReady();
        }
    }

    // Initialize splash screen manager
    window.splashManager = new SplashScreenManager();

    // Start splash screen when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            window.splashManager.init();
        });
    } else {
        window.splashManager.init();
    }

})();
