// app/index.tsx
import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
      }}
    >
      
      {/* Odnośnik do modułu treningowego */}
      <TouchableOpacity
        onPress={() => router.push('/TrainingModule')}
        style={{ marginBottom: 20 }}
      >
        <Text style={{ color: 'blue', fontSize: 18 }}>Modul treningowy</Text>
      </TouchableOpacity>

      {/* Odnośnik do modułu dietetycznego */}
      <TouchableOpacity
        onPress={() => router.push('/NutritionModule')}
        style={{ marginBottom: 20 }}
      >
        <Text style={{ color: 'blue', fontSize: 18 }}>Modul dietetyczny</Text>
      </TouchableOpacity>

      {/* Odnośnik do modułu powiadomień */}
      <TouchableOpacity
        onPress={() => router.push('/NotificationModule')}
        style={{ marginBottom: 20 }}
      >
        <Text style={{ color: 'blue', fontSize: 18 }}>Modul powiadomien</Text>
      </TouchableOpacity>
    </View>
  );
}
