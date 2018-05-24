module.exports = function (state, emitter) {
  state.ui = {
    color: 'red',
    moved: false
  }
  emitter.on('set-color', function (color) {
    state.ui.color = color
    emitter.emit('frame')
  })
  emitter.on('pick-data', function (data, ev) {
    if (ev.type === 'mousedown') {
      state.ui.moved = false
    } else if (ev.type === 'mouseup' && !state.ui.moved) {
      emitter.emit('add-brick', {
        color: state.ui.color,
        size: [4,1,2],
        offset: [data[0],data[1],data[2]]
      })
      emitter.emit('frame')
    } else if (ev.type === 'mousemove') {
      emitter.emit('hover-brick', {
        color: state.ui.color,
        size: [4,1,2],
        offset: [data[0],data[1],data[2]]
      })
      state.ui.moved = true
      emitter.emit('frame')
    }
  })
}
