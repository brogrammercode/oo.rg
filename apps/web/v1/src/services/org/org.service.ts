import { EmployeeStatus } from "../../constants/org";
import apiClient from "../../core/api-client";

class OrgService {
    /// org
    async find(name: string) {
        return await apiClient.get(`/org/find?name=${name}`);
    }

    async create(orgName: string) {
        return await apiClient.post(`/org/create`, { name: orgName });
    }

    /// employee
    async getMyEmployee(orgId: string) {
        return await apiClient.get(`/org/${orgId}/employee/my`);
    }

    async getAllEmployees(orgId: string) {
        return await apiClient.get(`/org/${orgId}/employee`);
    }

    async createEmployee(orgId: string, data: { name: string, email: string, password: string, role: string, post: string }) {
        return await apiClient.post(`/org/${orgId}/employee`, data);
    }

    async requestToJoin(orgId: string) {
        return await apiClient.post(`/org/${orgId}/employee/request`);
    }

    async acceptEmployeeRequest(employeeId: string) {
        return await apiClient.put(`/org/employee/${employeeId}`, { status: EmployeeStatus.ACCEPTED });
    }

    async rejectEmployeeRequest(employeeId: string) {
        return await apiClient.put(`/org/employee/${employeeId}`, { status: EmployeeStatus.REJECTED });
    }

    async removeEmployee(employeeId: string) {
        return await apiClient.put(`/org/employee/${employeeId}`, { status: EmployeeStatus.RESIGNED });
    }

    async updateEmployeeRoles(employeeId: string, roleIds: string[]) {
        return await apiClient.put(`/org/employee/${employeeId}`, { roles: roleIds });
    }

    async updateEmployeePost(employeeId: string, postId: string) {
        return await apiClient.put(`/org/employee/${employeeId}`, { post: postId });
    }

    /// department
    async getDepartments(orgId: string) {
        return await apiClient.get(`/org/${orgId}/department`);
    }

    async createDepartment(orgId: string, data: { name: string, description?: string, color?: string }) {
        return await apiClient.post(`/org/${orgId}/department`, data);
    }

    async updateDepartment(departmentId: string, data: { name: string, description?: string, color?: string }) {
        return await apiClient.put(`/org/department/${departmentId}`, data);
    }

    async deleteDepartment(departmentId: string) {
        return await apiClient.delete(`/org/department/${departmentId}`);
    }

    /// role
    async getRoles(orgId: string) {
        return await apiClient.get(`/org/${orgId}/role`);
    }

    async createRole(orgId: string, data: { name: string, description?: string, color?: string }) {
        return await apiClient.post(`/org/${orgId}/role`, data);
    }

    async updateRole(roleId: string, data: { name: string, description?: string, color?: string, permissions?: string[] }) {
        return await apiClient.put(`/org/role/${roleId}`, data);
    }

    async deleteRole(roleId: string) {
        return await apiClient.delete(`/org/role/${roleId}`);
    }

    /// post
    async getPosts(orgId: string, departmentId: string) {
        return await apiClient.get(`/org/${orgId}/${departmentId}/post`);
    }

    async createPost(orgId: string, departmentId: string, data: { name: string, description?: string, color?: string }) {
        return await apiClient.post(`/org/${orgId}/${departmentId}/post`, data);
    }

    async updatePost(postId: string, data: { name: string, description?: string, color?: string }) {
        return await apiClient.put(`/org/post/${postId}`, data);
    }

    async deletePost(postId: string) {
        return await apiClient.delete(`/org/post/${postId}`);
    }
}

export default new OrgService();
