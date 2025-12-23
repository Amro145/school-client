export interface Subject {
    id: string;
    name: string;
}

export interface Grade {
    id: string;
    score: number;
    subject: Subject;
}

export interface Class {
    id: string;
    name: string;
    subjects?: Subject[];
}

export interface TeacherSubject extends Subject {
    class?: Class;
    grades: Array<{
        student: { id: string };
        score: number;
    }>;
}

export interface Teacher {
    id: string;
    userName: string;
    email: string;
    role: string;
    subjectsTaught?: TeacherSubject[];
}

export interface StudentUser {
    id: string;
    userName: string;
    email: string;
    role: string;
    averageScore?: number;
    successRate?: number;
    class?: Class;
    grades?: Grade[];
}
