import { GameCanvas } from '@game-engine/GameCanvas'
import { GameController } from '@game-engine/GameController'
import { BOARD_SETTINGS } from '@pong/constants/pong-consts'
import { PongUX } from '@pong/game/PongUX'

export class PongController {
  Canvas = new GameCanvas()
  UX = new PongUX()

  init() {
    this._setupGame()
    this._setupUX()
  }

  _setupGame() {
    this.Canvas.setCanvasSize(BOARD_SETTINGS.WIDTH, BOARD_SETTINGS.HEIGHT)

    this.Controller = new GameController({
      gameCanvas: this.Canvas,
    })
  }

  _setupUX() {
    this.UX.init({ gameCanvas: this.Canvas.getCanvas() })
  }
}
