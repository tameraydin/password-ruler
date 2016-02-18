import test from 'ava';
import PasswordRuler from '../src/index';

// LEVEL FIXTURES:
const fixtureLevelWithProperValidator1 = {
  x: {
    validate: function() {},
    weight: 1
  }
};
const fixtureLevelWithProperValidator2 = {
  y: {
    validate: function() {},
    weight: 2
  }
};
const fixtureLevelWithImproperValidator = {
  x: null
};
const fixtureLevelsWithMixedValidators = [{
  a: {
    validate: function() {},
    weight: 1
  },
  b: {
    validate: function() {}
  },
  c: 1
}, {
  d: {}
}, {
  e: null
}];

// VALIDATOR FIXTURES:
const fixtureImproperValidatorArgs1 = ['', function() {}];
const fixtureImproperValidatorArgs2 = [3, function() {}];
const fixtureImproperValidatorArgs3 = ['x', 'x'];
const fixtureImproperValidatorArgs4 = ['x', function() {}, 'y'];
const fixtureProperValidatorArgs1 = ['a', function() {}];
const fixtureProperValidatorArgs2 = ['b', function() {}, 2];
const fixtureProperValidatorArgs3 = ['c', function() {}, 1, 99];

// PASSWORDS
const fixtureInvalidPassword = 1;
const fixtureValidPassword = '';

// MIXED LEVELS & CHECK RESULTS:
const resultOfEmptyLevels = {
  score: 0,
  strength: 0,
  levels: []
};
const resultOfALevelWithoutValidators = {
  score: 0,
  strength: 0,
  levels: [{
    score: 0,
    validator: {}
  }]
};

const fixtureLevel1 = {
  alwaysValid: {
    validate: function() {
      return true;
    }
  }
};
const resultOfFixtureLevel1WithInvalidPassword = {
  score: 0,
  strength: 0,
  levels: [{
    score: 0,
    validator: {
      alwaysValid: undefined
    }
  }]
};
const resultOfFixtureLevel1WithValidPassword = {
  score: 100,
  strength: 1,
  levels: [{
    score: 100,
    validator: {
      alwaysValid: true
    }
  }]
};

const fixtureLevel2 = {
  validW1: {
    validate: function() {
      return true;
    }
  },
  invalidW1: {
    validate: function() {
      return false;
    }
  },
  invalidW2: {
    validate: function() {
      return false;
    },
    weight: 2
  }
};
const resultOfFixtureLevel2 = {
  score: 25,
  strength: 0,
  levels: [{
    score: 25,
    validator: {
      validW1: true,
      invalidW1: false,
      invalidW2: false
    }
  }]
};

const fixtureLevel3 = [{
  validL1W3: {
    validate: function() {
      return true;
    },
    weight: 3
  }
}, {
  validL2W2: {
    validate: function() {
      return true;
    },
    weight: 2
  },
  validL2W1: {
    validate: function() {
      return true;
    }
  }
}, {
  validL3W3: {
    validate: function() {
      return true;
    },
    weight: 3
  },
  invalidL3W7: {
    validate: function() {
      return false;
    },
    weight: 7
  }
}, {
  validL4W2: {
    validate: function() {
      return true;
    },
    weight: 2
  }
}];
const resultOfFixtureLevel3 = {
  score: 50,
  strength: 2,
  levels: [{
    score: 100,
    validator: {
      validL1W3: true
    }
  }, {
    score: 100,
    validator: {
      validL2W2: true,
      validL2W1: true
    }
  }, {
    score: 30,
    validator: {
      validL3W3: true,
      invalidL3W7: false
    }
  }, {
    score: 0,
    validator: {
      validL4W2: undefined
    }
  }]
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
  let firstArgumentOnValidate;
  let specialRuler = new PasswordRuler({
    x: {
      validate: function() {
        firstArgumentOnValidate = arguments[0];
        return true;
      }
    }
  });
  specialRuler.check('abc');
  t.is(firstArgumentOnValidate, 'abc');

  const emptyRuler = new PasswordRuler();
  t.same(emptyRuler.check(fixtureValidPassword), resultOfEmptyLevels);

  emptyRuler.addLevel();
  t.same(emptyRuler.check(fixtureValidPassword), resultOfALevelWithoutValidators);

  const ruler1 = new PasswordRuler(fixtureLevel1);
  t.same(ruler1.check(fixtureInvalidPassword), resultOfFixtureLevel1WithInvalidPassword);
  t.same(ruler1.check(fixtureValidPassword), resultOfFixtureLevel1WithValidPassword);

  const ruler2 = new PasswordRuler(fixtureLevel2);
  t.same(ruler2.check(fixtureValidPassword), resultOfFixtureLevel2);

  const ruler3 = new PasswordRuler(fixtureLevel3);
  t.same(ruler3.check(fixtureValidPassword), resultOfFixtureLevel3);
});
