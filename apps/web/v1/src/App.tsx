import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/auth/login'
import FindOrg from './pages/org/find-org'
import CreateOrg from './pages/org/create-org'
import AppLayout from './components/layout/app-layout'
import ManagerDashboard from './pages/app/dashboard/manager-dashboard'
import SelfDashboard from './pages/app/dashboard/self-dashboard'
import Placeholder from './components/layout/placeholder'
import { useAuthStore } from './stores/auth'
import { AppRoutes } from './constants/routes'
import { useOrgStore } from './stores/org'
import EmployeeList from './pages/app/employee/employee-list'
import RoleList from './pages/app/employee/role-list'
import DepartmentList from './pages/app/employee/department-list'
import AttendanceList from './pages/app/attendance/attendance-list'
import SelfAttendance from './pages/app/attendance/self-attendance'
import AttendanceSummary from './pages/app/attendance/attendance-summary'
import LeaveList from './pages/app/leave/leave-list'
import SelfLeave from './pages/app/leave/self-leave'

function App() {
  const auth = useAuthStore();
  const org = useOrgStore();
  const authenticated = auth.isAuthenticated;
  const employee = org.employee;

  const getRootElement = () => {
    if (!authenticated) return <Login />;
    return employee ? <Navigate to={AppRoutes.APP} replace /> : <Navigate to={AppRoutes.ORG_FIND} replace />;
  };

  return (
    <Routes>
      <Route path={AppRoutes.ROOT} element={getRootElement()} />
      <Route path={AppRoutes.LOGIN} element={<Login />} />
      <Route path={AppRoutes.ORG_FIND} element={<FindOrg />} />
      <Route path={AppRoutes.ORG_CREATE} element={<CreateOrg />} />

      <Route
        path={AppRoutes.APP}
        element={
          authenticated && employee
            ? <AppLayout><Placeholder /></AppLayout>
            : <Navigate to={authenticated ? AppRoutes.ORG_FIND : AppRoutes.LOGIN} replace />
        }
      />

      <Route path={AppRoutes.DASHBOARD_MANAGER} element={<AppLayout><ManagerDashboard /></AppLayout>} />
      <Route path={AppRoutes.DASHBOARD_SELF} element={<AppLayout><SelfDashboard /></AppLayout>} />
      <Route path={AppRoutes.EMPLOYEE_LIST} element={<AppLayout><EmployeeList /></AppLayout>} />
      <Route path={AppRoutes.ROLE_LIST} element={<AppLayout><RoleList /></AppLayout>} />
      <Route path={AppRoutes.DEPARTMENT_LIST} element={<AppLayout><DepartmentList /></AppLayout>} />

      /// ATTENDANCE
      <Route path={AppRoutes.ATTENDANCE_LIST} element={<AppLayout><AttendanceList /></AppLayout>} />
      <Route path={AppRoutes.ATTENDANCE_MY} element={<AppLayout><SelfAttendance /></AppLayout>} />
      <Route path={AppRoutes.ATTENDANCE_SUMMARY} element={<AppLayout><AttendanceSummary /></AppLayout>} />

      /// LEAVE
      <Route path={AppRoutes.LEAVE_LIST} element={<AppLayout><LeaveList /></AppLayout>} />
      <Route path={AppRoutes.LEAVE_MY} element={<AppLayout><SelfLeave /></AppLayout>} />
    </Routes>
  )
}

export default App