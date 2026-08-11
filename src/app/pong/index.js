import { PongController } from '@pong/game/PongController'

const pongController = new PongController()

document.addEventListener('DOMContentLoaded', () => {
  pongController.init()
})
