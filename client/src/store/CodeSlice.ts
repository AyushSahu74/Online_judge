import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { UserSubmissionType } from "../utils/type";

const initialState: InitialStateType = {
  currentCode: "",
  currentLang: "",
  codeLoading: false,
  codeOutput: "",
  jobId: "",
  userSubmission: [],
  currentSubmission: "",
  loading: false,
};

const URL = "http://ec2-13-201-7-91.ap-south-1.compute.amazonaws.com:8000/api";

export const asyncProgrammemRun = createAsyncThunk(
  "code/runProgramme",
  async ({
    currentCode,
    currentLang,
    userInput,
  }: {
    currentCode: string;
    currentLang: string;
    userInput: string;
  }) => {
    const res = await fetch(`${URL}/code/run`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: currentCode,
        language: currentLang,
        userInput,
      }),
    });
    const data = await res.json();

    if (res.ok) return data.jobId;
    else {
      toast.error(data);
    }
  }
);

export const asyncProgrammemSubmit = createAsyncThunk(
  "code/submitProgramme",
  async ({
    currentCode,
    currentLang,
    userInput,
    problemId,
    userId,
  }: {
    currentCode: string;
    currentLang: string;
    userInput: string;
    problemId: string;
    userId: string;
  }) => {
    const res = await fetch(`${URL}/code/submit`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: currentCode,
        language: currentLang,
        userInput,
        problemId,
        userId,
      }),
    });
    const data = await res.json();

    if (res.ok) return data.jobId;
    else {
      toast.error(data);
    }
  }
);

export const asyncSubmissionGet = createAsyncThunk(
  "code/getSubmission",
  async (problemId: string) => {
    const res = await fetch(`${URL}/code/submission/${problemId}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) return data;
    else toast.error(data);
  }
);

export const asyncSubmissionContent = createAsyncThunk(
  "code/fetchSubmissionContent",
  async (jobId: string) => {
    const res = await fetch(`${URL}/code/content/${jobId}`);
    const data = await res.json();
    if (res.ok) return data.content;
    else {
      toast.error(data);
    }
  }
);

export const CodeSlice = createSlice({
  name: 'Code',
  initialState, // Your initial state object
  reducers: {
    setCurrentCode: (state: InitialStateType, action: PayloadAction<string>) => {
      state.currentCode = action.payload;
    },
    setCurrentLang: (state: InitialStateType, action: PayloadAction<string>) => {
      state.currentLang = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Async actions related to running programs
      .addCase(asyncProgrammemRun.pending, (state) => {
        state.codeLoading = true;
      })
      .addCase(asyncProgrammemRun.fulfilled, (state, action) => {
        state.codeLoading = false;
        state.jobId = action.payload;
      })
      // Async actions related to program submission
      .addCase(asyncProgrammemSubmit.pending, (state) => {
        state.codeLoading = true;
      })
      .addCase(asyncProgrammemSubmit.fulfilled, (state, action) => {
        state.codeLoading = false;
        state.jobId = action.payload;
      })
      // Async actions related to submissions
      .addCase(asyncSubmissionGet.pending, (state) => {
        state.loading = true;
      })
      .addCase(asyncSubmissionGet.fulfilled, (state, action) => {
        state.loading = false;
        state.userSubmission = action.payload;
      })
      .addCase(asyncSubmissionGet.rejected, (state) => {
        state.loading = false;
      })
      .addCase(asyncSubmissionContent.fulfilled, (state, action) => {
        state.currentSubmission = action.payload;
      });
  },
});

export const { setCurrentCode, setCurrentLang } = CodeSlice.actions;

export default CodeSlice.reducer;

interface InitialStateType {
  currentCode: string;
  currentLang: string;
  codeLoading: boolean;
  codeOutput: string;
  jobId: string;
  userSubmission: UserSubmissionType[];
  loading: boolean;
  currentSubmission: string;
}