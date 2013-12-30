
module.exports = function (grunt) {

	var tsm = require('../index');

	var description = 'Log a TeamCity service message.';

	grunt.registerMultiTask('teamcity-message', description, function () {
		var message = new tsm.Message(this.data.type || 'message', this.data.args || {});
		process.stdout.write(message.toString());
	});

};
