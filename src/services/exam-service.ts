import api from '@/lib/axios';
import { Exam, ExamSubmission } from '@/types/admin';

export const examService = {
  async createExam(data: {
    title: string;
    description?: string;
    durationInMinutes: number;
    subjectId: number;
    classId: number;
    questions: {
      questionText: string;
      options: string[];
      correctAnswerIndex: number;
      points: number;
    }[]
  }) {
    const mutation = `
      mutation CreateExamWithQuestions(
        $title: String!, 
        $description: String, 
        $durationInMinutes: Int!, 
        $subjectId: Int!, 
        $classId: Int!, 
        $questions: [QuestionInput!]!
      ) {
        createExamWithQuestions(
          title: $title, 
          description: $description, 
          durationInMinutes: $durationInMinutes, 
          subjectId: $subjectId, 
          classId: $classId, 
          questions: $questions
        ) {
          id
          title
        }
      }
    `;
    const response = await api.post('', {
      query: mutation,
      variables: data
    });

    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.createExamWithQuestions;
  },

  async getAvailableExams() {
    const query = `
      query GetAvailableExams {
        getAvailableExams {
          id
          title
          description
          durationInMinutes
          subject { name }
          class { name }
          teacher { userName }
          createdAt
        }
      }
    `;
    const response = await api.post('', { query });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.getAvailableExams;
  },

  async getExamForTaking(id: number) {
    const query = `
      query GetExamForTaking($id: Int!) {
        getExamForTaking(id: $id) {
          id
          title
          description
          durationInMinutes
          questions {
            id
            questionText
            options
            points
          }
        }
      }
    `;
    const response = await api.post('', {
      query,
      variables: { id }
    });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.getExamForTaking;
  },

  async submitExamResponse(examId: number, answers: { questionId: number, selectedIndex: number }[]) {
    const mutation = `
      mutation SubmitExamResponse($examId: Int!, $answers: [StudentAnswerInput!]!) {
        submitExamResponse(examId: $examId, answers: $answers) {
          id
          totalScore
          submittedAt
        }
      }
    `;
    const response = await api.post('', {
      query: mutation,
      variables: { examId, answers }
    });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.submitExamResponse;
  },

  async getTeacherExamReports(examId: number) {
    const query = `
      query GetTeacherExamReports($examId: Int!) {
        getTeacherExamReports(examId: $examId) {
          id
          student {
            userName
            email
          }
          totalScore
          submittedAt
        }
      }
    `;
    const response = await api.post('', {
      query,
      variables: { examId }
    });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.getTeacherExamReports;
  }
};
