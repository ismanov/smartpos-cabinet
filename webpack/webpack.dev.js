const path = require("path");
const webpack = require("webpack");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPWAManfiestPlugin = require("webpack-pwa-manifest");

module.exports = require("./webpack.base")({
  mode: "development",
  devServer: {
    publicPath: "/",
    contentBase: "./dist",
    hot: true,
    inline: true,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "https://api-dev.smartpos.uz",
        secure: true,
        changeOrigin: true,
      },
    },
  },
  devtool: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      favicon: "./src/assets/img/favicon.png",
    }),
    new webpack.DefinePlugin(
      (() => {
        return {
          "process.env": {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          },
        };
      })()
    ),
    new webpack.HotModuleReplacementPlugin(),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: false,
    }),
    new WebpackPWAManfiestPlugin({
      name: "SmarpotPOS PWA",
      short_name: "SmarpotPOS",
      description: "Smartpos Progressive Web Application",
      background_color: "#ffffff",
      crossorigin: "use-credentials", //can be null, use-credentials or anonymous
      start_url: "/index.html",
      display: "fullscreen",
      icons: [
        {
          src: path.resolve("src/assets/pwa_logo/icon.png"),
          sizes: [96, 128, 192, 256, 384, 512, 1024], // multiple sizes
        },
        {
          src: path.resolve("src/assets/pwa_logo/icon_1024x1024.png"),
          size: "1024x1024",
          purpose: "maskable",
        },
      ],
    }),
  ],
});
