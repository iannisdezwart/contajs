/*

  Vector Class

*/

class Vector {
  values: number[]

  constructor(...values: number[]) {
    this.values = values
  }

  get dimension() {
    return this.values.length
  }

  add(vector2: Vector) {
    if (this.dimension != vector2.dimension) {
      throw new Error(`Can't add vectors with different dimensions.`)
    }

    let newValues = []
    for (let i = 0; i < this.values.length; i++) {
      newValues[i] = this.values[i] + vector2.values[i]
    }

    return new Vector(...newValues)
  }

  subtract(vector2: Vector) {
    if (this.dimension != vector2.dimension) {
      throw new Error(`Can't subtract vectors with different dimensions.`)
    }

    let newValues = []
    for (let i = 0; i < this.values.length; i++) {
      newValues[i] = this.values[i] - vector2.values[i]
    }

    return new Vector(...newValues)
  }

  multiply(multiplier: any) {
    if (multiplier.constructor.name == 'Number') {
      return this.multiplyWithScalar(multiplier)
    }
    if (multiplier.constructor.name == 'Vector') {
      return this.dotProduct(multiplier)
    }
    // if (multiplier.constructor.name == 'Matrix') {
    //   return this.multiplyWithMatrix(multiplier)
    // }
  }

  divide(scalar: number) {
    let newValues = []
    for (let i = 0; i < this.values.length; i++) {
      newValues[i] = this.values[i] / scalar
    }

    return new Vector(...newValues)
  }

  multiplyWithScalar(scalar: number) {
    let newValues = []
    for (let i = 0; i < this.values.length; i++) {
      newValues[i] = this.values[i] * scalar
    }

    return new Vector(...newValues)
  }

  dotProduct(vector2: Vector) {
    if (this.dimension != vector2.dimension) {
      throw new Error(`Can't calculate the dot product of Vectors with different dimensions.`)
    }

    let sum = 0
    for (let i = 0; i < this.values.length; i++) {
      sum += this.values[i] * vector2.values[i]
    }

    return sum
  }

  // multiplyWithMatrix(matrix: Matrix) {
  //   return matrix.multiplyWithVector(this)
  // }

  each(f: (n: number) => number) {
    let newValues = []
    for (let i = 0; i < this.values.length; i++) {
      newValues[i] = f(this.values[i])
    }

    return new Vector(...newValues)
  }

  distance(vector2: Vector) {
    if (this.dimension != vector2.dimension) {
      throw new Error(`Can't calculate the distance between Vectors with different dimensions.`)
    }

    let sum = 0
    for (let i = 0; i < this.values.length; i++) {
      sum += ( this.values[i] - vector2.values[i] ) ** 2
    }

    return Math.sqrt(sum)
  }

  get sum() {
    let sum = 0

    for (let i = 0; i < this.values.length; i++) {
      sum += this.values[i]
    }

    return sum
  }

  get angle() {
    if (this.dimension == 2) {
      return Math.atan(this.values[1] / this.values[0])
    } else {
      throw new Error(`Can't calculate angle of a ${this.dimension}-dimensional Vector.`)
    }
  }

  get magnitude() {
    return Math.hypot(...this.values)
  }

  set magnitude(newMagnitude) {
    let newVector = this.each(x => x / this.magnitude * newMagnitude)
    this.values = newVector.values
  }

  get x() {
    return this.values[0]
  }

  set x(newX) {
    this.values[0] = newX
  }

  get y() {
    return this.values[1]
  }

  set y(newY) {
    this.values[1] = newY
  }

  static fromAngle(angle: number) {
    return new Vector(Math.cos(angle), Math.sin(angle))
  }

  static createRandom(dimension: number) {
    let values = new Array(dimension)

    for (let i = 0; i < dimension; i++) {
      values[i] = Math.random() * 2 - 1
    }

    return new Vector(...values)
  }
}
