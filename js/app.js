(function() {
    'use strict';
    angular.module('pelisEOI', ['ngRoute']).config(config);

    config.$inject=['$routeProvider','$locationProvider'];

    function config ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when("/", {
                controller: 'HomeController as home',
                templateUrl: '/views/home.html'
            })
            .when("/populares", {
                controller: 'PopularController',
                templateUrl: '/views/home.html'
            })
            .when("/proximamente", {
                controller: 'ProximamenteController',
                templateUrl: '/views/home.html'
            })

    }

})();