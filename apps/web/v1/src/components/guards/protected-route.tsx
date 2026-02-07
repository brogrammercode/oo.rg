import { Navigate } from 'react-router-dom';
import { usePermission } from '../../hooks/usePermission';
import { AppRoutes } from '../../constants/routes';

interface ProtectedRouteProps {
    permission?: string;
    children: React.ReactNode;
}

export function ProtectedRoute({ permission, children }: ProtectedRouteProps) {
    const { hasPermission } = usePermission();

    if (!permission) {
        return <>{children}</>;
    }

    if (!hasPermission(permission)) {
        return <Navigate to={AppRoutes.APP} replace />;
    }

    return <>{children}</>;
}
