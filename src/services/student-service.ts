import api from '@/lib/axios';
import axios from 'axios';

export const studentService = {
  async getMyStudents(params: { limit?: number; offset?: number; search?: string }, signal?: AbortSignal) {
    const query = `
      query GetMyStudents($limit: Int, $offset: Int, $search: String) {
        myStudents(limit: $limit, offset: $offset, search: $search) {
          id
          userName
          email
          role
          class {
            id
            name
          }
          grades {
            id
            score
          }
          successRate
        }
        totalStudentsCount
      }
    `;

    const response = await api.post('', {
      query,
      variables: params
    }, { signal });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return {
      students: response.data.data.myStudents,
      totalCount: response.data.data.totalStudentsCount
    };
  },

  async getStudentById(id: number) {
    const query = `
      query GetStudentById($id: Int!) {
        student(id: $id) {
          id
          userName
          email
          role
          class {
            id
            name
          }
          grades {
            id
            score
            type
            subject {
              id
              name
            }
          }
          finalGrades {
            id
            score
            type
            subject {
              id
              name
            }
          }
          midtermGrades {
            id
            score
            type
            subject {
              id
              name
            }
          }
          quizGrades {
            id
            score
            type
            subject {
              id
              name
            }
          }
          }
          finalAverageScore
          midtermAverageScore
          quizAverageScore
          averageScore
        }
      }
    `;
    const response = await api.post('', {
      query,
      variables: { id }
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.student;
  },

  async createStudent(userData: any) {
    // Reusing user creation implementation likely, or specific student creation if API differs.
    // Assuming createNewUser generic is used.
    // Intentionally left blank or defined if specific logic exists.
  },

  async updateGradesBulk(grades: { id: string | number, score: number }[]) {
    const mutation = `
      mutation updateBulkGrades($grades: [GradeUpdateInput!]!) {
        updateBulkGrades(grades: $grades) {
          id
          score
        }
      }
    `;
    const response = await api.post('', {
      query: mutation,
      variables: {
        grades: grades.map(g => ({
          id: g.id.toString(),
          score: g.score
        }))
      }
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.updateBulkGrades;
  }
};
