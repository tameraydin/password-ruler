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
const fixtureLevelsWithMixedValidators = [{
  'a': {
    'validate': function() {},
    'weight': 1
  },
  'b': {
    'validate': function() {}
  },
  'c': 1
}, {
  'd': {}
}, {
  'e': null
}];
const fixtureImproperValidatorArgs1 = ['', function() {}];
const fixtureImproperValidatorArgs2 = [3, function() {}];
const fixtureImproperValidatorArgs3 = ['x', 'x'];
const fixtureImproperValidatorArgs4 = ['x', function() {}, 'y'];
const fixtureProperValidatorArgs1 = ['a', function() {}];
const fixtureProperValidatorArgs2 = ['b', function() {}, 2];
const fixtureProperValidatorArgs3 = ['c', function() {}, 1, 99];
const fixtureInvalidPassword = 1;
const fixturePassword1 = 'abc';
const fixtureLevel1 = {
  alwaysValid: {
    validate: function() {
      return true;
    }
  }
};

test('PasswordRuler()', t => {
  const ruler1 = new PasswordRuler();

  t.is(ruler1.levels.length, 0);

  const ruler2 = new PasswordRuler(fixtureLevelWithProperValidator1);
  t.is(ruler2.levels.length, 1);
  t.ok(ruler2.levels[0].validator.x.validate);
  t.is(ruler2.levels[0].validator.x.weight, 1);

  const ruler3 = new PasswordRuler([
    fixtureLevelWithProperValidator1,
    fixtureLevelWithProperValidator2
  ]);
  t.is(ruler3.levels.length, 2);

  const ruler4 = new PasswordRuler([
    fixtureLevelWithProperValidator1,
    fixtureLevelWithImproperValidator
  ]);
  t.is(ruler4.levels.length, 2);

  const ruler5 = new PasswordRuler(fixtureLevelsWithMixedValidators);
  t.is(ruler5.levels.length, 3);
  t.ok(ruler5.levels[0].validator.a);
  t.ok(ruler5.levels[0].validator.b);
  t.notOk(ruler5.levels[0].validator.c);
  t.notOk(ruler5.levels[0].validator.c);
  t.notOk(ruler5.levels[0].validator.d);
});

test('addLevel()', t => {
  const aRuler = new PasswordRuler();

  aRuler.addLevel();
  t.same(aRuler.levels, [{
    validator: {}
  }]);

  aRuler.addLevel(1);
  t.same(aRuler.levels, [{
    validator: {}
  }, {
    validator: {}
  }]);

  aRuler.addLevel(fixtureLevelWithProperValidator1);
  t.is(aRuler.levels.length, 3);
  t.ok(aRuler.levels[2].validator.x);
});

test('addValidator()', t => {
  const aRuler = new PasswordRuler();

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
  t.ok(aRuler.levels[0].validator.a);

  aRuler.addValidator.apply(aRuler, fixtureProperValidatorArgs2);
  t.ok(aRuler.levels[0].validator.b);

  aRuler.addValidator.apply(aRuler, fixtureProperValidatorArgs3);
  t.is(aRuler.levels.length, 1);
  t.ok(aRuler.levels[0].validator.c);
});

test('check()', t => {
  const emptyRuler = new PasswordRuler();
  t.same(emptyRuler.check(1), {
    'score': 0,
    'strength': 0,
    'levels': []
  });

  const ruler1 = new PasswordRuler(fixtureLevel1);
  t.same(ruler1.check(fixtureInvalidPassword), {
    'score': 0,
    'strength': 0,
    'levels': [{
      'score': 0,
      'validator': {
        'alwaysValid': false
      }
    }]
  });
  t.same(ruler1.check(fixturePassword1), {
    'score': 100,
    'strength': 1,
    'levels': [{
      'score': 100,
      'validator': {
        'alwaysValid': true
      }
    }]
  });
});
