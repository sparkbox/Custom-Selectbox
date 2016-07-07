var path = require('path');

module.exports = {
  entry: './src/js/sb-select.js',
  output: {
    path: __dirname + '/dist',
    filename: 'sb-select.js',
    // export itself to a global var
    libraryTarget: "var",
    // name of the global var: "Foo"
    library: "sbSelect"
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
