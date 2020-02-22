const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const API_URL = "https://api.crime.arlyon.dev";

module.exports = merge(common, {
    entry: [
        "./src/prod.tsx"
    ],

    mode: 'production',

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'API_URL': JSON.stringify(API_URL),
            }
        })
    ]
});