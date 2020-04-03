var Population = /** @class */ (function () {
    function Population(size, ctxes) {
        this.humans = [];
        // Counts
        this.infectedCount = 0;
        this.deadCount = 0;
        this.recoveredCount = 0;
        this.cumulativeInfections = 0;
        this.isolationHasBeenEnabled = false;
        this.isolationActive = false;
        this.socialDistancingRatio = 1;
        this.socialDistancingHasBeenEnabled = false;
        this.lockdownHasBeenEnabled = false;
        this.lockdownActive = false;
        this.shopHasBeenClosed = false;
        this.shopClosed = false;
        // Movement
        this.travelProbability = 0.001;
        this.shopProbability = 0.001;
        this.ticksToLeaveShop = 30;
        this.ticksToIsolation = 5;
        this.isolationProbability = 0.5;
        this.falseDischargeProbability = 0.0005;
        this.trueDischargeProbability = 0.05;
        this.size = size;
        this.ctxes = ctxes;
        this.infectedCount = 0;
        this.deadCount = 0;
        this.recoveredCount = 0;
        this.cumulativeInfections = 0;
        for (var _i = 0, ctxes_1 = ctxes; _i < ctxes_1.length; _i++) {
            var ctx = ctxes_1[_i];
            ctx.humansOnMe = [];
        }
        this.generateHumans();
        this.calculateThresholds();
    }
    Population.prototype.generateHumans = function () {
        for (var i = 0; i < this.size; i++) {
            var ctx = this.ctxes[Math.floor(Math.random() * (this.ctxes.length))];
            var x = Math.random() * ctx.canvas.width;
            var y = Math.random() * ctx.canvas.height;
            this.humans[i] = new Human(new Vector(x, y), ctx, this);
            if (ctx.humansOnMe == undefined) {
                ctx.humansOnMe = [];
            }
            ctx.humansOnMe.push(this.humans[i]);
        }
        this.humans[0].infect();
    };
    Population.prototype.distributeHumans = function () {
        for (var i = 0; i < this.size; i++) {
            var ctx = this.ctxes[Math.floor(Math.random() * (this.ctxes.length))];
            var x = Math.random() * ctx.canvas.width;
            var y = Math.random() * ctx.canvas.height;
            this.humans[i].ctx = ctx;
            if (ctx.humansOnMe == undefined) {
                ctx.humansOnMe = [];
            }
            ctx.humansOnMe.push(this.humans[i]);
        }
    };
    Population.prototype.render = function () {
        var start = Date.now();
        for (var i = 0; i < this.size; i++) {
            this.humans[i].render();
        }
        if (!this.isolationHasBeenEnabled) {
            if (this.cumulativeInfections >= this.isolationThreshold) {
                log('Enabled Isolation');
                var checkbox = $('#enable-isolation');
                checkbox.checked = true;
                this.enableIsolation();
            }
        }
        if (!this.socialDistancingHasBeenEnabled) {
            if (this.cumulativeInfections >= this.socialDistancingThreshold) {
                log('Enabled Social Distancing');
                var checkbox = $('#enable-social-distancing');
                checkbox.checked = true;
                this.enableSocialDistancing(this.socialDistancingRatio);
            }
        }
        if (!this.lockdownHasBeenEnabled) {
            if (this.cumulativeInfections >= this.lockdownThreshold) {
                log('Enabled Total Lockdown');
                var checkbox = $('#enable-lockdown');
                checkbox.checked = true;
                this.enableLockdown();
            }
        }
        if (!this.shopHasBeenClosed) {
            if (this.cumulativeInfections >= this.shopCloseThreshold) {
                log('Closed Shop');
                var checkbox = $('#close-shop');
                checkbox.checked = true;
                this.closeShop();
            }
        }
        return Date.now() - start;
    };
    Population.prototype.calculateThresholds = function () {
        this.healthCareThreshold = this.size * Population.healthCareThresholdRatio;
        this.isolationThreshold = this.size * Population.isolationThresholdRatio;
        this.socialDistancingThreshold = this.size * Population.socialDistancingThresholdRatio;
        this.lockdownThreshold = this.size * Population.lockdownThresholdRatio;
        this.shopCloseThreshold = this.size * Population.shopCloseThresholdRatio;
    };
    Population.prototype.enableSocialDistancing = function (ratio) {
        if (ratio === void 0) { ratio = 1; }
        this.socialDistancingHasBeenEnabled = true;
        for (var i = 0; i < this.humans.length; i++) {
            if (Math.random() < ratio) {
                this.humans[i].socialDistancing = true;
            }
            else {
                this.humans[i].socialDistancing = false;
            }
        }
    };
    Population.prototype.enableIsolation = function () {
        this.isolationHasBeenEnabled = true;
        this.isolationActive = true;
    };
    Population.prototype.enableLockdown = function () {
        this.lockdownActive = true;
        this.lockdownHasBeenEnabled = true;
    };
    Population.prototype.closeShop = function () {
        this.shopClosed = true;
        this.shopHasBeenClosed = true;
    };
    // Thresholds and ratios
    Population.healthCareThresholdRatio = 0.2;
    Population.isolationThresholdRatio = 0.05;
    Population.socialDistancingThresholdRatio = 0.1;
    Population.lockdownThresholdRatio = 0.15;
    Population.shopCloseThresholdRatio = 0.3;
    return Population;
}());
