(function() {
'use strict';

    angular
        .module('pelisEOI')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'MoviesFactory'];
    function HomeController($scope, MoviesFactory) {
        var home = this;
        home.movies = [];
        home.filtering = {
            yearLower: 1900,
            yearHigher: 2017,
            imdbLower: 0,
            imdbHigher: 10,
            rtcsLower: 0,
            rtcsHigher: 100,
            rtasLower: 0,
            rtasHigher: 100,
            genres: []
        }
        home.totalResults = 0;




        ////////////////
        home.getFilteredMovies = getFilteredMovies;
        home.filterByGenres = filterByGenres;
        home.isGenreSelected = isGenreSelected;
               

        activate();

        ////////////////

        function activate() {
            getFilteredMovies();
        }

        ////////////////

        function getPopularMovies() {
            MoviesFactory.getPopular().then(function(data){
                home.totalResults = data.total;
                home.movies = data.movies;
                console.log(home.movies);
            });
        }
        
        function getFilteredMovies() {
            MoviesFactory.getFiltered(home.filtering).then(function(data){
                home.totalResults = data.total;
                home.movies = data.movies;
                console.log(home.movies);
            });
        }

        function filterByGenres(genreId) {
            var newGenre = true;
            home.filtering.genres.forEach(function(element, position) {
                if (element == genreId) {
                    newGenre = false;
                    home.filtering.genres.splice(position, 1);
                }
            });

            if (newGenre) home.filtering.genres.push(genreId);
            getFilteredMovies();
        }

        function isGenreSelected(genreId) {
            var isSelected = false;
            home.filtering.genres.forEach(function(element, position) {
                if (element == genreId) {
                    isSelected = true;
                }
            });

            return isSelected;
        }
    }
})();