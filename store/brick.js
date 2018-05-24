var colors = {
  red: [1,0,0],
  yellow: [1,1,0],
  lime: [0,1,0],
  blue: [0,0,1],
  gray: [0.5,0.5,0.5]
}

module.exports = function (state, emitter) {
  state.brickMesh = {
    positions: [],
    cells: [],
    colors: [],
    ids: [],
    depth: true
  }
  state.hoverBrickMesh = {
    positions: [],
    cells: [],
    colors: [],
    ids: [],
    depth: true
  }
  var base = {
    size: [20,1/3,20],
    offset: [0,-2/3,0],
    color: [0.1,0.5,0.1],
    id: 0
  }
  createBrick(state.brickMesh, base)
  state.bricks = [ base ]

  emitter.on('hover-brick', function (opts) {
    state.hoverBrickMesh.positions = []
    state.hoverBrickMesh.colors = []
    state.hoverBrickMesh.cells = []
    state.hoverBrickMesh.ids = []
    state.hoverBrickMesh.depth = !state.ui.remove
    if (opts) {
      opts.id = state.bricks.length
      createBrick(state.hoverBrickMesh, opts)
    }
  })

  emitter.on('add-brick', function (opts) {
    opts.id = state.bricks.length
    createBrick(state.brickMesh, opts)
    state.bricks.push(opts)
  })

  emitter.on('remove-brick', function (data) {
    state.bricks.splice(data[3],1)
  })

  emitter.on('rebuild-bricks', function () {
    state.brickMesh = { positions: [], cells: [], colors: [], ids: [] }
    for (var i = 0; i < state.bricks.length; i++) {
      var b = state.bricks[i]
      b.id = i
      createBrick(state.brickMesh, b)
    }
  })
}

function createBrick (mesh, opts) {
  var size = opts.size
  var offset = opts.offset
  var id = opts.id
  var k = mesh.positions.length
  var color = typeof opts.color === 'string' ? colors[opts.color] : opts.color
  mesh.positions.push(
    [-1*size[0]+offset[0]*2,-1*size[1]+offset[1]*2+1,-1*size[2]+offset[2]*2],
    [+1*size[0]+offset[0]*2,-1*size[1]+offset[1]*2+1,-1*size[2]+offset[2]*2],
    [+1*size[0]+offset[0]*2,-1*size[1]+offset[1]*2+1,+1*size[2]+offset[2]*2],
    [-1*size[0]+offset[0]*2,-1*size[1]+offset[1]*2+1,+1*size[2]+offset[2]*2],
    [-1*size[0]+offset[0]*2,+1*size[1]+offset[1]*2+1,-1*size[2]+offset[2]*2],
    [+1*size[0]+offset[0]*2,+1*size[1]+offset[1]*2+1,-1*size[2]+offset[2]*2],
    [+1*size[0]+offset[0]*2,+1*size[1]+offset[1]*2+1,+1*size[2]+offset[2]*2],
    [-1*size[0]+offset[0]*2,+1*size[1]+offset[1]*2+1,+1*size[2]+offset[2]*2]
  )
  for (var i = 0; i < 8; i++) {
    mesh.colors.push(color)
    mesh.ids.push(id)
  }
  mesh.cells.push(
    [k+0,k+1,k+2],[k+0,k+2,k+3],[k+6,k+5,k+4],[k+7,k+6,k+4],
    [k+4,k+1,k+0],[k+4,k+5,k+1],[k+5,k+2,k+1],[k+5,k+6,k+2],
    [k+6,k+3,k+2],[k+6,k+7,k+3],[k+7,k+0,k+3],[k+0,k+7,k+4]
  )
  var n = 12
  for (var x = 0; x < size[0]; x++) {
    for (var z = 0; z < size[2]; z++) {
      var k = mesh.positions.length
      for (var i = 0; i < n; i++) {
        var theta = i/n*2*Math.PI
        var px = Math.cos(theta)*0.8 + x*2 - (size[0]-1) + offset[0]*2
        var pz = Math.sin(theta)*0.8 + z*2 - (size[2]-1) + offset[2]*2
        mesh.positions.push([px,size[1]+0.4+offset[1]*2+1,pz])
        mesh.positions.push([px,size[1]+offset[1]*2+1,pz])
        mesh.colors.push(color, color)
        mesh.ids.push(id, id)
        mesh.cells.push([k,k+i*2,k+(i+1)%n*2])
        mesh.cells.push([k+i*2,k+(i+1)%n*2,k+i*2+1])
        mesh.cells.push([k+i*2+1,k+(i+1)%n*2,k+(i+1)%n*2+1])
      }
    }
  }
  return mesh
}
