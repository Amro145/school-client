import api from '@/lib/axios';
import { Exam, ExamSubmission } from '@shared/types/models';

export const examService = {
  async createExam(data: {
    title: string;
    type: string;
    description?: string;
    durationInMinutes: number;
    subjectId: string;
    classId: string;
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
        $type: String!,
        $description: String, 
        $durationInMinutes: Int!, 
        $subjectId: String!, 
        $classId: String!, 
        $questions: [QuestionInput!]!
      ) {
        createExamWithQuestions(
          title: $title, 
          type: $type,
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
          type
          subject { name }
          class { name }
          teacher { userName }
          createdAt
          hasSubmitted
        }
      }
    `;
    const response = await api.post('', { query });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.getAvailableExams;
  },
  async getExamDetails(id: string) {
    const query = `
      query GetExam($id: String!) {
        getExam(id: $id) {
          id
          title
          description
          durationInMinutes
          type
          teacher { userName }
          subject { name }
        }
      }
    `;
    const response = await api.post('', {
      query,
      variables: { id }
    });
    if (response.data.errors) throw new Error(response.data.errors[0].message);
    return response.data.data.getExam;
  },

  async getExamForTaking(id: string) {
    const query = `
      query GetExamForTaking($id: String!) {
        getExamForTaking(id: $id) {
          id
          title
          description
          durationInMinutes
          type
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

  async submitExamResponse(examId: string, answers: { questionId: string, selectedIndex: number }[]) {
    const mutation = `
      mutation SubmitExamResponse($examId: String!, $answers: [StudentAnswerInput!]!) {
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

  async getTeacherExamReports(examId: string) {
    const query = `
      query GetTeacherExamReports($examId: String!) {
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
