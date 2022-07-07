const webpack = require('webpack');

module.exports = options => ({
    mode: options.mode,
    entry: "./src/index.js",
    output: {
        publicPath: "/",
        filename: "index.[hash].js",
        chunkFilename: "[name].[chunkhash].js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                },
            },
            {
                test: /\.module\.scss$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.scss$/,
                exclude: /\.module\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    },
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    }
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                use: [
                {
                    loader: "url-loader?name=images/[name].[ext]",
                    options: {
                        limit: 1024
                    }
                }]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.svg$/,
                use: {
                loader: "svg-url-loader",
                options: { jsx: true }
                }
            }
        ]
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    devServer: options.devServer ? options.devServer : {},
    optimization: options.optimization ? options.optimization : {},
    plugins: [ 
        ...options.plugins,
        new webpack.optimize.OccurrenceOrderPlugin()
    ]
});
