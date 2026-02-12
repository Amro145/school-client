export interface Subject {
    id: number;
    name: string;
}

export interface Grade {
    id: number;
    score: number;
    subject: Subject;
    type: string;
}

export interface Class {
    id: number;
    name: string;
    subjects?: Subject[];
}

export interface TeacherSubject extends Subject {
    class?: Class;
    grades: Array<{
        student: { id: number };
        score: number;
        type?: string;
    }>;
}

export interface Teacher {
    id: number;
    userName: string;
    email: string;
    role: string;
    subjectsTaught?: TeacherSubject[];
    schedules?: ScheduleEntry[];
}

export interface StudentUser {
    id: number;
    userName: string;
    email: string;
    role: string;
    averageScore?: number;
    finalAverageScore?: number;
    midtermAverageScore?: number;
    quizAverageScore?: number;
    successRate?: number;
    class?: Class;
    grades?: Grade[];
    schedules?: ScheduleEntry[];
}

export interface ScheduleEntry {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    subject: {
        id: number;
        name: string;
        teacher?: {
            id: number;
            userName: string;
        };
    };
    classRoom: {
        id: number;
        name: string;
    };
}
