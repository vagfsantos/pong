import { GameCanvas } from '@game-engine/GameCanvas'
import { GameController } from '@game-engine/GameController'
import { GameRenderEngine } from '@game-engine/GameEngine'
import { BOARD_SETTINGS, PLAYER_TYPE } from '@pong/constants/pong-consts'
import { PongMatchScreen } from '@pong/game/PongMatchScreen'
import { PongSound } from '@pong/game/PongSound'
import { PongStartScreen } from '@pong/game/PongStartScreen'
import { PongUX } from '@pong/game/PongUX'

export class PongController {
  Canvas = new GameCanvas()
  UX = new PongUX()
  GameRenderEngine = new GameRenderEngine()

  StartScreen = new PongStartScreen()
  MatchScreen = new PongMatchScreen()
  Sound = new PongSound()

  gameScore = {
    [PLAYER_TYPE.USER]: 0,
    [PLAYER_TYPE.MACHINE]: 0,
  }

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

    this.MatchScreen.onPlayerHitsBall(({ playerType }) => {
      if (playerType === PLAYER_TYPE.USER) this.Sound.playUserHitPlaySound()
      if (playerType === PLAYER_TYPE.MACHINE)
        this.Sound.playMachineHitPlaySound()
    })

    this.MatchScreen.onScore(({ playerType }) => {
      this.gameScore[playerType] = this.gameScore[playerType] + 1
      this.Sound.playScoreSound()

      this.MatchScreen.updateScore(this.gameScore)
    })
  }

  _setupUX() {
    this.UX.onDOMIsReady(() => {
      this.Sound.loadAllSounds().then(() => {
        this.Sound.playBackgroundSound()
      })
    })

    this.UX.init({ gameCanvas: this.Canvas.getCanvas() })
  }
}
