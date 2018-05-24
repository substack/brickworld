var html = require('choo/html')

module.exports = function (state, emit) {
  return html`<body>
    <style>
      canvas {
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        z-index: 5;
      }
      .buttons {
        position: absolute;
        top: 4px;
        z-index: 10;
      }
      .buttons button {
        background-color: #808080;
        color: white;
        width: 2em;
        height: 2em;
        vertical-align: top;
        margin-right: 8px;
        border: 1px solid white;
      }
    </style>
    <div class="buttons">
      <button onclick=${rotate}>\u21b7</button>
      <button style="background-color: red" class="color"
        onclick=${setColor('red')}> </button>
      <button style="background-color: yellow" class="color"
        onclick=${setColor('yellow')}> </button>
      <button style="background-color: lime" class="color"
        onclick=${setColor('lime')}> </button>
      <button style="background-color: blue" class="color"
        onclick=${setColor('blue')}> </button>
    </div>
    ${state.canvas}
  </body>`
  function setColor (color) {
    return function () { emit('set-color', color) }
  }
  function rotate () { emit('rotate-brick') }
}
