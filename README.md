# Country Quiz

## Contents
- [Introduction](#introduction)
- [Setup](#setup)
- [Planned Improvements](#planned-improvements)
- [License](#license)

## Introduction

Simple country naming quiz web app. Click and name all the countries of the world as fast as possible.

Uses [panzoom](https://github.com/anvaka/panzoom) for panning and zooming functionality.

Map geometry `data/map.svg` is based on map data from [Simple Maps](https://simplemaps.com/resources/svg-world).

## Setup

Make sure you have [npm](https://www.npmjs.com/package/npm) installed and navigate to the root directory.

Then, install dependencies:

    $ npm install

Run the development server:

    $ npm run serve

Or build the app for deployment:

    $ npm run build

## Planned Improvements

- Add support for small screens and touch controls.
- Separate out generic code for click-and-name games from any quiz-specific data.

## License

Licensed under [MIT](./LICENSE).

Original license for the [Simple Maps](http://simplemaps.com) map data is attached as [MAP-LICENSE](./MAP-LICENSE).