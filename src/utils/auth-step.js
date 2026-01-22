import { inject } from 'aurelia-framework';
import { Redirect } from 'aurelia-router';
import { AuthService } from 'aurelia-authentication';
import jwtDecode from 'jwt-decode';

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
                    const token = JSON.parse(storage.get(config.storageKey));
                    var user = jwtDecode(token.data);
                    var routeSettings = route.config.settings || {};
                    var routePermission = routeSettings.permission || {}; // permission is an object like { H70: 1 }
                    // Parse user permissions (stored as JSON string in token)
                    var userPermissions = {};
                    try {
                        userPermissions = user.permission ? JSON.parse(user.permission) : {};
                    } catch (e) {
                        userPermissions = user.permission || {};
                    }

                    // If route has no permission setting, allow access
                    if (Object.keys(routePermission).length === 0) {
                        return false;
                    }

                    // Check if user has the required permission
                    // routePermission format: { "H70": 1 } where key is permission code and value is minimum level
                    for (const [permCode, requiredLevel] of Object.entries(routePermission)) {
                        const userLevel = userPermissions[permCode] || 0;
                        if (userLevel < requiredLevel) {
                            return true; // User doesn't have permission
                        }
                    }

                    return false; // User has permission
                });

                if (hasNoPermission) {
                    return next.cancel(new Redirect(forbiddenRoute));
                }
            }
        }
        else if (isLoggedIn && routingContext.getAllInstructions().some(route => [loginRoute].indexOf(route.fragment) >= 0)) {
            return next.cancel(new Redirect(this.authService.config.loginRedirect));
        }

        return next();
    }
}
