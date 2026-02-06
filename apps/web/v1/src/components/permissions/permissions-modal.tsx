import { useState, useEffect } from 'react';
import { X, Check, Shield } from 'lucide-react';
import { Modal } from '../ui/modal';
import { useOrgStore } from '../../stores/org';
import orgService from '../../services/org/org.service';
import { getPermissionsForMenuItem } from '../../utils/permissions';
import type { Role } from '../../types/org';

interface PermissionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuItemLabel: string;
}

export function PermissionsModal({ isOpen, onClose, menuItemLabel }: PermissionsModalProps) {
    const { org } = useOrgStore();
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && org) {
            fetchRoles();
        }
    }, [isOpen, org]);

    useEffect(() => {
        setPermissions(getPermissionsForMenuItem(menuItemLabel));
    }, [menuItemLabel]);

    const fetchRoles = async () => {
        if (!org) return;
        try {
            setLoading(true);
            const res = await orgService.getRoles(org._id);
            const rolesData = res.data.data.roles || [];
            setRoles(rolesData);
            if (rolesData.length > 0) {
                setSelectedRole(rolesData[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const hasPermission = (permission: string): boolean => {
        if (!selectedRole?.permissions) return false;
        return selectedRole.permissions.includes(permission);
    };

    const togglePermission = async (permission: string) => {
        if (!selectedRole) return;

        const currentPermissions = selectedRole.permissions || [];
        const hasIt = currentPermissions.includes(permission);

        const newPermissions = hasIt
            ? currentPermissions.filter(p => p !== permission)
            : [...currentPermissions, permission];

        try {
            await orgService.updateRole(selectedRole._id, {
                name: selectedRole.name,
                description: selectedRole.description,
                permissions: newPermissions
            });

            setSelectedRole({ ...selectedRole, permissions: newPermissions });
            setRoles(roles.map(r =>
                r._id === selectedRole._id
                    ? { ...r, permissions: newPermissions }
                    : r
            ));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Permissions - ${menuItemLabel}`} size="large">
            <div className="flex flex-col md:flex-row gap-6 h-[500px]">
                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-[#E5E7EB] dark:border-[#2F2F2F] pb-4 md:pb-0 md:pr-4">
                    <h3 className="text-sm font-medium text-[#1a1a1a] dark:text-white mb-3">Roles</h3>
                    {loading ? (
                        <div className="text-sm text-neutral-500">Loading roles...</div>
                    ) : roles.length === 0 ? (
                        <div className="text-sm text-neutral-500">No roles found</div>
                    ) : (
                        <div className="space-y-1 max-h-[400px] overflow-y-auto">
                            {roles.map((role) => (
                                <button
                                    key={role._id}
                                    onClick={() => setSelectedRole(role)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedRole?._id === role._id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                        : 'hover:bg-gray-50 dark:hover:bg-[#252525] text-[#1a1a1a] dark:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Shield size={14} />
                                        <span className="truncate">{role.name}</span>
                                    </div>
                                    {role.description && (
                                        <p className="text-xs text-neutral-500 mt-1 truncate">{role.description}</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <h3 className="text-sm font-medium text-[#1a1a1a] dark:text-white mb-3">
                        Permissions {selectedRole && `for ${selectedRole.name}`}
                    </h3>
                    {!selectedRole ? (
                        <div className="text-sm text-neutral-500">Select a role to manage permissions</div>
                    ) : permissions.length === 0 ? (
                        <div className="text-sm text-neutral-500">No permissions available for this menu item</div>
                    ) : (
                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                            {permissions.map((permission) => {
                                const granted = hasPermission(permission);
                                return (
                                    <div
                                        key={permission}
                                        className="flex items-center justify-between p-3 rounded-lg border border-[#E5E7EB] dark:border-[#2F2F2F] hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#1a1a1a] dark:text-white truncate">
                                                {permission.split('_').join(' ')}
                                            </p>
                                            <p className="text-xs text-neutral-500 mt-0.5">
                                                {granted ? 'Granted' : 'Not Granted'}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => togglePermission(permission)}
                                            className={`ml-3 flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${granted
                                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                                                : 'bg-gray-100 dark:bg-[#252525] text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2F2F2F]'
                                                }`}
                                        >
                                            {granted ? <Check size={16} /> : <X size={16} />}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
