/**
 * password-ruler v0.1.0 (https://github.com/tameraydin/password-ruler)
 * Copyright 2016 Tamer Aydin (http://tamerayd.in) 
 * Licensed under MIT
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PasswordRuler = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PasswordRuler = function () {
  function PasswordRuler(levels) {
    _classCallCheck(this, PasswordRuler);

    this.levels = [];

    PasswordRuler.init(this, levels);
  }

  _createClass(PasswordRuler, [{
    key: 'addLevel',
    value: function addLevel(level) {
      var _this = this;

      this.levels.push({ validator: {} });

      if (!level) {
        return this;
      }

      var validatorNames = Object.keys(level);
      if (!validatorNames.length) {
        return this;
      }

      validatorNames.forEach(function (validatorName) {
        var validatorObj = level[validatorName];

        if (!validatorObj) {
          return;
        }

        _this.addValidator(validatorName, validatorObj.validate, validatorObj.weight, _this.levels.length - 1);
      });

      return this;
    }
  }, {
    key: 'addValidator',
    value: function addValidator(name, validate, weight, levelIndex) {
      if (!name || typeof name !== 'string' || typeof validate !== 'function' || weight && typeof weight !== 'number') {
        return this;
      }

      var levels = this.levels;

      levelIndex = typeof levelIndex === 'number' && levels[levelIndex] ? levelIndex : Math.max(0, levels.length - 1);

      levels[levelIndex] = levels[levelIndex] || { validator: {} };
      levels[levelIndex].validator[name] = {
        validate: validate,
        weight: weight || 1
      };

      return this;
    }
  }, {
    key: 'check',
    value: function check(password) {
      if (typeof password !== 'string') {
        throw new TypeError('Password must be a string.');
      }

      var totalValidatorCount = 0;
      var totalValidValidatorCount = 0;
      var isPreviousLevelValid = true;

      var result = {
        score: 0,
        strength: 0
      };

      result.levels = this.levels.map(function (level) {
        var levelValidatorCount = 0;
        var levelValidValidatorCount = 0;
        var levelResult = {
          score: 0,
          validator: {}
        };

        Object.keys(level.validator).forEach(function (validatorName) {
          var validatorObj = level.validator[validatorName];
          var isValid = levelResult.validator[validatorName] = !isPreviousLevelValid ? undefined : !!validatorObj.validate(password);

          levelValidatorCount += validatorObj.weight;
          if (isValid) {
            levelValidValidatorCount += validatorObj.weight;
          }
        });

        levelResult.score = levelValidatorCount ? Math.floor(100 * levelValidValidatorCount / levelValidatorCount) : 0;

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

      result.score = totalValidatorCount ? Math.floor(100 * totalValidValidatorCount / totalValidatorCount) : 0;
      return result;
    }
  }], [{
    key: 'init',
    value: function init(passwordRuler, levels) {
      if (!levels) {
        return;
      }

      if (!(levels instanceof Array)) {
        levels = [levels];
      }

      levels.forEach(function (level, levelIndex) {
        return passwordRuler.addLevel(level);
      });
    }
  }]);

  return PasswordRuler;
}();

module.exports = PasswordRuler;

},{}]},{},[1])(1)
});