function UpTimer(opt) {
    var start;
    var time;
    var precision = (opt.tick) ? opt.tick * 1000 : 123;
    var isPaused = false;
    var interval;
    var add = 0;

    function ontick() {
        if (!isPaused) {
            time = new Date().valueOf() - add;
            opt.ontick(time - start);
        } else { add = new Date().valueOf() - time; }
    }
    this.getDuration = function() { return time - start; }
    this.pause = function() { isPaused = true; }
    this.play = function() {
        isPaused = false;
        if (!interval) { this.start(); }
    }
    this.stop = function() {
        clearInterval(interval);
        isPaused = false;
        add = 0;
        start = undefined;
        time = undefined;
        interval = undefined;
    }
    this.start = function() {
        if (isPaused) { isPaused = false; return }
        clearInterval(interval);
        start = time = new Date().valueOf();
        isPaused = false;
        interval = setInterval(ontick, precision);
    }
}