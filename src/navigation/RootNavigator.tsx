import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LevelSelectScreen } from '../screens/LevelSelectScreen';
import { LevelBoardScreen } from '../screens/LevelBoardScreen';
import { colors } from '../theme/colors';

export type RootStackParamList = {
  Home: undefined;
  LevelSelect: undefined;
  LevelBoard: { levelId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LevelSelect" component={LevelSelectScreen} />
        <Stack.Screen name="LevelBoard" component={LevelBoardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
