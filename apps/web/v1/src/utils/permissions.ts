import { Permissions } from '../constants/org';

export const MENU_PERMISSIONS: Record<string, string[]> = {
    'Manager Dashboard': [Permissions.READ_MANAGER_DASHBOARD],
    'My Dashboard': [Permissions.READ_SELF_DASHBOARD],
    'Employees': [
        Permissions.READ_ALL_EMPLOYEE,
        Permissions.CREATE_EMPLOYEE,
        Permissions.UPDATE_EMPLOYEE,
        Permissions.DELETE_EMPLOYEE
    ],
    'Roles': [
        Permissions.READ_ALL_ROLE,
        Permissions.CREATE_ROLE,
        Permissions.UPDATE_ROLE,
        Permissions.DELETE_ROLE
    ],
    'Departments': [
        Permissions.READ_ALL_DEPARTMENT,
        Permissions.CREATE_DEPARTMENT,
        Permissions.UPDATE_DEPARTMENT,
        Permissions.DELETE_DEPARTMENT
    ],
    'My Leaves': [
        Permissions.READ_SELF_LEAVE,
        Permissions.CREATE_LEAVE
    ],
    'Leaves': [
        Permissions.READ_ALL_LEAVE,
        Permissions.UPDATE_LEAVE,
        Permissions.DELETE_LEAVE
    ],
    'My Attendance': [
        Permissions.READ_SELF_ATTENDANCE,
        Permissions.CREATE_ATTENDANCE
    ],
    'Attendance': [
        Permissions.READ_ALL_ATTENDANCE,
        Permissions.UPDATE_ATTENDANCE,
        Permissions.DELETE_ATTENDANCE
    ],
    'Attendance Summary': [
        Permissions.READ_ATTENDANCE_SUMMARY
    ]
};

export function getPermissionsForMenuItem(label: string): string[] {
    return MENU_PERMISSIONS[label] || [];
}
