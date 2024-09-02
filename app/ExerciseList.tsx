// app/ExerciseList.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, Modal, Button, StyleSheet, Animated } from 'react-native';
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
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Spis Ćwiczeń
      </Text>
      <FlatList
        data={Object.keys(exercisesByGroup)}
        keyExtractor={(item) => item}
        renderItem={({ item: muscleGroup }) => (
          <View>
            <TouchableOpacity onPress={() => toggleGroup(muscleGroup)}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
                {muscleGroup}
              </Text>
            </TouchableOpacity>
            {expandedGroups[muscleGroup] &&
              exercisesByGroup[muscleGroup].map((exercise) => (
                <View key={exercise.id} style={{ marginLeft: 20 }}>
                  <TouchableOpacity onPress={() => showExerciseDetails(exercise)}>
                    <Text style={{ fontSize: 16, marginVertical: 5 }}>
                      {exercise.name}
                    </Text>
                  </TouchableOpacity>
                </View>
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
            <Button title="Zamknij" onPress={closeModal} />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
