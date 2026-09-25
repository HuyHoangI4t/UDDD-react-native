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
      <Tabs.Screen name="home/index" />
      <Tabs.Screen name="map/index" />
      <Tabs.Screen name="schedule/index" />
      <Tabs.Screen name="grades/index" />
      <Tabs.Screen name="profile/index" />
      <Tabs.Screen name="feedback/index" options={{ href: null }} />
      <Tabs.Screen name="sos/index" options={{ href: null }} />
    </Tabs>
  );
}
