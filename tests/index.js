
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
	test.expect(7);

	var escape = Message.prototype.escape;

	test.equal(escape("'"), "|'", "Should escape single quotes");
	test.equal(escape("|"), "||", "Should escape pipes");
	test.equal(escape("\n"), "|n", "Should escape newlines");
	test.equal(escape("\r"), "|r", "Should escape carriage returns");
	test.equal(escape("[]"), "|[|]", "Should escape brackets");
	test.equal(escape("✓"), "|0x2713", "Should escape unicode characters");
	test.equal(escape("'|\n\r[]✓"), "|'|||n|r|[|]|0x2713", "Should escape all special characters");

	test.done();
};

exports.testApi = function (test) {
	test.expect(3);

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

	console.log = oldConsoleLog;

	test.done();
};

