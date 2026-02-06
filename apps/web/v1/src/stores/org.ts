import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee, Org } from '../types/org';

interface OrgState {
    org: Org | null;
    employee: Employee | null;
    permissions: string[];
    setOrg: (org: Org) => void;
    setEmployee: (employee: Employee) => void;
    setPermissions: (permissions: string[]) => void;
    clearOrg: () => void;
    clearEmployee: () => void;
    clearPermissions: () => void;
}

export const useOrgStore = create<OrgState>()(
    persist(
        (set) => ({
            org: null,
            employee: null,
            permissions: [],
            setOrg: (org: Org) => set({ org }),
            setEmployee: (employee: Employee) => {
                const allPermissions = employee.roles?.flatMap(role => role.permissions || []) || [];
                const uniquePermissions = [...new Set(allPermissions)];
                set({ employee, permissions: uniquePermissions });
            },
            setPermissions: (permissions: string[]) => set({ permissions: [...new Set(permissions)] }),
            clearOrg: () => set({ org: null }),
            clearEmployee: () => set({ employee: null }),
            clearPermissions: () => set({ permissions: [] }),
        }),
        {
            name: 'org-storage',
        }
    )
);