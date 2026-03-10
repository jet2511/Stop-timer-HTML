function Main() {
    var theTimer = new UpTimer({ ontick: onTimer, tick: 0.032 });
    var timerAmount = 0;
    var isDown;
    var soundsInstance;
    var stageDim = { width: 400, height: 220 };
    (function init() {
        exportRoot.src_menu.btn_stopwatch.addEventListener("mousedown", stopWatchHandler);
        exportRoot.src_menu.btn_countdown.addEventListener("mousedown", countdownhHandler);
        exportRoot.scr_timer.grc_start.addEventListener("mousedown", startStopWatch);
        exportRoot.scr_timer.grc_clear.addEventListener("mousedown", clearStopWatch);
        exportRoot.scr_timer.btn_back.addEventListener("mousedown", backHandler);
        exportRoot.onlinestopwatch.addEventListener("mousedown", function() { window.open('https://www.online-stopwatch.com', '_blank'); });
        injectUrlData();
    })();

    function injectUrlData() {
        var realWindow = window.parent || window;
        realWindow.addEventListener("keyup", keyboardEventHandler, false);
        if (urlData.language) { overWriteLanguage(urlData.language); } else {
            urlData.language = {};
            urlData.language.start = "start";
            urlData.language.pause = "pause";
            urlData.language.continue = "continue";
        }
        urlData.countdown = (/[0-9]{2}:[0-9]{2}:[0-9]{2}/.test(urlData.countdown)) ? urlData.countdown : null;
        if (urlData.countdown != "00:00:00") { countdownhHandler(urlData.countdown); }
        if (urlData.autoplay == "true") {
            if (urlData.countdown != "00:00:00") { exportRoot.scr_set.grc_set.dispatchEvent("mousedown"); if (!isMobile.any) exportRoot.scr_timer.grc_start.dispatchEvent("mousedown"); } else {
                stopWatchHandler();
                exportRoot.scr_timer.grc_start.dispatchEvent("mousedown");
            }
        }
        if (urlData.mute == "true") { soundHandler("mute"); }

        function overWriteLanguage(data) {
            exportRoot.scr_set.txt_set.text = data.set.ucfirst();
            exportRoot.scr_set.txt_clear.text = data.clear.ucfirst();
            exportRoot.scr_timer.txt_start.text = data.start.ucfirst();
            exportRoot.scr_timer.txt_clear.text = data.clear.ucfirst();
            exportRoot.scr_timer.txt_back.text = data.back.ucfirst();
            if (data.stopwatch) exportRoot.src_menu.txt_stopwatch.text = data.stopwatch.ucfirst();
            if (data.countdown) exportRoot.src_menu.txt_countdown.text = data.countdown.ucfirst();
        }
    }

    function stopWatchHandler(val) {
        var animTime = (!val) ? 0 : 500;
        exportRoot.scr_timer.visible = true;
        createjs.Tween.get(exportRoot.scr_timer, { override: true }).to({ x: 0 }, animTime);
        createjs.Tween.get(exportRoot.src_menu, { override: true }).to({ x: stageDim.width }, animTime).call(function() { exportRoot.src_menu.visible = false; });
        isDown = false;
        timerAmount = 0;
        exportRoot.scr_timer.grc_start.visible = true;
        exportRoot.scr_timer.txt_start.text = urlData.language.start.ucfirst();
        exportRoot.scr_timer.animatedObject.gotoAndStop(0);
    }

    function countdownhHandler(val) {
        exportRoot.scr_set.visible = true;
        isDown = false;
        runSettings((typeof val === 'string') ? val : null);
        var animTime = (typeof val === 'string') ? 0 : 500;
        createjs.Tween.get(exportRoot.scr_set, { override: true }).to({ x: 0 }, animTime);
        createjs.Tween.get(exportRoot.src_menu, { override: true }).to({ x: -stageDim.width }, animTime).call(function() { exportRoot.src_menu.visible = false; });
    }

    function keyboardEventHandler(e) {
        switch (e.which) {
            case 32:
            case 13:
                if (exportRoot.scr_timer.visible) {
                    if (exportRoot.scr_timer.grc_start.visible) { startStopWatch(); } else { exportRoot.scr_timer.grc_clear.dispatchEvent("mousedown"); }
                } else if (exportRoot.scr_set.visible) { exportRoot.scr_set.grc_set.dispatchEvent("mousedown"); }
                break;
            case 67:
                if (exportRoot.scr_timer.visible) { clearStopWatch(); } else if (exportRoot.scr_set.visible) { exportRoot.scr_set.grc_clear.dispatchEvent("mousedown"); }
                break;
            case 37:
                if (exportRoot.scr_timer.visible) { exportRoot.scr_timer.btn_back.dispatchEvent("mousedown"); } else if (exportRoot.scr_set.visible) { exportRoot.scr_set.btn_back.dispatchEvent("mousedown"); } else if (exportRoot.src_menu.visible) { exportRoot.src_menu.btn_stopwatch.dispatchEvent("mousedown"); }
                break;
            case 39:
                if (exportRoot.src_menu.visible) { exportRoot.src_menu.btn_countdown.dispatchEvent("mousedown"); }
                break;
        }
        if (/^[0-9]{1}$/.test(e.key) && exportRoot.scr_set.visible) { exportRoot.scr_set["grc_b" + e.key].dispatchEvent("mousedown"); }
    }

    function restrict(func, minDuration) {
        var lastPress = 0;
        return function() {
            var now = Date.now();
            if (now - lastPress < minDuration) return;
            lastPress = now;
            return func.apply(this, arguments);
        };
    }

    function clearStopWatch(e) {
        theTimer.stop();
        onTimer(timerAmount, true);
        exportRoot.scr_timer.txt_start.text = urlData.language.start.ucfirst();
        exportRoot.scr_timer.grc_start.visible = true;
        exportRoot.scr_timer.animatedObject.gotoAndStop(0);
        if (soundsInstance) soundsInstance.stop();
    }

    function startStopWatch(e) {
        if (exportRoot.scr_timer.txt_start.text.toLowerCase() == urlData.language.start) {
            theTimer.start();
            exportRoot.scr_timer.txt_start.text = urlData.language.pause.ucfirst();
            exportRoot.scr_timer.grc_start.gotoAndStop(1);
        } else if (exportRoot.scr_timer.txt_start.text.toLowerCase() == urlData.language.pause) {
            theTimer.pause();
            exportRoot.scr_timer.txt_start.text = urlData.language.continue.ucfirst();
            exportRoot.scr_timer.grc_start.gotoAndStop(2);
        } else if (exportRoot.scr_timer.txt_start.text.toLowerCase() == urlData.language.continue) {
            theTimer.play();
            exportRoot.scr_timer.txt_start.text = urlData.language.pause.ucfirst();
            exportRoot.scr_timer.grc_start.gotoAndStop(1);
        }
    }

    function onTimer(e, prepare) {
        var time;
        if (prepare) { time = e; } else if (isDown === true) {
            time = (isDown) ? timerAmount - e : e;
            if (time <= 0) {
                theTimer.stop();
                exportRoot.scr_timer.animatedObject.gotoAndPlay(1);
                exportRoot.scr_timer.txt_start.text = "";
                exportRoot.scr_timer.grc_start.visible = false;
                exportRoot.scr_timer.txt_mils.text = "000";
                setTitle("00:00:00")
                if (soundsInstance) soundsInstance.stop();
                var snd = (urlData.ns) ? urlData.ns : "bell";
                var rpt = (typeof(urlData.nslen) != "string") ? parseInt(urlData.nslen) : 3;
                soundsInstance = createjs.Sound.play(snd, createjs.Sound.INTERRUPT_EARLY, 0, 0, rpt, 1, 0, null, null);
                return;
            }
        } else if (isDown === false) { time = e - timerAmount; } else if (isDown === undefined) { return; }
        var data = time.toString().formatedMilliseconds();
        exportRoot.scr_timer.txt_timer.text = data.hms;
        exportRoot.scr_timer.txt_mils.text = data.ms;
        setTitle(data.hms);
    }

    function backHandler(e) {
        theTimer.stop();
        exportRoot.scr_timer.txt_timer.text = "00:00:00";
        exportRoot.scr_timer.txt_mils.text = "000";
        exportRoot.scr_timer.txt_start.text = urlData.language.start.ucfirst();
        exportRoot.scr_timer.grc_start.gotoAndStop(0);
        if (exportRoot.scr_timer.visible) {
            createjs.Tween.get(exportRoot.scr_timer, { override: true }).to({ x: -stageDim.width }, 500).call(function() {
                exportRoot.scr_timer.visible = false;
                exportRoot.scr_timer.x = -stageDim.width
            });
            exportRoot.src_menu.visible = true;
            createjs.Tween.get(exportRoot.src_menu, { override: true }).to({ x: 0 }, 500);
            exportRoot.scr_set.x = stageDim.width;
        } else if (exportRoot.scr_set.visible) {
            createjs.Tween.get(exportRoot.scr_set, { override: true }).to({ x: stageDim.width }, 500).call(function() { exportRoot.scr_set.visible = false; });
            exportRoot.src_menu.visible = true;
            createjs.Tween.get(exportRoot.src_menu, { override: true }).to({ x: 0 }, 500);
        }
        if (soundsInstance) soundsInstance.stop();
    }

    function setTitle(val) { top.document.title = val; }

    function runSettings(val) {
        var i;
        var typed = "";
        var showText = (val) ? val : "00:00:00";
        exportRoot.scr_set.btn_back.removeAllEventListeners("mousedown");
        exportRoot.scr_set.btn_back.addEventListener("mousedown", backHandler);
        setTitle(showText);
        exportRoot.scr_set.txt_timer.text = showText;
        exportRoot.scr_set.grc_set.removeAllEventListeners("mousedown");
        exportRoot.scr_set.grc_set.addEventListener("mousedown", setSetBtn);

        function setSetBtn(e) {
            clearStopWatch();
            if (showText == "00:00:00" || showText == "") showText = "00:00:10";
            var mill = showText.timeToMill();
            timerAmount = mill;
            onTimer(mill, true);
            isDown = true;
            exportRoot.scr_timer.visible = true;
            createjs.Tween.get(exportRoot.scr_timer, { override: true }).to({ x: 0 }, 0);
            exportRoot.src_menu.visible = true;
            createjs.Tween.get(exportRoot.src_menu, { override: true }).to({ x: stageDim.width }, 0).call(function() {
                exportRoot.src_menu.x = stageDim.width;
                exportRoot.src_menu.visible = false;
            });
            createjs.Tween.get(exportRoot.scr_set, { override: true }).to({ x: stageDim.width }, 0).call(function() {
                exportRoot.scr_set.x = stageDim.width;
                exportRoot.scr_set.visible = false;
            });
        }
        exportRoot.scr_set.grc_clear.removeAllEventListeners("mousedown");
        exportRoot.scr_set.grc_clear.addEventListener("mousedown", setClearBtn);

        function setClearBtn(e) {
            showText = "00:00:00";
            typed = "";
            exportRoot.scr_set.txt_timer.text = showText;
        }
        for (i = 0; i < 10; i++) {
            exportRoot.scr_set["grc_b" + i].name = i;
            exportRoot.scr_set["grc_b" + i].removeAllEventListeners("mousedown");
            exportRoot.scr_set["grc_b" + i].addEventListener("mousedown", setupNumBtn);
        }

        function setupNumBtn(e) {
            if (typed.length == 6) return
            var num = e.currentTarget.name;
            typed += num;
            var newNum = typed.zeroPad(6);
            showText = newNum.splice(2, 0, ":");
            showText = showText.splice(5, 0, ":");
            exportRoot.scr_set.txt_timer.text = showText;
        }
    }
}