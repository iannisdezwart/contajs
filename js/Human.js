var Human = /** @class */ (function () {
    function Human(pos, ctx, population) {
        this.vel = new Vector(0, 0);
        this.acc = new Vector(0, 0);
        // Data
        this.infected = false;
        this.dead = false;
        this.recovered = false;
        this.daysSick = 0;
        // Recovery and death
        this.recoveryProbability = 0.001;
        this.deathProbability = 0.0001;
        // Movement
        this.consideredIsolation = false;
        this.isolated = false;
        this.socialDistancing = false;
        this.shopping = false;
        this.ticksInShop = 0;
        this.pos = pos;
        this.ctx = ctx;
        this.population = population;
    }
    Human.prototype.setCtx = function (ctx) {
        for (var i = 0; i < this.ctx.humansOnMe.length; i++) {
            if (this.ctx.humansOnMe[i] == this) {
                this.ctx.humansOnMe.splice(i, 1);
                break;
            }
        }
        this.ctx = ctx;
        if (this.ctx.humansOnMe == undefined) {
            this.ctx.humansOnMe = [];
        }
        this.ctx.humansOnMe.push(this);
    };
    Human.prototype.travel = function () {
        // Do not travel when in isolation
        if (this.ctx != isolationCtx) {
            // Do not travel when in lockdown
            if (!this.population.lockdownActive) {
                if (Math.random() < this.population.travelProbability) {
                    var newCtx = this.population.ctxes[Math.floor(Math.random() * (this.population.ctxes.length))];
                    // Only travel to other ctxes
                    if (newCtx != this.ctx) {
                        this.setCtx(newCtx);
                    }
                }
            }
        }
    };
    Human.prototype.visitShop = function () {
        // Do not go to shop when in isolation
        if (this.ctx != isolationCtx) {
            // Do not go to shop when shop is closed
            if (!this.population.shopClosed) {
                if (Math.random() < this.population.shopProbability) {
                    this.prevCtx = this.ctx;
                    this.setCtx(shopCtx);
                    this.shopping = true;
                }
            }
        }
    };
    Human.prototype.leaveShop = function () {
        this.setCtx(this.prevCtx);
        this.shopping = false;
        this.ticksInShop = 0;
    };
    Human.prototype.move = function () {
        if (!this.dead) {
            // Generate acceleration
            this.acc = Vector.fromAngle(Math.random() * 2 * Math.PI);
            // Social Distancing
            if (this.socialDistancing) {
                for (var i = 0; i < this.ctx.humansOnMe.length; i++) {
                    // Don't Social Distance on self
                    if (this.ctx.humansOnMe[i] != this) {
                        if (this.pos.distance(this.ctx.humansOnMe[i].pos) < Human.socialDistancingRange) {
                            this.acc = this.acc.add(this.pos.subtract(this.ctx.humansOnMe[i].pos));
                        }
                    }
                }
            }
            // Cap acceleration magnitude
            if (this.acc.magnitude > 1) {
                this.acc.magnitude = 1;
            }
            // Calculate new velocity
            this.vel = this.vel.add(this.acc);
            // Cap max velocity
            if (this.vel.magnitude > Human.maxVel) {
                this.vel.magnitude = Human.maxVel;
            }
            if (this.socialDistancing) {
                if (this.vel.magnitude > Human.socialDistancingMaxVel) {
                    this.vel.magnitude = Human.socialDistancingMaxVel;
                }
            }
            // Calculate new position
            this.pos = this.pos.add(this.vel);
            // Map bound check
            if (this.pos.x > this.ctx.canvas.width) {
                this.pos.x = Human.radius;
            }
            if (this.pos.x < 0) {
                this.pos.x = this.ctx.canvas.width - Human.radius;
            }
            if (this.pos.y > this.ctx.canvas.height) {
                this.pos.y = Human.radius;
            }
            if (this.pos.y < 0) {
                this.pos.y = this.ctx.canvas.height - Human.radius;
            }
        }
    };
    Human.prototype.draw = function () {
        if (!this.dead) {
            var ctx = this.ctx;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, Human.radius, 0, 2 * Math.PI);
            if (this.infected) {
                ctx.fillStyle = '#c55';
            }
            else if (this.recovered) {
                ctx.fillStyle = '#5c5';
            }
            else {
                ctx.fillStyle = '#777';
            }
            ctx.fill();
            ctx.closePath();
        }
    };
    Human.prototype.render = function () {
        this.travel();
        if (!this.shopping) {
            this.visitShop();
        }
        else {
            if (this.ticksInShop >= this.population.ticksToLeaveShop) {
                this.leaveShop();
            }
            else {
                this.ticksInShop++;
            }
        }
        this.move();
        this.draw();
        if (this.infected) {
            this.spread();
            this.beSick();
        }
        if (this.isolated) {
            this.goOutOfIsolation();
        }
    };
    Human.prototype.infect = function () {
        // Only infect susceptible humans
        if (!this.infected && !this.recovered && !this.dead) {
            this.infected = true;
            this.population.infectedCount++;
            this.population.cumulativeInfections++;
        }
    };
    Human.prototype.recover = function () {
        this.infected = false;
        this.population.infectedCount--;
        this.recovered = true;
        this.population.recoveredCount++;
    };
    Human.prototype.kill = function () {
        this.infected = false;
        this.population.infectedCount--;
        this.dead = true;
        this.population.deadCount++;
    };
    Human.prototype.beSick = function () {
        // Die or recover
        if (Math.random() < this.recoveryProbability) {
            this.recover();
        }
        else if (Math.random() < this.deathProbability) {
            this.kill();
        }
        // Set new death and recovery probabilities
        this.recoveryProbability *= Human.recoveryMultiplier;
        this.deathProbability *= Math.pow(Human.deathMultiplier, ((this.population.infectedCount > this.population.healthCareThreshold) ? 2 * (this.population.infectedCount / this.population.healthCareThreshold) : 1));
        // Move to isolation
        if (this.population.isolationActive) {
            if (!this.consideredIsolation) {
                if (this.daysSick >= this.population.ticksToIsolation) {
                    if (Math.random() < this.population.isolationProbability) {
                        if (!this.shopping) {
                            this.prevCtx = this.ctx;
                        }
                        this.setCtx(isolationCtx);
                        this.isolated = true;
                    }
                    this.consideredIsolation = true;
                }
            }
        }
        // Move out of isolation
        if (this.isolated) {
            if (!this.recovered) {
                if (Math.random() < this.population.falseDischargeProbability) {
                    this.setCtx(this.prevCtx);
                    this.isolated = false;
                }
            }
        }
        this.daysSick++;
    };
    Human.prototype.goOutOfIsolation = function () {
        if (this.isolated) {
            if (this.recovered) {
                if (Math.random() < this.population.trueDischargeProbability) {
                    this.setCtx(this.prevCtx);
                    this.isolated = false;
                }
            }
        }
    };
    Human.prototype.spread = function () {
        for (var i = 0; i < this.ctx.humansOnMe.length; i++) {
            // Cannot infect self
            if (this.ctx.humansOnMe[i] != this) {
                if (this.pos.distance(this.ctx.humansOnMe[i].pos) < Human.rangeOfSpread) {
                    if (Math.random() < Human.spreadProbability) {
                        this.ctx.humansOnMe[i].infect();
                    }
                }
            }
        }
    };
    Human.maxVel = 5;
    Human.radius = 3;
    // Spread
    Human.rangeOfSpread = 20;
    // static spreadProbability = 1
    Human.spreadProbability = 0.05;
    Human.recoveryMultiplier = 1.005;
    Human.deathMultiplier = 1.005;
    Human.socialDistancingRange = 30;
    Human.socialDistancingMaxVel = 3;
    return Human;
}());
