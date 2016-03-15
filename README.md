# PasswordRuler [![Build Status](http://img.shields.io/travis/tameraydin/password-ruler/master.svg?style=flat-square)](https://travis-ci.org/tameraydin/password-ruler) [![Coverage Status](https://img.shields.io/coveralls/tameraydin/password-ruler/master.svg?style=flat-square)](https://coveralls.io/r/tameraydin/password-ruler?branch=master)

### What does it do?

It helps you easily create a customized password complexity calculator, and furthermore, to build your own strength meter.

### Why?

Because -almost- every company you work for has its own requirements & specifications.

### Install

```
npm install --save password-ruler
```

### Usage

#### Basic scenario

Let's say that you just want to have a basic complexity score:

```js
const PasswordRuler = require('password-ruler');

// Constructor can take an object (one strength level)
// or an array of objects (length of array = number of levels).
// In this scenario, one strength level is fine:
const ruler = new PasswordRuler({
  minLength: { // a validator object has to have 2 props; "weight" & "validate"
    weight: 1, // basically the importance degree of validator
    validate: function(password) { // first argument is always the password
      return password.length > 3;
    }
  },
  containsAnUppercase: {
    weight: 2,
    validate: [Function]
  },
  containsASpecialCharacter: {
    weight: 2,
    validate: [Function]
  }
});

ruler.check('test');
// => {
//   score: 20,
//   strength: 0,
//   levels: [{
//     score: 20,
//     validator: {
//       minLength: true,
//       containsAnUppercase: false,
//       containsASpecialCharacter: false
//     }
//   }]
// }

ruler.check('Test');
// => {
//   score: 60,
//   strength: 0,
//   levels: [{
//     score: 60,
//     validator: {
//       minLength: true,
//       containsAnUppercase: true,
//       containsASpecialCharacter: false
//     }
//   }]
// }

ruler.check('Test*');
// => {
//   score: 100,
//   strength: 1,
//   levels: [{
//     score: 100,
//     validator: {
//       minLength: true,
//       containsAnUppercase: true,
//       containsASpecialCharacter: true
//     }
//   }]
// }
```

#### Multiple strength-levels

Let's rapidly create a password strength meter that has 3 levels, using [PasswordRuler Add-ons](https://github.com/tameraydin/password-ruler-addons):

```js
const {
  containsUpperCase,
  containsDigit,
  containsSpecialChar,
  excludesSequentialDigits,
  excludesBirthDate
} = require('password-ruler-addons'); // see above link for all available methods

const ruler = new PasswordRuler([
  { // 1st level (Weak):
    uppercase: containsUpperCase(), // Add-ons methods always return a validator
    number: containsDigit()
  },
  { // 2nd level:
    special: containsSpecialChar(2, 3), // => weight: 3 (the value comes after required parameters sets the weight of validator)
    sequential: excludesSequentialDigits(4), // excludes 4 digits, weight is still 1 as default
  },
  { // 3rd level (Strong)
    birthdate: excludesBirthDate()
  }
]);

ruler.check('**Test1234');
// => {
//   score: 71, // overall score that is calculated based on validator weights
//   strength: 1, // makes only the 1st level: weak
//   levels: [
//     {
//       score: 100,
//       validator: {
//         uppercase: true,
//         number: true
//       }
//     },
//     {
//       score: 75, // individual level score
//       validator: {
//         special: true,
//         sequential: false
//       }
//     },
//     {
//       score: 0,
//       validator: {
//         birthdate: undefined
//       }
//     }
//   ]
// }
```

<a name="module_PasswordRuler"></a>

### API

* [PasswordRuler](#module_PasswordRuler)
    * _instance_
        * [.addLevel(level)](#module_PasswordRuler+addLevel) ⇒ <code>PasswordRuler</code>
        * [.addValidator(name, validate, weight, [levelIndex])](#module_PasswordRuler+addValidator) ⇒ <code>PasswordRuler</code>
        * [.check(password)](#module_PasswordRuler+check) ⇒ <code>Object</code>
    * _static_
        * [.init(passwordRuler, levels)](#module_PasswordRuler.init)

<a name="module_PasswordRuler+addLevel"></a>

#### addLevel(level) ⇒ <code>PasswordRuler</code>
Adds a new level on top of existing levels.

**Kind**: instance method of <code>[PasswordRuler](#module_PasswordRuler)</code>

| Param | Type | Description |
| --- | --- | --- |
| level | <code>Object</code> | A level object with one or multiple validators |

**Returns**: <code>PasswordRuler</code> - PasswordRuler instance's itself

<a name="module_PasswordRuler+addValidator"></a>

#### addValidator(name, validate, weight, [levelIndex]) ⇒ <code>PasswordRuler</code>
Adds a new validator to the given or last level.

**Kind**: instance method of <code>[PasswordRuler](#module_PasswordRuler)</code>

| Param | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Validator name |
| validate | <code>function</code> | Validation function |
| weight | <code>Integer</code> | Validator importance rate |
| [levelIndex] | <code>Integer</code> | Index of level (If it is not available, validator will be added to the last level) |

**Returns**: <code>PasswordRuler</code> - PasswordRuler instance's itself

<a name="module_PasswordRuler+check"></a>

#### check(password) ⇒ <code>Object</code>
Checks the given password & provides a result object

**Kind**: instance method of <code>[PasswordRuler](#module_PasswordRuler)</code>

| Param | Type | Description |
| --- | --- | --- |
| password | <code>String</code> | Password to check |

**Returns**: <code>Object</code> - A result object that contains score, strenght & level props

<a name="module_PasswordRuler.init"></a>

#### PasswordRuler.init(passwordRuler, levels)
Applies each given levels to the given PasswordRuler instance

**Kind**: static method of <code>[PasswordRuler](#module_PasswordRuler)</code>

| Param | Type | Description |
| --- | --- | --- |
| passwordRuler | <code>PasswordRuler</code> | An instance of PasswordRuler |
| levels | <code>Array</code> &#124; <code>Object</code> | A level list with validators or a single level object |

### Related

- [PasswordRuler Add-ons](https://github.com/tameraydin/password-ruler-addons)
- [common-password-rules](https://github.com/tameraydin/common-password-rules)

### License

MIT [http://tameraydin.mit-license.org/](http://tameraydin.mit-license.org/)