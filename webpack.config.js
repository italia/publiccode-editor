const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
const autoprefixer = require("autoprefixer");
const webpack = require("webpack");
const paths = {
  DIST: path.resolve(__dirname, "dist"),
  SRC: path.resolve(__dirname, "src"),
  JS: path.resolve(__dirname, "src/app")
};

module.exports = env => {
  let mode = "production";
  let env_file = "./.env";

  if (fs.existsSync(env_file)) {
    require("dotenv").config({ path: env_file });
  }
  return {
    entry: path.join(paths.JS, "app.js"),
    output: {
      path: paths.DIST,
      filename: "app.bundle.js"
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": {
          REPOSITORY: JSON.stringify(process.env.REPOSITORY)
        }
      }),
      new HtmlWebpackPlugin({
        template: path.join(paths.SRC, "index.html"),
        minify: {
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
          useShortDoctype: true
        }
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css': '[id].[hash].css',
      })
    ],
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.s(c)ss/,
          loader: "import-glob-loader"
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"] //
        },

        {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
        },

        {
          test: /\.(png|jpg|gif)$/,
          use: ["url-loader"]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          use: ["file-loader"]
        }
      ]
    },
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
      extensions: [".js", ".jsx", ".json", ".yml"]
    }
  };
};
