angular.module("templates").run(["$templateCache", function($templateCache) {$templateCache.put("app/index.html","<!DOCTYPE html><html ng-app=\"\" ng-strict-di=\"\"><head lang=en><meta charset=UTF-8><title></title><link rel=stylesheet href=../bower_components/bootstrap/dist/css/bootstrap.css><link rel=stylesheet href=../bower_components/font-awesome/css/font-awesome.css><link rel=stylesheet href=/.tmp/main.css></head><body><script src=../bower_components/jquery/dist/jquery.js></script><script src=../bower_components/angular/angular.js></script><script src=../bower_components/bootstrap/dist/js/bootstrap.js></script><script src=../bower_components/moment/moment.js></script><script src=/client/app.js></script></body></html>");
$templateCache.put("app/test.html","<!DOCTYPE html><html><head lang=en><meta charset=UTF-8><meta http-equiv=X-UA-Compatible content=\"IE=edge, chrome=1\"><meta name=viewport content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no\"><title>gulp</title><style>\n        body {\n            font: 20px/1.5 \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n            padding-left: 20px;\n        }\n    </style><link rel=stylesheet href=node_modules/mocha/mocha.css></head><body><h1><a href=specs.html>Spec Runner</a></h1><p><strong>Make sure the REMOTE server is running</strong><br>Click on a <em>description title</em> to narrow the scope to just its specs (see \"<a href=http://mochajs.github.io/mocha/#grep-option target=_blank title=\"MochaJS grep option\">?grep</a>\" in address bar).<br>Click on a <em>spec title</em> to see the test implementation.<br>Click on <em>page title</em> to start over.</p><div id=mocha></div><script>\n        expect = chai.expect;\n        AssertionError = chai.AssertionError;\n        mocha.setup(\'bdd\');\n        mocha.traceIgnores = [\'mocha.js\', \'chai.js\', \'angular.js\'];\n    </script><script>\n        mocha.run();\n    </script></body></html>");}]);