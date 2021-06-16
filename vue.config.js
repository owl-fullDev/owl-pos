module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js",
      builderOptions: {
        productName: "Owl",
        appId: "com.acme.owl",
        win: {
          target: [
            {
              target: "portable",
              arch: ["x64"],
            },
          ],
        },
      },
    },
  },
};
