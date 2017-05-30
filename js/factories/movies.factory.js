(function() {
'use strict';

    angular
        .module('pelisEOI')
        .factory('MoviesFactory', MoviesFactory);

    MoviesFactory.$inject = ['$http'];
    function MoviesFactory($http) {
        
        var API_KEY = "7e2860525bbac2fa58d9b1fcb55830f9";
        var API_KEY_OMDB = "3370463f";


        return {
            getPopular: getPopular,
            getFiltered: getFiltered,
            getMovie: getMovie,
            getRatings: getRatings
        }

        /////////////////////////////////////////
        
        function getPopular() {
            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
            })
            .then (function(data) {
                console.log(data);
                var toReturn = [];
                toReturn.total = data.data.total_results;
                toReturn.movies = data.data.results;
                return toReturn;
            });
        }

        function getFiltered(filter) {
            console.log(filter);
            var minVotesToShow = 50;
            
            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/discover/movie?api_key=" 
                        + API_KEY
                        + "&language=en-US"
                        + "&sort_by=popularity.desc"
                        + "&include_adult=false"
                        + "&include_video=false"
                        + "&page=1"
                        + "&primary_release_date.gte=" + filter.yearLower
                        + "&primary_release_date.lte=" + filter.yearHigher
                        + "&vote_count.gte=" + minVotesToShow
                        + "&vote_average.gte=" + filter.voteLower
                        + "&vote_average.lte=" + filter.voteHigher
                        + "&with_genres=" + filter.genres.join()
            })
            .then (function(data) {
                var toReturn = [];
                toReturn.total = data.data.total_results;
                toReturn.movies = data.data.results;
                return toReturn;
            });        
        }
        
        function getMovie(movie) {
            console.log(movie);

            var toReturn = {
                title: movie.title,
                year: movie.release_date.slice(0, 4),
                poster_path: movie.poster_path,
                genres: getGenresMovie(movie.genre_ids),
                description: movie.overview,
                votes: {
                    tmdb: movie.vote_average
                }
            };

            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/movie/" + movie.id + "?api_key=" + API_KEY
            })
            .then ((data) => getMovieSucess(data, toReturn, movie)); 
            /*.then (resolve(toReturn, movie) );  */
        }

/*        function resolve(toReturn, movie){
            return function (data){

            }
        }*/

        function getRatings(id) {
            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/movie/" + id + "?api_key=" + API_KEY
            })
            .then (function(data) {
                console.log(data);
                console.log(data.data.imdb_id);

                return $http({
                    method : "GET",
                    url : "http://www.omdbapi.com/?apikey=3370463f&i=" + data.data.imdb_id
                })
                .then (function(data) {
                    console.log(data);
                    return true;
                });
            });    

        }

        /////////////////////////////

        function getMovieSucess(data, toReturn, movie) {
            console.log(data);
            toReturn.runtime = {
                hours: Math.floor(data.data.runtime / 60),
                minutes: data.data.runtime % 60
            }
            toReturn.imdb_id = data.data.imdb_id;

            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/movie/" + movie.id + "/videos?api_key=" + API_KEY
            })
            .then ((videos) => getMovieVideo(videos, toReturn));
        }

        function getMovieVideo(videos, toReturn) {
            toReturn.video = videos.data.results[0].key;
            return toReturn;
/*            return $http({
                method : "GET",
                url : "http://www.omdbapi.com/?apikey=" + API_KEY_OMDB + "&i=" + toReturn.imdb_id
            })
            .then ((rating) => getMovieRating(rating, toReturn));*/
        }

        function getMovieRating(rating, toReturn) {
            console.log(rating);
            toReturn.votes = {
                rt: rating.data.Rating[1].value,
                mc: rating.data.Rating[2].value
            };
            return toReturn;
        }

        /////////////////////////////

        function getGenresMovie(genresIds) {
            var toReturn = [];
            genresIds.forEach(function(element) {
                switch(element) {
                    case 28:
                        toReturn.push("Acción");
                        break;
                    case 12:
                        toReturn.push("Aventura");
                        break;
                    case 16:
                        toReturn.push("Animación");
                        break;
                    case 35:
                        toReturn.push("Comedia");
                        break;
                    case 80:
                        toReturn.push("Crimen");
                        break;
                    case 99:
                        toReturn.push("Documental");
                        break;
                    case 18:
                        toReturn.push("Drama");
                        break;
                    case 10751:
                        toReturn.push("Familiar");
                        break;
                    case 14:
                        toReturn.push("Fantasía");
                        break;
                    case 878:
                        toReturn.push("Ficción");
                        break;
                    case 10752:
                        toReturn.push("Guerra");
                        break;
                    case 36:
                        toReturn.push("Históricas");
                        break;
                    case 27:
                        toReturn.push("Horror");
                        break;
                    case 9648:
                        toReturn.push("Misterio");
                        break;
                    case 10402:
                        toReturn.push("Música");
                        break;
                    case 10749:
                        toReturn.push("Romance");
                        break;
                    case 53:
                        toReturn.push("Thriller");
                        break;
                    case 10770:
                        toReturn.push("TV Movies");
                        break;
                    case 37:
                        toReturn.push("Western");
                        break;                    
                }
            });

            return toReturn;
        }

    }
})();