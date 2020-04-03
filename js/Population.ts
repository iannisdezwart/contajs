class Population {
  size: number
  ctxes: CanvasRenderingContext2D[]
  humans: Human[] = []
  // Counts
  infectedCount = 0
  deadCount = 0
  recoveredCount = 0
  cumulativeInfections = 0
  // Thresholds and ratios
  static healthCareThresholdRatio = 0.2
  healthCareThreshold: number
  static isolationThresholdRatio = 0.05
  // static isolationThresholdRatio = 2
  isolationThreshold: number
  isolationHasBeenEnabled = false
  isolationActive = false
  static socialDistancingThresholdRatio = 0.1
  // static socialDistancingThresholdRatio = 2
  socialDistancingThreshold: number
  socialDistancingRatio = 1
  socialDistancingHasBeenEnabled = false
  static lockdownThresholdRatio = 0.15
  // static lockdownThresholdRatio = 2
  lockdownThreshold: number
  lockdownHasBeenEnabled = false
  lockdownActive = false
  static shopCloseThresholdRatio = 0.3
  shopCloseThreshold: number
  shopHasBeenClosed = false
  shopClosed = false
  // Movement
  travelProbability = 0.001
  shopProbability = 0.001
  ticksToLeaveShop = 30
  ticksToIsolation = 5
  isolationProbability = 0.5
  falseDischargeProbability = 0.0005
  trueDischargeProbability = 0.05

  constructor(size: number, ctxes: CanvasRenderingContext2D[]) {
    this.size = size
    this.ctxes = ctxes

    this.infectedCount = 0
    this.deadCount = 0
    this.recoveredCount = 0
    this.cumulativeInfections = 0

    for (let ctx of ctxes) {
      ctx.humansOnMe = []
    }

    this.generateHumans()
    this.calculateThresholds()
  }

  generateHumans() {
    for (let i = 0; i < this.size; i++) {
      let ctx = this.ctxes[Math.floor(Math.random() * (this.ctxes.length))]
      let x = Math.random() * ctx.canvas.width
      let y = Math.random() * ctx.canvas.height

      this.humans[i] = new Human(new Vector(x, y), ctx, this)

      if (ctx.humansOnMe == undefined) {
        ctx.humansOnMe = []
      }

      ctx.humansOnMe.push(this.humans[i])
    }

    this.humans[0].infect()
  }

  distributeHumans() {
    for (let i = 0; i < this.size; i++) {
      let ctx = this.ctxes[Math.floor(Math.random() * (this.ctxes.length))]
      let x = Math.random() * ctx.canvas.width
      let y = Math.random() * ctx.canvas.height

      this.humans[i].ctx = ctx

      if (ctx.humansOnMe == undefined) {
        ctx.humansOnMe = []
      }

      ctx.humansOnMe.push(this.humans[i])
    }
  }

  render() {
    const start = Date.now()

    for (let i = 0; i < this.size; i++) {
      this.humans[i].render()
    }

    if (!this.isolationHasBeenEnabled) {
      if (this.cumulativeInfections >= this.isolationThreshold) {
        log('Enabled Isolation')
        let checkbox = $('#enable-isolation') as HTMLInputElement
        checkbox.checked = true
        this.enableIsolation()
      }
    }

    if (!this.socialDistancingHasBeenEnabled) {
      if (this.cumulativeInfections >= this.socialDistancingThreshold) {
        log('Enabled Social Distancing')
        let checkbox = $('#enable-social-distancing') as HTMLInputElement
        checkbox.checked = true
        this.enableSocialDistancing(this.socialDistancingRatio)
      }
    }

    if (!this.lockdownHasBeenEnabled) {
      if (this.cumulativeInfections >= this.lockdownThreshold) {
        log('Enabled Total Lockdown')
        let checkbox = $('#enable-lockdown') as HTMLInputElement
        checkbox.checked = true
        this.enableLockdown()
      }
    }

    if (!this.shopHasBeenClosed) {
      if (this.cumulativeInfections >= this.shopCloseThreshold) {
        log('Closed Shop')
        let checkbox = $('#close-shop') as HTMLInputElement
        checkbox.checked = true
        this.closeShop()
      }
    }

    return Date.now() - start
  }

  calculateThresholds () {
    this.healthCareThreshold = this.size * Population.healthCareThresholdRatio
    this.isolationThreshold = this.size * Population.isolationThresholdRatio
    this.socialDistancingThreshold = this.size * Population.socialDistancingThresholdRatio
    this.lockdownThreshold = this.size * Population.lockdownThresholdRatio
    this.shopCloseThreshold = this.size * Population.shopCloseThresholdRatio
  }

  enableSocialDistancing(ratio = 1) {
    this.socialDistancingHasBeenEnabled = true
    for (let i = 0; i < this.humans.length; i++) {
      if (Math.random() < ratio) {
        this.humans[i].socialDistancing = true
      } else {
        this.humans[i].socialDistancing = false
      }
    }
  }

  enableIsolation() {
    this.isolationHasBeenEnabled = true
    this.isolationActive = true
  }

  enableLockdown() {
    this.lockdownActive = true
    this.lockdownHasBeenEnabled = true
  }

  closeShop() {
    this.shopClosed = true
    this.shopHasBeenClosed = true
  }
}
