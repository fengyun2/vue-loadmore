var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var autoprefixer = require('autoprefixer');

var index_file = path.resolve(__dirname, 'app/index.html');
fs.readFile(index_file, 'utf-8', function(err, data) {
    if (err) {
        console.log('error: ', err);
    } else {
        var devhtml = data;
        if (data.indexOf('/bundle.js') < 0) {
            devhtml = devhtml.replace('<script type="text/javascript" src="./assets/js/lib/sm-extend.min.js"></script>', '<script type="text/javascript" src="./assets/js/lib/sm-extend.min.js"></script><script type="text/javascript" src="/bundle.js"></script>');
        }
        fs.writeFileSync(index_file, devhtml);
    }
});

module.exports = {
    debug: true,
    devServer: {
        historyApiFallback: true,
        hot: false,
        inline: true,
        progress: true,
        contentBase: './app',
        lazy: false,
        stats: { colors: true, cached: false, cachedAssets: false },
        port: 8090
    },
    entry: [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8090',
        path.resolve(__dirname, 'app/main.js')
    ],
    output: {
        path: __dirname + '/build',
        publicPath: '/',
        filename: './bundle.js'
    },
    externals: {
        'VueRouter': 'VueRouter',
        'reqwest': 'reqwest'
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'vue'
        }, {
            test: /\.css$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'style!css!postcss'
        }, {
            test: /\.scss$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'style!css!sass!postcss'
        }, {
            test: /\.js[x]?$/,
            include: path.resolve(__dirname, 'app'),
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'stage-0'],
                plugins: ['transform-runtime']
            }
        }, {
            test: /\.json$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'json'
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'url',
            query: {
                limit: 1,
                name: '[name].[ext]?[hash]'
            }
        }, {
            test: /\.(html|tpl)$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'html'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'url-loader?limit=10000&minetype=application/font-woff'
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'url',
            query: {
                name: '[name].[ext]?mimetype=application/font-woff2'
            }
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
            include: path.resolve(__dirname, 'app'),
            loader: 'url',
            query: {
                name: '[name].[ext]?mimetype=application/font-woff2'
            }
        }]
    },
    /*    externals: {
            'zepto': 'Zepto',
            'wx': 'jWeixin'
        },*/
    vue: {
        loaders: {
            css: 'vue-style!css!sass!postcss?sourceMap',
            sass: 'vue-style!css!sass!postcss?sourceMap',
            js: 'babel',
            query: {
                presets: ['es2015', 'stage-0'],
                plugins: ['transform-runtime']
            },
            html: 'vue-html'
        }
    },
    postcss: [
        autoprefixer({ flexbox: true, browsers: ['last 5 version'] })
    ],
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-runtime']
    },
    resolve: {
        // root: [process.cwd() + '/app', process.cwd() + '/node_modules'],
        extensions: ['', '.js', '.vue', '.jsx', '.scss', '.css'],
        alias: {
            'app': path.resolve(__dirname, '../app'),
            'assets': path.resolve(__dirname, '../app/assets'),
            'components': path.resolve(__dirname, '../app/components')
        }
    },
    plugins: [
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:8090' })
    ],
    devtool: '#eval-source-map'
};
