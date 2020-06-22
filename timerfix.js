createjs.Sound.play = function(a, b, d, e, f, g, h, i, j) {
    if (createjs.Sound.activePlugin.context && createjs.Sound.activePlugin.context.state === "suspended") { createjs.Sound.activePlugin.context.resume(); }
    var k;
    k = b instanceof Object || b instanceof createjs.PlayPropsConfig ? createjs.PlayPropsConfig.create(b) : createjs.PlayPropsConfig.create({ interrupt: b, delay: d, offset: e, loop: f, volume: g, pan: h, startTime: i, duration: j });
    var l = createjs.Sound.createInstance(a, k.startTime, k.duration),
        m = createjs.Sound._playInstance(l, k);
    return m || l._playFailed(), l;
};

function getChromeVersion() { var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./); return raw ? parseInt(raw[2], 10) : false; }
if ((navigator.userAgent.toLowerCase().indexOf('firefox') > -1 || getChromeVersion() >= 71) && createjs) {
    createjs.Text.prototype._drawTextLine = function(ctx, text, y) {
        if (this.textBaseline === "top") {
            var lineHeight = this.lineHeight || this.getMeasuredLineHeight();
            y += lineHeight * 0.1;
        }
        if (this.outline) { ctx.strokeText(text, 0, y, this.maxWidth || 0xFFFF); } else { ctx.fillText(text, 0, y, this.maxWidth || 0xFFFF); }
    };
}