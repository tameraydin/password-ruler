'use strict'

let validatorsKey = Symbol();

class PasswordRuler {

  constructor(levelsWithValidators) {
    this.levels = [];
    this.score = 0;
    this.strength = 0;

    this[validatorsKey] = [];

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
        validatorObj.validate,
        validatorObj.weight,
        this.levels.length);
    });

    return this;
  }

  addValidator(name, validate, weight, levelIndex) {
    if (!name ||
      typeof name !== 'string' ||
      typeof validate !== 'function' ||
      (weight && typeof weight !== 'number')) {
      return this;
    }

    let validators = this[validatorsKey];

    levelIndex = typeof levelIndex === 'number' ?
      levelIndex : Math.max(0, validators.length - 1);

    validators[levelIndex] = validators[levelIndex] || {};

    validators[levelIndex][name] = {
      validate: validate,
      weight: weight || 1
    };

    let level = this.levels[levelIndex] = this.levels[levelIndex] || {};
    level[name] = false;
    level.score = 0;

    return this;
  }
}

module.exports = PasswordRuler;
