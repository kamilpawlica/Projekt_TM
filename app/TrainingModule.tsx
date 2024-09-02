// app/TrainingModule.tsx
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TrainingModule() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
      }}
    >
      {/* Odnośnik do spisu ćwiczeń */}
      <TouchableOpacity
        onPress={() => router.push('/ExerciseList')}
        style={{ marginBottom: 20 }}
      >
        <Text style={{ color: 'blue', fontSize: 18 }}>Spis Ćwiczeń</Text>
      </TouchableOpacity>

      {/* Odnośnik do planów treningowych */}
      <TouchableOpacity
        onPress={() => router.push('/WorkoutPlans')}
        style={{ marginBottom: 20 }}
      >
        <Text style={{ color: 'blue', fontSize: 18 }}>Plany Treningowe</Text>
      </TouchableOpacity>
    </View>
  );
}
