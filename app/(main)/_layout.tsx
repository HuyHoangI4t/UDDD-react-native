import { Tabs } from 'expo-router';
import { CustomBottomNav } from '../../src/components/MainTabs';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomBottomNav
        selectedIndex={props.state.index}
        onDestinationSelected={(index) => props.navigation.navigate(props.state.routeNames[index])}
      />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="schedule" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
