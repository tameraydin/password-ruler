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
    if (!level) {
      this.levels.push({});
      return this;
    }

    let validatorNames = Object.keys(level);
    if (!validatorNames.length) {
      this.levels.push({});
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
        this.levels.length);
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

    levelIndex = typeof levelIndex === 'number' ?
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
