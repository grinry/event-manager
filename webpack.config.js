const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// const namespace = process.env.NAMESPACE;
// const assetPrefixForNamespace = (namespace) => {
//   switch (namespace) {
//     case 'prod':
//       return 'https://cache.myserver.net/web';
//     case 'uat':
//       return 'https://cache-uat.myserver.net/web';
//     case 'st':
//       return 'https://cache-st.myserver.net/web';
//     case 'dev':
//       return 'https://cache-dev.myserver.net/web';
//     default:
//       return '';
//   }
// };
// __webpack_public_path__ = `${assetPrefixForNamespace(namespace)}/`;

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'web',
  entry: ['./src/resources/js/index.ts', './src/resources/css/index.scss'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.webpack.json'
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'css/[name].css',
            }
          },
          { loader: 'url-loader' },
          {
            loader: 'extract-loader'
          },
          {
            loader: 'css-loader?-url'
          },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          },
        ]
      },
      // {
      //   test: /\.css$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: _MiniCssExtractPlugin.loader,
      //       options: {
      //         // publicPath: __dirname + '/../../public/css/'
      //         publicPath: 'assets',
      //         hmr: process.env.NODE_ENV === 'development',
      //       }
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {importLoaders: 1},
      //     },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         config: {
      //           path: __dirname + '/postcss.config.js'
      //         }
      //       },
      //     }
      //   ],
      // },
      {
        // Now we apply rule for images
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            // Using file-loader for these files
            loader: "file-loader",

            // In options we can set different things like format
            // and directory to save
            options: {
              publicPath: './dist/public/assets/a',
              outputPath: './dist/public/assets/b'
            }
          }
        ]
      },
      {
        // Apply rule for fonts files
        test: /\.(woff|woff2|ttf|otf|eot)$/,
        use: [
          {
            // Using file-loader too
            loader: "file-loader?name=/fonts/[name].[ext]",
            options: {
              publicPath: './dist/public/assets/fonts-a',
              outputPath: './dist/public/assets/fonts-b'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000',
      }
    ]
  },
  resolve: {
    // extensions: [ '.ts', '.js', 'css', 'scss', 'png', 'jpg' ],
    plugins: [
      new TsconfigPathsPlugin({ configFile: "./tsconfig.webpack.json" })
    ],
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist', 'public', 'assets')
  }
};
