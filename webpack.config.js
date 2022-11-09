const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    main: './source/index.ts',
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
