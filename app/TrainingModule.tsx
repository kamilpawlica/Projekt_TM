// app/TrainingModule.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { supabase } from './../db/SupabaseConfig';

// Funkcja do pobierania listy kategorii
const getCategoryList = async () => {
  const { data, error } = await supabase.from('Category').select('*');
  if (error) {
    console.error('Error fetching categories:', error);
    return null;
  } else {
    console.log('Fetched Categories:', data);
    return data;
  }
};

export default function TrainingModule() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryData = await getCategoryList();
      if (categoryData) {
        setCategories(categoryData);
      }
    };

    fetchCategories();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Lista kategorii */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>Name: {item.name}</Text>
            <Text>Created At: {item.created_at}</Text>
          </View>
        )}
      />
    </View>
  );
}
