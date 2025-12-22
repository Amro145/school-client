import fullData from '../data/data.json';

// In Edge runtime, we cannot use fs. We import the JSON directly.
// Note: This makes the data read-only as writeFileSync won't work on Cloudflare.
// For persistence on Cloudflare, D1 or KV should be used.
const data: FullData = fullData as unknown as FullData;


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
    return data;
}

export function saveData(_newData: FullData) {
    console.warn("saveData called but persistence via 'fs' is not supported in Cloudflare Edge. Use D1/KV for persistence.");
    // In a production app on Cloudflare, you'd perform an API call or D1 operation here.
}

// Success Rate helper
export function calculateSuccessRate(grades: number[]): number {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    return Math.round(sum / grades.length);
}
