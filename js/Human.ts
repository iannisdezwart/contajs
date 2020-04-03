class Human {
  pos: Vector
  ctx: CanvasRenderingContext2D
  prevCtx: CanvasRenderingContext2D
  population: Population
  vel = new Vector(0, 0)
  acc = new Vector(0, 0)
  static maxVel = 5
  static radius = 3
  // Data
  infected = false
  dead = false
  recovered = false
  daysSick = 0
  // Spread
  static rangeOfSpread = 20
  // static spreadProbability = 1
  static spreadProbability = 0.05
  // Recovery and death
  recoveryProbability = 0.001
  static recoveryMultiplier = 1.005
  deathProbability = 0.0001
  static deathMultiplier = 1.005
  // Movement
  consideredIsolation = false
  isolated = false
  socialDistancing = false
  static socialDistancingRange = 30
  static socialDistancingMaxVel = 3
  shopping = false
  ticksInShop = 0

  constructor(pos: Vector, ctx: CanvasRenderingContext2D, population: Population) {
    this.pos = pos
    this.ctx = ctx
    this.population = population
  }

  setCtx(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.ctx.humansOnMe.length; i++) {
      if (this.ctx.humansOnMe[i] == this) {
        this.ctx.humansOnMe.splice(i, 1)
        break
      }
    }

    this.ctx = ctx

    if (this.ctx.humansOnMe == undefined) {
      this.ctx.humansOnMe = []
    }

    this.ctx.humansOnMe.push(this)
  }

  travel() {
    // Do not travel when in isolation
    if (this.ctx != isolationCtx) {
      // Do not travel when in lockdown
      if (!this.population.lockdownActive) {
        if (Math.random() < this.population.travelProbability) {
          let newCtx = this.population.ctxes[Math.floor(Math.random() * (this.population.ctxes.length))]

          // Only travel to other ctxes
          if (newCtx != this.ctx) {
            this.setCtx(newCtx)
          }
        }
      }
    }
  }

  visitShop() {
    // Do not go to shop when in isolation
    if (this.ctx != isolationCtx) {
      // Do not go to shop when shop is closed
      if (!this.population.shopClosed) {
        if (Math.random() < this.population.shopProbability) {
          this.prevCtx = this.ctx
          this.setCtx(shopCtx)
          this.shopping = true
        }
      }
    }
  }

  leaveShop() {
    this.setCtx(this.prevCtx)
    this.shopping = false
    this.ticksInShop = 0
  }

  move() {
    if (!this.dead) {
      // Generate acceleration
      this.acc = Vector.fromAngle(Math.random() * 2 * Math.PI)

      // Social Distancing
      if (this.socialDistancing) {
        for (let i = 0; i < this.ctx.humansOnMe.length; i++) {
          // Don't Social Distance on self
          if (this.ctx.humansOnMe[i] != this) {
            if (this.pos.distance(this.ctx.humansOnMe[i].pos) < Human.socialDistancingRange) {
              this.acc = this.acc.add(this.pos.subtract(this.ctx.humansOnMe[i].pos))
            }
          }
        }
      }

      // Cap acceleration magnitude
      if (this.acc.magnitude > 1) {
        this.acc.magnitude = 1
      }

      // Calculate new velocity
      this.vel = this.vel.add(this.acc)

      // Cap max velocity
      if (this.vel.magnitude > Human.maxVel) {
        this.vel.magnitude = Human.maxVel
      }

      if (this.socialDistancing) {
        if (this.vel.magnitude > Human.socialDistancingMaxVel) {
          this.vel.magnitude = Human.socialDistancingMaxVel
        }
      }

      // Calculate new position
      this.pos = this.pos.add(this.vel)

      // Map bound check
      if (this.pos.x > this.ctx.canvas.width) {
        this.pos.x = Human.radius
      }
      if (this.pos.x < 0) {
        this.pos.x = this.ctx.canvas.width - Human.radius
      }
      if (this.pos.y > this.ctx.canvas.height) {
        this.pos.y = Human.radius
      }
      if (this.pos.y < 0) {
        this.pos.y = this.ctx.canvas.height - Human.radius
      }
    }
  }

  draw() {
    if (!this.dead) {
      const { ctx } = this

      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, Human.radius, 0, 2 * Math.PI)
      if (this.infected) {
        ctx.fillStyle = '#c55'
      } else if (this.recovered) {
        ctx.fillStyle = '#5c5'
      } else {
        ctx.fillStyle = '#777'
      }
      ctx.fill()
      ctx.closePath()
    }
  }

  render() {
    this.travel()

    if (!this.shopping) {
      this.visitShop()
    } else {
      if (this.ticksInShop >= this.population.ticksToLeaveShop) {
        this.leaveShop()
      } else {
        this.ticksInShop++
      }
    }

    this.move()

    this.draw()

    if (this.infected) {
      this.spread()
      this.beSick()
    }

    if (this.isolated) {
      this.goOutOfIsolation()
    }
  }

  infect() {
    // Only infect susceptible humans
    if (!this.infected && !this.recovered && !this.dead) {
      this.infected = true
      this.population.infectedCount++
      this.population.cumulativeInfections++
    }
  }

  recover() {
    this.infected = false
    this.population.infectedCount--
    this.recovered = true
    this.population.recoveredCount++
  }

  kill() {
    this.infected = false
    this.population.infectedCount--
    this.dead = true
    this.population.deadCount++
  }

  beSick() {
    // Die or recover
    if (Math.random() < this.recoveryProbability) {
      this.recover()
    } else if (Math.random() < this.deathProbability) {
      this.kill()
    }

    // Set new death and recovery probabilities
    this.recoveryProbability *= Human.recoveryMultiplier
    this.deathProbability *= Human.deathMultiplier ** ((this.population.infectedCount > this.population.healthCareThreshold) ? 2 * (this.population.infectedCount / this.population.healthCareThreshold) : 1)

    // Move to isolation
    if (this.population.isolationActive) {
      if (!this.consideredIsolation) {
        if (this.daysSick >= this.population.ticksToIsolation) {
          if (Math.random() < this.population.isolationProbability) {
            if (!this.shopping) {
              this.prevCtx = this.ctx
            }
            this.setCtx(isolationCtx)
            this.isolated = true
          }
          this.consideredIsolation = true
        }
      }
    }

    // Move out of isolation
    if (this.isolated) {
      if (!this.recovered) {
        if (Math.random() < this.population.falseDischargeProbability) {
          this.setCtx(this.prevCtx)
          this.isolated = false
        }
      }
    }

    this.daysSick++
  }

  goOutOfIsolation() {
    if (this.isolated) {
      if (this.recovered) {
        if (Math.random() < this.population.trueDischargeProbability) {
          this.setCtx(this.prevCtx)
          this.isolated = false
        }
      }
    }
  }

  spread() {
    for (let i = 0; i < this.ctx.humansOnMe.length; i++) {
      // Cannot infect self
      if (this.ctx.humansOnMe[i] != this) {
        if (this.pos.distance(this.ctx.humansOnMe[i].pos) < Human.rangeOfSpread) {
          if (Math.random() < Human.spreadProbability) {
            this.ctx.humansOnMe[i].infect()
          }
        }
      }
    }
  }
}
