const {
  WranglerJsCompatWebpackPlugin,
} = require("wranglerjs-compat-webpack-plugin");


module.exports = {
  plugins: [new WranglerJsCompatWebpackPlugin()],
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.ya?ml$/,
      type: 'json',
      use: 'yaml-loader',
    })

    return config
  },
}
