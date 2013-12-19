
# TeamCity Service Messages

From the [TeamCity documentation](http://confluence.jetbrains.com/display/TCD7/Build+Script+Interaction+with+TeamCity):

	If TeamCity doesn't support your testing framework or build runner out of the box, you
	can still avail yourself of many TeamCity benefits by customizing your build scripts to
	interact with the TeamCity |server. This makes a wide range of features available to any
	team regardless of their testing frameworks and runners. Some of these features include
	displaying real-time test results and customized statistics, changing the build status,
	and publishing artifacts before the build is finished.

## Installation

```shell
npm install teamcity-service-message --save
```

## Usage

```javascript

var TCMessage = require('teamcity-service-message');

var message = new TCMessage('testStarted', {
	name: 'my test'
});

console.log(message.toString());
```

Outputs:

```
##teamcity[testStarted name='my test' flowId='023565345909446478' timestamp='2013-12-19T19:54:24.449Z']
```
