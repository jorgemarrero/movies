(function() {
'use strict';

    angular
        .module('pelisEOI')
        .factory('MoviesFactory', MoviesFactory);

    MoviesFactory.$inject = ['$http'];
    function MoviesFactory($http) {
        
        return {
            getPopular: getPopular
        }

        /////////////////////////////////////////
        
        function getPopular() {
            return $http({
                method : "GET",
                url : "https://api.themoviedb.org/3/discover/movie?api_key=7e2860525bbac2fa58d9b1fcb55830f9&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
            })
            .then (function (data) {
                console.log(data);
                return data.data.results;
            });
        }
        
    }
})();