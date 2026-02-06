export class AppRoutes {
    static readonly ROOT = "/";
    static readonly LOGIN = "/login";
    static readonly ORG_FIND = "/org/find";
    static readonly ORG_CREATE = "/org/create";
    static readonly APP = "/app";
    static readonly DASHBOARD_MANAGER = "/dashboard/manager";
    static readonly DASHBOARD_SELF = "/dashboard/self";

    /// Employee
    static readonly EMPLOYEE_LIST = "/employee/list";
    static readonly ROLE_LIST = "/role/list";
    static readonly DEPARTMENT_LIST = "/department/list";

    /// Attendance
    static readonly ATTENDANCE_LIST = "/attendance/list";
    static readonly ATTENDANCE_SUMMARY = "/attendance/summary";
    static readonly ATTENDANCE_MY = "/attendance/my";

    /// Leave
    static readonly LEAVE_LIST = "/leave/list";
    static readonly LEAVE_MY = "/leave/my";
}