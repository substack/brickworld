var mat4 = require('gl-mat4')

module.exports = function (state, emitter) {
  state.camera = {
    projection: new Float32Array(16),
    view: new Float32Array(16),
    eye: Float32Array.from([0,25,-50]),
    center: Float32Array.from([0,0,0]),
    up: Float32Array.from([0,1,0]),
    distance: 50,
    theta: 0.78,
    phi: 0.78
  }
  state.uniforms.projection = function (context) {
    var aspect = context.viewportWidth / context.viewportHeight
    return mat4.perspective(state.camera.projection, Math.PI/4, aspect, 0.1, 1000.0)
  }
  state.uniforms.view = function (context) {
    var theta = state.camera.theta, phi = state.camera.phi
    var d = state.camera.distance
    state.camera.eye[0] = Math.cos(theta) * Math.sin(phi) * d
    state.camera.eye[1] = Math.cos(phi) * d
    state.camera.eye[2] = Math.sin(theta) * Math.sin(phi) * d
    return mat4.lookAt(state.camera.view,
      state.camera.eye, state.camera.center, state.camera.up)
  }
  emitter.on('mouse', function (cur, prev) {
    if (cur.type === 'wheel') {
      state.camera.distance = Math.max(1,Math.min(100,
        state.camera.distance + cur.deltaY/10))
      emitter.emit('frame')
    } else if (prev && (cur.buttons & 1)) {
      var dx = cur.clientX - prev.clientX
      var dy = cur.clientY - prev.clientY
      state.camera.theta += dx * 0.01
      state.camera.phi -= dy * 0.01
      emitter.emit('frame')
    }
  })
}
