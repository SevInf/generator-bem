'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var BemGenerator = module.exports = function BemGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        this.installDependencies({ skipInstall: options['skip-install'] });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
    this.libs = [];
};

util.inherits(BemGenerator, yeoman.generators.Base);

BemGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // have Yeoman greet the user.
    console.log(this.yeoman);

    var prompts = [
        {
            name: 'projectName',
            message: 'What is your project name?'
        },
        {
            type: 'confirm',
            name: 'bemCore',
            message: 'Would you like to include bem-core?',
            default: true
        },

    ];

    this.prompt(prompts, function (props) {
        this.projectName = props.projectName;

        if (props.bemCore) {
            this.libs.push({
                name: 'bem-core',
                version: '9e5dc255421304fd652552c948cdf7af35dc8a68'
            });
            var prompt = {
                type: 'confirm',
                name: 'bemComponents',
                message: 'Would you like to include bem-components?',
                default: true
            };
            this.prompt(prompt, function (props) {
                if (props.bemComponents) {
                    this.libs.push({
                        name: 'bem-components',
                        version: 'bem/bem-components#231b03867325a51a33ae6bdd300b12946944a4de'
                    });
                }
                cb();
            }.bind(this));
        } else {
            cb();
        }

    }.bind(this));
};

BemGenerator.prototype.app = function app() {
    this.mkdir('desktop.blocks');
    this.mkdir('desktop.blocks/page');
    this.copy('_page.css', 'desktop.blocks/page/page.css');

    this.mkdir('desktop.bundles');
    this.mkdir('desktop.bundles/index');
    this.copy('_index.bemjson.js', 'desktop.bundles/index/index.bemjson.js');

    this.mkdir('.bem');
    this.copy('_level.js', '.bem/level.js');
    this.template('_make.js', '.bem/make.js');

    this.mkdir('.bem/techs');
    this.copy('_bemjson.js.js', '.bem/techs/bemjson.js.js');

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.copy('bowerrc', '.bowerrc');
};

BemGenerator.prototype.projectfiles = function projectfiles() {
};
