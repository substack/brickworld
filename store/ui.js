module.exports = function (state, emitter) {
  emitter.on('pick-data', function (data, ev) {
    if (ev.type === 'mousedown') {
      emitter.emit('add-brick', {
        size: [4,1,2],
        offset: [data[0],data[1],data[2]]
      })
      emitter.emit('frame')
    }
  })
}
