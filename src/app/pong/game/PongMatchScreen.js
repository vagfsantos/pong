import { BALL, BOARD_SETTINGS } from '@pong/constants/pong-consts'
import { PongBall } from '@pong/objects/PongBall'
import { PongPlayer } from '@pong/objects/PongPlayer'

export class PongMatchScreen {
  player = new PongPlayer({ name: 'player' })
  machine = new PongPlayer({ name: 'machine' })
  ball = new PongBall({ name: 'ball' })

  show() {
    this.__setupInitialObjectLocation()
    this._setupObjectCollisions()
    this._setupEvents()

    this.ball.onUpdate(() => {
      this._onBallCollision()
    })
  }

  getScreenGameObjects() {
    return [this.player, this.machine, this.ball]
  }

  __setupInitialObjectLocation() {
    const halfHeight = BOARD_SETTINGS.HEIGHT / 2 - this.player.height / 2
    this.player.setCoordinates({ x: 54, y: halfHeight })
    this.machine.setCoordinates({ x: BOARD_SETTINGS.WIDTH - 54, y: halfHeight })
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

  // TODO: Fix a bug when collision is detected more then once in a frame check
  // The ball changes its direction more than one time
  _onBallCollision() {
    const { colidded: collidedWithPlayer } = this.player.hasCollidedWith({
      gameObject: this.ball,
    })
    if (collidedWithPlayer) {
      this.ball.reverseDirectionX({ yHitNumber: 1 })
    }

    const { colidded: collidedWithMachine } = this.machine.hasCollidedWith({
      gameObject: this.ball,
    })
    if (collidedWithMachine) {
      this.ball.reverseDirectionX({ yHitNumber: 1 })
    }
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
