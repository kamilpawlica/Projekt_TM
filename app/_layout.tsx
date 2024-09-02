// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      {/* Główny ekran */}
      <Stack.Screen name="index" />
      {/* Nowe ekrany */}
      <Stack.Screen name="NotificationModule" />
      <Stack.Screen name="TrainingModule" />
      <Stack.Screen name="ExerciseList" />
      <Stack.Screen name="WorkoutPlans" />
      <Stack.Screen name="NutritionModule" />
    </Stack>
  );
}
