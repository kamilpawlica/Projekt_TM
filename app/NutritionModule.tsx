// app/NutritionModule.tsx
import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function NutritionModule() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('/NutritionTips')}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>
          Porady i ciekawostki dietetyczne
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/BmiCalculator')}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>
          Kalkulator BMI
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/BmrCalculator')}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>
          Kalkulator BMR
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  linkContainer: {
    marginBottom: 20,
  },
  linkText: {
    color: 'blue',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
});
