import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function MainLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Map', 
          tabBarIcon: ({ color }) => <MaterialIcons name="map" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="schedule" 
        options={{ 
          title: 'Schedule', 
          tabBarIcon: ({ color }) => <MaterialIcons name="schedule" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="events" 
        options={{ 
          title: 'Events', 
          tabBarIcon: ({ color }) => <MaterialIcons name="event" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}
