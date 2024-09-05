import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Inputs = () => {
   const [height, setHeight] = useState('');
   const [weight, setWeight] = useState('');
   const [bmi, setBmi] = useState('');
   const [bmiResult, setBmiResult] = useState('');
   const router = useRouter();

   const handleHeight = (text: string) => {
      setHeight(text);
   };

   const handleWeight = (text: string) => {
      setWeight(text);
   };

   const calculate = (height: string, weight: string) => {
      // Calculation
      const result = (parseFloat(weight) * 10000) / (parseFloat(height) * parseFloat(height));
      const formattedResult = result.toFixed(2);
      // Display result
      setBmi(formattedResult);
      if (result < 18.5) {
         setBmiResult('Waga zbyt niska');
      } else if (result >= 18.5 && result < 25) {
         setBmiResult('Waga prawidłowa');
      } else if (result >= 25 && result < 30) {
         setBmiResult('Nadwaga');
      } else if (result >= 30) {
         setBmiResult('Otyłość');
      } else {
         alert('Nieprawidłowe dane!');
         setBmiResult('');
      }
   };

   return (
      <View style={styles.container}>
         <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/NutritionModule')}
         >
            <Ionicons name="arrow-back" size={24} color="white" />
         </TouchableOpacity>

         <Text style={styles.title}>Kalkulator BMI</Text>

         <Text style={styles.label}>Wzrost</Text>
         <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Wzrost (cm)"
            autoCapitalize="none"
            keyboardType="numeric"
            onChangeText={handleHeight}
         />

         <Text style={styles.label}>Waga</Text>
         <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Waga (kg)"
            autoCapitalize="none"
            keyboardType="numeric"
            onChangeText={handleWeight}
         />

         <TouchableOpacity
            style={styles.submitButton}
            onPress={() => calculate(height, weight)}
         >
            <Text style={styles.submitButtonText}>Oblicz</Text>
         </TouchableOpacity>

         <Text style={styles.output}>{bmi}</Text>
         <Text style={styles.resultText}>{bmiResult}</Text>
      </View>
   );
};

export default Inputs;

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
   input: {
      margin: 15,
      height: 40,
      borderWidth: 1,
      borderColor: '#555',
      padding: 10,
      color: 'white',
      backgroundColor: '#333', 
      borderRadius: 5,
   },
   submitButton: {
      backgroundColor: '#1E90FF',
      padding: 10,
      margin: 15,
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
   output: {
      textAlign: 'center',
      fontSize: 30,
      color: 'white',
   },
   resultText: {
      paddingTop: 20,
      paddingBottom: 10,
      textAlign: 'center',
      fontSize: 30,
      color: '#1E90FF', 
   },
   label: {
      marginLeft: 15,
      fontSize: 18,
      color: 'white',
   },
});
