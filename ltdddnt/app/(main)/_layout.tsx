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
      <Tabs.Screen name="grades" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="feedback" options={{ href: null }} />
      <Tabs.Screen name="sos" options={{ href: null }} />
      <Tabs.Screen name="course-detail" options={{ href: null }} />
    </Tabs>
  );
}
