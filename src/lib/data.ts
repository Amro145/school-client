import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/data.json');

export interface Student {
    id: string;
    name: string;
    email: string;
    classId: string;
    grades: Record<string, number>;
}

export interface Teacher {
    id: string;
    name: string;
    email: string;
}

export interface ClassRoom {
    id: string;
    name: string;
}

export interface Subject {
    id: string;
    name: string;
    classId: string;
    teacherId: string;
}

export interface FullData {
    students: Student[];
    teachers: Teacher[];
    classes: ClassRoom[];
    subjects: Subject[];
}

export function getData(): FullData {
    const jsonData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(jsonData);
}

export function saveData(data: FullData) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2));
}

// Success Rate helper
export function calculateSuccessRate(grades: number[]): number {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return Math.round(sum / grades.length);
}
