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
            genres: [],
            page: 1
        }

        home.search = [];
        home.search.query = "";
        home.search.results = {
            movies: 0,
            pages: 0
        };
        home.search.page = 1;
        home.search.movies = [];

        /**********************************/
        home.yearSlider = {
            minValue: home.filtering.yearLower,
            maxValue: home.filtering.yearHigher,
            options: {
                floor: home.filtering.yearLower,
                ceil: home.filtering.yearHigher,
                step: 1,
                hideLimitLabels: true,
                selectionBarGradient: {
                    from: '#2783d8',
                    to: '#3db879'
                },
                onEnd: getFromSliders,
                id: 'year',
                noSwitching: true,
                hidePointerLabels: true
            }
        };

        home.voteSlider = {
            minValue: home.filtering.voteLower,
            maxValue: home.filtering.voteHigher,
            options: {
                floor: home.filtering.voteLower,
                ceil: home.filtering.voteHigher,
                step: 1,
                hideLimitLabels: true,
                selectionBarGradient: {
                    from: '#2783d8',
                    to: '#3db879'
                },
                onEnd: getFromSliders,
                id: 'vote',
                noSwitching: true,
                hidePointerLabels: true
            }
        };
        /**********************************/

        
        ////////////////
        home.getFilteredMovies = getFilteredMovies;
        home.getMoreFiltered = getMoreFiltered;
        home.getPopularMovies = getPopularMovies;
        home.getUpcomingMovies = getUpcomingMovies;
        home.getSearchMovies = getSearchMovies;
        home.getMoreSearch = getMoreSearch;
        home.filterByGenres = filterByGenres;
        home.isGenreSelected = isGenreSelected;
        home.openNav = openNav;
        home.clearFilters = clearFilters;
               

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
            home.search.movies = [];
            if (home.search.query == "") {
                home.search.results = {
                    movies: 0,
                    pages: 0
                };
            }
            else {
                MoviesFactory.getSearch(home.search.query).then(function(data){
                    home.search.results = data.results;
                    home.search.movies = data.movies;
                    console.log(home.movies);
                });
            }
        }

        function getMoreSearch() {
            ++ home.search.page;
            console.log(home.search);
            MoviesFactory.getSearch(home.search.query, home.search.page).then(function(data){
                data.movies.forEach(function(element) {
                    home.search.movies.push(element);
                });
            });

            console.log(home.search.movies);    
        }

        function getFromSliders(sliderId, modelValue, highValue) {
            switch(sliderId) {
                case "year":
                    home.filtering.yearLower = modelValue;
                    home.filtering.yearHigher = highValue;
                    break;
                case "vote":
                    home.filtering.voteLower = modelValue;
                    home.filtering.voteHigher = highValue;  
                    break;
            }

            getFilteredMovies();
        }

        function getFilteredMovies() {
            MoviesFactory.getFiltered(home.filtering).then(function(data){
                home.results = data.results;
                home.movies = data.movies;
                console.log(home.movies);        
            });
        }

        function getMoreFiltered() {
            ++ home.filtering.page;
            console.log(home.filtering);
            MoviesFactory.getFiltered(home.filtering).then(function(data){
                data.movies.forEach(function(element) {
                    home.movies.push(element);
                });
            });

            console.log(home.movies);        
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
            home.loadingModal = true;
            MoviesFactory.getMovie(movie).then(function(data){
                home.movieSelected = data;
                home.loadingModal = false;
                console.log(home.movieSelected);
            });
        }

        function clearFilters() {
            home.filtering = {
                yearLower: 1900,
                yearHigher: 2017,
                voteLower: 0,
                voteHigher: 10,
                genres: [],
                page: 1
            }  
            home.yearSlider.minValue = home.filtering.yearLower;
            home.yearSlider.maxValue = home.filtering.yearHigher;
            home.voteSlider.minValue = home.filtering.voteLower;
            home.voteSlider.maxValue = home.filtering.voteHigher;

            getFilteredMovies();
        }
    }
})();