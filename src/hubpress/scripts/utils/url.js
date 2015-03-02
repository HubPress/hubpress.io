module.exports = {
  getPostUrl: function(postName) {
    return postName.replace(/([\d]{4})-([\d]{2})-([\d]{2})-([\w-]*)\.adoc/, '/$1/$2/$3/$4.html')
  },

  getPostGhPath: function(postName) {
    return postName.replace(/([\d]{4})-([\d]{2})-([\d]{2})-([\w-]*)\.adoc/, '$1/$2/$3/$4.html')
  }
}
