'use strict'

class PasswordRuler {
  constructor(rules) {
    this.rules = {};

    PasswordRuler.applyRules(this, rules);
  }

  check(password) {
    if (typeof password !== 'string') {
      return false;
    }

    return new PasswordRulerResult(password, this.rules);
  }

  addRule(name, validator, weight) {
    if (!name || typeof name !== 'string' ||
        typeof validator !== 'function' ||
        (weight && typeof weight !== 'number')) {
      return false;
    }

    this.rules[name] = {
      validator: validator,
      weight: weight || 1
    };

    return this;
  }

  static applyRules(ruler, rules) {
    if (!(rules instanceof Object)) {
      return ruler;
    }

    Object.keys(rules).forEach((ruleName) => {
      let ruleObj = rules[ruleName];
      if (ruleObj) {
        ruler.addRule(ruleName, ruleObj.validator, ruleObj.weight);
      }
    });

    return ruler;
  }
}

class PasswordRulerResult {

  constructor(password, rules) {
    this.ready = false;
    this.inProgress = false;
    this.score = -1;
    this.rules = Object.assign({}, rules);

    PasswordRulerResult.generate(this, password);
  }

  static generate(result, password) {
    return result;
  }
}

module.exports = PasswordRuler;
