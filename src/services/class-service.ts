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
      query GetClass($id: String!) {
        classRoom(id: $id) {
          id
          name
          subjects {
            id
            name
            teacher {
              id
              userName
            }
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
          schedules {
            id
            day
            startTime
            endTime
            subject {
              id
              name
            }
          }
        }
      }
    `;
    const response = await api.post('', {
      query,
      variables: { id: String(id) }
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.classRoom;
  },

  async createClassRoom(name: string, schoolId?: string) {
    const mutation = `
      mutation CreateClassRoom($name: String!, $schoolId: String) {
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
      mutation DeleteClassRoom($id: String!) {
        deleteClassRoom(id: $id) {
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
  },

  async createSchedule(scheduleData: { classId: string; subjectId: string; day: string; startTime: string; endTime: string }) {
    const mutation = `
        mutation CreateSchedule($classId: String!, $subjectId: String!, $day: String!, $startTime: String!, $endTime: String!) {
            createSchedule(classId: $classId, subjectId: $subjectId, day: $day, startTime: $startTime, endTime: $endTime) {
                id
                day
                startTime
                endTime
                subject {
                    id
                    name
                }
            }
        }
    `;
    const response = await api.post('', {
      query: mutation,
      variables: scheduleData
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.createSchedule;
  },

  async getAllSchedules() {
    const query = `
        query GetAllSchedules {
            schedules {
                id
                day
                startTime
                endTime
                classRoom {
                    id
                    name
                }
                subject {
                    id
                    name
                    teacher {
                        id
                        userName
                    }
                }
            }
        }
    `;
    const response = await api.post('', { query });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.schedules;
  },

  async updateSchedule(id: string, data: { classId: string; subjectId: string; day: string; startTime: string; endTime: string }) {
    const mutation = `
        mutation UpdateSchedule($id: String!, $classId: String!, $subjectId: String!, $day: String!, $startTime: String!, $endTime: String!) {
            updateSchedule(id: $id, classId: $classId, subjectId: $subjectId, day: $day, startTime: $startTime, endTime: $endTime) {
                id
                day
                startTime
                endTime
                subject {
                    id
                    name
                }
            }
        }
     `;
    const response = await api.post('', {
      query: mutation,
      variables: { id: String(id), ...data }
    });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.updateSchedule;
  },

  async deleteSchedule(id: number | string) {
    const mutation = `
        mutation DeleteSchedule($id: String!) {
            deleteSchedule(id: $id) {
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
