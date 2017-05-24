(function() {
'use strict';

    angular
        .module('pelisEOI')
        .factory('MoviesFactory', MoviesFactory);

    MoviesFactory.$inject = ['$http'];
    function MoviesFactory($http) {
        
        var API_KEY = "7e2860525bbac2fa58d9b1fcb55830f9";


        return {
            getPopular: getPopular,
            getFiltered: getFiltered
        }

        /////////////////////////////////////////
        
        function getPopular() {
            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
            })
            .then (function (data) {
                console.log(data);
                var toReturn = [];
                toReturn.total = data.data.total_results;
                toReturn.movies = data.data.results;
                return toReturn;
            });
        }

        function getFiltered(filter) {
            console.log(filter);
            
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
                        + "&with_genres=" + filter.genres.join()
            })
            .then (function (data) {
                var toReturn = [];
                toReturn.total = data.data.total_results;
                toReturn.movies = data.data.results;
                return toReturn;
            });        
        }
        
    }
})();