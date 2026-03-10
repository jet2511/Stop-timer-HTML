/**
 * A unified Timer class that supports both stopwatch and countdown functionalities.
 */
export class Timer {
  constructor(options = {}) {
    this.options = {
      tick: 0.032, // Precision in seconds
      ontick: null,
      onend: null,
      ...options,
    };

    this.startTs = 0;
    this.elapsed = 0;
    this.duration = 0;
    this.isPaused = false;
    this.interval = null;
    this.mode = "stopwatch"; // 'stopwatch' or 'countdown'
  }

  start(durationInMs = 0) {
    this.stop();
    this.mode = durationInMs > 0 ? "countdown" : "stopwatch";
    this.duration = durationInMs;
    this.elapsed = 0;
    this.startTs = Date.now();
    this.isPaused = false;
    this._run();
  }

  pause() {
    if (this.interval && !this.isPaused) {
      this.isPaused = true;
      this.elapsed += Date.now() - this.startTs;
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false;
      this.startTs = Date.now();
      this._run();
    } else if (!this.interval) {
      this.start();
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isPaused = false;
    this.elapsed = 0;
    this.startTs = 0;
  }

  _run() {
    const tickMs = this.options.tick * 1000;
    this.interval = setInterval(() => {
      const now = Date.now();
      const currentTickElapsed = now - this.startTs;
      const totalElapsed = this.elapsed + currentTickElapsed;

      if (this.mode === "countdown") {
        const remaining = this.duration - totalElapsed;
        if (remaining <= 0) {
          this.stop();
          if (this.options.ontick) this.options.ontick(0);
          if (this.options.onend) this.options.onend();
          return;
        }
        if (this.options.ontick) this.options.ontick(remaining);
      } else {
        if (this.options.ontick) this.options.ontick(totalElapsed);
      }
    }, tickMs);
  }

  get currentTime() {
    if (!this.startTs) return this.elapsed;
    if (this.isPaused) return this.elapsed;
    return this.elapsed + (Date.now() - this.startTs);
  }
}
