// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // Ikony

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E90FF', // Kolor tła nagłówka
          elevation: Platform.OS === 'android' ? 5 : 0, // Cień na Androidzie
          shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0, // Cień na iOS
        },
        headerTintColor: '#fff', // Kolor tekstu nagłówka
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22,
        },
        headerBackTitleVisible: false, // Ukrycie tytułu powrotu
        headerShown: false, // Ukrycie nagłówka na wszystkich ekranach
      }}
    >
      {/* Główny ekran */}
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} // Ukrycie nagłówka na głównym ekranie
      />
      {/* Nowe ekrany */}
      <Stack.Screen 
        name="NotificationModule" 
        options={{ headerShown: false }} // Ukrycie nagłówka
      />
      <Stack.Screen 
        name="TrainingModule" 
        options={{ headerShown: false }} // Ukrycie nagłówka
      />
      <Stack.Screen 
        name="ExerciseList" 
        options={{ headerShown: false }} // Ukrycie nagłówka
      />
      <Stack.Screen 
        name="WorkoutPlans" 
        options={{ headerShown: false }} // Ukrycie nagłówka
      />
      <Stack.Screen 
        name="NutritionModule" 
        options={{ headerShown: false }} // Ukrycie nagłówka
      />
    </Stack>
  );
}
