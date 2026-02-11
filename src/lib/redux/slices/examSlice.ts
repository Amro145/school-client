import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { examService } from '@/services/exam-service';
import { Exam, ExamSubmission } from '@shared/types/models';

interface ExamState {
    availableExams: Exam[];
    currentExam: Exam | null;
    lastSubmission: ExamSubmission | null;
    reports: ExamSubmission[];
    loading: boolean;
    error: string | null;
}

const initialState: ExamState = {
    availableExams: [],
    currentExam: null,
    lastSubmission: null,
    reports: [],
    loading: false,
    error: null,
};

export const fetchAvailableExams = createAsyncThunk(
    'exam/fetchAvailableExams',
    async (_, { rejectWithValue }) => {
        try {
            return await examService.getAvailableExams();
        } catch (error: unknown) {
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchExamDetails = createAsyncThunk(
    'exam/fetchExamDetails',
    async (id: number, { rejectWithValue }) => {
        try {
            return await examService.getExamDetails(id);
        } catch (error: unknown) {
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchExamForTaking = createAsyncThunk(
    'exam/fetchExamForTaking',
    async (id: number, { rejectWithValue }) => {
        try {
            return await examService.getExamForTaking(id);
        } catch (error: unknown) {
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const createExamTransition = createAsyncThunk(
    'exam/createExam',
    async (data: {
        title: string;
        type: string;
        description?: string;
        durationInMinutes: number;
        subjectId: number;
        classId: number;
        questions: {
            questionText: string;
            options: string[];
            correctAnswerIndex: number;
            points: number;
        }[];
    }, { rejectWithValue }) => {
        try {
            return await examService.createExam(data);
        } catch (error: unknown) {
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const submitExam = createAsyncThunk(
    'exam/submitExam',
    async ({ examId, answers }: { examId: number, answers: { questionId: number; selectedIndex: number }[] }, { rejectWithValue }) => {
        try {
            return await examService.submitExamResponse(examId, answers);
        } catch (error: unknown) {
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

export const fetchTeacherExamReports = createAsyncThunk(
    'exam/fetchTeacherExamReports',
    async (examId: number, { rejectWithValue }) => {
        try {
            return await examService.getTeacherExamReports(examId);
        } catch (error: unknown) {
            if (error instanceof Error) return rejectWithValue(error.message);
            return rejectWithValue('An unexpected error occurred');
        }
    }
);

const examSlice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        clearExamState: (state) => {
            state.currentExam = null;
            state.lastSubmission = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAvailableExams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailableExams.fulfilled, (state, action) => {
                state.loading = false;
                state.availableExams = action.payload;
            })
            .addCase(fetchAvailableExams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.error = action.payload as string;
            })
            .addCase(fetchExamDetails.pending, (state) => {
                state.loading = true;
                state.currentExam = null;
                state.error = null;
            })
            .addCase(fetchExamDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentExam = action.payload;
            })
            .addCase(fetchExamDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchExamForTaking.pending, (state) => {
                state.loading = true;
                state.currentExam = null;
                state.error = null;
            })
            .addCase(fetchExamForTaking.fulfilled, (state, action) => {
                state.loading = false;
                state.currentExam = action.payload;
            })
            .addCase(fetchExamForTaking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(submitExam.pending, (state) => {
                state.loading = true;
            })
            .addCase(submitExam.fulfilled, (state, action) => {
                state.loading = false;
                state.lastSubmission = action.payload;
                // Optimistically update the local state to reflect submission
                const examId = action.meta.arg.examId;
                const examIndex = state.availableExams.findIndex(e => String(e.id) === String(examId));
                if (examIndex !== -1) {
                    state.availableExams[examIndex] = {
                        ...state.availableExams[examIndex],
                        hasSubmitted: true
                    };
                }
            })
            .addCase(submitExam.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTeacherExamReports.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTeacherExamReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload;
            })
            .addCase(fetchTeacherExamReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearExamState } = examSlice.actions;
export default examSlice.reducer;
