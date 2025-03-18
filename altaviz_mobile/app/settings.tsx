import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ScreenStyle } from '../myConfig/navigation';
import { getComponentName } from '@/hooks/getComponentName';

export default function Settings() {
  getComponentName()
  return (
    <>
      <Stack.Screen />
      <ThemedView style={[ScreenStyle.allScreenContainer, styles.container]}>
        <ThemedText type="title">This screen is still in development.</ThemedText>
        {/* <ThemedText type="link">Go nowhere!</ThemedText> */}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {

    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    // marginTop: 15,
    paddingVertical: 15,
  },
});
