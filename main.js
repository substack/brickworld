var app = require('choo')()
var html = require('choo/html')
var regl = require('regl')

app.use(function (state, emitter) {
  state.canvas = document.createElement('canvas')
  state.width = state.canvas.width = window.innerWidth
  state.height = state.canvas.height = window.innerHeight
  window.addEventListener('resize', function () {
    state.width = state.canvas.width = window.innerWidth
    state.height = state.canvas.height = window.innerHeight
    emitter.emit('frame')
  })
  window.addEventListener('mousemove', onmouse)
  window.addEventListener('mousedown', onmouse)
  window.addEventListener('mouseup', onmouse)
  state.mouse = { previous: null, current: null }
  function onmouse (ev) {
    state.mouse.current = ev
    emitter.emit('mouse', state.mouse.current, state.mouse.previous)
    state.mouse.previous = ev
  }
  state.regl = regl({
    extensions: [ 'oes_texture_float', 'oes_standard_derivatives' ],
    canvas: state.canvas
  })
  state.draws = []
  state.uniforms = {}
  emitter.on('frame', function () {
    if (state.drawing) return
    state.drawing = true
    window.requestAnimationFrame(frame)
  })
  emitter.emit('frame')
  function frame () {
    state.drawing = false
    state.regl.poll()
    state.regl.clear({ color: [1,1,1,1], depth: true })
    state.uniformFn(function () {
      for (var i = 0; i < state.draws.length; i++) {
        var d = state.draws[i]
        if (typeof d.preDraw === 'function') d.preDraw(state)
      }
      for (var i = 0; i < state.draws.length; i++) {
        var d = state.draws[i]
        if (typeof d.draw === 'function') d.draw(state)
      }
      for (var i = 0; i < state.draws.length; i++) {
        var d = state.draws[i]
        if (typeof d.postDraw === 'function') d.postDraw(state)
      }
    })
  }
  emitter.on('mouse', function (ev) {
    emitter.emit('pick', ev)
  })
  state.pick = {
    fb: state.regl.framebuffer({ colorType: 'float32' }),
    data: new Float32Array(4),
  }
  state.pick.usefb = state.regl({
    framebuffer: state.pick.fb
  })
  emitter.on('pick', function (ev) {
    state.pick.fb.resize(state.width, state.height)
    state.pick.usefb(function () {
      state.pick.fb.use(function () {
        state.regl.clear({ color: [0,0,0,0], depth: true })
        state.uniformFn(function () {
          for (var i = 0; i < state.draws.length; i++) {
            var d = state.draws[i]
            if (typeof d.pick === 'function') d.pick(state)
          }
        })
        var data = state.regl.read({
          x: Math.max(0,Math.min(state.width-1,ev.offsetX)),
          y: Math.max(0,Math.min(state.height-1,state.height-ev.offsetY)),
          width: 1,
          height: 1
        })
        emitter.emit('pick-data', data, ev)
      })
    })
  })
})

app.use(require('./draw/brick.js'))
app.use(require('./store/brick.js'))
app.use(require('./store/camera.js'))
app.use(require('./store/ui.js'))

app.use(function (state, emitter) {
  state.uniformFn = state.regl({
    uniforms: state.uniforms
  })
})

app.route('*', function (state, emit) {
  return html`<body>
    <style>
      canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
      }
    </style>
    ${state.canvas}
  </body>`
})

app.mount(document.body)
