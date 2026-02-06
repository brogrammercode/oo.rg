import apiClient from "../../core/api-client";

class AttendanceService {
    async createAttendance(orgId: string, employeeId: string, data: { date: string, status: string, checkIn: string, checkOut: string }) {
        return await apiClient.post(`/attendance/${orgId}/employee/${employeeId}`, data);
    }

    async getAllAttendance(orgId: string) {
        return await apiClient.get(`/attendance/${orgId}`);
    }

    async getAttendance(employeeId: string) {
        return await apiClient.get(`/attendance/employee/${employeeId}`);
    }

    async updateAttendance(attendanceId: string, data: { date: string, status: string, checkIn: string, checkOut: string }) {
        return await apiClient.put(`/attendance/${attendanceId}`, data);
    }

    async deleteAttendance(attendanceId: string) {
        return await apiClient.delete(`/attendance/${attendanceId}`);
    }
}

const attendanceService = new AttendanceService();
export default attendanceService;