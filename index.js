'use strict'

let validatorsKey = Symbol();

class PasswordRuler {

  constructor(levels) {
    this.levels = [];
    this.score = 0;
    this.strength = 0;

    this[validatorsKey] = [];

    PasswordRuler.addValidators(this, levels);
  }

  static addValidators(passwordRuler, levels) {
    if (!levels) {
      return
    }

    if (!(levels instanceof Array)) {
      levels = [levels];
    }

    levels.forEach((level, levelIndex) => {

      Object.keys(level).forEach((validatorName) => {
        let validatorObj = level[validatorName];

        if (!validatorObj) {
          return;
        }

        passwordRuler.addValidator(
          validatorName,
          validatorObj.validate,
          validatorObj.weight,
          levelIndex);
      });
    });
  }

  calculate(password) {

  }

  addValidator(name, validate, weight, levelIndex) {
    if (!name ||
      typeof name !== 'string' ||
      typeof validate !== 'function' ||
      (weight && typeof weight !== 'number')) {
      return false;
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
