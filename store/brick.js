module.exports = function (state, emitter) {
  state.brickMesh = { positions: [], cells: [] }
  var base = {
    size: [20,1/3,20],
    offset: [0,-2/3,0]
  }
  createBrick(state.brickMesh, base)
  state.bricks = [ base ]

  emitter.on('add-brick', function (opts) {
    createBrick(state.brickMesh, opts)
    state.bricks.push(opts)
  })
}

function createBrick (mesh, opts) {
  var size = opts.size
  var offset = opts.offset
  var k = mesh.positions.length
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
  mesh.cells.push(
    [k+0,k+1,k+2],[k+0,k+2,k+3],[k+4,k+5,k+6],[k+4,k+6,k+7],
    [k+0,k+1,k+4],[k+1,k+5,k+4],[k+1,k+2,k+5],[k+2,k+6,k+5],
    [k+2,k+3,k+6],[k+3,k+7,k+6],[k+3,k+0,k+7],[k+0,k+7,k+4]
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
        mesh.cells.push([k,k+i*2,k+(i+1)%n*2])
        mesh.cells.push([k+i*2,k+(i+1)%n*2,k+i*2+1])
        mesh.cells.push([k+i*2+1,k+(i+1)%n*2,k+(i+1)%n*2+1])
      }
    }
  }
  return mesh
}
