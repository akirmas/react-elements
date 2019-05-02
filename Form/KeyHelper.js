export default Object.create({
  _prefix: `data_`,
  data: function(key) {
    return `${this._prefix}${key}`
  },
  pure(dataKey) {
    return dataKey.replace(new RegExp(`^${this._prefix}`), '')
  },
  is(key) {
    return key.startsWith(this._prefix)
  }
})
