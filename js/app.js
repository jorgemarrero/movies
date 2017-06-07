(function() {
    'use strict';
    angular.module('pelisEOI', ['ngRoute', 'ngYoutubeEmbed', 'rzModule', 'infinite-scroll', 'firebase']).config(config);

    config.$inject=['$routeProvider','$locationProvider'];

    function config ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when("/", {
                controller: 'HomeController as home',
                templateUrl: '/views/home.html'
            })
            .when("/popular", {
                controller: 'HomeController as home',
                templateUrl: '/views/popular.html'
            })
            .when("/upcoming", {
                controller: 'HomeController as home',
                templateUrl: '/views/upcoming.html'
            })
            .when("/mymovies", {
                controller: 'HomeController as home',
                templateUrl: '/views/mymovies.html'
            })
    }
})();