const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const analysisBundle = false;

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'static/js/[name]-[contenthash].js'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: 4,
        sourceMap: false,
        terserOptions: {
          output: {
            comments: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      minRatio: 0.8
    }),
    new MiniCssExtractPlugin({
      path: path.join(__dirname, '../dist'),
      filename: 'static/css/[name]-[contenthash].css'
    })
  ]
});

// 是否进行chunk分析
if (analysisBundle) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
