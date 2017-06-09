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
            getUpcoming: getUpcoming,
            getSearch: getSearch,
            getFiltered: getFiltered,
            getMovie: getMovie
        }

        /////////////////////////////////////////
        
        function getPopular() {
            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/movie/popular?api_key=" + API_KEY + "&language=es-ES&region=ES"
            })
            .then (function(data) {
                console.log(data);
                var toReturn = [];
                toReturn.total = data.data.total_results;
                toReturn.movies = data.data.results;
                return toReturn;
            });
        }

        function getUpcoming() {
            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/movie/upcoming?api_key=" + API_KEY + "&language=es-ES&region=ES"
            })
            .then (function(data) {
                console.log(data);
                var toReturn = [];
                toReturn.total = data.data.total_results;
                toReturn.movies = data.data.results;
                return toReturn;
            });
        }

        function getSearch(toSearch, page) {
            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY 
                + "&language=es-ES&query=" + toSearch
                + "&include_adult=false" 
                + "&page=" + page
                + "&region=ES" 
            })
            .then (function(data) {
                console.log(data);
                var toReturn = [];
                toReturn.results = {
                    movies: data.data.total_results,
                    pages: data.data.pages,
                }
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
                        + "&language=es-ES"
                        + "&sort_by=popularity.desc"
                        + "&include_adult=false"
                        + "&include_video=false"
                        + "&page=" + filter.page 
                        + "&primary_release_date.gte=" + filter.yearLower
                        + "&primary_release_date.lte=" + filter.yearHigher
                        + "&vote_count.gte=" + minVotesToShow
                        + "&vote_average.gte=" + filter.voteLower
                        + "&vote_average.lte=" + filter.voteHigher
                        + "&with_genres=" + filter.genres.join()
            })
            .then (function(data) {
                console.log(data);
                var toReturn = [];
                toReturn.results = {
                    movies: data.data.total_results,
                    pages: data.data.pages,
                }
                toReturn.movies = data.data.results;
                return toReturn;
            });        
        }
        
        function getMovie(movie) {
            console.log(movie);

            var toReturn = {
                movie: movie,
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
                url : "https://api.themoviedb.org/3/movie/" + movie.id + "?api_key=" + API_KEY + "&language=es-ES"
            })
            .then ((data) => getMovieSucess(data, toReturn, movie)); 
            /*.then (resolve(toReturn, movie) );  */
        }

/*        function resolve(toReturn, movie){
            return function (data){

            }
        }*/

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
                url : "https://api.themoviedb.org/3/movie/" + movie.id + "/videos?api_key=" + API_KEY + "&language=es-ES"
            })
            .then ((videos) => getMovieVideo(videos, toReturn, movie));
        }

        function getMovieVideo(videos, toReturn, movie) {
            if(videos.data.results[0]) toReturn.video = videos.data.results[0].key;
            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/movie/" + movie.id + "/similar?api_key=" + API_KEY + "&language=es-ES"
            })
            .then ((simil) => getMovieSimilars(simil, toReturn));
        }

        function getMovieSimilars(simil, toReturn) {
            toReturn.similars = [];
            simil.data.results.some(function(value, index) {
                if (simil.total_results < index) return true;
                toReturn.similars.push(value);
                if (index == 3) return true;
            });

            return $http({
                method : "GET",
                url : "https://www.omdbapi.com/?apikey=" + API_KEY_OMDB + "&i=" + toReturn.imdb_id
            })
            .then ((rating) => getMovieRating(rating, toReturn));
        }

        function getMovieRating(rating, toReturn) {
            console.log(rating);
            console.log(toReturn);
            if(rating.data.Ratings[1]) toReturn.votes.rt = rating.data.Ratings[1].Value;
            if(rating.data.Ratings[2]) toReturn.votes.mc = rating.data.Ratings[2].Value.slice(0, 2) + "%";

            if(toReturn.runtime.hours == 0 && toReturn.runtime.hours == 0 && rating.data.Runtime != 'N/A') {
                toReturn.runtime = {
                    hours: Math.floor(rating.data.Runtime.slice(0, rating.data.Runtime.length-3) / 60),
                    minutes: rating.data.Runtime.slice(0, rating.data.Runtime.length-3) % 60
                }
            }
            console.log(rating.data.Genre);
            if(toReturn.genres.length == 0 && rating.data.Genre != "N/A") {
                console.log(rating.data.Genre);
                toReturn.genres = rating.data.Genre.split(',');
            }
            
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
