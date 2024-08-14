# a11y-auto-contrast

A set of tools which takes a background color value and optional text color options array. Returns a text color from the options array that would pass a11y accessibility checks, or the best ratio option. See [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) for more details on grading ratios.

## Licensing notice

This codebase is MIT licensed, which is considered open source. Free to use by any entity without restriction.

## Setup

To run locally, clone the repo down to local machine.

Install dependencies:

```bash
npm i
```

Develop via unit testing:

```bash
npm t
```

## Usage

The first argument is the background color, second is an optional array of text color options.
By default the array contains black and white.

The function will return the first color that passes AAA guidlines requirement of a >7.1 ratio. If none meet the requirement, it will return the best option available in the textColorOptions array.

```js
// Will use default text color options of [#000000, #ffffff]
const result = await findA11ySafeColor('#0000ff')
// {
//   ratio: '8.59',
//   AA: 'pass',
//   AALarge: 'pass',
//   AAA: 'pass',
//   AAALarge: 'pass',
//   color: '#FFFFFF'
// }

...

// Provide your own array of text color options.
// Notice, the returned value doesn't pass AAA guidelines requirement of a >7.1 ratio, but this is the best option available.
const result = await findA11ySafeColor('#0000ff', ['#22dd33', '#d9d9d9', '#48d980', '#010101'])
// {
//   ratio: '6.08',
//   AA: 'pass',
//   AALarge: 'pass',
//   AAA: 'fail',
//   AAALarge: 'pass',
//   color: '#d9d9d9'
// }

```
