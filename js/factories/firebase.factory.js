(function() {
'use strict';

    angular
        .module('pelisEOI')
        .factory('FirebaseFactory', FirebaseFactory);

    FirebaseFactory.$inject = ['$firebaseAuth'];
    function FirebaseFactory($firebaseAuth) {
        
        var auth = $firebaseAuth();
        var user;
        
        firebase.auth().onAuthStateChanged(function(firebaseUser) {
            if (firebaseUser) {
                user = firebaseUser;
                console.log("logeado");
            } else {
                console.log("no logeado");
            }
        }, function(error) {
            console.log(error);
        });

        //////////////////////

        return {
            getAuth: getAuth,
            signIn: signIn,
            addFav: addFav,
            toWatch: toWatch,
            getMyMovies: getMyMovies
        }

        ///////////////////////
        function getAuth() {
            return $firebaseAuth();
        }

        function signIn() {
            var uiConfig = {
                signInSuccessUrl: "https://jorgemarrero.github.io/movies/",
                signInFlow: "popup",
                signInOptions: [
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                ],
                credentialHelper: firebaseui.auth.CredentialHelper.NONE,
                // Terms of service url.
                tosUrl: 'https://www.google.com'
            };
            console.log("QUÉ PASA AQUÍ")
            // Initialize the FirebaseUI Widget using Firebase.
            var ui = new firebaseui.auth.AuthUI(firebase.auth());
            // The start method will wait until the DOM is loaded.
            ui.start('#firebaseui-auth-container', uiConfig);
            console.log("VIENE");
        }

        function addFav(movie) {
            console.log(movie);
            firebase.database().ref('favs/' + user.uid).update({
                [movie.id]: movie
            });
        }

        function toWatch(movie) {
            firebase.database().ref('towatch/' + user.uid).update({
                [movie.id]: movie
            });
        }

        function getMyMovies() {

        }

    }
})();
