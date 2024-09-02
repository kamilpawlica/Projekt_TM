// app/WorkoutPlans.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
import { supabase } from './../db/SupabaseConfig';

const getWorkoutPlansWithExercises = async () => {
  const { data, error } = await supabase
    .from('workout_plans')
    .select(`
      id,
      name,
      difficulty_level,
      description,
      workout_plan_exercises (
        order,
        exercises (
          name,
          muscle_groups (
            name
          )
        )
      )
    `);

  if (error) {
    console.error('Error fetching workout plans:', error);
    return null;
  } else {
    console.log('Fetched Workout Plans:', data);
    return data;
  }
};

export default function WorkoutPlans() {
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      const plansData = await getWorkoutPlansWithExercises();
      if (plansData) {
        setWorkoutPlans(plansData);
      }
    };

    fetchWorkoutPlans();
  }, []);

  const togglePlan = (planId: number) => {
    setExpandedPlan((prev) => (prev === planId ? null : planId));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Plany Treningowe
      </Text>
      <FlatList
        data={workoutPlans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity onPress={() => togglePlan(item.id)}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                Plan: {item.name}
              </Text>
            </TouchableOpacity>
            {expandedPlan === item.id && (
              <>
                <Text>Poziom trudności: {item.difficulty_level}</Text>
                <Text>Opis: {item.description}</Text>
                <Text style={{ marginTop: 10, fontWeight: 'bold' }}>
                  Ćwiczenia:
                </Text>
                {item.workout_plan_exercises
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((exercise: any) => (
                    <View key={exercise.order} style={{ marginLeft: 10 }}>
                      <Text>
                        {exercise.order}. {exercise.exercises.name} - {exercise.exercises.muscle_groups.name}
                      </Text>
                    </View>
                  ))}
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}
