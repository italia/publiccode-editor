import CopyPlugin from "copy-webpack-plugin";
import "dotenv/config";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { Configuration, DefinePlugin } from "webpack";

const config = (
  env: Record<string, string>,
  { mode }: { mode: "none" | "development" | "production" }
): Configuration => ({
  entry: "./src/app/app.tsx",
  output: {
    filename: "app.bundle.js",
  },
  plugins: [
    new DefinePlugin({
      "process.env": {
        REPOSITORY: JSON.stringify(process.env.REPOSITORY),
        ELASTIC_URL: JSON.stringify(process.env.ELASTIC_URL),
        VALIDATOR_URL: JSON.stringify(process.env.VALIDATOR_URL),
        VALIDATOR_REMOTE_URL: JSON.stringify(process.env.VALIDATOR_REMOTE_URL),
        FALLBACK_LANGUAGE: JSON.stringify(process.env.FALLBACK_LANGUAGE),
        DEFAULT_COUNTRY_SECTIONS: JSON.stringify(
          process.env.DEFAULT_COUNTRY_SECTIONS
        ),
      },
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        useShortDoctype: true,
      },
      favicon: "src/asset/img/favicon-32x32.png",
    }),
    new MiniCssExtractPlugin({
      filename: mode !== "production" ? "[name].css" : "[name].[fullhash].css",
      chunkFilename: mode !== "production" ? "[id].css" : "[id].[fullhash].css",
    }),
    new CopyPlugin({
      patterns: ["src/generated/main.wasm", "src/generated/wasm_exec.js"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: "swc-loader",
      },

      {
        test: /\.css$/,
        use: [
          mode !== "production" ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },

      {
        test: /\.(png|jpg|gif)$/,
        type: "asset/inline",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".yml", ".tsx", ".ts"],
    alias: {
      cldr$: "cldrjs",
      cldr: "cldrjs/dist/cldr",
    },
  },
});

export default config;
