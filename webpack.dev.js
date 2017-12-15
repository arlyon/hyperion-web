const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const ENV = "development";
const API_URL = "http://localhost:8080";

module.exports = merge(common, {
    entry: [
        "react-hot-loader/patch",
        "./front/dev.tsx"
    ],

    // enable source maps
    devtool: 'inline-source-map',

    // enable dev server
    devServer: {
        contentBase: "./back/static",
        overlay: true,
        hot: true
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
                'NODE_ENV': JSON.stringify(ENV),
                'API_URL': JSON.stringify(API_URL),
            }
        })
    ]
});