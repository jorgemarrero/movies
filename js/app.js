(function() {
    'use strict';
    angular.module('pelisEOI', ['ngRoute', 'ngYoutubeEmbed', 'rzModule', 'infinite-scroll', 'firebase']).config(config);

    config.$inject=['$routeProvider','$locationProvider'];

    function config ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when("https://jorgemarrero.github.io/movies/", {
                controller: 'HomeController as home',
                templateUrl: 'https://jorgemarrero.github.io/movies/views/home.html'
            })
            .when("/popular", {
                controller: 'HomeController as home',
                templateUrl: 'https://jorgemarrero.github.io/movies/views/popular.html'
            })
            .when("/upcoming", {
                controller: 'HomeController as home',
                templateUrl: 'https://jorgemarrero.github.io/movies/views/upcoming.html'
            })
            .when("/mymovies", {
                controller: 'HomeController as home',
                templateUrl: 'https://jorgemarrero.github.io/movies/views/mymovies.html'
            })
    }
})();
