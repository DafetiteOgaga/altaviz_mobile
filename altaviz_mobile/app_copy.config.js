const config = ({ config }) => ({
  ...config,
  expo: {
    name: "altaviz_mobile",
    slug: "altaviz_mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/altaviz_logo.png",
    scheme: "myapp",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      // "userInterfaceStyle": "light",
      adaptiveIcon: {
        foregroundImage: "./assets/images/altaviz_logo.png",
        backgroundColor: "#121A33",
      },
      softwareKeyboardLayoutMode: "pan",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/altaviz_logo.png",
    },
    splash: {
      image: "./assets/images/altaviz_logo.png",
      imageWidth: 200,
      resizeMode: "contain",
      backgroundColor: "#121A33",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/altaviz_logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#121A33",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    androidNavigationBar: {
      backgroundColor: "#121A33",
      barStyle: "light-content",
    },
    androidStatusBar: {
      backgroundColor: "#121A33",
      barStyle: "light-content",
      translucent: false,
    },
    extra: {
      API_URL:
        process.env.NODE_ENV === "production"
          ? "https://prod.example.com"
          : "https://dev.example.com",
    },
  },
});
export default config;
