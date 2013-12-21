
var Message = exports.Message = require('./lib/message');

exports.stdout = true;

[
	'blockOpened',
	'blockClosed',
	'message',
	'compilationStarted',
	'compilationFinished',
	'testSuiteStarted',
	'testSuiteFinished',
	'testStarted',
	'testFinished',
	'testFailed',
	'testIgnored',
	'testStdOut',
	'testStdErr',
	'publishArtifacts',
	'progressMessage',
	'progressStart',
	'progressFinish',
	'buildStatus',
	'buildNumber',
	'setParameter',
	'buildStatisticValue',
	'enableServiceMessages',
	'disableServiceMessages',
	'importData'
]
.forEach(function (message) {
	exports[message] = function (args) {
		var output = new Message(message, args).toString();
		if (exports.stdout) {
			console.log(output);
			return exports;
		}
		else {
			return output;
		}
	};
});
