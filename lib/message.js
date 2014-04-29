var util = require('util');

/**
 * Pad input string from left with paddingValue up to paddingValue.length.
 * @see http://stackoverflow.com/a/14760377/737477
 *
 * @param {String} str
 * @param {String} paddingValue
 * @return {String}
 */
var padLeft = function (str, paddingValue) {
	return String(paddingValue + str).slice(-paddingValue.length);
};

/**
 * Constructs a message formatted for consumption by TeamCity.
 *
 * @param {String} type
 * @param {Object} args
 */
var Message = function (type, args) {
	this.type = type;
	this.single = false;

	// Message is a 'multiple attribute message'.
	if (typeof args === 'object' || typeof args === 'undefined') {
		this.args = args || {};
	}
	// Message is a 'single attribute message'.
	else {
		this.single = true;
		this.args = args;
	}

	if (!this.single) {
		this.arg('flowId', this.args.flowId || Message.flowId);
	}
};

Message.flowId = Math.floor(Math.random() * (1e10 - 1e6 + 1)) + 1e6;

/**
 * Add a keyword argument to the message.
 *
 * @param  {String} key
 * @param  {String} value
 * @return {Message}
 */
Message.prototype.arg = function (key, value) {
	if (this.single) {
		throw new Error('Cannot add arguments to a single attribute message.');
	}

	this.args[key] = value;
	return this;
};

/**
 * Escape string for TeamCity output.
 * @see http://confluence.jetbrains.com/display/TCD8/Build+Script+Interaction+with+TeamCity#BuildScriptInteractionwithTeamCity-ServiceMessages
 *
 * @param  {String} str
 * @return {String}
 */
Message.prototype.escape = function (str) {
	var replacer = /['\n\r\|\[\]\u0100-\uffff]/g;

	var map = {
		'\'': '|\'',
		'|': '||',
		'\n': '|n',
		'\r': '|r',
		'[': '|[',
		']': '|]'
	};

	return str.toString().replace(replacer, function (character) {
		if (character in map) {
			return map[character];
		}
		else if (/[^\u0000-\u00ff]/.test(character)) {
			return '|0x' + padLeft(character.charCodeAt(0).toString(16), '0000');
		}
		else {
			return '';
		}
	});
};

/**
 * Format keyword arguments for use in a message.
 *
 * @return {String}
 */
Message.prototype.formatArgs = function () {
	return Object.keys(this.args).map(function (key) {
		return util.format('%s=\'%s\'', key, this.escape(this.args[key]));
	}, this).join(' ');
};

/**
 * Format the message as a string.
 *
 * @return {String}
 */
Message.prototype.toString = function () {
	if (this.single) {
		return util.format('##teamcity[%s \'%s\']', this.type, this.escape(this.args));
	}

	if (!this.args.timestamp) {
		// TeamCity not fully support ISO 8601 (see TW-36173) so we need to cut off 'Z' at the end.
		this.arg('timestamp', new Date().toISOString().slice(0, -1));
	}

	return util.format('##teamcity[%s %s]', this.type, this.formatArgs());
};

module.exports = Message;
