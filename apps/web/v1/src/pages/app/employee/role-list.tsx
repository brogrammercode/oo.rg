import {
    MoreHorizontal,
    Plus,
    Loader2,
    Trash2,
    Pencil,
    Mail,
    Shield
} from 'lucide-react';
import { useEffect, useState } from 'react';
import orgService from '../../../services/org/org.service';
import { useOrgStore } from '../../../stores/org';
import { usePermission } from '../../../hooks/usePermission';
import { PermissionGuard } from '../../../components/guards/permission-guard';
import { Permissions } from '../../../constants/org';
import type { Role, Employee } from '../../../types/org';
import { Dropdown, DropdownItem } from '../../../components/ui/dropdown';
import { Modal } from '../../../components/ui/modal';
import Avatar from '../../../components/ui/avatar';

export default function RoleList() {
    const { org } = useOrgStore();
    const { hasPermission } = usePermission();
    const [roles, setRoles] = useState<Role[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewEmployeesModalOpen, setViewEmployeesModalOpen] = useState(false);

    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', color: '#3b82f6' });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchRoles = async () => {
        if (!org) return;
        try {
            const res = await orgService.getRoles(org._id);
            setRoles(res.data.data.roles);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        if (!org) return;
        try {
            const res = await orgService.getAllEmployees(org._id);
            setEmployees(res.data.data.employees);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRoles();
        fetchEmployees();
    }, [org]);

    const getEmployeesByRole = (roleId: string) => {
        return employees.filter(emp =>
            emp.roles?.some(role => role._id === roleId)
        );
    };

    const handleCreateRole = async () => {
        if (!org) return;
        setActionLoading(true);
        try {
            await orgService.createRole(org._id, formData);
            setCreateModalOpen(false);
            setFormData({ name: '', description: '', color: '#3b82f6' });
            fetchRoles();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateRole = async () => {
        if (!selectedRole) return;
        setActionLoading(true);
        try {
            await orgService.updateRole(selectedRole._id, formData);
            setEditModalOpen(false);
            fetchRoles();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteRole = async () => {
        if (!selectedRole) return;
        setActionLoading(true);
        try {
            await orgService.deleteRole(selectedRole._id);
            setDeleteModalOpen(false);
            fetchRoles();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (role: Role) => {
        setSelectedRole(role);
        setFormData({
            name: role.name,
            description: role.description || '',
            color: role.color || '#3b82f6'
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (role: Role) => {
        setSelectedRole(role);
        setDeleteModalOpen(true);
    };

    const openViewEmployeesModal = (role: Role) => {
        setSelectedRole(role);
        setViewEmployeesModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="w-full mx-auto py-2 px-2 sm:px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">Roles</h1>
                    <p className="mt-2 text-neutral-500 max-w-2xl">
                        Define roles and permissions for your organization members.
                    </p>
                </div>
                <PermissionGuard permission={Permissions.CREATE_ROLE}>
                    <button
                        onClick={() => {
                            setFormData({ name: '', description: '', color: '#3b82f6' });
                            setCreateModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        New Role
                    </button>
                </PermissionGuard>
            </header>

            <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg overflow-hidden bg-white dark:bg-[#191919] shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-[#2F2F2F] bg-gray-50/50 dark:bg-zinc-800/20">
                            <th className="py-3 px-4 font-medium text-neutral-500 w-[30%]">Name</th>
                            <th className="py-3 px-4 font-medium text-neutral-500 w-[50%]">Description</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Members</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2F2F2F]">
                        {roles.map((role) => {
                            const roleEmployees = getEmployeesByRole(role._id);
                            return (
                                <tr key={role._id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: role.color || '#3b82f6' }} />
                                            <span className="font-medium text-[#1a1a1a] dark:text-white">{role.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                                        {role.description || '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {roleEmployees.length > 0 ? (
                                            <div
                                                className="flex items-center gap-1 cursor-pointer"
                                                onClick={() => openViewEmployeesModal(role)}
                                            >
                                                <div className="flex -space-x-2">
                                                    {roleEmployees.slice(0, 3).map((emp, idx) => (
                                                        <div
                                                            key={emp._id}
                                                            className="relative"
                                                            style={{ zIndex: 3 - idx }}
                                                        >
                                                            <Avatar
                                                                initials={emp.user?.name?.substring(0, 2).toUpperCase()}
                                                                className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 ring-2 ring-white dark:ring-[#191919] w-6 h-6 text-xs"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                {roleEmployees.length > 3 && (
                                                    <span className="text-xs text-neutral-500 ml-1">
                                                        +{roleEmployees.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-neutral-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <Dropdown
                                            trigger={
                                                <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            }
                                            align="right"
                                        >
                                            {hasPermission(Permissions.UPDATE_ROLE) && <DropdownItem icon={Pencil} label="Edit" onClick={() => openEditModal(role)} />}
                                            {hasPermission(Permissions.DELETE_ROLE) && <DropdownItem icon={Trash2} label="Delete" danger onClick={() => openDeleteModal(role)} />}
                                        </Dropdown>
                                    </td>
                                </tr>
                            );
                        })}
                        {roles.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-neutral-500">
                                    No roles found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Role">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Role Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. Manager"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={3}
                            placeholder="Describe the responsibilities of this role..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Color</label>
                        <div className="flex gap-2">
                            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#64748b'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${formData.color === color ? 'border-black dark:border-white scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleCreateRole} disabled={actionLoading || !formData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Create Role
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Role">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Role Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. Manager"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={3}
                            placeholder="Describe the responsibilities of this role..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Color</label>
                        <div className="flex gap-2">
                            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#64748b'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setFormData({ ...formData, color })}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${formData.color === color ? 'border-black dark:border-white scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleUpdateRole} disabled={actionLoading || !formData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Role">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete the <strong>{selectedRole?.name}</strong> role? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleDeleteRole} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Delete Role
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={viewEmployeesModalOpen} onClose={() => setViewEmployeesModalOpen(false)} title={`${selectedRole?.name} - Employees`}>
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-500">
                        {getEmployeesByRole(selectedRole?._id || '').length} employee(s) with this role
                    </p>
                    <div className="max-h-96 overflow-y-auto">
                        {getEmployeesByRole(selectedRole?._id || '').length === 0 ? (
                            <div className="py-8 text-center text-neutral-500 text-sm">
                                No employees with this role yet.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {getEmployeesByRole(selectedRole?._id || '').map((employee) => (
                                    <div key={employee._id} className="flex items-center justify-between p-3 border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                initials={employee.user?.name?.substring(0, 2).toUpperCase()}
                                                className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 w-8 h-8"
                                            />
                                            <div>
                                                <span className="font-medium text-[#1a1a1a] dark:text-white block">{employee.user?.name}</span>
                                                <div className="flex items-center gap-2 text-xs text-neutral-500">
                                                    <Mail size={10} />
                                                    <span>{employee.user?.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {employee.post && (
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs">
                                                    <Shield size={12} className="text-neutral-500" />
                                                    <span className="text-neutral-700 dark:text-neutral-300">{employee.post.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
