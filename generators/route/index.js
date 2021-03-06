'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
	constructor: function() {
		yeoman.generators.Base.apply(this, arguments);

		// Arguments
		this.argument('newRoute', {
			desc: 'New route path ie. "/profile/new"',
			type: String, 
			optional: false,
			required: true
		});

		// Options
		this.option('default', {
			desc: 'Set this route as the "default" route at url "/"',
			alias: 'd',
			type: Boolean
		});
	},
	prompting: function() {
		var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay(
			'Welcome to the awe-inspiring ' + chalk.red('Mithril') + ' generator!'
		));

		// Prompt for user input
		var prompts = [];

		this.prompt(prompts, function(props) {
			this.props = props;
			// To access props later use this.props.someOption;

			done();
		}.bind(this));
	},

	writing: {
		app: function() {
			// Hook is the comment we use to find out insert point
			var hook = '/*===== yeoman hook =====*/';
			// Remove preceding and trailing slashes
			this.newRoute = this.newRoute.replace(/^\/|\/$/g, '');
			var finalRoute = '/' + (this.options.default ? '' : this.newRoute);
			// Split the route path so we can camel case it for use in the file system
			var routeArray = this.newRoute.split('/');
			var ccRoutePath = routeArray.reduce(function(result, current, idx) {
				if(idx > 0) {
					return result + '/' + _.camelCase(current);
				} else {
					return _.camelCase(current);
				}
			}, '');

			// Copy the view template to the project
			this.fs.copy(
				this.templatePath('module/**/*'),
				this.destinationPath('src/modules/' + ccRoutePath)
			);

			// Get out insert code ready to be inserted into the project
			var source = this.fs.read(this.destinationPath('src/index.js'));
			var insert = this.fs.read(this.templatePath('routeInsert.js'));
			insert = insert.replace(/###newRouteURL###/g, finalRoute).replace(/###newRoutePath###/g, './modules/' + ccRoutePath);

			// Write out the new contents to the file system
			if(source.indexOf(insert) < 0)
				this.fs.write(this.destinationPath('src/index.js'), source.replace(hook, insert + '\n\t' + hook));
		}
	}
});