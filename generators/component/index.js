'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
	constructor: function() {
		yeoman.generators.Base.apply(this, arguments);

		// Arguments
		this.argument('componentName', {
			desc: 'New Mithril component name',
			type: String, 
			optional: false,
			required: true
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
			this.componentName = _.camelCase(this.componentName);
			// Copy the model file to the project
			this.fs.copy(
				this.templatePath('component/**/*'),
				this.destinationPath('src/components/' + this.componentName)
			);
		}
	}
});