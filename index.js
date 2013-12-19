
var util = require('util');

/**
 * Constructs a message formatted for consumption by TeamCity.
 *
 * @param {String} type
 * @param {Object} args
 */
var TCMessage = function (type, args) {
	this.type = type;
	this.args = typeof args === 'object' ? args : {};

	this.arg('flowId', TCMessage.flowId);
};

TCMessage.flowId = Math.random().toString().substr(2);

/**
 * Add a keyword argument to the message.
 *
 * @param  {String} key
 * @param  {String} value
 * @return {this}
 */
TCMessage.prototype.arg = function (key, value) {
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
TCMessage.prototype.escape = function (str) {
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
TCMessage.prototype.formatArgs = function() {
	return Object.keys(this.args).map(function(key) {
		return util.format('%s=\'%s\'', key, this.escape(this.args[key]));
	}, this).join(' ');
};

/**
 * Format the message as a string.
 *
 * @return {String}
 */
TCMessage.prototype.toString = function() {
	this.arg('timestamp', new Date().toISOString());
	return util.format('##teamcity[%s %s]', this.type, this.formatArgs());
};

module.exports = TCMessage;
