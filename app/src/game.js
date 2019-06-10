import {
  start,
  size,
  canvasWith,
  image,
  at,
  eachFrame,
  paint,
  gameObject
} from 'play2d'
import playerImg from '../img/player.png'

window.addEventListener('DOMContentLoaded', () => {
  canvasWith(800, 600)

  const player = gameObject(image(playerImg), at(0, 0), size(15, 80))
  eachFrame(() => paint(player()))

  start()
})
