// app/NutritionModule.tsx
import React from 'react';
import { Text, View } from 'react-native';

export default function NutritionModule() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18 }}>
        Witaj w module żywieniowym
      </Text>
    </View>
  );
}
