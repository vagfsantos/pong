import {
  BALL,
  BOARD_SETTINGS,
  COLORS,
  PLAYER_TYPE,
} from '@pong/constants/pong-consts'
import { PongMachineAI } from '@pong/game/PongMachineAI'
import { PongBall } from '@pong/objects/PongBall'
import { PongPlayer } from '@pong/objects/PongPlayer'
import { PongScoreWall } from '@pong/objects/PongScoreWall'
import { PongText } from '@pong/objects/PongText'

export class PongMatchScreen {
  player = new PongPlayer({ name: PLAYER_TYPE.USER })
  machine = new PongPlayer({ name: PLAYER_TYPE.MACHINE })
  ball = new PongBall({ name: 'ball' })
  playerScoreWall = new PongScoreWall({ name: 'player-score-wall' })
  machineScoreWall = new PongScoreWall({ name: 'machine-score-wall' })
  score = new PongText({
    name: 'score',
    text: '0x0',
    fontSize: 72,
    fontColor: COLORS.PRIMARY_DARK,
    textBaseline: 'middle',
    textAlign: 'center',
  })

  machineAI = null

  _onScoreCallbacks = []
  _onPlayerHitsBallCallbacks = []

  show() {
    this.__setupInitialObjectLocation()
    this._setupObjectCollisions()
    this._setupEvents()
    this._setupMachinePlayerAI()

    this.ball.onUpdate(() => {
      this._onBallCollision()
      this.machineAI.move()
    })
  }

  getScreenGameObjects() {
    return [
      this.score,
      this.player,
      this.machine,
      this.ball,
      this.playerScoreWall,
      this.machineScoreWall,
    ]
  }

  updateScore(score) {
    this.score.setText(
      `${score[PLAYER_TYPE.USER]}x${score[PLAYER_TYPE.MACHINE]}`
    )
  }

  onScore(callback) {
    this._onScoreCallbacks.push(callback)
  }

  onPlayerHitsBall(callback) {
    this._onPlayerHitsBallCallbacks.push(callback)
  }

  __setupInitialObjectLocation() {
    const halfHeight = BOARD_SETTINGS.HEIGHT / 2 - this.player.height / 2
    this.player.setCoordinates({
      x: BOARD_SETTINGS.PLAYER_GAP_FROM_WALL,
      y: halfHeight,
    })
    this.machine.setCoordinates({
      x: BOARD_SETTINGS.WIDTH - BOARD_SETTINGS.PLAYER_GAP_FROM_WALL,
      y: halfHeight,
    })

    this.score.setCoordinates({
      x: BOARD_SETTINGS.WIDTH / 2,
      y: BOARD_SETTINGS.HEIGHT / 2,
    })

    this.playerScoreWall.setCoordinates({
      y: (this.playerScoreWall.height / 4) * -1, // wall has double height of screen
      x: -this.playerScoreWall.width - BALL.RADIUS * 2,
    })
    this.machineScoreWall.setCoordinates({
      y: (this.machineScoreWall.height / 4) * -1, // wall has double height of screen
      x: BOARD_SETTINGS.WIDTH + BALL.RADIUS * 2,
    })
  }

  _setupObjectCollisions() {
    this.player.setInnerColissionArea({
      y: 0,
      x: 13,
      width: 2,
      height: 80,
    })

    this.machine.setInnerColissionArea({
      y: 0,
      x: 0,
      width: 2,
      height: 80,
    })

    this.ball.setInnerColissionArea({
      x: BALL.RADIUS * -1,
      y: BALL.RADIUS * -1,
      width: BALL.RADIUS * 2,
      height: BALL.RADIUS * 2,
    })
  }

  _onPlayerHitsBall({ playerType, whereCollided }) {
    const fullPlayerHeight = this.player.height
    const whereCollidedNormalized =
      whereCollided.y < 1
        ? 1
        : whereCollided.y > fullPlayerHeight
          ? fullPlayerHeight
          : whereCollided.y

    const ratio = whereCollidedNormalized / fullPlayerHeight
    const middlePointRatio = 0.5 // mean the ball hits exactly on center of player
    const finalRatio = Math.abs(ratio - middlePointRatio) * 2

    if (playerType === PLAYER_TYPE.USER) {
      this.ball.reverseDirectionWith({ yPlayerHitRatio: finalRatio })
    }

    if (playerType === PLAYER_TYPE.MACHINE) {
      this.ball.reverseDirectionWith({ yPlayerHitRatio: finalRatio })
    }

    this.ball.incrementSpeed()
    this._onPlayerHitsBallCallbacks.forEach((callback) => {
      callback({ playerType })
    })
  }

  _onBallCollision() {
    const {
      collided: collidedWithPlayer,
      whereCollided: whereCollidedWithPlayer,
    } = this.player.hasCollidedWith({
      gameObject: this.ball,
    })

    if (collidedWithPlayer) {
      this._onPlayerHitsBall({
        playerType: PLAYER_TYPE.USER,
        whereCollided: whereCollidedWithPlayer,
      })
    }

    const {
      collided: collidedWithMachine,
      whereCollided: whereCollidedWithMachine,
    } = this.machine.hasCollidedWith({
      gameObject: this.ball,
    })
    if (collidedWithMachine) {
      this._onPlayerHitsBall({
        playerType: PLAYER_TYPE.MACHINE,
        whereCollided: whereCollidedWithMachine,
      })
    }

    const { collided: collidedWithPlayerWall } =
      this.playerScoreWall.hasCollidedWith({
        gameObject: this.ball,
      })

    if (collidedWithPlayerWall) {
      this._confirmScore({ playerType: PLAYER_TYPE.MACHINE })
    }

    const { collided: collidedWithMachineWall } =
      this.machineScoreWall.hasCollidedWith({
        gameObject: this.ball,
      })

    if (collidedWithMachineWall) {
      this._confirmScore({ playerType: PLAYER_TYPE.USER })
    }
  }

  _confirmScore({ playerType }) {
    this._relaunchBall()
    this._onScoreCallbacks.forEach((callback) => {
      callback({ playerType })
    })
  }

  _relaunchBall() {
    this.ball.reset()
  }

  _setupEvents() {
    this.player.onEvent({
      name: 'keydown',
      callback: ({ rawEvent }) => {
        if (rawEvent.code === 'ArrowUp') this.player.beginMove('up')
        if (rawEvent.code === 'ArrowDown') this.player.beginMove('down')
      },
    })

    this.player.onEvent({
      name: 'keyup',
      callback: ({ rawEvent }) => {
        if (rawEvent.code === 'ArrowUp') this.player.stopMove('up')
        if (rawEvent.code === 'ArrowDown') this.player.stopMove('down')
      },
    })
  }

  _setupMachinePlayerAI() {
    this.machineAI = new PongMachineAI({
      pongBall: this.ball,
      playerObject: this.machine,
    })
  }
}
