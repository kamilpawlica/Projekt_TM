// app/ExerciseList.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, Modal, Button, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from './../db/SupabaseConfig';

const getExercisesByMuscleGroup = async () => {
  const { data, error } = await supabase
    .from('exercises')
    .select('id, name, muscle_groups (name), instructions');

  if (error) {
    console.error('Error fetching exercises:', error);
    return null;
  } else {
    console.log('Fetched Exercises:', data);
    return data;
  }
};

export default function ExerciseList() {
  const [exercisesByGroup, setExercisesByGroup] = useState<{ [key: string]: any[] }>({});
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useState(new Animated.Value(0))[0];
  const router = useRouter();

  useEffect(() => {
    const fetchExercises = async () => {
      const exercisesData = await getExercisesByMuscleGroup();
      if (exercisesData) {
        const groupedExercises: { [key: string]: any[] } = {};
        exercisesData.forEach((exercise) => {
          const { muscle_groups } = exercise;
          if (!groupedExercises[muscle_groups.name]) {
            groupedExercises[muscle_groups.name] = [];
          }
          groupedExercises[muscle_groups.name].push(exercise);
        });
        setExercisesByGroup(groupedExercises);
      }
    };

    fetchExercises();
  }, []);

  const toggleGroup = (muscleGroup: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [muscleGroup]: !prev[muscleGroup],
    }));
  };

  const showExerciseDetails = (exercise: any) => {
    setSelectedExercise(exercise);
    setModalVisible(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/TrainingModule')}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Spis Ćwiczeń</Text>
      <FlatList
        data={Object.keys(exercisesByGroup)}
        keyExtractor={(item) => item}
        renderItem={({ item: muscleGroup }) => (
          <View style={styles.groupContainer}>
            <TouchableOpacity onPress={() => toggleGroup(muscleGroup)}>
              <Text style={styles.groupTitle}>{muscleGroup}</Text>
            </TouchableOpacity>
            {expandedGroups[muscleGroup] &&
              exercisesByGroup[muscleGroup].map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  onPress={() => showExerciseDetails(exercise)}
                  style={styles.exerciseItem}
                >
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}
      />

      {/* Modal for exercise details */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleValue }] }]}>
            <Text style={styles.modalTitle}>Szczegóły ćwiczenia: {selectedExercise?.name}</Text>
            <Text style={styles.modalInstructions}>{selectedExercise?.instructions}</Text>
            <Button title="Zamknij" onPress={closeModal} color="#1E90FF" />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C', 
    padding: 20,
    marginTop: 0, 
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 50,
    marginTop: 32
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 30,
    marginLeft: 75
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseItem: {
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
  exerciseName: {
    fontSize: 18,
    color: 'white',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInstructions: {
    fontSize: 16,
    marginBottom: 20,
  },
});
