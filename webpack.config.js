const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = () => {

  // this will return an object with a parsed key (made from the .env file)
  const env = dotenv.config().parsed;

  // modifying and reducing that object to a JSON object
  const envVars = Object.entries(env).reduce((acc, currentValue) => {
    return Object.assign({ [`process.env.${currentValue[0]}`]: JSON.stringify(currentValue[1]) }, acc);
  }, {});

  console.log('envVars: ', envVars);

  return {
    entry: './client/src/index.jsx',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'client/dist')
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envVars)
    ],
    mode: 'development'
  }
}