/// <binding Clean='Run - Development' />
var webpack = require('webpack');
module.exports = {
    entry: {
        "dist": './react.js',
    },
   output: {
       filename: './[name].js',
       libraryTarget:'var'
    },
    module: {
        loaders: [
          {
              test: /\.js[x]?$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              query: {
                  presets: ["es2015-loose"],
                  "plugins": ["transform-remove-strict-mode"]
              }
          },
          { test: /\.css$/, loader: 'css-loader' }
        ]
   },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                properties: false,
                warnings: false,
                screw_ie8: false
            },
            output: {
                beautify: false,
                quote_keys: false,
                screw_ie8: false
            },
            mangle: {
                screw_ie8: false
            },
            sourceMap: false
        })
    ]

};
