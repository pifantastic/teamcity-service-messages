
var assert = require("assert");

var tsm = require("../dist");
var Message = tsm.Message;

describe("teamcity-service-messages", function () {
	it("testConstructor", function () {
		var message = new Message("test");
		assert.ok(~message.toString().indexOf("##teamcity[test "), "Constructor should accept a type");

		message = new Message("test", { foo: "bar", baz: "boom" });
		assert.ok(~message.toString().indexOf("foo='bar'"), "Constructor should accept args");
		assert.ok(~message.toString().indexOf("baz='boom'"), "Constructor should accept multiple args");
	});

	it("testDefaults", function () {
		var message = new Message("test").toString();
		assert.ok(~message.indexOf("timestamp='"), "Message should have a timestamp");
		assert.ok(/timestamp='[-T.:\d]+'/.test(message), "Message should not have 'Z' in timestamp");
		assert.ok(~message.indexOf("flowId='"), "Message should have a flowId");
	});

	it("testFlowId", function () {
		var now = new Date();
		var message1 = new Message("test", { timestamp: now.toISOString() });
		var message2 = new Message("test", { timestamp: now.toISOString() });

		assert.ok(~message1.toString().indexOf("flowId='"), "Message should have a flowId");
		assert.ok(~message2.toString().indexOf("flowId='"), "Message should have a flowId");
		assert.equal(message1.toString(), message2.toString(), "All messages should share a flowId");

		var message = new Message("test", { flowId: "flow" });
		assert.ok(~message.toString().indexOf("flowId='flow'"), "flowId can be overridden");

		message = new Message("test");
		message.arg("flowId", "flow");
		assert.ok(~message.toString().indexOf("flowId='flow'"), "flowId can be overridden");

		tsm.autoFlowId = false;

		message = new Message("test", { timestamp: now.toISOString() });
		assert.ok(message.toString().indexOf("flowId=") === -1, "flowIds can be globally disabled");
	});

	it("testEscape", function () {
		var escape = Message.prototype.escape;

		assert.equal(escape(), "", "Should handle 'undefined' input");
		assert.equal(escape("'"), "|'", "Should escape single quotes");
		assert.equal(escape("|"), "||", "Should escape pipes");
		assert.equal(escape("\n"), "|n", "Should escape newlines");
		assert.equal(escape("\r"), "|r", "Should escape carriage returns");
		assert.equal(escape("[]"), "|[|]", "Should escape brackets");
		assert.equal(escape("\u0085"), "|x", "Should escape next line");
		assert.equal(escape("\u2028"), "|l", "Should escape line separator");
		assert.equal(escape("\u2029"), "|p", "Should escape paragraph separator");
	});

	it("testChainableApi", function () {
		// Hijack console.log for this test.
		var logged = '', oldConsoleLog = console.log;
		console.log = function (str) {
			logged = str;
		};

		tsm.blockOpened();
		assert.ok(~logged.indexOf("##teamcity[blockOpened "), "Should correctly set the message type");

		tsm.blockOpened({ foo: "bar" });
		assert.ok(~logged.indexOf("foo='bar'"), "Should accept args");

		assert.strictEqual(tsm.message(), tsm, "Should be chainable");

		tsm.message(3.14);
		assert.ok(~logged.indexOf("##teamcity[message '3.14']"), "Chainable API should handle single attribute messages with numbers");

		console.log = oldConsoleLog;
	});

	it("testSingleAttribute", function () {
		var message = new Message("test", "value");
		assert.ok(~message.toString().indexOf("##teamcity[test 'value']"), "Constructor should handle single attribute messages with strings");

		message = new Message("test", 123);
		assert.ok(~message.toString().indexOf("##teamcity[test '123']"), "Constructor should handle single attribute messages with numbers");

		message = new Message("test", 123);
		assert.throws(function () {
			message.arg('foo', 'bar');
		}, "Adding an arg to a single message should throw an error");
	});
});
