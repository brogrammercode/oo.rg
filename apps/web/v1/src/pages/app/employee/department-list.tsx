import {
    MoreHorizontal,
    Plus,
    Loader2,
    Building2,
    Trash2,
    Pencil,
    Eye,
    Briefcase,
    Mail,
    Shield
} from 'lucide-react';
import { useEffect, useState } from 'react';
import orgService from '../../../services/org/org.service';
import { useOrgStore } from '../../../stores/org';
import type { Department, Post, Employee } from '../../../types/org';
import { Dropdown, DropdownItem } from '../../../components/ui/dropdown';
import { Modal } from '../../../components/ui/modal';
import Avatar from '../../../components/ui/avatar';

export default function DepartmentList() {
    const { org } = useOrgStore();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [viewPostsModalOpen, setViewPostsModalOpen] = useState(false);
    const [addPostModalOpen, setAddPostModalOpen] = useState(false);
    const [editPostModalOpen, setEditPostModalOpen] = useState(false);
    const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
    const [viewEmployeesModalOpen, setViewEmployeesModalOpen] = useState(false);

    const [selectedDept, setSelectedDept] = useState<Department | null>(null);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [formData, setFormData] = useState({ name: '', description: '', color: '#3b82f6' });
    const [postFormData, setPostFormData] = useState({ name: '', description: '', color: '#3b82f6' });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchDepartments = async () => {
        if (!org) return;
        try {
            const res = await orgService.getDepartments(org._id);
            setDepartments(res.data.data.departments);
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

    const fetchPosts = async (departmentId: string) => {
        if (!org) return;
        try {
            const res = await orgService.getPosts(org._id, departmentId);
            setPosts(res.data.data.posts || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchDepartments();
        fetchEmployees();
    }, [org]);

    const getEmployeesByDepartment = (deptId: string) => {
        return employees.filter(emp => emp.post?.department?._id === deptId);
    };

    const handleCreateDept = async () => {
        if (!org) return;
        setActionLoading(true);
        try {
            await orgService.createDepartment(org._id, formData);
            setCreateModalOpen(false);
            setFormData({ name: '', description: '', color: '#3b82f6' });
            fetchDepartments();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateDept = async () => {
        if (!selectedDept) return;
        setActionLoading(true);
        try {
            await orgService.updateDepartment(selectedDept._id, formData);
            setEditModalOpen(false);
            fetchDepartments();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteDept = async () => {
        if (!selectedDept) return;
        setActionLoading(true);
        try {
            await orgService.deleteDepartment(selectedDept._id);
            setDeleteModalOpen(false);
            fetchDepartments();
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!org || !selectedDept) return;
        setActionLoading(true);
        try {
            await orgService.createPost(org._id, selectedDept._id, postFormData);
            setAddPostModalOpen(false);
            setViewPostsModalOpen(true);
            setPostFormData({ name: '', description: '', color: '#3b82f6' });
            fetchPosts(selectedDept._id);
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdatePost = async () => {
        if (!selectedPost || !selectedDept) return;
        setActionLoading(true);
        try {
            await orgService.updatePost(selectedPost._id, postFormData);
            setEditPostModalOpen(false);
            setViewPostsModalOpen(true);
            fetchPosts(selectedDept._id);
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeletePost = async () => {
        if (!selectedPost || !selectedDept) return;
        setActionLoading(true);
        try {
            await orgService.deletePost(selectedPost._id);
            setDeletePostModalOpen(false);
            setViewPostsModalOpen(true);
            fetchPosts(selectedDept._id);
        } catch (error) {
            console.error(error);
        } finally {
            setActionLoading(false);
        }
    };

    const openEditModal = (dept: Department) => {
        setSelectedDept(dept);
        setFormData({
            name: dept.name,
            description: dept.description || '',
            color: dept.color || '#3b82f6'
        });
        setEditModalOpen(true);
    };

    const openDeleteModal = (dept: Department) => {
        setSelectedDept(dept);
        setDeleteModalOpen(true);
    };

    const openViewPostsModal = async (dept: Department) => {
        setSelectedDept(dept);
        setViewPostsModalOpen(true);
        await fetchPosts(dept._id);
    };

    const openViewEmployeesModal = (dept: Department) => {
        setSelectedDept(dept);
        setViewEmployeesModalOpen(true);
    };

    const openAddPostModal = () => {
        setViewPostsModalOpen(false);
        setPostFormData({ name: '', description: '', color: '#3b82f6' });
        setAddPostModalOpen(true);
    };

    const openEditPostModal = (post: Post) => {
        setSelectedPost(post);
        setPostFormData({
            name: post.name,
            description: post.description || '',
            color: post.color || '#3b82f6'
        });
        setViewPostsModalOpen(false);
        setEditPostModalOpen(true);
    };

    const openDeletePostModal = (post: Post) => {
        setSelectedPost(post);
        setViewPostsModalOpen(false);
        setDeletePostModalOpen(true);
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
                    <h1 className="text-3xl font-bold text-[#1a1a1a] dark:text-white tracking-tight">Departments</h1>
                    <p className="mt-2 text-neutral-500 max-w-2xl">
                        Organize your company structure by departments.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setFormData({ name: '', description: '', color: '#3b82f6' });
                        setCreateModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-sm font-medium rounded-lg transition-colors"
                >
                    <Plus size={16} />
                    New Department
                </button>
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
                        {departments.map((dept) => {
                            const deptEmployees = getEmployeesByDepartment(dept._id);
                            return (
                                <tr key={dept._id} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded flex items-center justify-center text-white shadow-sm"
                                                style={{ backgroundColor: dept.color || '#3b82f6' }}
                                            >
                                                <Building2 size={16} />
                                            </div>
                                            <span className="font-medium text-[#1a1a1a] dark:text-white">{dept.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                                        {dept.description || '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        {deptEmployees.length > 0 ? (
                                            <div
                                                className="flex items-center gap-1 cursor-pointer"
                                                onClick={() => openViewEmployeesModal(dept)}
                                            >
                                                <div className="flex -space-x-2">
                                                    {deptEmployees.slice(0, 3).map((emp, idx) => (
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
                                                {deptEmployees.length > 3 && (
                                                    <span className="text-xs text-neutral-500 ml-1">
                                                        +{deptEmployees.length - 3}
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
                                            <DropdownItem icon={Eye} label="View Posts" onClick={() => openViewPostsModal(dept)} />
                                            <DropdownItem icon={Pencil} label="Edit" onClick={() => openEditModal(dept)} />
                                            <DropdownItem icon={Trash2} label="Delete" danger onClick={() => openDeleteModal(dept)} />
                                        </Dropdown>
                                    </td>
                                </tr>
                            );
                        })}
                        {departments.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-neutral-500">
                                    No departments found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} title="Create Department">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Department Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. Engineering"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={3}
                            placeholder="Describe the function of this department..."
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
                        <button onClick={handleCreateDept} disabled={actionLoading || !formData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Create Department
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Department">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Department Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. Engineering"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={3}
                            placeholder="Describe the function of this department..."
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
                        <button onClick={handleUpdateDept} disabled={actionLoading || !formData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Department">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete the <strong>{selectedDept?.name}</strong> department? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleDeleteDept} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Delete Department
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={viewPostsModalOpen} onClose={() => setViewPostsModalOpen(false)} title={`Posts in ${selectedDept?.name}`} width="max-w-2xl">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-neutral-500">Manage positions in this department</p>
                        <button
                            onClick={openAddPostModal}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-black text-white text-xs font-medium rounded-lg transition-colors"
                        >
                            <Plus size={14} />
                            Add Post
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {posts.length === 0 ? (
                            <div className="py-8 text-center text-neutral-500 text-sm">
                                No posts found. Create one to get started.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {posts.map((post) => (
                                    <div key={post._id} className="group flex items-center justify-between p-3 border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded flex items-center justify-center text-white shadow-sm"
                                                style={{ backgroundColor: post.color || '#3b82f6' }}
                                            >
                                                <Briefcase size={14} />
                                            </div>
                                            <div>
                                                <span className="font-medium text-[#1a1a1a] dark:text-white block">{post.name}</span>
                                                {post.description && <span className="text-xs text-neutral-500">{post.description}</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditPostModal(post)}
                                                className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                                            >
                                                <Pencil size={14} className="text-neutral-600 dark:text-neutral-400" />
                                            </button>
                                            <button
                                                onClick={() => openDeletePostModal(post)}
                                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                            >
                                                <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={addPostModalOpen} onClose={() => { setAddPostModalOpen(false); setViewPostsModalOpen(true); }} title="Add Post">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Post Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. Senior Engineer"
                            value={postFormData.name}
                            onChange={(e) => setPostFormData({ ...postFormData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={3}
                            placeholder="Describe the responsibilities..."
                            value={postFormData.description}
                            onChange={(e) => setPostFormData({ ...postFormData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Color</label>
                        <div className="flex gap-2">
                            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#64748b'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setPostFormData({ ...postFormData, color })}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${postFormData.color === color ? 'border-black dark:border-white scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => { setAddPostModalOpen(false); setViewPostsModalOpen(true); }} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleCreatePost} disabled={actionLoading || !postFormData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Create Post
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={editPostModalOpen} onClose={() => { setEditPostModalOpen(false); setViewPostsModalOpen(true); }} title="Edit Post">
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Post Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            placeholder="e.g. Senior Engineer"
                            value={postFormData.name}
                            onChange={(e) => setPostFormData({ ...postFormData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2F2F2F] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10"
                            rows={3}
                            placeholder="Describe the responsibilities..."
                            value={postFormData.description}
                            onChange={(e) => setPostFormData({ ...postFormData, description: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Color</label>
                        <div className="flex gap-2">
                            {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#64748b'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setPostFormData({ ...postFormData, color })}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${postFormData.color === color ? 'border-black dark:border-white scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => { setEditPostModalOpen(false); setViewPostsModalOpen(true); }} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleUpdatePost} disabled={actionLoading || !postFormData.name} className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-black rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deletePostModalOpen} onClose={() => { setDeletePostModalOpen(false); setViewPostsModalOpen(true); }} title="Delete Post">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Are you sure you want to delete the <strong>{selectedPost?.name}</strong> post? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => { setDeletePostModalOpen(false); setViewPostsModalOpen(true); }} className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 border border-[#E5E7EB] rounded-lg">Cancel</button>
                        <button onClick={handleDeletePost} disabled={actionLoading} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-70 flex items-center gap-2">
                            {actionLoading && <Loader2 size={16} className="animate-spin" />}
                            Delete Post
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={viewEmployeesModalOpen} onClose={() => setViewEmployeesModalOpen(false)} title={`${selectedDept?.name} - Employees`} width="max-w-2xl">
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-neutral-500">
                        {getEmployeesByDepartment(selectedDept?._id || '').length} employee(s) in this department
                    </p>
                    <div className="max-h-96 overflow-y-auto">
                        {getEmployeesByDepartment(selectedDept?._id || '').length === 0 ? (
                            <div className="py-8 text-center text-neutral-500 text-sm">
                                No employees in this department yet.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {getEmployeesByDepartment(selectedDept?._id || '').map((employee) => (
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
