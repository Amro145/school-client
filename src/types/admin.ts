export interface AdminDashboardStats {
    totalStudents: number;
    totalTeachers: number;
    totalClassRooms: number;
}

export interface Subject {
    id: string;
    name: string;
    teacher: {
        id: string;
        userName: string;
    } | null;
    class: {
        id: string;
        name: string;
    } | null;
    grades: {
        id: string;
        score: number;
        type: string;
        student: {
            id: string;
            userName: string;
        };
    }[];
}

export interface Student {
    id: string;
    userName: string;
    email: string;
    role: string;
    class: {
        id: string;
        name: string;
    } | null;
    averageScore?: number;
    successRate?: number;
    grades: {
        id: string;
        score: number;
        type: string;
        subject?: {
            id: string;
            name: string;
        };
    }[];
    finalGrades?: {
        id: string;
        score: number;
        type: string;
        subject?: {
            id: string;
            name: string;
        };
    }[];
    midtermGrades?: {
        id: string;
        score: number;
        type: string;
        subject?: {
            id: string;
            name: string;
        };
    }[];
    quizGrades?: {
        id: string;
        score: number;
        type: string;
        subject?: {
            id: string;
            name: string;
        };
    }[];
}

export interface Teacher {
    id: string;
    userName: string;
    email: string;
    role: string;
    subjectsTaught: {
        id: string;
        name: string;
        grades: {
            id: string;
            score: number;
        }[];
    }[];
}

export interface Schedule {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
    subject: {
        id: string;
        name: string;
        teacher?: {
            id: string;
            userName: string;
        };
    } | null;
    classRoom?: {
        id: string;
        name: string;
    };
}

export interface ClassRoom {
    id: string;
    name: string;
    subjects?: Subject[];
    students?: Student[];
    schedules?: Schedule[];
}

export interface Exam {
    id: string;
    title: string;
    type: string;
    description?: string;
    durationInMinutes: number;
    subjectId: string;
    classId: string;
    teacherId: string;
    createdAt: string;
    subject?: { name: string };
    class?: { name: string };
    teacher?: { userName: string };
    questions?: Question[];
    submissions?: ExamSubmission[];
    hasSubmitted?: boolean;
}

export interface Question {
    id: string;
    examId: string;
    questionText: string;
    options: string[];
    correctAnswerIndex?: number;
    points: number;
}

export interface ExamSubmission {
    id: string;
    studentId: string;
    examId: string;
    totalScore: number;
    answers: string; // JSON string
    submittedAt: string;
    student?: { userName: string; email: string };
    exam?: { title: string };
}
