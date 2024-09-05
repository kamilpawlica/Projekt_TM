import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from './../db/SupabaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
  const router = useRouter();

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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/TrainingModule')}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Plany Treningowe</Text>
      <FlatList
        data={workoutPlans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.planContainer}>
            <TouchableOpacity onPress={() => togglePlan(item.id)} style={styles.planHeader}>
              <Text style={styles.planTitle}>Plan: {item.name}</Text>
            </TouchableOpacity>
            {expandedPlan === item.id && (
              <View style={styles.planDetails}>
                <Text style={styles.detailsText}>Poziom trudności: {item.difficulty_level}</Text>
                <Text style={styles.detailsText}>Opis: {item.description}</Text>
                <Text style={styles.exercisesTitle}>Ćwiczenia:</Text>
                {item.workout_plan_exercises
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((exercise: any) => (
                    <View key={exercise.order} style={styles.exerciseItem}>
                      <Text style={styles.exerciseText}>
                        {exercise.order}. {exercise.exercises.name} - {exercise.exercises.muscle_groups.name}
                      </Text>
                    </View>
                  ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C', 
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 50,
    marginTop: 32,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 30,
    marginLeft: 50
  },
  planContainer: {
    marginBottom: 20,
  },
  planHeader: {
    backgroundColor: '#333', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 4,
  },
  planTitle: {
    fontSize: 18,
    color: 'white',
  },
  planDetails: {
    backgroundColor: '#444', 
    padding: 15,
    borderRadius: 10,
  },
  detailsText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  exercisesTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  exerciseItem: {
    backgroundColor: '#555', 
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  exerciseText: {
    color: 'white',
    fontSize: 16,
  },
});
