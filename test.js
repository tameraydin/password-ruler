import test from 'ava';
import PasswordRuler from './index';

const fixtureLevelWithProperValidator1 = {
  'x': {
    'validator': function() {},
    'weight': 1
  }
};
const fixtureLevelWithProperValidator2 = {
  'y': {
    'validator': function() {},
    'weight': 2
  }
};
const fixtureLevelWithImproperValidator = {
  'x': null
};
const fixtureLevelWithMixedValidators = {
  'x': {
    'validator': function() {},
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
  let ruler1 = new PasswordRuler();

  t.is(ruler1.levels.length, 0);

  let ruler2 = new PasswordRuler(fixtureLevelWithProperValidator1);
  t.is(ruler2.levels.length, 1);
  t.ok(ruler2.levels[0].x.validator);
  t.is(ruler2.levels[0].x.weight, 1);

  let ruler3 = new PasswordRuler([
    fixtureLevelWithProperValidator1,
    fixtureLevelWithProperValidator2
  ]);
  t.is(ruler3.levels.length, 2);

  let ruler4 = new PasswordRuler([
    fixtureLevelWithProperValidator1,
    fixtureLevelWithImproperValidator
  ]);
  t.is(ruler4.levels.length, 1);

  let ruler5 = new PasswordRuler(fixtureLevelWithMixedValidators);
  t.is(ruler5.levels.length, 1);
  t.ok(ruler5.levels[0].x);
  t.notOk(ruler5.levels[0].y);
  t.notOk(ruler5.levels[0].z);
});

test('addLevel()', t => {
  let aRuler = new PasswordRuler();

  aRuler.addLevel();
  t.same(aRuler.levels, [{}]);

  aRuler.addLevel(fixtureLevelWithProperValidator1);
  t.is(aRuler.levels.length, 2);
  t.ok(aRuler.levels[1].x);
});

test('addValidator()', t => {
  let aRuler = new PasswordRuler();

  t.is(aRuler.addValidator.apply(aRuler, fixtureImproperValidatorArgs1)
    .levels.length, 0);
  t.is(aRuler.addValidator.apply(aRuler, fixtureImproperValidatorArgs2)
    .levels.length, 0);
  t.is(aRuler.addValidator.apply(aRuler, fixtureImproperValidatorArgs3)
    .levels.length, 0);
  t.is(aRuler.addValidator.apply(aRuler, fixtureImproperValidatorArgs4)
    .levels.length, 0);

  aRuler.addValidator.apply(aRuler, fixtureProperValidatorArgs1);
  t.is(aRuler.levels.length, 1);
  t.ok(aRuler.levels[0].a);

  aRuler.addValidator.apply(aRuler, fixtureProperValidatorArgs2);1
  t.ok(aRuler.levels[0].b);
});