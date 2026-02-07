import { useOrgStore } from '../stores/org';
import { Permissions } from '../constants/org';

export function usePermission() {
    const { permissions } = useOrgStore();

    const hasPermission = (permission: string): boolean => {
        if (!permissions || permissions.length === 0) return false;
        if (permissions.includes(Permissions.ALL)) return true;
        return permissions.includes(permission);
    };

    const hasAnyPermission = (requiredPermissions: string[]): boolean => {
        if (!permissions || permissions.length === 0) return false;
        if (permissions.includes(Permissions.ALL)) return true;
        return requiredPermissions.some(permission => permissions.includes(permission));
    };

    const hasAllPermissions = (requiredPermissions: string[]): boolean => {
        if (!permissions || permissions.length === 0) return false;
        if (permissions.includes(Permissions.ALL)) return true;
        return requiredPermissions.every(permission => permissions.includes(permission));
    };

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        permissions
    };
}
