// app/NotificationModule.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Platform, TextInput, View, Modal, Text, TouchableOpacity, StyleSheet, Animated, Alert, ImageBackground } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons'; // Ikony
import { useRouter } from 'expo-router';

export default function NotificationModule() {
  const router = useRouter(); // Dodaj ten wiersz
  const [expoPushToken, setExpoPushToken] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const scaleValue = useState(new Animated.Value(0))[0];
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const openModal = () => {
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

  const handleSendNotification = async () => {
    await schedulePushNotification(title, body);
    Alert.alert('Powiadomienie', 'Powiadomienie zostało wysłane prawidłowo.');
    setTitle('');
    setBody('');
    closeModal();
  };

  return (
    <ImageBackground
      source={require('../assets/notification-module-bg.jpg')} // Tło dla modułu powiadomień
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Przycisk powrotu */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')} // Powrót do strony głównej
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>Moduł Powiadomień</Text>
        <TouchableOpacity onPress={openModal} style={styles.button}>
          <Ionicons name="notifications-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Ustaw powiadomienie</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="none"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleValue }] }]}>
              <Text style={styles.modalTitle}>Wprowadź szczegóły powiadomienia</Text>
              <TextInput
                style={styles.input}
                placeholder="Wprowadź tytuł powiadomienia"
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={styles.input}
                placeholder="Wprowadź treść powiadomienia"
                value={body}
                onChangeText={setBody}
              />
              <TouchableOpacity onPress={handleSendNotification} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Wyślij powiadomienie</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
                <Text style={[styles.modalButtonText, { color: 'red' }]}>Anuluj</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}

async function schedulePushNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title || "Default Title",
      body: body || "Default Body",
      data: { extraData: 'example data' },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use a physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Dopasowanie tła
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 50,
    marginTop: 30,
    marginLeft: -30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
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
  modalButton: {
    marginVertical: 10,
    backgroundColor: '#1E90FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
