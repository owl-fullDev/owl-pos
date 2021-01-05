module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          productName: "Owl",
          appId: "com.acme.owl",
          win: {
            target: [
              {
                target: 'portable',
                arch: ['x64']
              }
            ]
          }
        }
      }
    }
  }