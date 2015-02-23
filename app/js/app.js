/*global angular */
/*jshint unused:false */
'use strict';

/**
 * The main TodoMVC app module
 *
 * @type {angular.Module}
 */
var todomvc = angular.module('todomvc', [ 'ngRoute', 'ngResource' ]);

angular.element(document).ready(function () {
    var liveOak = LiveOak({
        auth: {
            appClientId: 'todomvc-html-client',
            realm: 'liveoak-apps'
        }
    });

    liveOak.auth.init({ onLoad: 'login-required' }).success(function () {
        if (liveOak.auth.hasResourceRole('admin', 'todomvc')) {
            liveOak.app().create('/storage', { id: 'todos' }, {
                success: function (data) {
                },
                error: function (data) {
                }
            });
        }

        todomvc.factory('LiveOak', function () {
            return liveOak;
        });

        angular.bootstrap(document, ["todomvc"]);
    }, function () {
        alert('authentication failed');
    });
});
