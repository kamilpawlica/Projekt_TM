// app/index.tsx
import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Ikony

export default function Index() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('../assets/main-bg.jpg')} // Ładowanie lokalnego obrazka
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Witaj w apce treningowej!</Text>
        <Text style={styles.subtitle}>Wybierz moduł, który Cię interesuje:</Text>

        {/* Odnośnik do modułu treningowego */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/TrainingModule')}>
          <Ionicons name="fitness-outline" size={32} color="white" />
          <Text style={styles.cardText}>Moduł treningowy</Text>
        </TouchableOpacity>

        {/* Odnośnik do modułu dietetycznego */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/NutritionModule')}>
          <Ionicons name="nutrition-outline" size={32} color="white" />
          <Text style={styles.cardText}>Moduł dietetyczny</Text>
        </TouchableOpacity>

        {/* Odnośnik do modułu powiadomień */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/NotificationModule')}>
          <Ionicons name="notifications-outline" size={32} color="white" />
          <Text style={styles.cardText}>Moduł powiadomień</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Dopasowanie obrazu do ekranu
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Półprzezroczyste tło dla lepszej widoczności tekstu
    width: '100%',
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
