const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // to access built-in plugins
const path = require('path');

const RootPath = path.resolve(__dirname);

const config = {
    entry: {
        // demo: ['babel-polyfill', 'react-hot-loader/patch', './example/src/demo.jsx'],
        // barChart: ['./example/src/BarChartApp.jsx'],
        // pieChart: ['./example/src/PieChartApp.jsx'],
        // tween: ['./example/src/tween.js'],
        // windmill: ['./example/src/windmill.js'],
        // graphics: ['./example/src/graphics.js'],
        // snow: ['./example/src/snow.js'],
        // layout: ['./example/src/layout.js'],
        // gum: ['./example/src/gum.js'],
        // merge: ['./example/src/merge.js'],
        // colors: ['./example/src/colors.js'],
        // flower: ['./example/src/flower.js'],
        // balance: ['./example/src/balance.js'],
        scrawl: ['./example/src/scrawl.js'],
    },
    resolve: {
        alias: { RootPath },
        extensions: ['.js', '.jsx', '.json'],
        modules: [__dirname, path.resolve(__dirname, 'packages'), 'node_modules'],
    },
    output: {
        path: path.resolve(__dirname, './assets'),
        filename: '[name].js',
    },
    devServer: {
        contentBase: [path.resolve(__dirname, './assets')],
        hot: true,
        port: 9000,
        host: '0.0.0.0',
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
            template: './template/index.template.html',
            title: 'tigerface.js',
            filename: 'index.html',
            chunks: ['scrawl'],
        }),
        // new HtmlWebpackPlugin({
        //     template: './template/index.template.html',
        //     title: 'tigerface.js',
        //     filename: 'index.html',
        //     chunks: ['windmill03'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/windmill01.html',
        //     title: 'tigerface.js 范例 - 平衡',
        //     chunks: ['windmill01'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './index.html',
        //     title: 'tigerface.js 范例 - 平衡',
        //     chunks: ['balance'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/merge.html',
        //     title: 'tigerface.js 范例 - 花',
        //     chunks: ['flower'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/merge.html',
        //     title: 'tigerface.js 范例 - 多边形合并',
        //     chunks: ['merge'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/color.html',
        //     title: 'tigerface.js 范例 - 调色板',
        //     chunks: ['colors'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/gum.html',
        //     title: 'tigerface.js 范例 - 口香糖',
        //     chunks: ['gum'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/snow.html',
        //     title: 'tigerface.js 范例 - 雪花',
        //     chunks: ['snow'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/windmill.html',
        //     title: 'tigerface.js 范例 - 风车',
        //     chunks: ['windmill'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/barChart.html',
        //     title: 'tigerface.js 范例 - 柱图',
        //     chunks: ['barChart'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/pieChart.html',
        //     title: 'tigerface.js 范例 - 饼图',
        //     chunks: ['pieChart'],
        // }),
        // new HtmlWebpackPlugin({
        //     template: './template/embed.template.html',
        //     filename: './html/tween.html',
        //     title: 'tigerface.js 范例 - 补间',
        //     chunks: ['tween'],
        // }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                // NODE_ENV: '"production"',
                LOG_LEVEL: '"DEBUG"',
                // MAX_LISTENERS:100
            },
        }),
    ],
};

module.exports = config;
