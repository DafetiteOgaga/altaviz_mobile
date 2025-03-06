import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Image } from 'react-native';
import React from 'react';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ScreenStyle } from '../myConfig/navigation';
import { getComponentName } from '@/hooks/getComponentName';

export default function About() {
  getComponentName()
  return (
    <>
      <Stack.Screen />
      <ThemedView style={[ScreenStyle.allScreenContainer, styles.container]}>
        <ThemedText type="title">This is the About screen.</ThemedText>
        <ThemedText type="link">Go nowhere!</ThemedText>
        <Image source={require('../assets/images/dafelogo1.png')} style={{ width: 150, height: 75 }} />
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
