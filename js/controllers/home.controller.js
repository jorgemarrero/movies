(function() {
'use strict';

    angular
        .module('pelisEOI')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'MoviesFactory'];
    function HomeController($scope, MoviesFactory) {
        var home = this;
        home.movies = {};
        

        activate();

        ////////////////

        function activate() {
            MoviesFactory.getPopular().then(function(data){
                home.movies = data;
            });

        }

    }
})();