/*
 * @Author: fengyun2
 * @Date:   2016-06-03 13:44:17
 * @Last Modified by:   fengyun2
 * @Last Modified time: 2016-06-18 14:56:48
 */

/**
 * 打包上线还有bug, 请先不要使用这个上线功能
 */

var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var fs = require('fs'),
    buildPath = './build/';
(function deleteFolderRecursive(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file) {
            var curPath = path + '/' + file;
            if (curPath.indexOf('assets') < 0) {
                if (fs.statSync(curPath).isDirectory()) {
                    deleteFolderRecursive(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            }
        });
        // if (path.indexOf('assets') < 0) {
        //     fs.rmdirSync(path);
        // }
    }
})(buildPath);

var index_file = path.resolve(__dirname, 'app/index.html');
fs.readFile(index_file, 'utf-8', function(err, data) {
    if (err) {
        console.log('error: ', err);
    } else {
        var devhtml = data.replace(/((?:href|src)="[^"]+\.)(\w{20}\.)(js|css)/g, '$1$3');
        devhtml = devhtml.replace('<script type="text/javascript" src="/bundle.js"></script>', '');
        fs.writeFileSync(index_file, devhtml);
    }
});


module.exports = {
    entry: {
        main: [path.resolve(__dirname, 'app/main.js')],
        // topic: [path.resolve(__dirname, 'app/assets/js/page/topic.js')],
        // zepto: [path.resolve(__dirname, 'app/assets/js/lib/zepto-1.1.6-min.js')],
    },
    output: {
        path: __dirname + '/build',
        publicPath: '/',
        filename: '[name].[chunkhash:16].js',
        chunkFilename: '[name].[chunkhash:16].js'
    },
    module: {
        loaders: [{
                test: /\.vue$/,
                loader: 'vue'
            }, {
                test: /\.css$/,
                include: path.resolve(__dirname, 'app'),
                loader: ExtractTextPlugin.extract('style', 'css?-convertValues!postcss')
            }, {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'app'),
                loader: ExtractTextPlugin.extract('style', 'css?-convertValues!sass!postcss')
            }, {
                test: /\.js[x]?$/,
                include: path.resolve(__dirname, 'app'),
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0'],
                    plugins: ['transform-runtime'],
                    compact: false
                }
            }, {
                test: /\.json$/,
                include: path.resolve(__dirname, 'app'),
                loader: 'json'
            }, {
                test: /\.(png|jpg|gif|woff|woff2|ttf|eot|svg)$/,
                loader: 'url-loader?name=[name]_[sha512:hash:base64:7].[ext]',
                query: {
                    limit: 1,
                    name: '[name].[ext]?[hash]'
                }
            }, {
                test: /\.(html|tpl)$/,
                include: path.resolve(__dirname, 'app'),
                loader: 'html'
            },

            // {
            //     test: /\.html/,
            //     loader: 'html'
            // }
            // {
            //     test: /\.(png|jpg|gif|svg)$/,
            //     loader: 'url?limit=800000'
            // },
            // {
            //     test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            //     include: path.resolve(__dirname, 'app'),
            //     loader: 'url',
            //     query: {
            //         limit: 10000,
            //         name: '[name].[ext]?minetype=application/font-woff'
            //     }
            // }, {
            //     test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            //     include: path.resolve(__dirname, 'app'),
            //     loader: 'url',
            //     query: {
            //         name: '[name].[ext]?mimetype=application/font-woff2'
            //     }
            // }, {
            //     test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            //     include: path.resolve(__dirname, 'app'),
            //     loader: 'url',
            //     query: {
            //         name: '[name].[ext]?mimetype=application/font-woff2'
            //     }
            // }
        ]
    },
    vue: {
        loaders: {
            css: ExtractTextPlugin.extract('vue-style', 'css!sass!postcss'),
            sass: ExtractTextPlugin.extract('vue-style', 'css!sass!postcss'),
            js: 'babel',
            html: 'vue-html'
        }
    },
    postcss: [
        autoprefixer({
            flexbox: true,
            browsers: ['> 0.01%'],
            cascade: false,
            supports: true
        })
    ],
    resolve: {
        root: [],
        alias: [],
        extensions: ['', '.js', '.vue', '.jsx', '.scss', '.css'],
    },
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    },
    plugins: [
        new webpack.ProvidePlugin({
            // $: 'zepto',
            // jQuery: 'jquery',
            // template: 'template',
            // store: 'store',
            // _: 'understore'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new uglifyJsPlugin({
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require']
        }),

        new HtmlWebpackPlugin({
            favicon: './app/assets/img/favicon.ico',
            filename: './index.html',
            template: './app/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['common'],
            minChunks: Infinity
        }),
        new ExtractTextPlugin('[name].[chunkhash:16].css', { allChunks: true })
    ]
};
