module.exports = function (state, emitter) {
  state.ui = {
    color: 'red',
    moved: false,
    brick: [4,1,2]
  }
  emitter.on('set-color', function (color) {
    state.ui.color = color
    emitter.emit('frame')
  })
  emitter.on('rotate-brick', function () {
    var x = state.ui.brick[0], z = state.ui.brick[2]
    state.ui.brick[0] = z
    state.ui.brick[2] = x
    emitter.emit('frame')
  })
  emitter.on('pick-data', function (data, ev) {
    if (ev.type === 'mousedown') {
      state.ui.moved = false
    } else if (ev.type === 'mouseup' && !state.ui.moved) {
      emitter.emit('add-brick', {
        color: state.ui.color,
        size: state.ui.brick,
        offset: [data[0],data[1],data[2]]
      })
      emitter.emit('frame')
    } else if (ev.type === 'mousemove') {
      emitter.emit('hover-brick', {
        color: state.ui.color,
        size: state.ui.brick,
        offset: [data[0],data[1],data[2]]
      })
      state.ui.moved = true
      emitter.emit('frame')
    }
  })
}
