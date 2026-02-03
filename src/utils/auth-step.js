import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { AuthService } from 'aurelia-authentication';
import jwtDecode from 'jwt-decode';
import * as XLSX from "xlsx";

@inject(AuthService)
export class AuthStep {
    constructor(authService) {
        this.authService = authService;
    }

    run(routingContext, next) {
        const isLoggedIn = this.authService.authenticated;
        const loginRoute = this.authService.config.loginRoute;
        const config = this.authService.authentication.config;
        const storage = this.authService.authentication.storage;
        const forbiddenRoute = "/";

        if (routingContext.getAllInstructions().some(route => route.config.auth === true)) {
            if (!isLoggedIn) {
                return next.cancel(new Redirect(loginRoute));
            }
            else {
                // Check permission for the route
                const hasNoPermission = routingContext.getAllInstructions().some(route => {
                    const allRoutes = route.router.routes; // ALL ROUTES
                    //this.exportDuplicateRoutesToExcel(allRoutes);
                    const token = JSON.parse(storage.get(config.storageKey));
                    const user = jwtDecode(token.data);
                    const routeSettings = route.config.settings || {};
                    const routePermission = routeSettings.permission || {}; // { H27: 1 }
                    let userPermissions = {};
                    try {
                        userPermissions = user.permission ? JSON.parse(user.permission) : {};
                    } catch(e) {
                        userPermissions = user.permission || {};
                    }

                    //console.group("============================ PERMISSION CHECK START ===========================");
                    //console.log("Current Route Name:", route.config.route);
                    //console.log("Route Settings:", routeSettings);
                    // console.log("Route Permission (raw):", routePermission);
                    // console.log("User Permissions:", userPermissions);
                    // console.log(" All Routes:", allRoutes);

                    // route tanpa permission → allow
                    if (!routePermission || Object.keys(routePermission).length === 0) {
                        // console.warn("⚠️ Route has NO permission requirement → ALLOW");
                        // console.groupEnd();
                        return false;
                    }

                    /**
                     * 1. Ambil permission code dari route aktif
                     * contoh: { H27: 1 } → "H27"
                     */
                    const currentPermissionCode = Object.keys(routePermission)[0];
                    //console.log("Current Permission Code:", currentPermissionCode);

                    /**
                     * 2. Cari route di allRoutes yang punya permission code tsb
                     */
                    const matchedRoute = allRoutes.find(r => {
                        const p = r.settings.permission;
                        return p && Object.keys(p)[0] === currentPermissionCode;
                    });

                    //console.log("Matched Route:", matchedRoute);

                    if (!matchedRoute) {
                        // console.error("Permission code NOT FOUND in allRoutes → BLOCK");
                        // console.groupEnd();
                        return true;
                    }
                    /**
                     * DOMAIN / HALAMAN UTAMA
                     * permission: { "*": 0 }
                     */
                    const isPublicDomain =
                        Object.keys(routePermission).length === 1 &&
                        routePermission["*"] === 0;

                    if (isPublicDomain) {
                        // console.info("PUBLIC DOMAIN (*:0) → ALLOW ACCESS");
                        // console.groupEnd();
                        return false;
                    }

                    /**
                     * 3. Ambil route dari matched route
                     */
                    const routess = matchedRoute.route;
                    //console.log("ROUTES:", routess);

                    /**
                     * 4. Ambil semua routes dengan route yang sama
                     */
                    const sameMenuRoutes = allRoutes.filter(r => r.route === routess);
                    //console.log("Routes with SAME menu:", sameMenuRoutes);

                    /**
                     * 5. Ambil semua permission code dalam menu tersebut
                     */
                    const menuPermissionCodes = sameMenuRoutes
                        .map(r => r.settings.permission)
                        .filter(Boolean)
                        .flatMap(p => Object.keys(p));

                    //console.log("Menu Permission Codes:", menuPermissionCodes);

                    /**
                     * 6. Validasi user permission
                     * cukup punya SATU permission bernilai 1
                     */
                    const hasPermission = menuPermissionCodes.some(code => {
                        const value = Number(userPermissions[code] || 0);
                        //console.log(`Check User Permission → ${code}:`, value);
                        return value === 1;
                    });

                    // console.log("FINAL RESULT → Has Permission ?", hasPermission);
                    // console.groupEnd();

                    return !hasPermission; // true = BLOCK
                });

                if (hasNoPermission) {
                    //console.warn("USER BLOCKED → REDIRECT TO FORBIDDEN");
                    return next.cancel(new Redirect(forbiddenRoute));
                }
            }
        }
        else if (isLoggedIn && routingContext.getAllInstructions().some(route => [loginRoute].indexOf(route.fragment) >= 0)) {
            return next.cancel(new Redirect(this.authService.config.loginRedirect));
        }

        return next();
    }
// exportDuplicateRoutesToExcel(allRoutes) {
//     console.group(" EXPORT DUPLICATE ROUTES");

//     if (!allRoutes || !allRoutes.length) {
//         console.warn("No routes found");
//         console.groupEnd();
//         return;
//     }

//     // Helper ambil permission code
//     const getPermissionCode = (route) => {
//         const p = route.settings && route.settings.permission;
//         if (!p || Object.keys(p).length === 0) return "-";
//         return Object.keys(p)[0];
//     };

//     // Mapping semua route
//     const mappedRoutes = allRoutes.map(r => ({
//         menuName: r.name || "-",
//         permissionCode: getPermissionCode(r),
//         route: r.route || r.path || "-"
//     }));

//     console.log(" Mapped Routes:", mappedRoutes);

//     /**
//      *  DUPLIKAT BERDASARKAN ROUTE SAJA
//      */
//     const map = {};
//     mappedRoutes.forEach(r => {
//         const key = r.route; //  HANYA ROUTE
//         if (!map[key]) {
//             map[key] = [];
//         }
//         map[key].push(r);
//     });

//     // Ambil hanya yang duplikat
//     const duplicates = Object.values(map)
//         .filter(group => group.length > 1)
//         .flat();

//     console.log(" Duplicate Routes (by route):", duplicates);

//     if (!duplicates.length) {
//         console.warn("No duplicate routes found");
//         console.groupEnd();
//         return;
//     }

//     // Format untuk Excel
//     const excelData = duplicates.map((r, i) => ({
//         No: i + 1,
//         MenuName: r.menuName,
//         PermissionCode: r.permissionCode,
//         Route: r.route
//     }));

//     // Buat worksheet
//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DuplicateRoutes");

//     // Download
//     XLSX.writeFile(workbook, "duplicate-routes.xlsx");

//     console.info(" Excel generated: duplicate-routes.xlsx");
//     console.groupEnd();
// }

}
