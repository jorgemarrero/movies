(function () {
    'use strict';

    angular
        .module('pelisEOI')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'MoviesFactory', 'FirebaseFactory'];

    function HomeController($scope, MoviesFactory, FirebaseFactory) {
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
        home.getMyMovies = getMyMovies;
        home.getSearchMovies = getSearchMovies;
        home.getMoreSearch = getMoreSearch;
        home.filterByGenres = filterByGenres;
        home.isGenreSelected = isGenreSelected;
        home.openNav = openNav;
        home.clearFilters = clearFilters;

        home.signIn = signIn;
        home.addFav = addFav;
        home.toWatch = toWatch;


        activate();

        ////////////////

        function activate() {
            home.auth = FirebaseFactory.getAuth();

            firebase.auth().onAuthStateChanged(function(firebaseUser) {
                if (firebaseUser) {
                    home.firebaseUser = firebaseUser;
                    console.log("logeado");
                } else {
                    home.firebaseUser = null;
                    console.log("no logeado");
                }
                $scope.$apply();
            }, function(error) {
                console.log(error);
            });            
        }

        /* FIREBASE */
        function signIn(movie) {
            FirebaseFactory.signIn(movie);
        }

        function addFav(movie) {
            FirebaseFactory.addFav(movie);
        }

        function toWatch(movie) {
            FirebaseFactory.toWatch(movie);
        }
        /************/

        function getPopularMovies() {
            MoviesFactory.getPopular().then(function (data) {
                home.totalResults = data.total;
                home.movies = data.movies;
                console.log(home.movies);
            });
        }

        function getUpcomingMovies() {
            MoviesFactory.getUpcoming().then(function (data) {
                home.totalResults = data.total;
                console.log(data.movies);
                home.movies = data.movies;
                console.log(home.movies);
            });
        }

        function getMyMovies() {
            var userId = firebase.auth().currentUser.uid;
            home.movies = {};
            firebase.database().ref('/favs/' + userId).once('value').then(function(snapshot) {
                home.movies.favs = $.map(snapshot.val(), function(value, index) {
                    return [value];
                });
                $scope.$apply();
                console.log(home.movies.favs);
            });
            firebase.database().ref('/towatch/' + userId).once('value').then(function(snapshot) {
                home.movies.towatch = $.map(snapshot.val(), function(value, index) {
                    return [value];
                });
                $scope.$apply();
                console.log(home.movies.towatch);
            });        
        }

        function getSearchMovies() {
            home.search.movies = [];
            if (home.search.query == "") {
                home.search.results = {
                    movies: 0,
                    pages: 0
                };
            } else {
                MoviesFactory.getSearch(home.search.query).then(function (data) {
                    home.search.results = data.results;
                    home.search.movies = data.movies;
                    console.log(home.movies);
                });
            }
        }

        function getMoreSearch() {
            ++home.search.page;
            console.log(home.search);
            MoviesFactory.getSearch(home.search.query, home.search.page).then(function (data) {
                data.movies.forEach(function (element) {
                    home.search.movies.push(element);
                });
            });

            console.log(home.search.movies);
        }

        function getFromSliders(sliderId, modelValue, highValue) {
            switch (sliderId) {
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
            MoviesFactory.getFiltered(home.filtering).then(function (data) {
                home.results = data.results;
                home.movies = data.movies;
                console.log(home.movies);
            });
        }

        function getMoreFiltered() {
            ++home.filtering.page;
            console.log(home.filtering);
            MoviesFactory.getFiltered(home.filtering).then(function (data) {
                data.movies.forEach(function (element) {
                    home.movies.push(element);
                });
            });

            console.log(home.movies);
        }

        function filterByGenres(genreId) {
            var newGenre = true;
            home.filtering.genres.forEach(function (element, position) {
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
            home.filtering.genres.forEach(function (element, position) {
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
            MoviesFactory.getMovie(movie).then(function (data) {
                home.movieSelected = data;
                home.movieSelected.subtitles = {};
                home.loadingModal = false;
                
                console.log(home.movieSelected);

                getSubtitles(home.movieSelected.imdb_id).then(function (subs) {
                    console.log(subs);
                    var toReturn;
                    toReturn = {
                        en: subs.en.url,
                        es: subs.es.url,
                        de: subs.de.url
                    }
                    $scope.$apply(() =>  home.movieSelected.subtitles = toReturn);
                });;

                console.log(home.movieSelected);
            
            });
        }

        function getSubtitles(imdb_id) {
            const OS = require('opensubtitles-api');
            const OpenSubtitles = new OS({
                useragent: 'OSTestUserAgentTemp',
                username: 'Balaenidae',
                password: 'pepe123',
                ssl: true
            });

            OpenSubtitles.login()
                .then(res => {
                    console.log(res.token);
                    console.log(res.userinfo);
                })
                .catch(err => {
                    console.log(err);
                });

            return OpenSubtitles.search({
                imdbid: imdb_id, // 'tt528809' is fine too.
                }).then((subtitles) => {
                    console.log(subtitles);

                    return subtitles;
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