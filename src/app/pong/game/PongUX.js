export class PongUX {
  DOM = {}
  onDOMIsReadyCallbackList = []

  init({ gameCanvas }) {
    this._setupDOM()

    window.onload = () => {
      this._appendCanvasToDOM({ gameCanvas })
      this._runOnDOMIsReadyCallbacks()
    }
  }

  onDOMIsReady(callback) {
    this.onDOMIsReadyCallbackList.push(callback)
  }

  _setupDOM() {
    this.DOM.canvasPlaceholder = document.querySelector('#canvas-placeholder')
  }

  _appendCanvasToDOM({ gameCanvas }) {
    this.DOM.canvasPlaceholder.appendChild(gameCanvas)
  }

  _runOnDOMIsReadyCallbacks() {
    this.onDOMIsReadyCallbackList.forEach((callback) => {
      callback()
    })
  }
}
