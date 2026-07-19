import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* <StatusBar barStyle="light-content" backgroundColor="#000" /> */}
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen
        name="details"
        options={{
          title: 'Details',
          headerBackButtonDisplayMode: 'minimal',
          presentation: 'formSheet',
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.5, 0.85],

          // presentation: 'modal',
        }}
      />
    </Stack>
  );
}
