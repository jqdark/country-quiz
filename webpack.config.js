const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSVGPlugin = require("html-webpack-inline-svg-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new HtmlWebpackInlineSVGPlugin({
            svgoConfig: [
                {
                    collapseGroups: false
                },
                {
                    removeComments: false
                },
                {
                    removeViewBox: false
                }
            ],
            inlineAll: true
        }),
        new MiniCssExtractPlugin({
            filename: "styles.css"
        })
    ],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader"
            },
            {
                test: /\.sass$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    }
};