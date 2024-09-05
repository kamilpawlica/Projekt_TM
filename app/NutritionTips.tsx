import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, Button, StyleSheet, Animated } from 'react-native';
import { supabase } from './../db/SupabaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NutritionTips() {
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedTip, setSelectedTip] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useState(new Animated.Value(0))[0];
  const router = useRouter();

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

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const showTipDetails = (tip: any) => {
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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/NutritionModule')}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Porady i Ciekawostki Dietetyczne</Text>
      <ScrollView>
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryContainer}>
            <TouchableOpacity onPress={() => toggleCategory(category.id)} style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
            </TouchableOpacity>
            {expandedCategories[category.id] && (
              <View style={styles.subcategoryContainer}>
                {category.diet_subcategories.map((subcategory) => (
                  <View key={subcategory.id} style={styles.subcategoryItem}>
                    <TouchableOpacity onPress={() => showTipDetails(subcategory.diet_tips[0])}>
                      <Text style={styles.subcategoryTitle}>{subcategory.name}</Text>
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
            <Button title="Zamknij" onPress={closeModal} color="#1E90FF" />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

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
  },
  title: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    backgroundColor: '#333', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 4,
  },
  categoryTitle: {
    fontSize: 18,
    color: 'white',
  },
  subcategoryContainer: {
    paddingLeft: 10,
    marginTop: 10,
  },
  subcategoryItem: {
    marginBottom: 10,
  },
  subcategoryTitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
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
