const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // Override with PUBLIC_PATH when deploying under a subpath, e.g.
  // PUBLIC_PATH=/personal_website_dev/ npm run build
  publicPath: process.env.PUBLIC_PATH || '/'
})