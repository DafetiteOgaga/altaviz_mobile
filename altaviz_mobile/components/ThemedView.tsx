import { View, type ViewProps, ImageBackground } from 'react-native';
import { useColorMode } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundImage = require('../assets/images/altavizDoodleDark.png')
  const uniColorMode = useColorMode();
  // return <View style={[{ backgroundColor: uniColorMode.vvvdrkbltr }, style]} {...otherProps} />;
  return <ImageBackground source={backgroundImage} style={[{ backgroundColor: uniColorMode.vvvdrkbltr }, style]} {...otherProps} />;
}
