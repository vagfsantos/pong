import { BOARD_SETTINGS } from '@pong/constants/pong-consts'

export class PongMachineAI {
  askedMachineToMove = false

  constructor({ pongBall, playerObject }) {
    this.pongBall = pongBall
    this.playerObject = playerObject
  }

  move() {
    // ball is moving left
    if (this.pongBall.directionX < 0) {
      this.askedMachineToMove = false
      return
    }
    if (this.askedMachineToMove) return
    if (this.pongBall.x < BOARD_SETTINGS.WIDTH / 2) return // ball is not on the middle of screen

    const futurePointY = this.getWhereBallWillHitY()

    this.moveMachine({ yTarget: futurePointY })
  }

  moveMachine({ yTarget }) {
    this.playerObject.goTo({
      yTarget,
    })

    this.askedMachineToMove = true
  }

  getWhereBallWillHitY() {
    const amountBallMovePerFrame =
      this.pongBall.speed * this.pongBall.directionX
    const [ballPositionX, ballPositionY] = [this.pongBall.x, this.pongBall.y]

    const futurePointWallToCalculateImpact =
      BOARD_SETTINGS.WIDTH - BOARD_SETTINGS.PLAYER_GAP_FROM_WALL
    const distanceToFuturePointWall =
      futurePointWallToCalculateImpact - ballPositionX

    const framesNeededToMoveToFuturePoint =
      distanceToFuturePointWall / amountBallMovePerFrame
    const angleBallIsMoving = this.pongBall.directionY
    const whereIsTheFuturePointY =
      ballPositionY +
      angleBallIsMoving * this.pongBall.speed * framesNeededToMoveToFuturePoint

    let finalBallPredictedPositionY = whereIsTheFuturePointY

    if (whereIsTheFuturePointY > BOARD_SETTINGS.HEIGHT) {
      const diff = finalBallPredictedPositionY - BOARD_SETTINGS.HEIGHT
      finalBallPredictedPositionY = BOARD_SETTINGS.HEIGHT - diff
    }

    if (whereIsTheFuturePointY < 0) {
      finalBallPredictedPositionY *= -1
    }

    return finalBallPredictedPositionY
  }
}
