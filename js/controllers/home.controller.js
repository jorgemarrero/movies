(function() {
'use strict';

    angular
        .module('pelisEOI')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'MoviesFactory'];
    function HomeController($scope, MoviesFactory) {
        var home = this;
        home.movies = [];
        home.movieSelected = {
            video: undefined
        };
        home.filtering = {
            yearLower: 1900,
            yearHigher: 2017,
            voteLower: 0,
            voteHigher: 10,
            genres: []
        }

        home.search = [];
        home.search.query = "";
        home.search.totalResults = 0;
        home.search.movies = [];

        home.totalResults = 0;

        /**********************************/
        home.slider = {
            minValue: 10,
            maxValue: 90,
            options: {
                floor: 0,
                ceil: 100,
                step: 1
            }
        };
        /**********************************/

        
        ////////////////
        home.getFilteredMovies = getFilteredMovies;
        home.getPopularMovies = getPopularMovies;
        home.getUpcomingMovies = getUpcomingMovies;
        home.getSearchMovies = getSearchMovies;
        home.filterByGenres = filterByGenres;
        home.isGenreSelected = isGenreSelected;
        home.openNav = openNav;
               

        activate();

        ////////////////

        function activate() {
        }

        ////////////////
       
        function getPopularMovies() {
            MoviesFactory.getPopular().then(function(data){
                home.totalResults = data.total;
                home.movies = data.movies;
                console.log(home.movies);
            });
        }

        function getUpcomingMovies() {
            MoviesFactory.getUpcoming().then(function(data){
                home.totalResults = data.total;
                home.movies = data.movies;
                console.log(home.movies);
            });
        }

        function getSearchMovies() {
            if (home.search.query == "") {
                home.search.totalResults = 0;
                home.search.movies = [];
            }
            else {
                MoviesFactory.getSearch(home.search.query).then(function(data){
                    home.search.totalResults = data.total;
                    home.search.movies = data.movies;
                    console.log(home.movies);
                });
            }
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

        /////////////

        function openNav(movie) {
            console.log(movie);
            MoviesFactory.getMovie(movie).then(function(data){
                home.movieSelected = data;
                console.log(home.movieSelected);
            });
        }
    }
})();