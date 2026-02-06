import apiClient from "../../core/api-client";

class AuthService {
    async login(email: string, password: string) {
        const response = await apiClient.post('/auth/login', {
            email,
            password
        });
        return response.data;
    }

    async logout() {
        const response = await apiClient.post('/auth/logout');
        return response.data;
    }

    async register(email: string, password: string) {
        const response = await apiClient.post('/auth/register', {
            email,
            password
        });
        return response.data;
    }
}

const authService = new AuthService();
export default authService;