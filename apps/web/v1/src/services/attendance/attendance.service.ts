import apiClient from "../../core/api-client";

class AttendanceService {

    async createShiftType(orgId: string, data: any) {
        return await apiClient.post(`/attendance/${orgId}/shift-type`, data);
    }

    async getAllShiftTypes(orgId: string) {
        return await apiClient.get(`/attendance/${orgId}/shift-type`);
    }

    async getShiftType(orgId: string, shiftTypeId: string) {
        return await apiClient.get(`/attendance/${orgId}/shift-type/${shiftTypeId}`);
    }

    async updateShiftType(orgId: string, shiftTypeId: string, data: any) {
        return await apiClient.put(`/attendance/${orgId}/shift-type/${shiftTypeId}`, data);
    }

    async deleteShiftType(orgId: string, shiftTypeId: string) {
        return await apiClient.delete(`/attendance/${orgId}/shift-type/${shiftTypeId}`);
    }

    async createBreakType(orgId: string, data: any) {
        return await apiClient.post(`/attendance/${orgId}/break-type`, data);
    }

    async getAllBreakTypes(orgId: string) {
        return await apiClient.get(`/attendance/${orgId}/break-type`);
    }

    async getBreakType(orgId: string, breakTypeId: string) {
        return await apiClient.get(`/attendance/${orgId}/break-type/${breakTypeId}`);
    }

    async updateBreakType(orgId: string, breakTypeId: string, data: any) {
        return await apiClient.put(`/attendance/${orgId}/break-type/${breakTypeId}`, data);
    }

    async deleteBreakType(orgId: string, breakTypeId: string) {
        return await apiClient.delete(`/attendance/${orgId}/break-type/${breakTypeId}`);
    }

    async createBreak(orgId: string, employeeId: string, attendanceId: string, data: any) {
        return await apiClient.post(`/attendance/${orgId}/${employeeId}/${attendanceId}/break`, data);
    }

    async getAllBreaks(attendanceId: string) {
        return await apiClient.get(`/attendance/${attendanceId}/break`);
    }

    async getBreak(attendanceId: string, breakId: string) {
        return await apiClient.get(`/attendance/${attendanceId}/break/${breakId}`);
    }

    async updateBreak(attendanceId: string, breakId: string, data: any) {
        return await apiClient.put(`/attendance/${attendanceId}/break/${breakId}`, data);
    }

    async deleteBreak(attendanceId: string, breakId: string) {
        return await apiClient.delete(`/attendance/${attendanceId}/break/${breakId}`);
    }

    async createAttendance(orgId: string, data: any) {
        return await apiClient.post(`/attendance/${orgId}`, data);
    }

    getAllAttendance(orgId: string) {
        return apiClient.get(`/attendance/org/${orgId}`);
    }

    getMyAttendance(employeeId: string) {
        return apiClient.get(`/attendance/employee/${employeeId}`);
    }

    getAttendance(attendanceId: string) {
        return apiClient.get(`/attendance/${attendanceId}`);
    }

    updateAttendance(attendanceId: string, data: any) {
        return apiClient.put(`/attendance/${attendanceId}`, data);
    }

    deleteAttendance(attendanceId: string) {
        return apiClient.delete(`/attendance/${attendanceId}`);
    }

}

export default new AttendanceService();