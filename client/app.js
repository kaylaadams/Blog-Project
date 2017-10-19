angular.module('blogApp', ['ngRoute', 'ngResource', 'blogApp.controllers', 'blogApp.factories', 'blogApp.services', 'blogApp.directives' ])
.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
    .when("/", {
        templateUrl : "views/allposts.html",
        controller : "HomeController"
    })
    .when ('/donate', {
        templateUrl: 'views/donations.html',
        controller: "DonationController"
    })
    .when("/compose", {
        templateUrl : "views/compose.html",
        controller : "CreateController",
        requiresLogin: true
    })
    .when("/users", {
        templateUrl : "views/user_list.html",
        controller : "UserListController",
        requiresLogin : true
    })
    .when("/login", {           
        templateUrl: "views/login.html",
        controller: "LoginController"
    })
    .when("/logout", {
        templateUrl: "views/logout.html",
        controller: "LogoutController"
    })
    .when("/users/create", {
        templateUrl: "views/createuser.html",
        controller: "CreateUserController"
    })
    .when('/users/:id', {
        templateUrl: 'views/singleuser.html',
        controller: 'SingleUserController'
    })
    .when("/users/:id/update", {
        templateUrl:"views/updateuser.html",
        controller: "UpdateUserController"
    })
    .when("/:id", {
        templateUrl : "views/singlepost.html",
        controller : "SingleController"
    })
    .when("/:id/update", {
        templateUrl : "views/updatepost.html",
        controller : "UpdateController"
    })
    .otherwise({
        redirectTo: '/'
    })
}])
.run(['$rootScope', '$location', 'UserService', function($rootScope, $location, UserService) {
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, previousRoute) {
        if (nextRoute.$$route && nextRoute.$$route.requiresLogin && !UserService.isLoggedIn()) {
            event.preventDefault();
            UserService.loginRedirect();
        }
    });
}])