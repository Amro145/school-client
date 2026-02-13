import api from '@/lib/axios';

export const userService = {
    async createUser(userData: { userName: string, email: string, role: string, password: string, classId?: string | number }) {
        const mutation = `
      mutation CreateUser($userName: String!, $email: String!, $role: String!, $password: String!, $classId: Int) {
        createUser(userName: $userName, email: $email, role: $role, password: $password, classId: $classId) {
          id
          userName
          email
          role
        }
      }
    `;
        const response = await api.post('', {
            query: mutation,
            variables: {
                userName: userData.userName,
                email: userData.email,
                role: userData.role,
                password: userData.password,
                classId: userData.classId ? Number(userData.classId) : undefined
            }
        });

        if (response.data.errors) {
            let errorMessage = response.data.errors[0].message;
            try {
                const parsed = JSON.parse(errorMessage);
                if (Array.isArray(parsed) && parsed[0]?.message) {
                    errorMessage = parsed[0].message;
                }
            } catch (e) {
                // Keep original message if parsing fails
            }
            throw new Error(errorMessage);
        }
        return response.data.data.createUser;
    },

    async deleteUser(id: string | number) {
        const mutation = `
      mutation DeleteUser($id: Int!) {
        deleteUser(id: $id) {
          id
        }
      }
    `;
        const response = await api.post('', {
            query: mutation,
            variables: { id: Number(id) }
        });

        if (response.data.errors) {
            let errorMessage = response.data.errors[0].message;
            try {
                const parsed = JSON.parse(errorMessage);
                if (Array.isArray(parsed) && parsed[0]?.message) {
                    errorMessage = parsed[0].message;
                }
            } catch (e) {
                // Keep original message if parsing fails
            }
            throw new Error(errorMessage);
        }
        return id;
    }
};
