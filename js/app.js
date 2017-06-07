(function() {
    'use strict';
    angular.module('pelisEOI', ['ngRoute', 'ngYoutubeEmbed', 'rzModule', 'infinite-scroll', 'firebase']).config(config);

    config.$inject=['$routeProvider','$locationProvider'];

    function config ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when("/", {
                controller: 'HomeController as home',
                templateUrl: 'views/home.html'
            })
            .when("https://jorgemarrero.github.io/movies/popular", {
                controller: 'HomeController as home',
                templateUrl: 'https://jorgemarrero.github.io/movies/views/popular.html'
            })
            .when("https://jorgemarrero.github.io/movies/upcoming", {
                controller: 'HomeController as home',
                templateUrl: 'https://jorgemarrero.github.io/movies/views/upcoming.html'
            })
            .when("https://jorgemarrero.github.io/movies/mymovies", {
                controller: 'HomeController as home',
                templateUrl: 'https://jorgemarrero.github.io/movies/views/mymovies.html'
            })
    }
})();
