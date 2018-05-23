# RingaJS Application Template

This application template can be used as a foundation for a Ringa application that uses the Ringa component library.

# Setup

* Node 8.7.0 (recommended)
* Webpack 3.8.1
* React 16.1.0
* Ringa 0.2.1
* Ringa React Framework 0.2.2
* Babel Transpiling from ES6 to ES5
* Development (hot reloading) and Production (uglified) Builds

# Installing

`npm install`

# Development

Run the development build for a live-update Webpack development server.

`npm start`

# Build Production

Build an uglified fully packaged production build that is ready to go:

`npm run prod`

The full production build, all assets, is only **193kb gzipped** for everything.

# Test Production Build

To test the uglified production build (to make sure the uglified code does not break), run:

`npm run prod:test`

# Analyze Production Build

If you want to analyze the uglified size of your final production build, you can run:

`npm run prod:analyze`

**Note that building production build minifies the Javascript. Ringa JS needs to have its mangle whitelist updated or else your production build will break.**

To edit the mangle list, find it in `config/ugligyMangleWhitelist.json`. See [Preparing for Production](http://ringajs.com/architecture/dependencyInjection/#17-preparing-for-production-uglify) for more information.
 
# Test Production Build in Browser

You can use this test locally to verify your production build is running properly.

**Note: this requires `npm i -g nws` to run:**

`npm run prod:test`

This will run the production build, put it into `dist` and then run a mini web-server from the dist folder.

# Analyze Production Build

`npm run prod:analyze`

License
=======

The MIT License (MIT)

Copyright (c) 2017 Joshua Jung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.