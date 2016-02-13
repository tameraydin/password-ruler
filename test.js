import test from 'ava';
import PasswordRuler from './index';

const fixtureLevelWithProperValidator1 = {
  'x': {
    'validate': function() {},
    'weight': 1
  }
};
const fixtureLevelWithProperValidator2 = {
  'y': {
    'validate': function() {},
    'weight': 2
  }
};
const fixtureLevelWithImproperValidator = {
  'x': null
};
const fixtureLevelWithMixedValidators = {
  'x': {
    'validate': function() {},
    'weight': 1
  },
  'y': {},
  'z': null
};
const fixtureImproperValidatorArgs1 = ['', function() {}];
const fixtureImproperValidatorArgs2 = [3, function() {}];
const fixtureImproperValidatorArgs3 = ['x', 'x'];
const fixtureImproperValidatorArgs4 = ['x', function() {}, 'y'];
const fixtureProperValidatorArgs1 = ['a', function() {}];
const fixtureProperValidatorArgs2 = ['b', function() {}, 2];
// const fixtureInvalidPassword = 1;
// const fixtureValidPassword = 'x';

test('PasswordRuler()', t => {
  var ruler1 = new PasswordRuler();

  t.is(ruler1.levels.length, 0);
  t.is(ruler1.strength, 0);
  t.is(ruler1.score, 0);

  var ruler2 = new PasswordRuler(fixtureLevelWithProperValidator1);
  t.is(ruler2.levels.length, 1);

  var ruler3 = new PasswordRuler([
    fixtureLevelWithProperValidator1,
    fixtureLevelWithProperValidator2
  ]);
  t.is(ruler3.levels.length, 2);

  var ruler4 = new PasswordRuler([
    fixtureLevelWithProperValidator1,
    fixtureLevelWithImproperValidator
  ]);
  t.is(ruler4.levels.length, 1);

  var ruler5 = new PasswordRuler(fixtureLevelWithMixedValidators);
  t.is(ruler5.levels.length, 1);
  t.notOk(ruler5.levels.y);
  t.notOk(ruler5.levels.z);
});

test('addValidator()', t => {
  let ruler1 = new PasswordRuler();

  t.false(ruler1.addValidator.apply(ruler1, fixtureImproperValidatorArgs1));
  t.false(ruler1.addValidator.apply(ruler1, fixtureImproperValidatorArgs2));
  t.false(ruler1.addValidator.apply(ruler1, fixtureImproperValidatorArgs3));
  t.false(ruler1.addValidator.apply(ruler1, fixtureImproperValidatorArgs4));

  t.is(ruler1.addValidator.apply(
    ruler1, fixtureProperValidatorArgs1), ruler1);
  t.is(ruler1.levels[0].a, false);

  t.is(ruler1.addValidator.apply(
    ruler1, fixtureProperValidatorArgs2), ruler1);
  t.is(ruler1.levels[0].b, false);
});