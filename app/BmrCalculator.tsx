import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCaloriesModalVisible, setIsCaloriesModalVisible] = useState(false); // Nowy stan modala dla kalorii
  const router = useRouter();

  const handleCalculate = () => {
    // Walidacja formularza
    if (!age || !weight || !height) {
      Alert.alert('Błąd', 'Wszystkie pola muszą być wypełnione.');
      return;
    }

    if (isNaN(age) || isNaN(weight) || isNaN(height)) {
      Alert.alert('Błąd', 'Wiek, waga i wzrost muszą być liczbami.');
      return;
    }

    const result = calculateCalories(
      parseInt(age),
      parseFloat(weight),
      parseFloat(height),
      gender,
      activityLevel
    );
    setCalories(result.toFixed(2));
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleCaloriesModal = () => {
    setIsCaloriesModalVisible(!isCaloriesModalVisible); // Funkcja do obsługi modala kalorii
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

        <View style={styles.activityLevelContainer}>
          <Text style={styles.label}>Poziom aktywności:</Text>
          <TouchableOpacity onPress={toggleModal}>
            <Ionicons name="information-circle-outline" style={styles.iconStyle} />
          </TouchableOpacity>
        </View>

        <Picker
          selectedValue={activityLevel}
          style={styles.picker}
          onValueChange={(itemValue) => setActivityLevel(itemValue)}
        >
          <Picker.Item label="Brak aktywności" value="sedentary" />
          <Picker.Item label="Lekka aktywność" value="light" />
          <Picker.Item label="Umiarkowana aktywność" value="moderate" />
          <Picker.Item label="Aktywny tryb życia" value="active" />
          <Picker.Item label="Bardzo aktywny tryb życia" value="very active" />
        </Picker>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleCalculate}
        >
          <Text style={styles.submitButtonText}>Oblicz</Text>
        </TouchableOpacity>

        {calories !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.result}>Dzienne zapotrzebowanie kaloryczne: {calories} kcal</Text>
            <TouchableOpacity onPress={toggleCaloriesModal}>
              <Ionicons name="information-circle-outline" style={styles.iconStyle} />
            </TouchableOpacity>
          </View>
        )}

        {/* Modal z opisami poziomów aktywności */}
        <Modal
          transparent={true}
          visible={isModalVisible}
          onRequestClose={toggleModal}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Wyjaśnienie poziomów aktywności</Text>
              <ScrollView>
                <Text style={styles.modalText}>
                  - **Brak aktywności**: Mało lub brak regularnej aktywności fizycznej.
                </Text>
                <Text style={styles.modalText}>
                  - **Lekka aktywność**: Aktywność np. spacery, lekki wysiłek fizyczny.
                </Text>
                <Text style={styles.modalText}>
                  - **Umiarkowana aktywność**: Regularna aktywność fizyczna np. treningi 3-4 razy w tygodniu.
                </Text>
                <Text style={styles.modalText}>
                  - **Aktywny tryb życia**: Intensywne treningi np. 5-6 razy w tygodniu.
                </Text>
                <Text style={styles.modalText}>
                  - **Bardzo aktywny tryb życia**: Codzienne intensywne treningi, wysoki poziom aktywności fizycznej.
                </Text>
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                <Text style={styles.closeButtonText}>Zamknij</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal dla wyliczonych kalorii */}
        <Modal
          transparent={true}
          visible={isCaloriesModalVisible}
          onRequestClose={toggleCaloriesModal}
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Twoje zalecenia kaloryczne</Text>
              <Text style={styles.modalText}>
                Aby utrzymać swoją wagę, musisz spożywać około {calories} kcal dziennie.
              </Text>
              <Text style={styles.modalText}>
                Aby przytyć, zwiększ dzienne spożycie do około {parseFloat(calories) + 500} kcal.
              </Text>
              <Text style={styles.modalText}>
                Aby schudnąć, zmniejsz dzienne spożycie do około {parseFloat(calories) - 500} kcal.
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={toggleCaloriesModal}>
                <Text style={styles.closeButtonText}>Zamknij</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  activityLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  result: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  iconStyle: {
    fontSize: 20,
    marginLeft: 8,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CalorieCalculator;
