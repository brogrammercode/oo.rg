import { Route, Routes, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
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
import AttendanceSummary from './pages/app/attendance/components/attendance-summary'
import LeaveList from './pages/app/leave/leave-list'
import SelfLeave from './pages/app/leave/self-leave'
import orgService from './services/org/org.service'
import { ProtectedRoute } from './components/guards/protected-route'
import { Permissions } from './constants/org'

function App() {
  const auth = useAuthStore();
  const org = useOrgStore();
  const authenticated = auth.isAuthenticated;
  const employee = org.employee;

  useEffect(() => {
    const refreshData = async () => {
      if (!authenticated) return;

      try {
        if (org.org?._id) {
          const orgRes = await orgService.getMyEmployee(org.org._id);
          if (orgRes.data?.data?.org) {
            org.setOrg(orgRes.data.data.org);
          }
        }

        if (org.org?._id && org.employee?._id) {
          const empRes = await orgService.getMyEmployee(org.org._id);
          if (empRes.data?.data?.employee) {
            org.setEmployee(empRes.data.data.employee);
          }
        }
      } catch (error) {
        console.error('Failed to refresh data:', error);
      }
    };

    refreshData();
  }, [authenticated]);

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

      <Route path={AppRoutes.DASHBOARD_MANAGER} element={<ProtectedRoute permission={Permissions.READ_MANAGER_DASHBOARD}><AppLayout><ManagerDashboard /></AppLayout></ProtectedRoute>} />
      <Route path={AppRoutes.DASHBOARD_SELF} element={<ProtectedRoute permission={Permissions.READ_SELF_DASHBOARD}><AppLayout><SelfDashboard /></AppLayout></ProtectedRoute>} />
      <Route path={AppRoutes.EMPLOYEE_LIST} element={<ProtectedRoute permission={Permissions.READ_ALL_EMPLOYEE}><AppLayout><EmployeeList /></AppLayout></ProtectedRoute>} />
      <Route path={AppRoutes.ROLE_LIST} element={<ProtectedRoute permission={Permissions.READ_ALL_ROLE}><AppLayout><RoleList /></AppLayout></ProtectedRoute>} />
      <Route path={AppRoutes.DEPARTMENT_LIST} element={<ProtectedRoute permission={Permissions.READ_ALL_DEPARTMENT}><AppLayout><DepartmentList /></AppLayout></ProtectedRoute>} />

      <Route path={AppRoutes.ATTENDANCE_LIST} element={<ProtectedRoute permission={Permissions.READ_ALL_ATTENDANCE}><AppLayout><AttendanceList /></AppLayout></ProtectedRoute>} />
      <Route path={AppRoutes.ATTENDANCE_MY} element={<ProtectedRoute permission={Permissions.READ_SELF_ATTENDANCE}><AppLayout><SelfAttendance /></AppLayout></ProtectedRoute>} />
      <Route path={AppRoutes.ATTENDANCE_SUMMARY} element={<ProtectedRoute permission={Permissions.READ_ATTENDANCE_SUMMARY}><AppLayout><AttendanceSummary /></AppLayout></ProtectedRoute>} />

      <Route path={AppRoutes.LEAVE_LIST} element={<ProtectedRoute permission={Permissions.READ_ALL_LEAVE}><AppLayout><LeaveList /></AppLayout></ProtectedRoute>} />
      <Route path={AppRoutes.LEAVE_MY} element={<ProtectedRoute permission={Permissions.READ_SELF_LEAVE}><AppLayout><SelfLeave /></AppLayout></ProtectedRoute>} />
    </Routes>
  )
}

export default App