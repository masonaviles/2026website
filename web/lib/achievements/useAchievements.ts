"use client";

import { useSyncExternalStore } from "react";
import {
  type AchievementState,
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "./store";

export function useAchievements(): AchievementState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
