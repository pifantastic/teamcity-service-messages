
var Message = exports.Message = require('./lib/message');

exports.stdout = true;
exports.autoFlowId = true;

[
	'blockClosed',
	'blockOpened',
	'buildNumber',
	'buildProblem',
	'buildStatisticValue',
	'buildStatus',
	'compilationFinished',
	'compilationStarted',
	'disableServiceMessages',
	'enableServiceMessages',
	'importData',
	'message',
	'progressFinish',
	'progressMessage',
	'progressStart',
	'publishArtifacts',
	'setParameter',
	'testFailed',
	'testFinished',
	'testIgnored',
	'testStarted',
	'testStdErr',
	'testStdOut',
	'testSuiteFinished',
	'testSuiteStarted'
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
