import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
};

// GET /api/tasks  (backend auto-filters by role: admin sees all, user sees own)
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/tasks');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Could not load tasks');
    }
  }
);

// POST /api/tasks  (admin only, per backend adminOnly middleware)
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, thunkAPI) => {
    try {
      const res = await api.post('/tasks', taskData);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Could not create task');
    }
  }
);

// PUT /api/tasks/:id
export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, updates }, thunkAPI) => {
    try {
      const res = await api.put(`/tasks/${id}`, updates);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Could not update task');
    }
  }
);

// DELETE /api/tasks/:id  (admin only)
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Could not delete task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearTaskError } = tasksSlice.actions;
export default tasksSlice.reducer;
