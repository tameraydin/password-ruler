'use strict'

let levelValidatorsKey = Symbol();

class PasswordRuler {

  constructor(levels) {
    this.levels = [];
    this.score = 0;
    this.strength = 0;

    this[levelValidatorsKey] = [];

    PasswordRuler.processLevels(this, levels);
  }

  static processLevels(passwordRuler, levels) {
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

        let levelOnRuler = passwordRuler.levels[levelIndex] =
          passwordRuler.levels[levelIndex] || {};

        if (passwordRuler.addValidator(
            validatorName,
            validatorObj.validate,
            validatorObj.weight,
            levelIndex)) {
          levelOnRuler[validatorName] = false;
          levelOnRuler.score = 0;
        };
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

    let levelValidators = this[levelValidatorsKey];
    let validators = levelIndex ? levelValidators[levelIndex] :
      levelValidators[levelValidators.length - 1];

    validators = validators || {};
    validators[name] = {
      validate: validate,
      weight: weight || 1
    };

    return this;
  }
}

module.exports = PasswordRuler;