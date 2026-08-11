import { GameCanvas } from '@game-engine/GameCanvas'
import { GameController } from '@game-engine/GameController'
import { BOARD_SETTINGS } from '@pong/constants/pong-consts'
import { PongStartScreen } from '@pong/game/PongStartScreen'
import { PongUX } from '@pong/game/PongUX'

export class PongController {
  Canvas = new GameCanvas()
  UX = new PongUX()

  StartScreen = new PongStartScreen()

  init() {
    this._setupGame()
    this._setupInitialScreen()
    this._setupUX()
  }

  _setupGame() {
    this.Canvas.setCanvasSize(BOARD_SETTINGS.WIDTH, BOARD_SETTINGS.HEIGHT)

    this.Controller = new GameController({
      gameCanvas: this.Canvas,
    })
  }

  _setupInitialScreen() {
    this.StartScreen.getScreenGameObjects().forEach((gameObj) =>
      this.Controller.addGameObject({
        gameObject: gameObj,
      })
    )
    this.StartScreen.show({ gameCanvas: this.Canvas.getCanvas() })
    this.StartScreen.onClickStart(() => this._startMatch())

    this.Controller.startGame()
  }

  _startMatch() {
    alert('Game on')
  }

  _setupUX() {
    this.UX.init({ gameCanvas: this.Canvas.getCanvas() })
  }
}
