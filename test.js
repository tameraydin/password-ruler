import test from 'ava';
import PasswordRuler from './index';

const mockRuler = new PasswordRuler();

const fixtureProperValidators = {
    'x': {
      'validate': function() {},
      'weight': 1
    },
    'y': {},
    'z': null
  };
const fixtureImproperValidator1 = ['', function() {}];
const fixtureImproperValidator2 = [3, function() {}];
const fixtureImproperValidator3 = ['x', 'x'];
const fixtureImproperValidator4 = ['x', function() {}, 'y'];
const fixtureProperValidator1 = ['x', function() {}];
const fixtureProperValidator2 = ['y', function() {}, 2];
const fixtureInvalidPassword = 1;
const fixtureValidPassword = 'x';

test('PasswordRuler', t => {
  t.ok(mockRuler.validators);
  t.ok(mockRuler.addValidator);
  t.ok(mockRuler.check);

  let mockRulerWithRules = new PasswordRuler(fixtureProperValidators);
  t.is(Object.keys(mockRulerWithRules.validators).length, 1);
});

test('PasswordRuler:addValidator', t => {
  t.notOk(mockRuler.addValidator.apply(mockRuler, fixtureImproperValidator1));
  t.notOk(mockRuler.addValidator.apply(mockRuler, fixtureImproperValidator2));
  t.notOk(mockRuler.addValidator.apply(mockRuler, fixtureImproperValidator3));
  t.notOk(mockRuler.addValidator.apply(mockRuler, fixtureImproperValidator4));

  t.is(mockRuler.addValidator.apply(
    mockRuler, fixtureProperValidator1), mockRuler);
  t.ok(mockRuler.validators.x);
  t.ok(mockRuler.validators.x.validate);
  t.is(mockRuler.validators.x.weight, 1);

  t.is(mockRuler.addValidator.apply(
    mockRuler, fixtureProperValidator2), mockRuler);
  t.is(mockRuler.validators.y.weight, 2);
});

test('PasswordRuler:check', t => {
  t.notOk(mockRuler.check.call(mockRuler, fixtureInvalidPassword));

  let validResult = mockRuler.check.call(mockRuler, fixtureValidPassword);
  t.ok(validResult);
  t.is(validResult.constructor.name, 'PasswordRulerResult');
});
