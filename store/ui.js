module.exports = function (state, emitter) {
  state.ui = {
    color: 'red',
    moved: false,
    brick: [4,1,2],
    remove: false
  }
  emitter.on('set-color', function (color) {
    state.ui.color = color
    emitter.emit('frame')
  })
  emitter.on('toggle-remove', function () {
    state.ui.remove = !state.ui.remove
    emitter.emit('render')
  })
  emitter.on('rotate-brick', function () {
    var x = state.ui.brick[0], z = state.ui.brick[2]
    state.ui.brick[0] = z
    state.ui.brick[2] = x
    emitter.emit('frame')
    emitter.emit('render')
  })
  emitter.on('pick-data', function (data, ev) {
    if (ev.type === 'mousedown') {
      state.ui.moved = false
    } else if (ev.type === 'mouseup' && !state.ui.moved) {
      if (state.ui.remove) {
        emitter.emit('remove-brick', data)
        emitter.emit('rebuild-bricks')
      } else {
        emitter.emit('add-brick', {
          color: state.ui.color,
          size: state.ui.brick,
          offset: [data[0],data[1],data[2]]
        })
      }
      emitter.emit('frame')
    } else if (ev.type === 'mousemove') {
      if (state.ui.remove) {
        if (data[3] <= 0) {
          emitter.emit('hover-brick', null)
        } else {
          var b = state.bricks[data[3]]
          emitter.emit('hover-brick', b ? {
            color: 'gray',
            size: b.size,
            offset: b.offset
          } : null)
        }
      } else {
        emitter.emit('hover-brick', {
          color: state.ui.color,
          size: state.ui.brick,
          offset: [data[0],data[1],data[2]]
        })
      }
      state.ui.moved = true
      emitter.emit('frame')
    }
  })
}
