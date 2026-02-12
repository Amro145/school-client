import {
    AdminDashboardStats,
    Subject,
    Student,
    Teacher as SharedTeacher,
    Schedule,
    ClassRoom,
    Exam,
    Question,
    ExamSubmission
} from '../../../shared/types/models';

export type {
    AdminDashboardStats,
    Subject,
    Student,
    Schedule,
    ClassRoom,
    Exam,
    Question,
    ExamSubmission
};

export interface Teacher extends Omit<SharedTeacher, 'subjectsTaught'> {
    subjectsTaught: {
        id: string;
        name: string;
        grades: {
            id: string;
            score: number;
        }[];
    }[];
}
