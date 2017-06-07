  var config = {
    apiKey: "AIzaSyCNbXaJxMiyCeYe7hMEizEDbV9H6NvAi40",
    authDomain: "movie-directory-917db.firebaseapp.com",
    databaseURL: "https://movie-directory-917db.firebaseio.com",
    projectId: "movie-directory-917db",
    storageBucket: "movie-directory-917db.appspot.com",
    messagingSenderId: "556529699163"
  };
  firebase.initializeApp(config);

//   firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     console.log("SI LOG");
//   } else {
//     console.log("NO LOG");
//   }

//   var uiConfig = {
//         signInSuccessUrl: '<url-to-redirect-to-on-success>',
//         signInOptions: [
//           // Leave the lines as is for the providers you want to offer your users.
//           firebase.auth.EmailAuthProvider.PROVIDER_ID,
//         ],
//         // Terms of service url.
//         tosUrl: '<your-tos-url>'
//       };

//     // Initialize the FirebaseUI Widget using Firebase.
//     var ui = new firebaseui.auth.AuthUI(firebase.auth());
//     // The start method will wait until the DOM is loaded.
//     ui.start('#firebaseui-auth-container', uiConfig);

//     firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // ...
//     });
// });