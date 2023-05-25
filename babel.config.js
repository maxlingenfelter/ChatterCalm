module.exports = function (apiToken) {
  apiToken.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: ".env",
          path: ".env",
        },
      ],
    ],
  };
};
