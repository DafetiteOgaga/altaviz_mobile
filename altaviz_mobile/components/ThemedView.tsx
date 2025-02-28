import { View, type ViewProps } from 'react-native';

import { useColorMode } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const uniColorMode = useColorMode();
  return <View style={[{ backgroundColor: uniColorMode.vvvdrkbltr }, style]} {...otherProps} />;
}
