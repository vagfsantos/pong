import { GAME_OBJECT_TYPES, GameObject } from '@game-engine/GameObject'
import { BOARD_SETTINGS, COLORS } from '@pong/constants/pong-consts'

export class PongScoreWall extends GameObject {
  type = GAME_OBJECT_TYPES.STATIC

  width = 10
  height = BOARD_SETTINGS.HEIGHT

  render({ gameCanvas }) {
    // const ctx = gameCanvas.getCanvasContext()
    // ctx.fillStyle = COLORS.HIGHLIGHT
    // ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}
