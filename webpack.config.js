const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Ваш основной JavaScript файл
  output: {
    filename: 'bundle.js', // Имя выходного файла
    path: path.resolve(__dirname, 'dist') // Папка, куда будут сохранены собранные файлы
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Обработка стилей
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/, // Обработка изображений
        type: 'asset/resource'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'), 
    port: 8080 
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'index.html'), // Путь к вашему index.html в папке src
          to: path.resolve(__dirname, 'dist') // Куда копировать файл в папку dist
        }
      ]
    })
  ]
};
