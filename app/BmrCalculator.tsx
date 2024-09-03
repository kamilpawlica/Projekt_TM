import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Provider as PaperProvider, RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

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
          />
          <Text>Mężczyzna</Text>
          <RadioButton
            value="female"
            status={gender === 'female' ? 'checked' : 'unchecked'}
            onPress={() => setGender('female')}
          />
          <Text>Kobieta</Text>
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

        <Button title="Oblicz" onPress={handleCalculate} />

        {calories && (
          <Text style={styles.result}>Dzienne zapotrzebowanie kaloryczne: {calories} kcal</Text>
        )}
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center'
  },
  label: {
    marginBottom: 8,
    fontSize: 16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default CalorieCalculator;
