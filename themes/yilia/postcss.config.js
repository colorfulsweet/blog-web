module.exports = {
  plugins: [
    // require('postcss-smart-import')({ /* ...options */ }),
    // require('precss')({ /* ...options */ }),
    require('autoprefixer')({
      browsers:['last 2 versions', '> 1%', 'iOS >= 7', 'Android >= 4', 'not ie <= 8']
    })
  ]
}
