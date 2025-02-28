import { useColorScheme } from 'react-native';
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorDark = '#fff';
export const Colors = {
  dark: {
    text: '#ECEDEE',
    // background: '#1C1C1C',
    // background: '#0A0D1A',
    background: '#121A33',
    vvvdrkb: '#0A0D1A',
    vvvdrkbltr: '#0D1222',
    vdrkb: '#121A33',
    newdrkb: '#131E3D',
    newdrkb1: '#142D55',
    dkrb: '#142b5a',
    dkb: '#1f3a73',
    sdkb: '#264489',
    bb: '#283593',
    mb: '#3b5bae',
    ltb: '#6a8fdb',
    ltrb:'#8ea7e8',
    vltb: '#b3cff9',
    extltb: '#ddebff',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    smoke: '#whitesmoke',
    buttonSpin: '#264489',
    // shadow: linear-gradient(to bottom, #2957B0, #20418C, #142B5A, #0B1933, #070F20),
    shadowdkr: '#0B1933',
    shadowLeft: '#0F2146',
    shadowTop: '#1F365C',
    shadowRight: '#172B50',
    shadowBottom: '#0B1933',
  },
};

export const useColorMode = () => {
  return Colors.dark;
};

export const useColorModeTransparent = () => {
  const colorScheme = useColorScheme(); // Detect system theme
  // console.log({colorScheme});
  return colorScheme === 'dark' ? '#121a1d' : 'rgba(255, 255, 255, 0.8)'
};

// '#6e2e2e'
// 'rgba(59, 238, 89, 0.8)'