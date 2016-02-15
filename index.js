'use strict'

class PasswordRuler {

  constructor(levelsWithValidators) {
    this.levels = [];

    PasswordRuler.init(this, levelsWithValidators);
  }

  static init(passwordRuler, levelsWithValidators) {
    if (!levelsWithValidators) {
      return
    }

    if (!(levelsWithValidators instanceof Array)) {
      levelsWithValidators = [levelsWithValidators];
    }

    levelsWithValidators.forEach(
      (level, levelIndex) => passwordRuler.addLevel(level));
  }

  addLevel(level) {
    this.levels.push({});

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

    levels[levelIndex] = levels[levelIndex] || {};
    levels[levelIndex][name] = {
      validator: validator,
      weight: weight || 1
    };

    return this;
  }
}

module.exports = PasswordRuler;
