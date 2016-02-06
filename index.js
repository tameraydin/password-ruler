'use strict'

class PasswordRuler {
  constructor(validators) {
    this.validators = {};

    PasswordRuler.assignValidators(this, validators);
  }

  check(password) {
    if (typeof password !== 'string') {
      return false;
    }

    return new PasswordRulerResult(password, this.validators);
  }

  addValidator(name, validate, weight) {
    if (!name || typeof name !== 'string' ||
        typeof validate !== 'function' ||
        (weight && typeof weight !== 'number')) {
      return false;
    }

    this.validators[name] = {
      validate: validate,
      weight: weight || 1
    };

    return this;
  }

  static assignValidators(passwordRuler, validators) {
    if (!(validators instanceof Object)) {
      return passwordRuler;
    }

    Object.keys(validators).forEach((validatorName) => {
      let validatorObj = validators[validatorName];
      if (validatorObj) {
        passwordRuler.addValidator(
          validatorName, validatorObj.validate, validatorObj.weight);
      }
    });
  }
}

class PasswordRulerResult {

  constructor(password, validators) {
    this.score = -1;
    this.validators = validators;

    PasswordRulerResult.calculate(this, password);
  }

  static calculate(passwordRulerResult, password) {
    let validatorKeys = Object.keys(passwordRulerResult.validators);
    let scorePerValidator = 100 / validatorKeys.length;
    let score = 0;

    validatorKeys.forEach(function(key) {
      let validator = passwordRulerResult.validators[key];
      let weight = validator.weight;

      validator = !!validator.validate(password);

      if (validator) {
        score =+ scorePerValidator * weight;
      }
    });

    passwordRulerResult.score = Math.ceil(score);
  }
}

module.exports = PasswordRuler;
