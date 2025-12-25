import api from '@/lib/axios';

export const classService = {
  async getClassRooms() {
    const query = `
      query GetClassRooms {
        classRooms {
          id
          name
        }
      }
    `;
    const response = await api.post('', { query });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.classRooms;
  },

  async getClassById(id: number | string) {
    const query = `
      query GetClass($id: Int!) {
        classRoom(id: $id) {
          id
          name
          subjects {
            id
            name
            grades {
              id
              score
              student {
                id
                userName
              }
            }
          }
          students {
            id
            userName
            averageScore
          }
        }
      }
    `;
    const response = await api.post('', {
      query,
      variables: { id: Number(id) }
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.classRoom;
  },

  async createClassRoom(name: string, schoolId?: number) {
    const mutation = `
      mutation CreateClassRoom($name: String!, $schoolId: Int) {
        createClassRoom(name: $name, schoolId: $schoolId) {
          id
          name
        }
      }
    `;
    const response = await api.post('', {
      query: mutation,
      variables: {
        name,
        schoolId
      }
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.createClassRoom;
  },

  async deleteClassRoom(id: number | string) {
    const mutation = `
      mutation DeleteClassRoom($id: Int!) {
        deleteClassRoom(id: $id) {
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
  },

  async createSchool(name: string) {
    const mutation = `
      mutation CreateSchool($name: String!) {
        createSchool(name: $name) {
          id
          name
        }
      }
    `;
    const response = await api.post('', {
      query: mutation,
      variables: { name }
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.createSchool;
  }
};
