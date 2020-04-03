var $ = function (query) { return document.querySelector(query); };
var $all = function (query) { return Array.prototype.slice.call(document.querySelectorAll(query)); };
// Load all canvasses and ctxes
var canvasses = $all('.ctx');
var ctxes = [];
var getCtxes = function () {
    var canvasses = $all('.ctx');
    return canvasses.map(function (canvasEl) { return canvasEl.getContext('2d'); });
};
var isolation = $('.isolation');
var isolationCtx = isolation.getContext('2d');
var shop = $('.shop');
var shopCtx = shop.getContext('2d');
for (var i = 0; i < canvasses.length; i++) {
    ctxes[i] = canvasses[i].getContext('2d');
}
// Create Population
var population = new Population(1500, ctxes);
// Create Graph
var cumulativeInfectionsData = {
    x: [],
    y: [],
    name: 'Cumulative Infections',
    type: 'scatter',
    mode: 'lines',
    line: {
        color: '#cc5',
        width: 3
    }
};
var infectedData = {
    x: [],
    y: [],
    name: 'Infected',
    type: 'scatter',
    mode: 'lines',
    line: {
        color: '#c55',
        width: 3
    }
};
var notInfectedData = {
    x: [],
    y: [],
    name: 'Not Infected',
    type: 'scatter',
    mode: 'lines',
    line: {
        color: '#55c',
        width: 3
    }
};
var recoveredData = {
    x: [],
    y: [],
    name: 'Recovered',
    type: 'scatter',
    mode: 'lines',
    line: {
        color: '#5c5',
        width: 3
    }
};
var deadData = {
    x: [],
    y: [],
    name: 'Dead',
    type: 'scatter',
    mode: 'lines',
    line: {
        color: '#ccc',
        width: 3
    }
};
var maxHealthCare = {
    x: [],
    y: [],
    name: 'Healthcare Threshold',
    type: 'scatter',
    mode: 'lines',
    line: {
        color: '#c5c',
        width: 1
    }
};
var isMobile = (function (a) { return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))); })(navigator.userAgent || navigator.vendor || window.opera);
var graphlayout = {
    title: {
        text: 'Data',
        font: {
            color: '#fff',
            family: 'Montserrat',
            size: 32
        }
    },
    xaxis: {
        title: {
            text: 'Ticks'
        },
        fixedrange: isMobile ? true : false,
        color: '#fff'
    },
    yaxis: {
        title: {
            text: ''
        },
        fixedrange: isMobile ? true : false,
        color: '#fff',
    },
    plot_bgcolor: '#333',
    paper_bgcolor: '#333',
    dragmode: isMobile ? false : 'zoom',
    hovermode: isMobile ? 'closest' : 'x',
    margin: {
        l: 40,
        r: 40,
        t: 80,
        b: 80
    },
    legend: {
        font: {
            color: '#fff'
        }
    }
};
var graphOptions = {
    responsive: true
};
var log = function (text) {
    var el = document.createElement('p');
    el.innerText = "tick " + tick + " >> " + text;
    $('#console').appendChild(el);
};
Plotly.newPlot('graph', [
    cumulativeInfectionsData,
    infectedData,
    notInfectedData,
    recoveredData,
    deadData,
    maxHealthCare
], graphlayout, graphOptions);
var tick = 0;
var rendering = false;
var paused = false;
var startRendering = function () {
    if (!rendering) {
        paused = false;
        rendering = true;
        renderFrame();
    }
};
var pause = function () {
    paused = true;
    rendering = false;
};
var reset = function () {
    tick = 0;
    paused = true;
    rendering = false;
    population.constructor(population.size, getCtxes()); // Ew a semicolon
    ([
        cumulativeInfectionsData,
        infectedData,
        notInfectedData,
        recoveredData,
        deadData,
        maxHealthCare
    ]).forEach(function (data) {
        data.x = [];
        data.y = [];
    });
};
var renderFrame = function () {
    // Clear canvasses
    $all('canvas').map(function (canvasEl) { return canvasEl.getContext('2d'); }).forEach(function (ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    });
    // Render Population
    console.log("Rendering population took: " + population.render() + "ms");
    // Update data
    cumulativeInfectionsData.x[tick] = tick;
    cumulativeInfectionsData.y[tick] = population.cumulativeInfections;
    infectedData.x[tick] = tick;
    infectedData.y[tick] = population.infectedCount;
    notInfectedData.x[tick] = tick;
    notInfectedData.y[tick] = population.size - population.infectedCount;
    recoveredData.x[tick] = tick;
    recoveredData.y[tick] = population.recoveredCount;
    deadData.x[tick] = tick;
    deadData.y[tick] = population.deadCount;
    maxHealthCare.x[tick] = tick;
    maxHealthCare.y[tick] = population.healthCareThreshold;
    // Update graph (takes about 20ms)
    Plotly.redraw('graph');
    // Stop if no humans are infected
    if (population.infectedCount == 0) {
        log('Virus Eradicated');
    }
    else if (paused != true) {
        setTimeout(function () {
            renderFrame();
        }, 0);
    }
    tick++;
};
var changePopulationSize = function (el) {
    var value = parseFloat(el.value);
    population.constructor(value, getCtxes());
};
var changeNumberOfCommunities = function (el) {
    var value = parseFloat(el.value);
    $all('.ctx').forEach(function (ctx) {
        ctx.remove();
    });
    for (var i = value; i > 0; i--) {
        var ctx = document.createElement('canvas');
        ctx.classList.add('ctx');
        ctx.width = 400;
        ctx.height = 400;
        $('.canvasses').prepend(ctx);
    }
    population.constructor(population.size, getCtxes());
};
var changeSpreadRange = function (el) {
    var value = parseFloat(el.value);
    Human.rangeOfSpread = value;
};
var changeSpreadProbability = function (el) {
    var value = parseFloat(el.value);
    Human.spreadProbability = value;
};
var changeSocialDistancingRange = function (el) {
    var value = parseFloat(el.value);
    Human.socialDistancingRange = value;
};
var changeSocialDistancingRatio = function (el) {
    var value = parseFloat(el.value);
    population.socialDistancingRatio = value;
    if (population.socialDistancingHasBeenEnabled) {
        population.enableSocialDistancing(population.socialDistancingRatio);
    }
};
var changeTravelProbability = function (el) {
    var value = parseFloat(el.value);
    population.travelProbability = value;
};
var changeShopProbability = function (el) {
    var value = parseFloat(el.value);
    population.shopProbability = value;
};
var changeIsolationProbability = function (el) {
    var value = parseFloat(el.value);
    population.isolationProbability = value;
};
var enableIsolation = function (enable) {
    population.isolationActive = enable;
};
var enableSocialDistancing = function (enable) {
    if (enable) {
        population.enableSocialDistancing(population.socialDistancingRatio);
    }
    else {
        population.enableSocialDistancing(0);
    }
};
var enableLockdown = function (enable) {
    population.lockdownActive = enable;
};
var closeShop = function (enable) {
    population.shopClosed = enable;
};
var changeIsolationThresholdRatio = function (el) {
    var value = parseFloat(el.value);
    Population.isolationThresholdRatio = value;
    population.calculateThresholds();
};
var changeSocialDistancingThresholdRatio = function (el) {
    var value = parseFloat(el.value);
    Population.socialDistancingThresholdRatio = value;
    population.calculateThresholds();
};
var changeLockdownThresholdRatio = function (el) {
    var value = parseFloat(el.value);
    Population.lockdownThresholdRatio = value;
    population.calculateThresholds();
};
var changeShopCloseThresholdRatio = function (el) {
    var value = parseFloat(el.value);
    Population.shopCloseThresholdRatio = value;
    population.calculateThresholds();
};
// Input + submit buttons
var inputSubmits = $all('div > input');
var _loop_1 = function (i) {
    if (inputSubmits[i].parentElement.querySelector('button') != null) {
        if (inputSubmits[i].parentElement.querySelector('button').innerText == 'Submit') {
            inputSubmits[i].addEventListener('input', function () {
                inputSubmits[i].parentElement.querySelector('button').style.border = '2px solid #cc5';
            });
            inputSubmits[i].addEventListener('keydown', function (e) {
                if (e.key == 'Enter') {
                    inputSubmits[i].parentElement.querySelector('button').click();
                }
            });
            inputSubmits[i].parentElement.querySelector('button').addEventListener('click', function () {
                inputSubmits[i].parentElement.querySelector('button').style.border = '2px solid #5c5';
            });
        }
    }
};
for (var i = 0; i < inputSubmits.length; i++) {
    _loop_1(i);
}
var _loop_2 = function (numberInput) {
    numberInput.addEventListener('mousewheel', function (e) {
        numberInput.blur();
    });
};
for (var _i = 0, _a = $all('input[type="number"]'); _i < _a.length; _i++) {
    var numberInput = _a[_i];
    _loop_2(numberInput);
}
