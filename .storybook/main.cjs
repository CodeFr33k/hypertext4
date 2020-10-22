const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const path = require('path');

module.exports = {
    stories: [
        '../src/**/*.stories.ts',
        '../src/**/*.stories.tsx',
    ],
    webpackFinal: async (config, { configType }) => {
        config.resolve.alias['@'] = path.resolve(__dirname, '../src/');
        config.resolve.alias['caml-js'] = path.resolve(__dirname, '../github.com/caml-js');
        config.resolve.extensions.push(
            '.ts',
            '.tsx',
            '.js',
            '.jsx',
            '.json',
            '.css',
            '.styl',
        )

        config.module.rules.push({
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            use: 'babel-loader', 
        })

        //console.dir(config, { depth: null });

          config.module.rules.push({
            include: path.resolve(__dirname, '../'),
            test: /\.styl$/,
            use: [
              {
                loader: ExtractCssChunks.loader,
                options: {
                  hot: true,
                  reloadAll: true
                }
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[name]__[local]--[hash:base64:5]'
                }
              },
              {
                loader: 'stylus-loader'
              }
            ]
          });

        config.plugins.push(new ExtractCssChunks());
        return config
    },
}
