
var tsm = require("../index");
var Message = tsm.Message;

exports.testConstructor = function (test) {
	test.expect(3);

	var message = new Message("test");
	test.ok(~message.toString().indexOf("##teamcity[test "), "Constructor should accept a type");

	message = new Message("test", { foo: "bar", baz: "boom" });
	test.ok(~message.toString().indexOf("foo='bar'"), "Constructor should accept args");
	test.ok(~message.toString().indexOf("baz='boom'"), "Constructor should accept multiple args");

	test.done();
};

exports.testDefaults = function (test) {
	test.expect(2);

	var message = new Message("test");
	test.ok(~message.toString().indexOf("timestamp='"), "Message should have a timestamp");
	test.ok(~message.toString().indexOf("flowId='"), "Message should have a flowId");

	test.done();
};

exports.testFlowId = function (test) {
	test.expect(5);

	var now = new Date();
	var message1 = new Message("test", { timestamp: now.toISOString() });
	var message2 = new Message("test", { timestamp: now.toISOString() });

	test.ok(~message1.toString().indexOf("flowId='"), "Message should have a flowId");
	test.ok(~message2.toString().indexOf("flowId='"), "Message should have a flowId");
	test.equal(message1.toString(), message2.toString(), "All messages should share a flowId");

	var message = new Message("test", { flowId: "flow" });
	test.ok(~message.toString().indexOf("flowId='flow'"), "flowId can be overridden");

	message = new Message("test");
	message.arg("flowId", "flow");
	test.ok(~message.toString().indexOf("flowId='flow'"), "flowId can be overridden");

	test.done();
};

exports.testEscape = function (test) {
	test.expect(9);

	var escape = Message.prototype.escape;

	test.equal(escape("'"), "|'", "Should escape single quotes");
	test.equal(escape("|"), "||", "Should escape pipes");
	test.equal(escape("\n"), "|n", "Should escape newlines");
	test.equal(escape("\r"), "|r", "Should escape carriage returns");
	test.equal(escape("[]"), "|[|]", "Should escape brackets");
	test.equal(escape("✓"), "|0x2713", "Should escape unicode characters");
	test.equal(escape("\u0100"), "|0x0100", "Should correctly pad unicode characters");
	test.equal(escape("я"), "|0x044f", "Should escape russian characters");
	test.equal(escape("'|\n\r[]✓"), "|'|||n|r|[|]|0x2713", "Should escape all special characters");

	test.done();
};

exports.testChainableApi = function (test) {
	test.expect(4);

	// Hijack console.log for this test.
	var logged = '', oldConsoleLog = console.log;
	console.log = function (str) {
		logged = str;
	};

	tsm.blockOpened();
	test.ok(~logged.indexOf("##teamcity[blockOpened "), "Should correctly set the message type");

	tsm.blockOpened({ foo: "bar" });
	test.ok(~logged.indexOf("foo='bar'"), "Should accept args");

	test.strictEqual(tsm.message(), tsm, "Should be chainable");

	tsm.message(3.14);
	test.ok(~logged.indexOf("##teamcity[message '3.14']"), "Chainable API should handle single attribute messages with numbers");

	console.log = oldConsoleLog;

	test.done();
};

exports.testSingleAttribute = function (test) {
	test.expect(3);

	var message = new Message("test", "value");
	test.ok(~message.toString().indexOf("##teamcity[test 'value']"), "Constructor should handle single attribute messages with strings");

	message = new Message("test", 123);
	test.ok(~message.toString().indexOf("##teamcity[test '123']"), "Constructor should handle single attribute messages with numbers");

	message = new Message("test", 123);
	test.throws(function () {
		message.arg('foo', 'bar');
	}, "Adding an arg to a single message should throw an error");

	test.done();
};

