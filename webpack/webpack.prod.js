const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const WebpackPWAManfiestPlugin = require("webpack-pwa-manifest");


module.exports = require('./webpack.base')({
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
              terserOptions: {
                warnings: false,
                compress: {
                  comparisons: false,
                },
                parse: {},
                mangle: true,
                output: {
                  comments: false,
                  ascii_only: true,
                },
              },
              parallel: true,
              cache: true,
              sourceMap: true
            })
          ],
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                vendor: {
                    chunks: 'all',
                    name: 'vendor',
                    test: /node_modules/,
                    enforce: true
                },
            }
        },
        runtimeChunk: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
            inject: true,
            favicon: './src/assets/img/favicon.png'
          }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css"
        }),
        new WebpackPWAManfiestPlugin({
          name: 'SmarpotPOS PWA',
          short_name: 'SmarpotPOS',
          description: 'Smartpos Progressive Web Application',
          background_color: '#ffffff',
          crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
          icons: [
            {
              src: path.resolve('src/assets/pwa_logo/icon.png'),
              sizes: [96, 128, 192, 256, 384, 512, 1024] // multiple sizes
            },
            {
              src: path.resolve('src/assets/pwa_logo/icon_1024x1024.png'),
              size: '1024x1024',
              purpose: 'maskable'
            }
          ]
        }),
    ]
});
