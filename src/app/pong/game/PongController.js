import { GameCanvas } from '@game-engine/GameCanvas'
import { GameController } from '@game-engine/GameController'
import { GameRenderEngine } from '@game-engine/GameEngine'
import { BOARD_SETTINGS } from '@pong/constants/pong-consts'
import { PongMatchScreen } from '@pong/game/PongMatchScreen'
import { PongStartScreen } from '@pong/game/PongStartScreen'
import { PongUX } from '@pong/game/PongUX'

export class PongController {
  Canvas = new GameCanvas()
  UX = new PongUX()
  GameRenderEngine = new GameRenderEngine()

  StartScreen = new PongStartScreen()
  MatchScreen = new PongMatchScreen()

  init() {
    this._setupGame()
    this._setupInitialScreen()
    this._setupUX()

    this.Controller.startGame()
  }

  _setupGame() {
    this.Canvas.setCanvasSize(BOARD_SETTINGS.WIDTH, BOARD_SETTINGS.HEIGHT)

    this.Controller = new GameController({
      gameCanvas: this.Canvas,
      renderEngine: this.GameRenderEngine,
    })
  }

  _setupInitialScreen() {
    this.StartScreen.getScreenGameObjects().forEach((gameObject) => {
      this.GameRenderEngine.addGameObject({
        gameObject,
      })
      gameObject.watchForEvents({ gameCanvas: this.Canvas.getCanvas() })
    })
    this.StartScreen.onClickStart(() => this._setupMatchScreen())
    this.StartScreen.show()
  }

  _setupMatchScreen() {
    this.StartScreen.getScreenGameObjects().forEach((gameObject) => {
      this.GameRenderEngine.removeGameObject({ gameObject })
    })

    this.MatchScreen.show()

    this.MatchScreen.getScreenGameObjects().forEach((gameObject) => {
      this.GameRenderEngine.addGameObject({ gameObject })
      gameObject.watchForEvents({ gameCanvas: this.Canvas.getCanvas() })
    })
  }

  _setupUX() {
    this.UX.init({ gameCanvas: this.Canvas.getCanvas() })
  }
}
