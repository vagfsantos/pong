import { COLORS } from '@pong/constants/pong-consts'
import { PongText } from '@pong/objects/PongText'

export class PongStartScreen {
  title = new PongText({
    name: 'game-title',
    text: 'PONG',
    fontSize: 144,
    fontColor: COLORS.HIGHLIGHT,
  })

  startBtn = new PongText({
    name: 'game-start-button',
    text: 'start',
    fontSize: 36,
    fontColor: COLORS.LIGHT,
  })

  _onStart = () => {}

  onClickStart(callback) {
    this._onStart = callback
  }

  show({ gameCanvas }) {
    const titleMarginLeft = 165
    const titleMarginTop = 194

    const startBtnMarginTop = 325
    const startBtnMarginLeft = 330

    this.title.setCoordinates({ x: titleMarginLeft, y: titleMarginTop })

    this.startBtn.setCoordinates({
      x: startBtnMarginLeft,
      y: startBtnMarginTop,
    })
    this.startBtn.setSizes({ width: 150, height: 30 })

    this._setupEvents()
    this.startBtn.watchForEvents({ DOMElement: gameCanvas })
  }

  clean() {
    throw Error('WIP')
  }

  getScreenGameObjects() {
    return [this.title, this.startBtn]
  }

  _setupEvents() {
    this.startBtn.onEvent({
      name: 'mousemove',
      callback: ({ isInsideGameObjectArea }) => {
        if (isInsideGameObjectArea) {
          this.startBtn.fontColor = COLORS.HIGHLIGHT
        } else {
          this.startBtn.fontColor = COLORS.LIGHT
        }
      },
    })

    this.startBtn.onEvent({
      name: 'click',
      callback: ({ isInsideGameObjectArea }) => {
        if (isInsideGameObjectArea) {
          this._onStart()
        }
      },
    })
  }
}
