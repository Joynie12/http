const path = require('path');

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
      }
    ]
  }
};