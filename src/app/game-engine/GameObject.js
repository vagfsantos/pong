export const GAME_OBJECT_TYPES = {
  STATIC: 'static',
  DYNAMIC: 'dynamic',
}

class GameObjectEvent {
  events = {
    mousemove: [],
    click: [],
    keyup: [],
    keydown: [],
  }

  onEvent({ name, callback }) {
    this.events[name].push(callback)
  }

  watchForEvents({ DOMElement = window }) {
    const allEvents = Object.keys(this.events)

    allEvents.forEach((eventName) => {
      DOMElement.addEventListener(eventName, (event) => {
        const rangeX = {
          start: this.x,
          end: this.x + this.width,
        }
        const rangeY = {
          start: this.y,
          end: this.y + this.height,
        }

        const isInsideXArea =
          event.offsetX >= rangeX.start && event.offsetX <= rangeX.end

        const isInsideYArea =
          event.offsetY >= rangeY.start && event.offsetY <= rangeY.end

        const isInsideGameObjectArea = isInsideXArea && isInsideYArea

        this.events[eventName].forEach((callback) => {
          callback({ isInsideGameObjectArea, rawEvent: event })
        })
      })
    })
  }
}

export class GameObject extends GameObjectEvent {
  name = null
  type = GAME_OBJECT_TYPES.DYNAMIC

  width = null
  height = null
  x = 0
  y = 0

  collision = {
    isCollinding: false,
  }

  _innerCollisionArea = null

  constructor({ name }) {
    super()
    if (typeof name !== 'string')
      throw new Error('Name is required to create a game object')

    this.name = name
  }

  setInnerColissionArea({ x, y, width, height }) {
    this._innerCollisionArea = { x, y, width, height }
  }

  getInnerCollisionArea() {
    if (!this._innerCollisionArea) {
      if (this.width != null && this.height != null) {
        return {
          x: this.x,
          y: this.y,
          width: this.width,
          height: this.height,
        }
      }

      return null
    }

    const x = this.x + this._innerCollisionArea.x
    const y = this.y + this._innerCollisionArea.y
    const width = this._innerCollisionArea.width
    const height = this._innerCollisionArea.height

    return {
      x,
      y,
      width,
      height,
    }
  }

  setCoordinates({ x, y }) {
    this.x = x || this.x
    this.y = y || this.y
  }

  setSizes({ width, height }) {
    this.width = width || this.width
    this.height = height || this.height
  }

  update() {
    if (this.type === 'dynamic')
      throw new Error(
        `Method update not implemented on: ${this.name}. If you want to create a static game object set type to "static" on your class`
      )
  }

  render() {
    throw new Error(`Method render not implemented on: ${this.name}`)
  }

  hasCollidedWith({ gameObject }) {
    if (
      gameObject.getInnerCollisionArea() == null ||
      this.getInnerCollisionArea() == null
    ) {
      throw new Error(
        `Game Object ${gameObject?.name == null ? gameObject.name : this?.name} has no innerColissionArea.`
      )
    }

    const thisObjCollisionArea = this.getInnerCollisionArea()
    const gameObjCollisionArea = gameObject.getInnerCollisionArea()

    const collidedOnX =
      thisObjCollisionArea.x + thisObjCollisionArea.width >=
        gameObjCollisionArea.x &&
      thisObjCollisionArea.x <=
        gameObjCollisionArea.x + gameObjCollisionArea.width

    const collidedOnY =
      thisObjCollisionArea.y <=
        gameObjCollisionArea.y + gameObjCollisionArea.height &&
      gameObjCollisionArea.y <=
        thisObjCollisionArea.y + thisObjCollisionArea.height

    const collisionDetected = collidedOnX && collidedOnY

    let collided = false

    if (collisionDetected && this.collision.isCollinding) {
      collided = false
    }

    if (!collisionDetected && this.collision.isCollinding) {
      collided = false
      this.collision.isCollinding = false
    }

    if (collisionDetected && !this.collision.isCollinding) {
      collided = true
      this.collision.isCollinding = true
    }

    return {
      collided,
      isCollinding: this.collision.isCollinding,
    }
  }
}

export class GameObjectText extends GameObject {
  type = GAME_OBJECT_TYPES.STATIC
}
