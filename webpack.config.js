const glob = require('glob');
const path = require('path');

module.exports = {
    mode: 'development',
    // Pick up all files placed in the client_scripts directory
    entry: glob.sync('./src/*.js').reduce( (obj, el) => {
      obj[path.parse(el).name] = el;
      return obj
    }, {}),
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    output: {
      filename: 'simple_extension.bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devtool: 'inline-source-map',
  };