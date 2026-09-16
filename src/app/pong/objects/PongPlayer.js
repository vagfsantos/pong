import { GAME_OBJECT_TYPES, GameObject } from '@game-engine/GameObject'
import { BOARD_SETTINGS, COLORS } from '@pong/constants/pong-consts'

export class PongPlayer extends GameObject {
  type = GAME_OBJECT_TYPES.DYNAMIC

  width = 15
  height = 80

  moveSpeed = 8
  moveDirection = 0
  isMoving = false

  _autoMoveTargetY = null

  beginMove(direction) {
    if (direction === 'up') this.moveDirection = -1
    else this.moveDirection = 1

    this.isMoving = true
  }

  stopMove() {
    this.moveDirection = 0
    this.isMoving = false
  }

  moveUp() {
    const canMoveUp = this.y - this.moveSpeed >= 0
    if (canMoveUp) this.y -= this.moveSpeed
  }

  moveDown() {
    const canMoveDown =
      this.y + this.moveSpeed + this.height <= BOARD_SETTINGS.HEIGHT
    if (canMoveDown) this.y += this.moveSpeed
  }

  goTo({ yTarget }) {
    this._autoMoveTargetY = yTarget

    if (yTarget > this.y) {
      this.beginMove('down')
    }

    if (yTarget < this.y) {
      this.beginMove('up')
    }
  }

  isBetweenYTarget() {
    if (this._autoMoveTargetY === null) return false

    const rangeSize = this.height
    const middlePoint = this.y + rangeSize / 2
    const rangeMin = this._autoMoveTargetY - rangeSize / 4
    const rangeMax = this._autoMoveTargetY + rangeSize / 4

    return middlePoint > rangeMin && middlePoint < rangeMax
  }

  update() {
    if (this.isMoving) {
      if (this.moveDirection === 1) this.moveDown()
      if (this.moveDirection === -1) this.moveUp()

      if (this.isBetweenYTarget()) {
        this.stopMove()
        this._autoMoveTargetY = null
      }
    }
  }

  render({ gameCanvas }) {
    const ctx = gameCanvas.getCanvasContext()

    ctx.fillStyle = COLORS.HIGHLIGHT
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}
