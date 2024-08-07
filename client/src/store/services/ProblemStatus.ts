import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const problemStatusApi = createApi({
  reducerPath: "problemStatusApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/code/",
  }),
  endpoints: (builder) => ({
    getProblemStatus: builder.query({
      query: (id) => `status/${id}`,
    }),
  }),
});

export const { useGetProblemStatusQuery } = problemStatusApi;
// export const { useGetProblemStatusQuery } = problemStatusApi as { useGetProblemStatusQuery: any };