
var TCMessage = require("../index");

exports.testConstructor = function (test) {
	test.expect(3);

	var message = new TCMessage("test");
	test.ok(~message.toString().indexOf("##teamcity[test "), "Constructor should accept a type");

	message = new TCMessage("test", { foo: "bar", baz: "boom" });
	test.ok(~message.toString().indexOf("foo='bar'"), "Constructor should accept args");
	test.ok(~message.toString().indexOf("baz='boom'"), "Constructor should accept multiple args");

	test.done();
};

exports.testDefaults = function (test) {
	test.expect(2);

	var message = new TCMessage("test");
	test.ok(~message.toString().indexOf("timestamp='"), "Message should have a timestamp");
	test.ok(~message.toString().indexOf("flowId='"), "Message should have a flowId");

	test.done();
};

exports.testFlowId = function (test) {
	test.expect(3);

	var now = new Date();
	var message1 = new TCMessage("test1", { timestamp: now.toISOString() });
	var message2 = new TCMessage("test1", { timestamp: now.toISOString() });

	test.ok(~message1.toString().indexOf("flowId='"), "Message should have a flowId");
	test.ok(~message2.toString().indexOf("flowId='"), "Message should have a flowId");
	test.equal(message1.toString(), message2.toString(), "All messages should share a flowId");

	test.done();
};

exports.testEscape = function (test) {
	test.expect(7);

	var escape = TCMessage.prototype.escape;

	test.equal(escape("'"), "|'", "Should escape single quotes");
	test.equal(escape("|"), "||", "Should escape pipes");
	test.equal(escape("\n"), "|n", "Should escape newlines");
	test.equal(escape("\r"), "|r", "Should escape carriage returns");
	test.equal(escape("[]"), "|[|]", "Should escape brackets");
	test.equal(escape("✓"), "|0x2713", "Should escape unicode characters");
	test.equal(escape("'|\n\r[]✓"), "|'|||n|r|[|]|0x2713", "Should escape all special characters");

	test.done();
};

