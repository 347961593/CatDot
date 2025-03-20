import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "小猫点点点" }} />
      <Stack.Screen name="game" options={{ headerShown: false }} />
    </Stack>
  );
}