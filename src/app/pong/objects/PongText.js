import { GAME_OBJECT_TYPES, GameObject } from '@game-engine/GameObject'
import { FONTS } from '@pong/constants/pong-consts'

export class PongText extends GameObject {
  type = GAME_OBJECT_TYPES.STATIC

  constructor({
    text,
    fontSize,
    fontColor,
    textBaseline = 'top',
    textAlign = 'left',
    ...params
  }) {
    super(params)

    this.text = text
    this.fontSize = fontSize
    this.fontColor = fontColor
    this.textBaseline = textBaseline
    this.textAlign = textAlign
  }

  setText(text) {
    this.text = text
  }

  render({ gameCanvas }) {
    const ctx = gameCanvas.getCanvasContext()

    ctx.fillStyle = this.fontColor
    ctx.font = `${this.fontSize}px ${FONTS.PRIMARY}`
    ctx.textBaseline = this.textBaseline
    ctx.textAlign = this.textAlign
    ctx.fillText(this.text, this.x, this.y)
    ctx.fill()
  }
}
