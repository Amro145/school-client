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

export interface ClassRoom {
    id: string;
    name: string;
}
