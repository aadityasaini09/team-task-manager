import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000";

const baseQuery = fetchBaseQuery({ baseUrl: `${API_URI}/api` });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
