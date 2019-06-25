const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rootDir = path.resolve(__dirname, '..')

module.exports = {
    entry: path.resolve(rootDir, './src/index.js'),
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(rootDir, 'dist')
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, 'src/index.html')
        }),
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            "@components": path.join(rootDir, "./src/components/"),
            "@pages": path.join(rootDir, './src/pages'),
        }
    },

    module: {
        rules: [
            {
                test: /.(js|jsx)$/,
                include: [path.resolve(rootDir, 'src')],
                loader: 'babel-loader',

                options: {
                    plugins: ['syntax-dynamic-import'],

                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                modules: false
                            }
                        ],
                        "@babel/preset-react",
                    ]
                }
            }
        ]
    },
};

