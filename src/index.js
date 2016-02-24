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
    this.levels.push({ validator: {} });

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
        validatorObj.validate,
        validatorObj.weight,
        this.levels.length - 1);
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

    let levels = this.levels;

    levelIndex = typeof levelIndex === 'number' && levels[levelIndex] ?
      levelIndex : Math.max(0, levels.length - 1);

    levels[levelIndex] = levels[levelIndex] || { validator: {} };
    levels[levelIndex].validator[name] = {
      validate: validate,
      weight: weight || 1
    };

    return this;
  }

  check(password) {
    if (typeof password !== 'string') {
      throw new TypeError('Password must be a string.');
    }

    let totalValidatorCount = 0;
    let totalValidValidatorCount = 0;
    let isPreviousLevelValid = true;

    let result = {
      score: 0,
      strength: 0
    };

    result.levels = this.levels.map((level) => {
      let levelValidatorCount = 0;
      let levelValidValidatorCount = 0;
      let levelResult = {
        score: 0,
        validator: {}
      };

      Object.keys(level.validator).forEach((validatorName) => {
        let validatorObj = level.validator[validatorName];
        let isValid = levelResult.validator[validatorName] =
          !isPreviousLevelValid ? undefined : !!validatorObj.validate(password);

        levelValidatorCount += validatorObj.weight;
        if (isValid) {
          levelValidValidatorCount += validatorObj.weight;
        }
      });

      levelResult.score = levelValidatorCount ?
        Math.floor(100 * levelValidValidatorCount / levelValidatorCount) : 0;

      if (levelResult.score < 100) {
        isPreviousLevelValid = false;

      } else {
        isPreviousLevelValid = true;
        result.strength++;
      }

      totalValidatorCount += levelValidatorCount;
      totalValidValidatorCount += levelValidValidatorCount;

      return levelResult;
    });

    result.score = totalValidatorCount ?
      Math.floor(100 * totalValidValidatorCount / totalValidatorCount) : 0;
    return result;
  }
}

module.exports = PasswordRuler;
