import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";
import { resetErrAction, resetSuccessAction } from "../globalActions/globalActions";

// Initial state
const initialState = {
  stories: [],
  myStories: [],
  story: {},
  loading: false,
  error: null,
  isAdded: false,
  isDeleted: false,
};

// CREATE story
export const createStoryAction = createAsyncThunk(
  "stories/create",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      for (let key in payload) {
        if (key === "files") {
          payload.files.forEach((file) => formData.append("files", file));
        } else {
          formData.append(key, payload[key]);
        }
      }

      const { data } = await axios.post(`${baseURL}/stories`, formData, config);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

// FETCH all stories
export const fetchAllStoriesAction = createAsyncThunk(
  "stories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${baseURL}/stories`);
      return data?.stories;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

// FETCH my stories
export const fetchMyStoriesAction = createAsyncThunk(
  "stories/fetchMine",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${baseURL}/stories/my-stories`, config);
      return data?.stories;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

// DELETE a story
export const deleteStoryAction = createAsyncThunk(
  "stories/delete",
  async (storyId, { rejectWithValue, getState }) => {
    try {
      const token = getState()?.users?.userAuth?.userInfo?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.delete(`${baseURL}/stories/${storyId}`, config);
      return data;
    } catch (err) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

const storySlice = createSlice({
  name: "stories",
  initialState,
  extraReducers: (builder) => {
    // Create story
    builder.addCase(createStoryAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createStoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.story = action.payload;
      state.isAdded = true;
    });
    builder.addCase(createStoryAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch all stories
    builder.addCase(fetchAllStoriesAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllStoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.stories = action.payload;
    });
    builder.addCase(fetchAllStoriesAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch my stories
    builder.addCase(fetchMyStoriesAction.fulfilled, (state, action) => {
      state.loading = false;
      state.myStories = action.payload;
    });

    // Delete story
    builder.addCase(deleteStoryAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteStoryAction.fulfilled, (state, action) => {
      state.loading = false;
      state.isDeleted = true;
    });
    builder.addCase(deleteStoryAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Resets
    builder.addCase(resetSuccessAction, (state) => {
      state.isAdded = false;
      state.isDeleted = false;
    });
    builder.addCase(resetErrAction, (state) => {
      state.error = null;
    });
  },
});

export default storySlice.reducer;
