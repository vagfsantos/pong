export class GameRenderEngine {
  gameObjectsList = []

  addGameObject({ gameObject }) {
    const isGameObjectAlreadyAdded = this.gameObjectsList.find(
      ({ name }) => name === gameObject.name
    )

    if (isGameObjectAlreadyAdded) {
      throw new Error(
        `Game object with name: ${gameObject.name} is} already added`
      )
    }

    this.gameObjectsList.push(gameObject)
  }

  removeGameObject({ gameObject }) {
    this.gameObjectsList = this.gameObjectsList.filter(
      ({ name }) => name !== gameObject.name
    )
  }

  clean({ gameCanvas }) {
    gameCanvas
      .getCanvasContext()
      .clearRect(
        0,
        0,
        gameCanvas.getCanvas().width,
        gameCanvas.getCanvas().height
      )
  }

  update({ gameCanvas }) {
    this.gameObjectsList.forEach((gameObject) => {
      gameObject.update({ gameCanvas })
    })
  }

  render({ gameCanvas }) {
    this.clean({ gameCanvas })
    this.update({ gameCanvas })

    this.gameObjectsList.forEach((gameObject) => {
      gameObject.render({ gameCanvas })
    })

    window.requestAnimationFrame(() => {
      this.render({
        gameCanvas,
      })
    })
  }
}
