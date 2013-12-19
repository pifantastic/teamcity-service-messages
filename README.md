# TeamCity Service Messages

From the [TeamCity documentation](http://confluence.jetbrains.com/display/TCD7/Build+Script+Interaction+with+TeamCity):

> If TeamCity doesn't support your testing framework or build runner out of the box, you
> can still avail yourself of many TeamCity benefits by customizing your build scripts to
> interact with the TeamCity |server. This makes a wide range of features available to any
> team regardless of their testing frameworks and runners. Some of these features include
> displaying real-time test results and customized statistics, changing the build status,
> and publishing artifacts before the build is finished.

## Installation

```shell
npm install teamcity-service-messages --save
```

## Usage

```javascript

var TCMessage = require('teamcity-service-messages');

var message = new TCMessage('testStarted', {
	name: 'my test'
});

console.log(message.toString());
```

Outputs:

```
##teamcity[testStarted name='my test' flowId='023565345909446478' timestamp='2013-12-19T19:54:24.449Z']
```

## TODO

Sugar for specific messages types.

## License

Copyright (c) 2013 Aaron Forsander

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
