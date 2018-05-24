module.exports = function (state, emitter) {
  state.draws.push(new Brick(state.regl))
}

function Brick (regl) {
  var drawOpts = {
    frag: `
      precision highp float;
      #extension GL_OES_standard_derivatives: enable
      varying vec3 vpos, vcolor;
      uniform float alpha;
      void main () {
        vec3 N = normalize(cross(dFdx(vpos),dFdy(vpos)));
        vec3 L0 = normalize(vec3(2,8,3));
        float d = max(0.4,dot(N,L0));
        gl_FragColor = vec4(vcolor*d,alpha);
      }
    `,
    vert: `
      precision highp float;
      uniform mat4 projection, view;
      varying vec3 vpos, vcolor;
      attribute vec3 position, color;
      void main () {
        vpos = position;
        vcolor = color;
        gl_Position = projection * view * vec4(position,1);
      }
    `,
    uniforms: { alpha: 1 },
    attributes: {
      position: regl.prop('positions'),
      color: regl.prop('colors'),
    },
    elements: regl.prop('cells')
  }
  this._drawSolid = regl(drawOpts)
  this._drawAlpha = regl(Object.assign({}, drawOpts, {
    uniforms: { alpha: 0.8 },
    cull: { enable: true, face: 'back' },
    depth: { mask: false },
    blend: {
      enable: true,
      func: { src: 'src alpha', dst: 'one minus src alpha' }
    }
  }))
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

Brick.prototype.draw = function (state) {
  this._drawSolid(state.brickMesh)
}

Brick.prototype.postDraw = function (state) {
  this._drawAlpha(state.hoverBrickMesh)
}

Brick.prototype.pick = function (state) {
  this._pick(state.brickMesh)
}
