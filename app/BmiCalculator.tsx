import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Inputs = () => {
   const [height, setHeight] = useState('');
   const [weight, setWeight] = useState('');
   const [bmi, setBmi] = useState('');
   const [bmiResult, setBmiResult] = useState('');
   const [modalVisible, setModalVisible] = useState(false);
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

         {/* Display the BMI result */}
         <Text style={styles.output}>{bmi}</Text>

         {/* Display the BMI result description and button */}
         <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{bmiResult}</Text>
            {bmiResult ? (
               <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => setModalVisible(true)}
               >
                  <Ionicons name="information-circle-outline" size={24} color="#1E90FF" />
               </TouchableOpacity>
            ) : null}
         </View>

         {/* Modal for BMI Interpretation */}
         <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
         >
            <View style={styles.modalContainer}>
               <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Interpretacja wyników BMI</Text>
                  <Text style={styles.modalText}>{"< 18.5 : Waga zbyt niska"}</Text>
                  <Text style={styles.modalText}>{"18.5 - 24.9 : Waga prawidłowa"}</Text>
                  <Text style={styles.modalText}>{"25 - 29.9 : Nadwaga"}</Text>
                  <Text style={styles.modalText}>{">= 30 : Otyłość"}</Text>
                  <TouchableOpacity
                     style={styles.closeButton}
                     onPress={() => setModalVisible(false)}
                  >
                     <Text style={styles.closeButtonText}>Zamknij</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>
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
   label: {
      marginLeft: 15,
      fontSize: 18,
      color: 'white', // changed to white
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
      marginTop: 20,
   },
   resultContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10, // added spacing
   },
   resultText: {
      textAlign: 'center',
      fontSize: 24,
      color: '#1E90FF', 
   },
   infoButton: {
      marginLeft: 10,
   },
   modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
   },
   modalContent: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      width: '80%',
   },
   modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
   },
   modalText: {
      fontSize: 18,
      marginBottom: 10,
   },
   closeButton: {
      backgroundColor: '#1E90FF',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
   },
   closeButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
   },
});
