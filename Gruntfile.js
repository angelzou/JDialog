"use strict";

module.exports = function(grunt) {
	//project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*! <%= pkg.name %> v<%= pkg.version %> |'
		},
		uglify: {
			/*options: {
				banner: '<%= meta.banner %>'
			},*/
			build: {
				src: 'src/<%= pkg.name %>.js',
				dest: 'src/<%= pkg.name %>.min.js'
			},
			/*dist: {
				files: {
					'src/global_modules/jquery.min.js': 'src/global_modules/jquery.js'
				}
			}*/	
		},
		cssmin: {
			options: {
				banner: '<%= meta.banner %>',
			},
			compress: {
				files: {
					'css/ui-jdiablog.min.css': ['css/ui-jdiablog.css']
				}
			}
		}
	});
	
	//加载包含“uglify”任务的插件
	//grunt.loadNpmTasks('grunt-unwrap');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	//默认被执行的任务列表
	grunt.registerTask('default', ['uglify', 'cssmin']);
};
