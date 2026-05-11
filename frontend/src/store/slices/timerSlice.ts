import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TimerEntry {
  recipeId: string;
  stepIndex: number;
  totalSeconds: number;
  startedAt: number;       // Date.now() quando o timer foi (re)iniciado
  pausedSecondsLeft: number | null; // null = rodando, número = pausado
  notificationId: string | null;
}

type TimerState = {
  timers: Record<string, TimerEntry>; // chave: `${recipeId}_${stepIndex}`
};

const initialState: TimerState = {
  timers: {},
};

function timerKey(recipeId: string, stepIndex: number) {
  return `${recipeId}_${stepIndex}`;
}

const timerSlice = createSlice({
  name: "timers",
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<TimerEntry>) => {
      const key = timerKey(action.payload.recipeId, action.payload.stepIndex);
      state.timers[key] = action.payload;
    },

    pauseTimer: (
      state,
      action: PayloadAction<{ recipeId: string; stepIndex: number; secondsLeft: number }>
    ) => {
      const key = timerKey(action.payload.recipeId, action.payload.stepIndex);
      const entry = state.timers[key];
      if (entry) {
        entry.pausedSecondsLeft = action.payload.secondsLeft;
        entry.notificationId = null;
      }
    },

    clearTimer: (
      state,
      action: PayloadAction<{ recipeId: string; stepIndex: number }>
    ) => {
      const key = timerKey(action.payload.recipeId, action.payload.stepIndex);
      delete state.timers[key];
    },

    clearAllTimersForRecipe: (state, action: PayloadAction<string>) => {
      Object.keys(state.timers).forEach((key) => {
        if (state.timers[key].recipeId === action.payload) {
          delete state.timers[key];
        }
      });
    },
  },
});

export { timerKey };
export const { startTimer, pauseTimer, clearTimer, clearAllTimersForRecipe } = timerSlice.actions;
export default timerSlice.reducer;