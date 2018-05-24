module.exports = function (state, emitter) {
  state.draws.push(new Brick(state.regl))
}
var colors = {
  red: [1,0,0],
  yellow: [1,1,0],
  lime: [0,1,0],
  blue: [0,0,1]
}

function Brick (regl) {
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
  this._drawSolid = regl(drawOpts)
  this._drawAlpha = regl(Object.assign({}, drawOpts, {
    frag: `
      precision highp float;
      #extension GL_OES_standard_derivatives: enable
      varying vec3 vpos;
      uniform vec3 color;
      void main () {
        vec3 N = normalize(cross(dFdx(vpos),dFdy(vpos)));
        vec3 L0 = normalize(vec3(2,8,3));
        float d = max(0.4,dot(N,L0));
        gl_FragColor = vec4(color*d,0.8);
      }
    `,
    cull: { enable: true, face: 'back' },
    depth: { mask: false },
    blend: {
      enable: true,
      func: { src: 'src alpha', dst: 'one minus src alpha' }
    },
    uniforms: {
      color: regl.prop('color')
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
  this._drawAlpha(Object.assign({}, state.hoverBrickMesh, {
    color: rgb(state.ui.color)
  }))
}

Brick.prototype.pick = function (state) {
  this._pick(state.brickMesh)
}

function rgb (color) {
  return colors[color]
}
