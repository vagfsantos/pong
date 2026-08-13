import { BOARD_SETTINGS } from '@pong/constants/pong-consts'
import { PongPlayer } from '@pong/objects/PongPlayer'

export class PongMatchScreen {
  player = new PongPlayer({ name: 'player' })
  machine = new PongPlayer({ name: 'machine' })

  show() {
    const halfHeight = BOARD_SETTINGS.HEIGHT / 2 - this.player.height / 2
    this.player.setCoordinates({ x: 54, y: halfHeight })
    this.machine.setCoordinates({ x: BOARD_SETTINGS.WIDTH - 54, y: halfHeight })

    this._setupEvents()
  }

  getScreenGameObjects() {
    return [this.player, this.machine]
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
