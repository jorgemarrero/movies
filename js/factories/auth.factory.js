(function() {
'use strict';

    angular
        .module('pelisEOI')
        .factory('AuthFactory', AuthFactory);

    AuthFactory.$inject = ['$firebaseAuth'];
    function AuthFactory($firebaseAuth) {
        console.log($firebaseAuth);
        return $firebaseAuth();
    }
})();

