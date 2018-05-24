module.exports = function (state, emitter) {
  state.draws.push(new Base(state.regl))
}

function Base (regl) {
  var drawOpts = {
    frag: `
      precision highp float;
      #extension GL_OES_standard_derivatives: enable
      varying vec3 vpos;
      void main () {
        vec3 N = normalize(cross(dFdx(vpos),dFdy(vpos)));
        gl_FragColor = vec4(N*0.5+0.5,1);
      }
    `,
    vert: `
      precision highp float;
      uniform mat4 projection, view;
      varying vec3 vpos;
      attribute vec3 position;
      void main () {
        vpos = position;
        gl_Position = projection * view * vec4(position,1);
      }
    `,
    attributes: {
      position: regl.prop('positions'),
    },
    elements: regl.prop('cells')
  }
  this._draw = regl(drawOpts)
  this._pick = regl(Object.assign({}, drawOpts, {
    frag: `
      precision highp float;
      varying vec3 vpos;
      void main () {
        vec3 coord = floor(vpos*0.5);
        gl_FragColor = vec4(coord,1);
      }
    `
  }))
}

Base.prototype.draw = function (state) {
  this._draw(state.brickMesh)
}

Base.prototype.pick = function (state) {
  this._pick(state.brickMesh)
}
