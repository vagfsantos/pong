import { BALL, BOARD_SETTINGS, COLORS } from '@pong/constants/pong-consts'
import { PongBall } from '@pong/objects/PongBall'
import { PongPlayer } from '@pong/objects/PongPlayer'
import { PongScoreWall } from '@pong/objects/PongScoreWall'
import { PongText } from '@pong/objects/PongText'

export class PongMatchScreen {
  player = new PongPlayer({ name: 'player' })
  machine = new PongPlayer({ name: 'machine' })
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

  _onScoreCallbacks = []

  show() {
    this.__setupInitialObjectLocation()
    this._setupObjectCollisions()
    this._setupEvents()

    this.ball.onUpdate(() => {
      this._onBallCollision()
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

  updateScore({ player, machine }) {
    this.score.setText(`${player}x${machine}`)
  }

  onScore(callback) {
    this._onScoreCallbacks.push(callback)
  }

  __setupInitialObjectLocation() {
    const halfHeight = BOARD_SETTINGS.HEIGHT / 2 - this.player.height / 2
    this.player.setCoordinates({ x: 54, y: halfHeight })
    this.machine.setCoordinates({ x: BOARD_SETTINGS.WIDTH - 54, y: halfHeight })

    this.score.setCoordinates({
      x: BOARD_SETTINGS.WIDTH / 2,
      y: BOARD_SETTINGS.HEIGHT / 2,
    })

    this.playerScoreWall.setCoordinates({ y: 0, x: 0 })
    this.machineScoreWall.setCoordinates({
      y: 0,
      x: BOARD_SETTINGS.WIDTH - this.machineScoreWall.width,
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

  _onBallCollision() {
    const { collided: collidedWithPlayer } = this.player.hasCollidedWith({
      gameObject: this.ball,
    })
    if (collidedWithPlayer) {
      this.ball.reverseDirectionX({ yHitNumber: 1 })
    }

    const { collided: collidedWithMachine } = this.machine.hasCollidedWith({
      gameObject: this.ball,
    })
    if (collidedWithMachine) {
      this.ball.reverseDirectionX({ yHitNumber: 1 })
    }

    const { collided: collidedWithPlayerWall } =
      this.playerScoreWall.hasCollidedWith({
        gameObject: this.ball,
      })

    if (collidedWithPlayerWall) {
      this._alertScore({ scoreOwner: 'machine' })
    }

    const { collided: collidedWithMchineWall } =
      this.machineScoreWall.hasCollidedWith({
        gameObject: this.ball,
      })

    if (collidedWithMchineWall) {
      this._alertScore({ scoreOwner: 'player' })
    }
  }

  _alertScore({ scoreOwner }) {
    this._onScoreCallbacks.forEach((callback) => {
      callback({ scoreOwner })
    })
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
}
