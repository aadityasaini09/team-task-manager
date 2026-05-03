import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROOT } from "../../utils/apiBase.js";

const baseQuery = fetchBaseQuery({ baseUrl: API_ROOT });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
