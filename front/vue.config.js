module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      "^/api/": {
        target: "http://localhost:9999/",
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '/api' },
      }
    }
  }
}
