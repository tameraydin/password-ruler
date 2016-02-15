'use strict'

class PasswordRuler {

  constructor(levels) {
    this.levels = [];

    PasswordRuler.init(this, levels);
  }

  static init(passwordRuler, levels) {
    if (!levels) {
      return
    }

    if (!(levels instanceof Array)) {
      levels = [levels];
    }

    levels.forEach(
      (level, levelIndex) => passwordRuler.addLevel(level));
  }

  addLevel(level) {
    this.levels.push({ validators: {} });

    if (!level) {
      return this;
    }

    let validatorNames = Object.keys(level);
    if (!validatorNames.length) {
      return this;
    }

    validatorNames.forEach((validatorName) => {
      let validatorObj = level[validatorName];

      if (!validatorObj) {
        return;
      }

      this.addValidator(
        validatorName,
        validatorObj.validator,
        validatorObj.weight,
        this.levels.length - 1);
    });

    return this;
  }

  addValidator(name, validator, weight, levelIndex) {
    if (!name ||
      typeof name !== 'string' ||
      typeof validator !== 'function' ||
      (weight && typeof weight !== 'number')) {
      return this;
    }

    let levels = this.levels;

    levelIndex = typeof levelIndex === 'number' && levels[levelIndex] ?
      levelIndex : Math.max(0, levels.length - 1);

    levels[levelIndex] = levels[levelIndex] || { validators: {} };
    levels[levelIndex].validators[name] = {
      validator: validator,
      weight: weight || 1
    };

    return this;
  }
}

module.exports = PasswordRuler;
