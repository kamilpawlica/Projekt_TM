import React, { useState, useEffect, useRef } from 'react';
import { Text, View, FlatList, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { supabase } from './../db/SupabaseConfig';
import Constants from 'expo-constants';

// Ustawienie obsługi powiadomień
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

export default function Index() {
  const [categories, setCategories] = useState<any[]>([]);
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryData = await getCategoryList();
      if (categoryData) {
        setCategories(categoryData);
      }
    };

    fetchCategories();

    // Rejestracja powiadomień
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    // Obsługa odbierania powiadomień
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Obsługa odpowiedzi na powiadomienia
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Name: {item.name}</Text>
            <Text>Created At: {item.created_at}</Text>
          </View>
        )}
      />
      <Button
        title="Send Test Notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

// Funkcja do wysyłania powiadomienia
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Notification",
      body: "This is a test notification body.",
      data: { extraData: 'example data' },
    },
    trigger: { seconds: 2 }, // Wywołanie po 2 sekundach
  });
}

// Funkcja rejestrująca do powiadomień
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
