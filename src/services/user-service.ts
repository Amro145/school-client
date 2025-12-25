import api from '@/lib/axios';

export const userService = {
    async createUser(userData: { userName: string, email: string, role: string, password: string, classId?: number | string }) {
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

        if (response.data.errors) throw new Error(response.data.errors[0].message);
        return response.data.data.createUser;
    },

    async deleteUser(id: number | string) {
        const mutation = `
      mutation DeleteUser($id: Int!) {
        deleteUser(id: $id) {
          id
        }
      }
    `;
        const response = await api.post('', {
            query: mutation,
            variables: { id: typeof id === 'string' ? parseInt(id) : id }
        });

        if (response.data.errors) throw new Error(response.data.errors[0].message);
        return id;
    }
};
