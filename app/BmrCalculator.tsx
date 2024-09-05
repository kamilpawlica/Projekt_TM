import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Provider as PaperProvider, RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const calculateCalories = (age, weight, height, gender, activityLevel) => {
  let bmr;

  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  switch (activityLevel) {
    case 'sedentary':
      bmr *= 1.2;
      break;
    case 'light':
      bmr *= 1.375;
      break;
    case 'moderate':
      bmr *= 1.55;
      break;
    case 'active':
      bmr *= 1.725;
      break;
    case 'very active':
      bmr *= 1.9;
      break;
    default:
      bmr *= 1.2;
      break;
  }

  return bmr;
};

const CalorieCalculator = () => {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [calories, setCalories] = useState(null);
  const router = useRouter();

  const handleCalculate = () => {
    const result = calculateCalories(
      parseInt(age),
      parseFloat(weight),
      parseFloat(height),
      gender,
      activityLevel
    );
    setCalories(result.toFixed(2));
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/NutritionModule')}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Kalkulator Kalorii</Text>

        <Text style={styles.label}>Wiek:</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={age}
          onChangeText={setAge}
        />
        
        <Text style={styles.label}>Waga (kg):</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={weight}
          onChangeText={setWeight}
        />

        <Text style={styles.label}>Wzrost (cm):</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={height}
          onChangeText={setHeight}
        />
        
        <Text style={styles.label}>Płeć:</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            value="male"
            status={gender === 'male' ? 'checked' : 'unchecked'}
            onPress={() => setGender('male')}
            color='#1E90FF'
          />
          <Text style={styles.radioText}>Mężczyzna</Text>
          <RadioButton
            value="female"
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('female')}
            color='#1E90FF'
          />
          <Text style={styles.radioText}>Kobieta</Text>
        </View>

        <Text style={styles.label}>Poziom aktywności:</Text>
        <Picker
          selectedValue={activityLevel}
          style={styles.picker}
          onValueChange={(itemValue) => setActivityLevel(itemValue)}
        >
          <Picker.Item label="Siedzący tryb życia (brak aktywności)" value="sedentary" />
          <Picker.Item label="Lekka aktywność (np. spacery)" value="light" />
          <Picker.Item label="Umiarkowana aktywność (np. treningi 3-4 razy w tygodniu)" value="moderate" />
          <Picker.Item label="Aktywny tryb życia (np. intensywne treningi)" value="active" />
          <Picker.Item label="Bardzo aktywny tryb życia (np. codzienne intensywne treningi)" value="very active" />
        </Picker>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCalculate}
        >
          <Text style={styles.submitButtonText}>Oblicz</Text>
        </TouchableOpacity>

        {calories !== null && (
          <Text style={styles.result}>Dzienne zapotrzebowanie kaloryczne: {calories} kcal</Text>
        )}
      </View>
    </PaperProvider>
  );
};

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
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    padding: 10,
    marginBottom: 16,
    color: 'white',
    backgroundColor: '#333', 
    borderRadius: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  radioText: {
    color: 'white',
    marginHorizontal: 8,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    color: 'white',
    backgroundColor: '#333', 
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    marginTop: 15,
    height: 40,
    justifyContent: 'center',
    borderRadius: 5,
  },
  submitButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CalorieCalculator;
