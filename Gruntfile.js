
module.exports = function (grunt) {

	grunt.initConfig({
		jshint: {
			options: {},
			lib: {
				src: ['index.js', 'lib/**/*.js']
			},
			task: {
				src: ['tasks/**/*.js']
			}
		},
		nodeunit: {
			all: ['tests/index.js']
		},
		'teamcity-message': {
			main: {
				type: 'message',
				args: {
					text: 'test!'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadTasks('./tasks');

	grunt.registerTask('default', ['jshint', 'nodeunit']);
	grunt.registerTask('test', ['nodeunit']);

};
