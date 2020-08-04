const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const baseConfig = require('./config');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const packageInfo = require('../package.json');
const OfflinePlugin = require('offline-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir); // __dirname是当前文件所在目录
}

module.exports = {
  context: resolve('.'),
  entry: {
    app: './src/main.js'
  },
  output: {
    publicPath: baseConfig.urlPrefix,
    path: resolve('dist'),
    filename: 'static/js/[name]-[hash].js'
  },
  resolve: {
    extensions: ['.js', '.json', '.vue', '.css'],
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js',
      '@': resolve('src'),
      api: '@/api',
      utils: '@/utils',
      styles: '@/styles',
      assets: '@/assets',
      vendor: '@/vendor',
      views: '@/views'
    }
  },
  optimization: {
    runtimeChunk: 'single', // 将webpack的runtime单独提取到一个chunk，且被多个入口共用
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 单独提取到vendor中的库
          test: /[\\/]node_modules[\\/](vue|vue-router|axios)[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 3 // 某个module同时符合多个Group的条件的时候移入priority值更大的chunk中
        },
        xlsx: {
          test: /[\\/]node_modules[\\/](xlsx)[\\/]/,
          name: 'xlsx',
          chunks: 'all',
          priority: 3
        },
        'element-ui': {
          test: /[\\/]node_modules[\\/](element-ui)[\\/]/,
          name: 'element-ui',
          chunks: 'all',
          priority: 3
        },
        common: {
          // 其他node_modules文件夹里的库提取到common中
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          chunks: 'all',
          reuseExistingChunk: true,
          enforce: true,
          priority: 2
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                scss: ['vue-style-loader', 'css-loader', 'sass-loader']
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.js$/,
        include: [resolve('src')],
        use: [
          {
            loader: 'babel-loader?cacheDirectory=true',
            options: {
              plugins: ['dynamic-import-webpack']
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          process.env.ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')({
                  browsers: 'last 2 versions'
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/img/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'static/fonts/[name].[hash:7].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      CURVERSION: JSON.stringify(packageInfo.version)
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: 'body',
      path: './static/'
    }),
    // webpack-dev-server在内存中虚拟一套目录，也需要用到CopyWebpackPlugin，否则当publicPath非默认值时会导致某些static下的资源在dev模式下访问不到
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: path.resolve(__dirname, '../dist/static')
        }
      ]
    }),
    new OfflinePlugin({
      AppCache: false,
      safeToUseOptionalCaches: true, // 去除`additional | optional`路径检查不确定时打印的警告
      ServiceWorker: {
        events: true // 用于当前控制页面的sw的强制更新
      },
      caches: {
        // 缓存内容的精细控制
        main: ['index.html'],
        additional: ['*/js/common-*.js', '*/js/app-*.js', '*/js/vendor-*.js', '*/js/element-ui-*.js', '*/js/xlsx-*.js'],
        optional: [':rest:']
      }
    })
  ]
};
