import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { ProblemType, PropblemDetailType, TestcaseType } from "../utils/type";

const initialState: InitialStateType = {
  testcase: [],
  loading: false,
  problems: [],
  singleProblem: undefined
};

const URL = 'http://localhost:8000/api'

export const asyncProblemAdd = createAsyncThunk(
  "problem/addProblem",
  async ({
    detail,
    testcase,
  }: {
    detail: PropblemDetailType;
    testcase: TestcaseType[];
  }) => {
    const res = await fetch(`${URL}/problem/add`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ detail, testcase }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Problem added successfully...')
      window.location.href = '/'
      return data;
    } else toast.error(JSON.stringify(data));
  }
);

export const asyncProblemEdit = createAsyncThunk(
  "problem/editProblem",
  async ({
    detail,
    testcase,
    id
  }: {
    detail: PropblemDetailType;
    testcase: TestcaseType[];
    id: string
  }) => {
    const res = await fetch(`${URL}/problem/edit/${id}`, {
      method: "PUT",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ detail, testcase }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Problem Updated Successfully...')
      window.location.href = '/'
      return data;
    } else toast.error(JSON.stringify(data));
  }
);

export const asyncProblemDelete = createAsyncThunk(
  "problem/deleteProblem",
  async (id: string) => {
    const res = await fetch(`${URL}/problem/delete/${id}`, {
      method: "DELETE",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();
    if (res.ok) {
      toast.success('Problem Deleted Successfully...')
      window.location.href = '/'
      return data;
    } else toast.error(JSON.stringify(data));
  }
);

export const asyncProblemGet = createAsyncThunk(
  "problem/getProblem",
  async () => {
    const res = await fetch(`${URL}/problem/`, {
      credentials: 'include'
    });
    const data = await res.json();
    if (res.ok) {
      return data;
    } else toast.error(JSON.stringify(data));
  }
);

export const asyncSingleProblemGet = createAsyncThunk(
  "problem/getSingleProblem",
  async (id: string) => {
    const res = await fetch(`${URL}/problem/`+id);
    const data = await res.json();
    if (res.ok) {
      return data;
    } else toast.error(JSON.stringify(data));
  }
);

export const ProblemSlice = createSlice({
  name: 'problem',
  initialState, // Your initial state object
  reducers: {
    addTestcase: (state: InitialStateType, action: PayloadAction<TestcaseType>) => {
      state.testcase.push(action.payload);
    },
    removeTestcase: (state: InitialStateType, action: PayloadAction<number>) => {
      state.testcase = state.testcase.filter((item, index) => index !== action.payload);
    },
    setTestcase: (state: InitialStateType, action: PayloadAction<TestcaseType[]>) => {
      state.testcase = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncProblemAdd.pending, (state) => {
        state.loading = true;
      })
      .addCase(asyncProblemAdd.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(asyncProblemAdd.rejected, (state) => {
        state.loading = false;
      })
      .addCase(asyncProblemGet.pending, (state, action) => {
        state.loading = true; // Use action.payload if needed (e.g., for filtering)
      })
      .addCase(asyncProblemGet.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })
      .addCase(asyncProblemGet.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(asyncSingleProblemGet.pending, (state, action) => {
        state.loading = true; // Use action.payload if needed (e.g., for filtering)
      })
      .addCase(asyncSingleProblemGet.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProblem = action.payload;
      })
      .addCase(asyncSingleProblemGet.rejected, (state, action) => {
        state.loading = false;
      });
  },
});


export const { addTestcase, removeTestcase, setTestcase } = ProblemSlice.actions;

export default ProblemSlice.reducer;

interface InitialStateType {
  testcase: TestcaseType[];
  loading: boolean;
  problems: ProblemType[],
  singleProblem: ProblemType | undefined
}