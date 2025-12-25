import api from '@/lib/axios';

export const dashboardService = {
    async getStats() {
        const query = `
      query GetDashboardStats {
        adminDashboardStats {
          totalStudents
          totalTeachers
          totalClassRooms
        }
        subjects {
          id
          name
          grades {
            id
            score
          }
        }
        topStudents {
          id
          userName
          averageScore
        }
      }
    `;
        const response = await api.post('', { query });
        if (response.data.errors) throw new Error(response.data.errors[0].message);
        return response.data.data;
    }
};
