// app/NutritionTips.tsx
import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, Button, StyleSheet, Animated } from 'react-native';
import { supabase } from './../db/SupabaseConfig';

export default function NutritionTips() {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedTip, setSelectedTip] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('diet_categories')
        .select(`
          id,
          name,
          diet_subcategories (
            id,
            name,
            diet_tips (
              id,
              title,
              description
            )
          )
        `);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setCategories(data);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const showTipDetails = (tip) => {
    setSelectedTip(tip);
    setModalVisible(true);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>
        Porady i ciekawostki dietetyczne
      </Text>
      <ScrollView>
        {categories.map((category) => (
          <View key={category.id} style={{ marginBottom: 20 }}>
            <TouchableOpacity onPress={() => toggleCategory(category.id)}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {category.name}
              </Text>
            </TouchableOpacity>
            {expandedCategories[category.id] && (
              <View style={{ paddingLeft: 10, marginTop: 10 }}>
                {category.diet_subcategories.map((subcategory) => (
                  <View key={subcategory.id} style={{ marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => showTipDetails(subcategory.diet_tips[0])}>
                      <Text style={{ fontSize: 14, fontWeight: '600' }}>
                        {subcategory.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Modal for tip details */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleValue }] }]}>
            <Text style={styles.modalTitle}>{selectedTip?.title}</Text>
            <Text style={styles.modalDescription}>{selectedTip?.description}</Text>
            <Button title="Zamknij" onPress={closeModal} />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
});
