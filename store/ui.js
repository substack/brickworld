module.exports = function (state, emitter) {
  state.ui = {
    color: 'red',
    moved: false,
    brick: [4,1,2],
    remove: false
  }
  emitter.on('select-brick', function (size) {
    state.ui.brick = size
    emitter.emit('render')
  })
  emitter.on('set-color', function (color) {
    state.ui.color = color
    state.ui.remove = false
    state.hoverBrick.color = color
    emitter.emit('hover-brick', state.hoverBrick)
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
    if (state.hoverBrick) {
      state.hoverBrick.size = state.ui.brick.slice()
      emitter.emit('hover-brick', state.hoverBrick)
    }
    emitter.emit('render')
    emitter.emit('frame')
  })
  emitter.on('keydown', function (ev) {
    var m
    if (ev.key === 'r') emitter.emit('rotate-brick')
    else if (ev.key === 'd') emitter.emit('toggle-remove')
    else if (m = /^(\d+)$/.exec(ev.key)) {
      if (state.colors[m[1]]) {
        emitter.emit('set-color', state.colors[m[1]])
        emitter.emit('frame')
      }
    }
  })
  emitter.on('pick-data', function (data, ev) {
    if (ev.type === 'mousedown') {
      state.ui.moved = false
    } else if (ev.type === 'mouseup' && !state.ui.moved) {
      if (state.ui.remove) {
        if (data[3] > 0) {
          emitter.emit('remove-brick', data)
          emitter.emit('rebuild-bricks')
        }
      } else {
        emitter.emit('add-brick', {
          color: state.ui.color,
          size: state.ui.brick.slice(),
          offset: [data[0],data[1],data[2]]
        })
      }
      emitter.emit('frame')
    } else if (ev.type === 'mousemove') {
      if (state.ui.remove) {
        var b = data[3] > 0 && state.bricks[data[3]]
        emitter.emit('hover-brick', b ? {
          color: 'gray',
          size: b.size.slice(),
          offset: b.offset
        } : null)
      } else {
        emitter.emit('hover-brick', data[3] >= 0 ? {
          color: state.ui.color,
          size: state.ui.brick.slice(),
          offset: [data[0],data[1],data[2]]
        } : null)
      }
      state.ui.moved = true
      emitter.emit('frame')
    }
  })
}
