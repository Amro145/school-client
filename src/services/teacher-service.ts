import api from '@/lib/axios';

export const teacherService = {
    async getMyTeachers() {
        const query = `
      query GetMyTeachers {
        myTeachers {
          id
          userName
          email
          role
          subjectsTaught {
            id
            name
            grades {
              id
              score
            }
          }
        }
      }
    `;
        const response = await api.post('', { query });
        if (response.data.errors) throw new Error(response.data.errors[0].message);
        return response.data.data.myTeachers;
    }
};
