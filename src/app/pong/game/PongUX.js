export class PongUX {
  DOM = {}

  init({ gameCanvas }) {
    this._setupDOM()
    this._appendCanvasToDOM({ gameCanvas })
  }

  _setupDOM() {
    this.DOM.canvasPlaceholder = document.querySelector('#canvas-placeholder')
  }

  _appendCanvasToDOM({ gameCanvas }) {
    this.DOM.canvasPlaceholder.appendChild(gameCanvas)
  }
}
