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

  async createSubject(subjectData: { classId: string, name: string, teacherId: string }) {
    const mutation = `
      mutation CreateSubject($classId: String!, $name: String!, $teacherId: String!) {
        createSubject(classId: $classId, name: $name, teacherId: $teacherId) {
          id
        }
      }
    `;
    const response = await api.post('', {
      query: mutation,
      variables: {
        classId: String(subjectData.classId),
        teacherId: String(subjectData.teacherId),
        name: subjectData.name
      }
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.createSubject;
  },

  async deleteSubject(id: number | string) {
    const mutation = `
      mutation DeleteSubject($id: String!) {
        deleteSubject(id: $id) {
          id
        }
      }
    `;
    const response = await api.post('', {
      query: mutation,
      variables: { id: String(id) }
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return id;
  }
};
