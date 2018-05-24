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
        vec3 L1 = normalize(vec3(-4,2,-1));
        vec3 C0 = vec3(0.8,0.8,0.5);
        vec3 C1 = vec3(0.3,0.4,0.7);
        vec3 L = max(vec3(0.2),max(dot(N,L0)*C0,dot(N,L1)*C1));
        gl_FragColor = vec4(pow(vcolor*L,vec3(1.0/2.0)),alpha);
      }
    `,
    vert: `
      precision highp float;
      uniform mat4 projection, view;
      varying vec3 vpos, vcolor;
      varying float vid;
      attribute vec3 position, color;
      attribute float id;
      void main () {
        vpos = position;
        vcolor = color;
        vid = id;
        gl_Position = projection * view * vec4(position,1);
      }
    `,
    uniforms: { alpha: 1 },
    attributes: {
      position: regl.prop('positions'),
      color: regl.prop('colors'),
      id: regl.prop('ids')
    },
    elements: regl.prop('cells')
  }
  this._drawSolid = regl(drawOpts)
  this._drawAlpha = regl(Object.assign({}, drawOpts, {
    uniforms: { alpha: 0.8 },
    cull: { enable: true, face: 'back' },
    depth: {
      enable: function (context, props) { return !!props.depth },
      mask: false
    },
    blend: {
      enable: true,
      func: { src: 'src alpha', dst: 'src alpha' }
    }
  }))
  this._pick = regl(Object.assign({}, drawOpts, {
    frag: `
      precision highp float;
      varying vec3 vpos;
      varying float vid;
      void main () {
        vec3 coord = floor(vpos*0.5);
        gl_FragColor = vec4(coord,vid);
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
