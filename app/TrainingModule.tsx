// app/TrainingModule.tsx
import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Ikony

export default function TrainingModule() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/training-module-bg.jpg')} // Nowe tło dla modułu treningowego
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Przycisk powrotu */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')} // Powrót do strony głównej
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.title}>Moduł Treningowy</Text>
        <Text style={styles.subtitle}>Wybierz opcję:</Text>

        {/* Odnośnik do spisu ćwiczeń */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/ExerciseList')}>
          <Ionicons name="list-outline" size={32} color="white"/>
          <Text style={styles.cardText}>Spis Ćwiczeń</Text>
        </TouchableOpacity>

        {/* Odnośnik do planów treningowych */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/WorkoutPlans')}>
          <Ionicons name="barbell-outline" size={32} color="white" />
          <Text style={styles.cardText}>Plany Treningowe</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Dopasowanie tła
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Półprzezroczyste tło dla lepszej widoczności
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 50,
    marginTop: 30,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#1E90FF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cardText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
});
