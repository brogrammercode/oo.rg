import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutGrid,
    LayoutDashboard,
    Users,
    Plane,
    Clock,
    Settings,
    LogOut,
    Menu,
    Moon,
    ChevronDown,
    ChevronRight,
    Search,
    UserCircle,
    Building2,
    Calendar,
    FileText,
    DollarSign,
    ShieldCheck,
    BarChart3
} from 'lucide-react';
import { AppRoutes } from '../../constants/routes';
import { useAuthStore } from '../../stores/auth';
import { MenuItemDropdown } from '../permissions/menu-item-dropdown';
import { PermissionsModal } from '../permissions/permissions-modal';
import { usePermission } from '../../hooks/usePermission';
import { Permissions } from '../../constants/org';

interface NavItem {
    icon: React.ElementType;
    label: string;
    to?: string;
    permission?: string;
    subItems?: NavItem[];
}

const NAV_ITEMS: NavItem[] = [
    {
        icon: LayoutDashboard,
        label: 'Dashboards',
        subItems: [
            { icon: Building2, label: 'Manager Dashboard', to: AppRoutes.DASHBOARD_MANAGER, permission: Permissions.READ_MANAGER_DASHBOARD },
            { icon: UserCircle, label: 'My Dashboard', to: AppRoutes.DASHBOARD_SELF, permission: Permissions.READ_SELF_DASHBOARD },
        ]
    },
    {
        icon: Users,
        label: 'Employees',
        subItems: [
            { icon: UserCircle, label: 'Employees', to: AppRoutes.EMPLOYEE_LIST, permission: Permissions.READ_ALL_EMPLOYEE },
            { icon: ShieldCheck, label: 'Roles', to: AppRoutes.ROLE_LIST, permission: Permissions.READ_ALL_ROLE },
            { icon: Building2, label: 'Departments', to: AppRoutes.DEPARTMENT_LIST, permission: Permissions.READ_ALL_DEPARTMENT },
        ]
    },
    {
        icon: Plane,
        label: 'Leaves',
        subItems: [
            { icon: Calendar, label: 'My Leaves', to: AppRoutes.LEAVE_MY, permission: Permissions.READ_SELF_LEAVE },
            { icon: FileText, label: 'Leaves', to: AppRoutes.LEAVE_LIST, permission: Permissions.READ_ALL_LEAVE },
        ]
    },
    {
        icon: Clock,
        label: 'Attendance',
        subItems: [
            { icon: Calendar, label: 'My Attendance', to: AppRoutes.ATTENDANCE_MY, permission: Permissions.READ_SELF_ATTENDANCE },
            { icon: Clock, label: 'Attendance', to: AppRoutes.ATTENDANCE_LIST, permission: Permissions.READ_ALL_ATTENDANCE },
            { icon: BarChart3, label: 'Attendance Summary', to: AppRoutes.ATTENDANCE_SUMMARY, permission: Permissions.READ_ATTENDANCE_SUMMARY },
        ]
    },
    {
        icon: DollarSign,
        label: 'Finance',
        subItems: [
            { icon: FileText, label: 'Payslips', to: '/app/finance/payslips' },
            { icon: DollarSign, label: 'Expenses', to: '/app/finance/expenses' },
        ]
    }
];

const SidebarItem = ({ item, level = 0 }: { item: NavItem, level?: number }) => {
    const location = useLocation();
    const { hasPermission } = usePermission();
    const [isOpen, setIsOpen] = useState(false);
    const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);

    const isActive = item.to ? location.pathname === item.to : false;
    const isChildActive = item.subItems?.some(sub => sub.to && location.pathname.startsWith(sub.to));

    React.useEffect(() => {
        if (isChildActive) setIsOpen(true);
    }, [isChildActive]);

    const hasSubmenu = item.subItems && item.subItems.length > 0;

    const hasAccess = item.permission ? hasPermission(item.permission) : true;

    if (!hasAccess && !hasSubmenu) {
        return null;
    }

    const baseClasses = `
        w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 group
        ${level > 0 ? 'pl-9 text-xs' : ''}
        ${isActive
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/10 dark:text-blue-400'
            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
        }
    `;

    const handleClick = (e: React.MouseEvent) => {
        if (hasSubmenu) {
            e.preventDefault();
            setIsOpen(!isOpen);
        }
    };

    const visibleSubItems = hasSubmenu
        ? item.subItems!.filter(subItem => {
            return subItem.permission ? hasPermission(subItem.permission) : true;
        })
        : [];

    if (hasSubmenu && visibleSubItems.length === 0) {
        return null;
    }

    const content = (
        <>
            <div className="flex items-center flex-1 min-w-0">
                <item.icon size={level === 0 ? 18 : 16} className={`mr-3 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200'}`} />
                <span className="truncate">{item.label}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
                {hasPermission(Permissions.UPDATE_ROLE) && level > 0 && item.to && (
                    <MenuItemDropdown
                        onDetailsClick={() => console.log('Details:', item.label)}
                        onPermissionsClick={() => setPermissionsModalOpen(true)}
                    />
                )}
                {hasSubmenu && (
                    <ChevronRight
                        size={14}
                        className={`text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                    />
                )}
            </div>
        </>
    );

    return (
        <>
            <div className="mb-0.5">
                {item.to && !hasSubmenu ? (
                    <Link to={item.to} className={baseClasses}>
                        {content}
                    </Link>
                ) : (
                    <button onClick={handleClick} className={baseClasses} type="button">
                        {content}
                    </button>
                )}

                {hasSubmenu && isOpen && (
                    <div className="animate-in slide-in-from-left-2 duration-200">
                        {visibleSubItems.map((subItem, index) => (
                            <SidebarItem key={index} item={subItem} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>

            {level > 0 && item.to && (
                <PermissionsModal
                    isOpen={permissionsModalOpen}
                    onClose={() => setPermissionsModalOpen(false)}
                    menuItemLabel={item.label}
                />
            )}
        </>
    );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuthStore();

    const breadcrumbs = location.pathname.split('/').filter(Boolean);

    return (
        <div className="flex h-screen overflow-hidden bg-[#F7F7F5] dark:bg-[#191919] text-[#37352F] dark:text-[#D4D4D4] font-sans">
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#202020] border-r border-[#E5E7EB] dark:border-[#2F2F2F] transform transition-transform duration-200 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-14 flex items-center px-4 border-b border-[#E5E7EB] dark:border-[#2F2F2F]">
                    <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer w-full">
                        <div className="size-6 bg-blue-600 rounded flex items-center justify-center text-white">
                            <LayoutGrid size={14} />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">DOUSOFT</span>
                        <ChevronDown size={14} className="ml-auto text-neutral-400" />
                    </div>
                </div>

                <div className="flex flex-col h-[calc(100%-3.5rem)]">
                    <nav className="flex-1 overflow-y-auto mt-4 px-2 space-y-0.5">
                        <div className="px-3 mb-2 text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                            Workspace
                        </div>
                        {NAV_ITEMS.map((item, index) => (
                            <SidebarItem key={index} item={item} />
                        ))}
                    </nav>

                    <div className="mt-auto px-2 pb-4 border-t border-[#E5E7EB] dark:border-[#2F2F2F] pt-3">
                        <div className="px-3 mb-2 text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                            Account
                        </div>
                        <SidebarItem item={{ icon: Settings, label: 'Settings', to: '/settings' }} />
                        <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/10 rounded-md transition-colors">
                            <LogOut size={18} className="mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="flex-shrink-0 h-14 bg-white/50 backdrop-blur-sm dark:bg-[#191919]/50 flex justify-between items-center px-4 lg:px-8 border-b border-[#E5E7EB] dark:border-[#2F2F2F] z-10">
                    <div className="flex items-center">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mr-4 lg:hidden text-neutral-500 hover:text-neutral-900">
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center text-sm breadcrumbs text-neutral-500 capitalize">
                            {breadcrumbs.map((crumb, index) => (
                                <React.Fragment key={crumb}>
                                    {index > 0 && <ChevronRight size={14} className="mx-1" />}
                                    <span className={index === breadcrumbs.length - 1 ? "font-medium text-neutral-900 dark:text-white" : "hover:text-neutral-900 cursor-pointer"}>
                                        {crumb}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors">
                            <Search size={18} />
                        </button>
                        <button className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors">
                            <Moon size={18} />
                        </button>
                        <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-700 mx-1"></div>
                        <div className="flex items-center gap-2 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 py-1 px-2 rounded-md transition-colors">
                            <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white font-medium text-xs">
                                {user?.name?.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hidden sm:block">
                                {user?.name}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
                    {children}
                </div>
            </main>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            )}
        </div>
    );
}