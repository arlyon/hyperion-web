const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

    // set output to app.js
    output: {
        filename: "app.js",
        path: __dirname + "/public/"
    },

    // add additional extensions to resolve
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    // load ts files with typescript loader
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {loader: "react-hot-loader/webpack"},
                    {loader: "awesome-typescript-loader"}
                ]
            },
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"},
            {test: /\.styl$/, loaders: ['style-loader', 'css-loader', 'stylus-loader']}
        ]
    },

    // allows us to not have react bundled
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-md": "ReactMD"
    },

    plugins: [
        new CopyWebpackPlugin([{from: "src/static", to: "."}])
    ]

};