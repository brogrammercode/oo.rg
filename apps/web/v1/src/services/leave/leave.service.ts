import apiClient from "../../core/api-client";

class LeaveService {
    async getAllLeaveType(orgId: string) {
        return await apiClient.get(`/leave/${orgId}/leave-type`);
    }

    async getLeaveType(orgId: string, leaveTypeId: string) {
        return await apiClient.get(`/leave/${orgId}/leave-type/${leaveTypeId}`);
    }

    async createLeaveType(orgId: string, data: { name?: string, description?: string, color?: string, maxPerMonth?: number, maxPerYear?: number, isPaid?: boolean }) {
        return await apiClient.post(`/leave/${orgId}/leave-type`, data);
    }

    async updateLeaveType(orgId: string, leaveTypeId: string, data: { name?: string, description?: string, color?: string, maxPerMonth?: number, maxPerYear?: number, isPaid?: boolean }) {
        return await apiClient.put(`/leave/${orgId}/leave-type/${leaveTypeId}`, data);
    }

    async deleteLeaveType(orgId: string, leaveTypeId: string) {
        return await apiClient.delete(`/leave/${orgId}/leave-type/${leaveTypeId}`);
    }

    /// leave
    async getAllLeaves(orgId: string) {
        return await apiClient.get(`/leave/org/${orgId}`);
    }

    async getMyLeaves(employeeId: string) {
        return await apiClient.get(`/leave/employee/${employeeId}`);
    }

    async getLeave(leaveId: string) {
        return await apiClient.get(`/leave/${leaveId}`);
    }

    async createLeave(orgId: string, data: { employee?: string, type?: string, startDate?: string, endDate?: string, reason?: string, status?: string }) {
        return await apiClient.post(`/leave/${orgId}`, data);
    }

    async updateLeave(leaveId: string, data: { type?: string, startDate?: string, endDate?: string, reason?: string, status?: string }) {
        return await apiClient.put(`/leave/${leaveId}`, data);
    }

    async deleteLeave(leaveId: string) {
        return await apiClient.delete(`/leave/${leaveId}`);
    }
}

export default new LeaveService();