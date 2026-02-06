import {
    User,
    MoreHorizontal,
    Mail,
    Shield,
    Calendar,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Trash2,
    Briefcase,
    Building2,
    Plus
} from 'lucide-react';
import { useEffect, useState } from 'react';
import orgService from '../../../services/org/org.service';
import { useOrgStore } from '../../../stores/org';
import type { Employee, Role, Post, Department } from '../../../types/org';
import Avatar from '../../../components/ui/avatar';
import { Dropdown, DropdownItem } from '../../../components/ui/dropdown';
import { EmployeeStatus } from '../../../constants/org';
import { Modal } from '../../../components/ui/modal';

const StatusBadge = ({ status }: { status: string }) => {
    let styles = "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400";
    if (status === 'ACTIVE') {
        styles = "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    } else if (status === 'INACTIVE') {
        styles = "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    } else if (status === 'REQUESTED') {
        styles = "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
    return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border border-transparent ${styles}`}>
            {status}
        </span>
    );
};

export default function EmployeeList() {
    const { org } = useOrgStore();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState<Role[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [allPosts, setAllPosts] = useState<Post[]>([]);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
    const [editPostModalOpen, setEditPostModalOpen] = useState(false);
    const [removeModalOpen, setRemoveModalOpen] = useState(false);
    const [approveModalOpen, setApproveModalOpen] = useState(false);

    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        post: ''
    });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchEmployees = async () => {
        if (!org) return;
        try {
            const res = await orgService.getAllEmployees(org._id);
            setEmployees(res.data.data.employees);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        if (!org) return;
        try {
            const res = await orgService.getRoles(org._id);
            setRoles(res.data.data.roles || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchDepartments = async () => {
        if (!org) return;
        try {
            const res = await orgService.getDepartments(org._id);
            setDepartments(res.data.data.departments || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAllPosts = async () => {
        if (!org || departments.length === 0) return;
        try {
            const postsPromises = departments.map(dept =>
                orgService.getPosts(org._id, dept._id)
                    .then(res => res.data.data.posts || [])
                    .catch(() => [])
            );
            const postsArrays = await Promise.all(postsPromises);
            const posts = postsArrays.flat();
            setAllPosts(posts);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchRoles();
        fetchDepartments();
    }, [org]);

    useEffect(() => {
        if (departments.length > 0) {
            fetchAllPosts();
        }
    }, [departments]);

    const getPostsByDepartment = (deptId: string) => {
        return allPosts.filter(post =>
            post.department?._id === deptId
        );
    };

    const handleCreateEmployee = async () => {
        if (!org) return;
        setActionLoading(true);
        try {
            await orgService.createEmployee(org._id, formData);
            setCreateModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: '', post: '' });
            fetchEmployees();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleViewProfile = (employee: Employee) => {
        setSelectedEmployee(employee);
        setViewModalOpen(true);
    };

    const handleEditRole = (employee: Employee) => {
        setSelectedEmployee(employee);
        setSelectedRoleIds(employee.roles?.map(r => r._id) || []);
        setEditRoleModalOpen(true);
    };

    const handleEditPost = (employee: Employee) => {
        setSelectedEmployee(employee);
        setSelectedPostId(employee.post?._id || '');
        setEditPostModalOpen(true);
    };

    const handleRemoveMember = (employee: Employee) => {
        setSelectedEmployee(employee);
        setRemoveModalOpen(true);
    };

    const handleApprove = (employee: Employee) => {
        setSelectedEmployee(employee);
        setApproveModalOpen(true);
    };

    const confirmEditRole = async () => {
        if (!selectedEmployee) return;
        setActionLoading(true);
        try {
            await orgService.updateEmployeeRoles(selectedEmployee._id, selectedRoleIds);
            setEditRoleModalOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const confirmEditPost = async () => {
        if (!selectedEmployee) return;
        setActionLoading(true);
        try {
            await orgService.updateEmployeePost(selectedEmployee._id, selectedPostId);
            setEditPostModalOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const confirmRemove = async () => {
        if (!selectedEmployee) return;
        setActionLoading(true);
        try {
            await orgService.removeEmployee(selectedEmployee._id);
            setRemoveModalOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const confirmApprove = async () => {
        if (!selectedEmployee) return;
        setActionLoading(true);
        try {
            await orgService.acceptEmployeeRequest(selectedEmployee._id);
            setApproveModalOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const toggleRole = (roleId: string) => {
        if (selectedRoleIds.includes(roleId)) {
            setSelectedRoleIds(selectedRoleIds.filter(id => id !== roleId));
        } else {
            setSelectedRoleIds([...selectedRoleIds, roleId]);
        }
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
                    <h1 className="text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">Employees</h1>
                    <p className="mt-2 text-neutral-500 max-w-2xl">
                        Manage your organization's employees and their roles.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ name: '', email: '', password: '', role: '', post: '' });
                        setCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus size={16} />
                    New Employee
                </button>
            </header>

            <div className="border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg overflow-hidden bg-white dark:bg-[#191919] shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] dark:border-[#2F2F2F] bg-gray-50/50 dark:bg-zinc-800/20">
                            <th className="py-3 px-4 font-medium text-neutral-500 w-[40%]">Name</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Role</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Post</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Status</th>
                            <th className="py-3 px-4 font-medium text-neutral-500">Joined</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#2F2F2F]">
                        {employees.map((employee) => (
                            <tr key={employee._id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            initials={employee.user?.name?.substring(0, 2).toUpperCase()}
                                            size="sm"
                                            className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-[#1a1a1a] dark:text-white">{employee.user?.name}</span>
                                            <span className="text-xs text-neutral-400 flex items-center gap-1">
                                                <Mail size={10} /> {employee.user.email}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Shield size={14} className="text-neutral-400" />
                                        <span>{employee.roles?.map((role) => role.name).join(', ') || 'New'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                                        <Briefcase size={14} className="text-neutral-400" />
                                        <span>{employee.post?.name || 'Not Assigned'}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={employee.status} />
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-xs">
                                        <Calendar size={12} />
                                        {new Date(employee.joined_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <Dropdown
                                        trigger={
                                            <button className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        }
                                        align="right"
                                    >
                                        <DropdownItem icon={User} label="View Profile" onClick={() => handleViewProfile(employee)} />
                                        <DropdownItem icon={Shield} label="Edit Role" onClick={() => handleEditRole(employee)} />
                                        <DropdownItem icon={Briefcase} label="Edit Post" onClick={() => handleEditPost(employee)} />
                                        <DropdownItem icon={Trash2} label="Remove Member" danger onClick={() => handleRemoveMember(employee)} />
                                        {employee.status == EmployeeStatus.REQUESTED && <DropdownItem icon={CheckCircle} label="Approve" onClick={() => handleApprove(employee)} />}
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                        {employees.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-neutral-500">
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Employee">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Role</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="">Select a role</option>
                            {roles.map(role => (
                                <option key={role._id} value={role._id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Post</label>
                        <select
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            value={formData.post}
                            onChange={(e) => setFormData({ ...formData, post: e.target.value })}
                        >
                            <option value="">Select a post (optional)</option>
                            {departments.map(dept => {
                                const deptPosts = getPostsByDepartment(dept._id);
                                if (deptPosts.length === 0) return null;
                                return (
                                    <optgroup key={dept._id} label={dept.name}>
                                        {deptPosts.map(post => (
                                            <option key={post._id} value={post._id}>{post.name}</option>
                                        ))}
                                    </optgroup>
                                );
                            })}
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleCreateEmployee} disabled={actionLoading || !formData.name || !formData.email || !formData.password || !formData.role} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Create Employee
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Employee Profile">
                {selectedEmployee && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <Avatar
                                initials={selectedEmployee.user?.name?.substring(0, 2).toUpperCase()}
                                size="lg"
                                className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            />
                            <div>
                                <h3 className="text-lg font-semibold text-[#1a1a1a] dark:text-white">{selectedEmployee.user?.name}</h3>
                                <p className="text-sm text-neutral-500">{selectedEmployee.user?.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-[#E5E7EB] dark:border-[#2F2F2F]">
                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">Role</span>
                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                                    {selectedEmployee.roles?.map(r => r.name).join(', ') || 'New'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">Post</span>
                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                                    {selectedEmployee.post?.name || 'Not Assigned'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">Status</span>
                                <StatusBadge status={selectedEmployee.status} />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-neutral-500">Joined</span>
                                <span className="text-sm font-medium text-[#1a1a1a] dark:text-white">
                                    {new Date(selectedEmployee.joined_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={editRoleModalOpen} onClose={() => setEditRoleModalOpen(false)} title="Edit Employee Role">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Select roles for <strong>{selectedEmployee?.user?.name}</strong>
                    </p>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {roles.map((role) => (
                            <label
                                key={role._id}
                                className="flex items-center gap-3 p-3 border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedRoleIds.includes(role._id)}
                                    onChange={() => toggleRole(role._id)}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex items-center gap-2">
                                    <Shield size={16} className="text-neutral-400" />
                                    <span className="font-medium text-[#1a1a1a] dark:text-white">{role.name}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditRoleModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={confirmEditRole} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={editPostModalOpen} onClose={() => setEditPostModalOpen(false)} title="Edit Employee Post">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Select a post for <strong>{selectedEmployee?.user?.name}</strong>
                    </p>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {departments.map((dept) => {
                            const deptPosts = getPostsByDepartment(dept._id);
                            if (deptPosts.length === 0) return null;
                            return (
                                <div key={dept._id} className="space-y-2">
                                    <div className="flex items-center gap-2 py-1">
                                        <div
                                            className="w-4 h-4 rounded-sm flex items-center justify-center"
                                            style={{ backgroundColor: dept.color || '#3b82f6' }}
                                        >
                                            <Building2 size={10} className="text-white" />
                                        </div>
                                        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{dept.name}</span>
                                    </div>
                                    <div className="space-y-1">
                                        {deptPosts.map((post) => (
                                            <label
                                                key={post._id}
                                                className="flex items-center gap-3 p-3 border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors"
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedPostId === post._id}
                                                    onChange={() => setSelectedPostId(post._id)}
                                                    className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-6 h-6 rounded flex items-center justify-center"
                                                        style={{ backgroundColor: post.color || '#3b82f6' }}
                                                    >
                                                        <Briefcase size={12} className="text-white" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-[#1a1a1a] dark:text-white block">{post.name}</span>
                                                        {post.description && <span className="text-xs text-neutral-500">{post.description}</span>}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setEditPostModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={confirmEditPost} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={removeModalOpen} onClose={() => setRemoveModalOpen(false)} title="Remove Employee">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-800 dark:text-red-200">
                            This action cannot be undone.
                        </p>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to remove <strong>{selectedEmployee?.user?.name}</strong> from the organization?
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setRemoveModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={confirmRemove} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Remove Employee
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={approveModalOpen} onClose={() => setApproveModalOpen(false)} title="Approve Employee Request">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to approve <strong>{selectedEmployee?.user?.name}</strong>'s request to join the organization?
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setApproveModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={confirmApprove} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Approve Request
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}