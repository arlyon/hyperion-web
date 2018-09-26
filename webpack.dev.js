const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const API_URL = "http://localhost:8000";

module.exports = merge(common, {
    entry: [
        "react-hot-loader/patch",
        "./src/dev.tsx"
    ],

    // enable source maps
    devtool: 'eval',
    mode: 'development',

    // enable dev server
    devServer: {
        contentBase: "public",
        overlay: true,
        hot: true
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'API_URL': JSON.stringify(API_URL),
            }
        })
    ]
});