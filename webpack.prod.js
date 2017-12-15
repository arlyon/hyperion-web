const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const ENV = "production";
const API_URL = "https://crimechecker.herokuapp.com";

module.exports = merge(common, {
    entry: [
        "./front/prod.tsx"
    ],

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
                'NODE_ENV': JSON.stringify(ENV),
                'API_URL': JSON.stringify(API_URL),
            }
        }),
        new UglifyJSPlugin()
    ]
});