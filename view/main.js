var html = require('choo/html')
var brickSizes = [[4,1,2],[3,1,2],[2,1,2],[4,1,1],[3,1,1],[2,1,1],[1,1,1]]
var fg = {
  red: 'dark',
  yellow: 'dark',
  lime: 'dark',
  blue: 'light',
  purple: 'light'
}

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
        width: 2em;
        height: 2em;
        vertical-align: top;
        margin-right: 8px;
        border: 1px solid #404040;
      }
      .buttons button.toggle.active {
        background-color: #ff80a0;
        color: #808080;
        border-color: #808080;
      }
      .buttons button.color.light {
        color: white;
      }
      .buttons button.color.dark {
        color: black;
      }
      .buttons select {
        height: 2em;
      }
    </style>
    <div class="buttons">
      <button onclick=${rotate} alt="rotate (key: R)" title="rotate (key: R)">
        ${state.ui.brick[0] > state.ui.brick[2] ? '\u21b7' : '\u21b6'}
      </button>
      <button onclick=${toggleRemove}
        alt="toggle remove mode ${state.ui.remove ? 'off' : 'on'} (key: d)"
        title="toggle remove mode ${state.ui.remove ? 'off' : 'on'} (key: d)"
        class="toggle ${state.ui.remove ? 'active' : ''}">X</button>
      <button onclick=${clear} alt="clear" title="clear">\u2205</button>
      ${state.colors.map(function (color,i) {
        return html`<button style="background-color: ${color}"
          class="color ${fg[color]}" alt="${color}" title="${color}"
          onclick=${setColor(color)}>${i}</button>`
      })}
      <select onchange=${selectBrick}>
        ${brickSizes.map(function (size) {
          var selected = state.ui.brick.join(' ') === size.join(' ')
          return html`<option ${selected ? 'selected' : ''}>
            ${size.join(' ')}</option>`
        })}
      </select>
    </div>
    ${state.canvas}
  </body>`
  function setColor (color) {
    return function () { emit('set-color', color) }
  }
  function rotate () { emit('rotate-brick') }
  function toggleRemove () { emit('toggle-remove') }
  function selectBrick () {
    if (this.blur) this.blur()
    emit('select-brick', this.value.split(' ').map(Number))
  }
  function clear () { emit('clear') }
}
