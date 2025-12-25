import api from '@/lib/axios';

export const subjectService = {
    async getSubjects() {
        const query = `
      query GetSubjects {
        subjects {
          id
          name
          teacher {
            id
            userName
          }
          class {
            id
            name
          }
          grades {
            id
            score
          }
        }
      }
    `;
        const response = await api.post('', { query });
        if (response.data.errors) throw new Error(response.data.errors[0].message);
        return response.data.data.subjects;
    },

    async createSubject(subjectData: { classId: number, name: string, teacherId: number }) {
        const mutation = `
      mutation CreateSubject($classId: Int!, $name: String!, $teacherId: Int!) {
        createSubject(classId: $classId, name: $name, teacherId: $teacherId) {
          id
        }
      }
    `;
        const response = await api.post('', {
            query: mutation,
            variables: {
                classId: Number(subjectData.classId),
                teacherId: Number(subjectData.teacherId),
                name: subjectData.name
            }
        });

        if (response.data.errors) throw new Error(response.data.errors[0].message);
        return response.data.data.createSubject;
    },

    async deleteSubject(id: number | string) {
        const mutation = `
      mutation DeleteSubject($id: Int!) {
        deleteSubject(id: $id) {
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
