import type { ReactNode } from 'react';
import { usePermission } from '../../hooks/usePermission';

interface PermissionGuardProps {
    permission?: string;
    anyPermission?: string[];
    allPermissions?: string[];
    children: ReactNode;
    fallback?: ReactNode;
}

export function PermissionGuard({
    permission,
    anyPermission,
    allPermissions,
    children,
    fallback = null
}: PermissionGuardProps) {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

    let hasAccess = false;

    if (permission) {
        hasAccess = hasPermission(permission);
    } else if (anyPermission && anyPermission.length > 0) {
        hasAccess = hasAnyPermission(anyPermission);
    } else if (allPermissions && allPermissions.length > 0) {
        hasAccess = hasAllPermissions(allPermissions);
    }

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
