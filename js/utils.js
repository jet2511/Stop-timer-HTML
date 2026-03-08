/**
 * Utility functions for time formatting and string manipulation.
 * These are refactored from prototypes.js to avoid polluting global prototypes.
 */

export const timeUtils = {
  /**
   * Pads a string with leading zeros.
   */
  zeroPad: (val, max) => {
    const str = val.toString();
    return str.length < max ? ("0" + str).padStart(max, "0") : str;
  },

  /**
   * Converts seconds/milliseconds to HH:MM:SS format.
   */
  toHHMMSS: (seconds) => {
    const secNum = parseInt(seconds, 10);
    const hours = Math.floor(secNum / 3600);
    const minutes = Math.floor((secNum - hours * 3600) / 60);
    const secs = secNum - hours * 3600 - minutes * 60;

    return [hours, minutes, secs]
      .map((v) => v.toString().padStart(2, "0"))
      .join(":");
  },

  /**
   * Converts HH:MM:SS string to milliseconds.
   */
  timeToMill: (hms) => {
    const [h, m, s] = hms.split(":").map((v) => parseInt(v, 10));
    return (s + m * 60 + h * 3600) * 1000;
  },

  /**
   * Formats milliseconds into an object with hms and ms components.
   */
  formatMilliseconds: (totalMs) => {
    const ms = Math.floor(totalMs % 1000);
    const totalSecs = Math.floor(totalMs / 1000);
    const secs = totalSecs % 60;
    const totalMins = Math.floor(totalSecs / 60);
    const mins = totalMins % 60;
    const hrs = Math.floor(totalMins / 60);

    return {
      hms: [hrs, mins, secs].map((v) => v.toString().padStart(2, "0")).join(":"),
      ms: ms.toString().padStart(3, "0"),
      sec: secs,
    };
  },

  /**
   * Capitalizes the first letter of a string.
   */
  ucfirst: (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
};

export const MathUtils = {
  /**
   * Generates a random number between min and max.
   */
  getRandomArbitrary: (min, max) => {
    let key;
    if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
      const randomBuffer = new Uint32Array(1);
      window.crypto.getRandomValues(randomBuffer);
      key = randomBuffer[0] / (0xffffffff + 1);
    } else {
      key = Math.random();
    }
    const isInteger = Math.floor(min) === min && Math.floor(max) === max;
    return isInteger
      ? Math.floor(key * (max - min + 1)) + min
      : key * (max - min) + min;
  },
};
