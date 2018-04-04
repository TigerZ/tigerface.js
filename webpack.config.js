const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack'); // to access built-in plugins
const path = require('path');

const RootPath = path.resolve(__dirname);

const config = {
    entry: {
        marked: [
            './webroot/src/marked.js',
        ],
        demo: [
            'babel-polyfill',
            './example/src/demo.jsx',
        ],
        barChart: [
            './packages/tigerface-example/src/BarChartApp.jsx',
        ],
        pieChart: [
            './packages/tigerface-example/src/PieChartApp.jsx',
        ],
        tween: ['./example/src/tween.js'],
        windmill: ['./packages/tigerface-example/src/windmill.js'],
        graphics: ['./packages/tigerface-example/src/graphics.js'],
        snow: ['./packages/tigerface-example/src/snow.js'],
    },
    resolve: {
        alias: {
            RootPath,
        },
        extensions: ['.js', '.jsx', '.json'],
        modules: [__dirname, path.resolve(__dirname, 'packages'), 'node_modules'],
    },
    output: {
        path: path.resolve(__dirname, './webroot/js'),
        filename: '[name].js',
    },
    module: {
        exprContextCritical: false,
        rules: [
            // // 以下是没有 .babelrc 文档的完整配置写法
            // {
            //     test: /\.(js|jsx)$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: {
            //             presets: [
            //                 ['babel-preset-env', {modules: false}], 'babel-preset-stage-1', 'babel-preset-react'],
            //             plugins: [
            //                 'react-hot-loader/babel'
            //             ]
            //         }
            //     }
            // },
            // // 结合 .babelrc 文件，此处就只需要简单指定使用 babel-loader
            { test: /\.(js|jsx)$/, exclude: /node_modules/, use: 'babel-loader' },
            { test: /\.json$/, loader: 'json-loader' },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './template/embed.template.html',
            filename: '../html/snow.html',
            title: 'tigerface.js 范例 - 雪花',
            chunks: ['snow'],
        }),
        new HtmlWebpackPlugin({
            template: './template/embed.template.html',
            filename: '../html/windmill.html',
            title: 'tigerface.js 范例 - 风车',
            chunks: ['windmill'],
        }),

        new HtmlWebpackPlugin({
            template: './template/embed.template.html',
            filename: '../html/barChart.html',
            title: 'tigerface.js 范例 - 柱图',
            chunks: ['barChart'],
        }),
        new HtmlWebpackPlugin({
            template: './template/embed.template.html',
            filename: '../html/pieChart.html',
            title: 'tigerface.js 范例 - 饼图',
            chunks: ['pieChart'],
        }),
        new HtmlWebpackPlugin({
            template: './template/embed.template.html',
            filename: '../html/tween.html',
            title: 'tigerface.js 范例 - 补间',
            chunks: ['tween'],
        }),
        new CleanWebpackPlugin(['./webroot/marked.html', './webroot/js', './webroot/html']),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
                // LOG_LEVEL: '"DEBUG"',
                // MAX_LISTENERS:100
            },
        }),
    ],
};

module.exports = config;
