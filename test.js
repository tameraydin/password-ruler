import test from 'ava';
import PswdRuler from './index';

let myPswdRuler;

test.before(t => {
  myPswdRuler = new PswdRuler();
});

test('PasswordRuler', t => {
  t.ok(myPswdRuler.rules);
  t.ok(myPswdRuler.addRule);
  t.ok(myPswdRuler.check);

  let myPswdRulerWithRules =
    new PswdRuler({
      'x': {
        'validator': function() {},
        'weight': 1
      },
      'y': {},
      'z': null
    });
  t.is(Object.keys(myPswdRulerWithRules.rules).length, 1);
});

test('PasswordRuler:addRule', t => {
  t.notOk(myPswdRuler.addRule('', function() {}));
  t.notOk(myPswdRuler.addRule(3, function() {}));
  t.notOk(myPswdRuler.addRule('x', 'x'));
  t.notOk(myPswdRuler.addRule('x', function() {}, 'y'));

  t.is(myPswdRuler.addRule('x', function() {}), myPswdRuler);
  t.ok(myPswdRuler.rules.x);
  t.ok(myPswdRuler.rules.x.validator);
  t.is(myPswdRuler.rules.x.weight, 1);

  t.is(myPswdRuler.addRule('y', function() {}, 2), myPswdRuler);
  t.is(myPswdRuler.rules.y.weight, 2);
});

test('PasswordRuler:check', t => {
  t.notOk(myPswdRuler.check(1));

  let validResult = myPswdRuler.check('x');
  t.ok(validResult);
  t.is(validResult.constructor.name, 'PasswordRulerResult');
});
