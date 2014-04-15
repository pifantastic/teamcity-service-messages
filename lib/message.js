
var util = require('util');

/**
 * Constructs a message formatted for consumption by TeamCity.
 *
 * @param {String} type
 * @param {Object} args
 */
var Message = function (type, args) {
	this.type = type;
	this.args = typeof args === 'object' ? args : {};

	this.arg('flowId', this.args.flowId || Message.flowId);
};

Message.flowId = Math.floor(Math.random() * (1e10 - 1e6 + 1)) + 1e6;

/**
 * Add a keyword argument to the message.
 *
 * @param  {String} key
 * @param  {String} value
 * @return {this}
 */
Message.prototype.arg = function (key, value) {
	this.args[key] = value;
	return this;
};

/**
 * Escape string for TeamCity output.
 * http://confluence.jetbrains.com/display/TCD7/Build+Script+Interaction+with+TeamCity
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
			return '|0x' + character.charCodeAt(0).toString(16);
		}
		else {
			return '';
		}
	} );
};

/**
 * Format keyword arguments for use in a message.
 *
 * @return {String}
 */
Message.prototype.formatArgs = function() {
	return Object.keys(this.args).map(function(key) {
		return util.format('%s=\'%s\'', key, this.escape(this.args[key]));
	}, this).join(' ');
};

/**
 * Format the message as a string.
 *
 * @return {String}
 */
Message.prototype.toString = function() {
	if (!this.args.timestamp) {
		this.arg('timestamp', new Date().toISOString());
	}

	return util.format('##teamcity[%s %s]', this.type, this.formatArgs());
};

module.exports = Message;
