import { GAME_OBJECT_TYPES, GameObject } from '@game-engine/GameObject'
import { BALL, BOARD_SETTINGS, COLORS } from '@pong/constants/pong-consts'

const getXDirection = () => {
  return -1
}
const getYDirection = () => {
  return Math.random()
}

export class PongBall extends GameObject {
  type = GAME_OBJECT_TYPES.DYNAMIC

  x = BOARD_SETTINGS.WIDTH / 2 - BALL.RADIUS
  y = BOARD_SETTINGS.HEIGHT / 2 - BALL.RADIUS
  speed = 4
  directionY = getYDirection()
  directionX = getXDirection()

  _onUpdateCallbacks = []

  _reverseDirectionWhenHitWall() {
    const hasHitGround = this.y >= BOARD_SETTINGS.HEIGHT
    const hasHitCelling = this.y <= 0

    if (hasHitGround || hasHitCelling) {
      this.directionY *= -1
    }
  }

  _runOnUpdateCallbacks() {
    this._onUpdateCallbacks.forEach((callaback) => callaback())
  }

  onUpdate(callback) {
    this._onUpdateCallbacks.push(callback)
  }

  // yHitNumber: A number between 0 and 1
  reverseDirectionX({ yHitNumber }) {
    this.directionX = this.directionX * -1
  }

  reset() {
    this.x = BOARD_SETTINGS.WIDTH / 2 - BALL.RADIUS
    this.y = BOARD_SETTINGS.HEIGHT / 2 - BALL.RADIUS
    this.directionY = getYDirection()
    this.directionX = getXDirection()
  }

  update() {
    this.y = this.y + this.speed * this.directionY
    this.x = this.x + this.speed * this.directionX
    this._reverseDirectionWhenHitWall()
    this._runOnUpdateCallbacks()
  }

  render({ gameCanvas }) {
    const ctx = gameCanvas.getCanvasContext()

    ctx.fillStyle = COLORS.LIGHT
    ctx.beginPath()
    ctx.arc(this.x, this.y, BALL.RADIUS, 0, 2 * Math.PI)
    ctx.fill()
  }
}
