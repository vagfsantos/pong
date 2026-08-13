export class GameController {
  constructor({ gameCanvas, renderEngine }) {
    this.gameCanvas = gameCanvas
    this.renderEngine = renderEngine
  }

  startGame() {
    window.requestAnimationFrame(() => {
      this.renderEngine.render({
        gameCanvas: this.gameCanvas,
      })
    })
  }
}
