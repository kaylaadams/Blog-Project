angular.module('blogApp.controllers', [])
.controller('HomeController', ['$scope', 'Post', '$location', 'SEOService', function ($scope, Post, $location, SEOService) {
    $scope.posts = Post.query();
    SEOService.setSEO({
        title: 'My Blog',
        description: "This is home to my ramblings and musings.",
        url: $location.url()
    })

    $scope.newPost = function () {
        $location.path('/compose');
    }
    $scope.goToLogin = function () {
        $location.path('/login');
    }
}])
.controller('UpdateController', ['$scope', 'Post', '$routeParams', 'Category', '$location', 'UserService', function ($scope, Post, $routeParams, Category, $location, UserService) {
    // UserService.requireLogin();
    $scope.post = Post.get({
        id: $routeParams.id
    }, function (success) {
        $scope.post.categoryid = String($scope.post.categoryid);
    });
    $scope.categories = Category.query();

    $scope.updatePost = function () {
        $scope.post.$update(function (success) {
            $location.path('/');
        }, function (err) {
            console.log(err)
        });
    }
}])
.controller('SingleController', ['$scope', 'Post', '$routeParams', 'Category', '$location', 'SEOService', function ($scope, Post, $routeParams, Category, $location, SEOService) {
    $scope.post = Post.get({
        id: $routeParams.id
    }, function (success) {
        SEOService.setSEO({
            title: $scope.post.title,
            description: $scope.post.content.substring(0, 140),
            url: $location.url()
        });
    });
    $scope.categories = Category.query();

    $scope.updatePost = function () {
        $location.path(`/${$routeParams.id}/update`);
    }

    $scope.deletePost = function () {
        $scope.post.$delete(function () {
            // Set it so that when the modal finishes dismissing, we navigate to a different page
            $('#delete-modal').on('hidden.bs.modal', () => {
                // navigate to the homepage, trigger a $scope digest (update)
                // so that Angular knows something changed
                // it doesn't know by default because this happened "outside" of Angular.
                $location.path('/');
                $scope.$apply();
            });

            // dismiss the modal
            $('#delete-modal').modal('hide');
        });
    }
}])
.controller('CreateController', ['$scope', 'Post', 'User', 'Category', '$location', function ($scope, Post, User, Category, $location) {
    $scope.posts = Post.query();
    $scope.users = User.query();
    $scope.categories = Category.query();

    $scope.addPost = function () {
        let blogPost = {
            title: $scope.newTitle,
            content: $scope.newContent,
            userid: $scope.newUserId,
            categoryid: $scope.newCategory
        };
        let newPost = new Post(blogPost);

        newPost.$save((success) => {
            $location.path('/');
        }, function (err) {
            console.log(err);
        });
    }
}])
.controller('LoginController', ['$scope', 'UserService', '$location', function ($scope, UserService, $location) {
    UserService.me()
        .then((loggedInUser) => {
            redirect();
        });

    function redirect() {
        let dest = $location.search().dest;
        if (!dest) {
            dest = '/';
        }
        $location.replace().path(dest).search('dest', null);
    }
    $scope.login = function () {
        UserService.login($scope.email, $scope.password)
            .then(() => {
                redirect();
            }, (err) => {
                console.log(err);
            });
    }
}])


.controller('SingleUserController', ['$scope', 'User', 'UserService', '$location', "$routeParams", function ($scope, User, UserService, $location, $routeParams) {
    $scope.user = User.get({
        id: $routeParams.id
    });

    $scope.userToUpdate = function () {
        $location.path(`/users/${$routeParams.id}/update`);
    }


    $scope.deleteUser = function () {
        if (confirm('Are you sure you want to delete this user?')) {
            $scope.user.$delete(function (success) {
                $location.replace().path('/users');
            }, function (err) {
                console.log(err);
            })
        }
    }
}])
.controller('UpdateUserController', ['$scope', 'User', 'UserService', '$location', '$routeParams', function ($scope, User, UserService, $location, $routeParams) {
    $scope.user = User.get({
        id: $routeParams.id
    });

    $scope.updateUser = function () {
        $scope.user.$update(function (success) {
            $location.path(`/users`);
        }, function (err) {
            console.log(err);
        });
    }
}])
.controller('UserListController', ['$scope', 'User', 'UserService', '$location', function ($scope, User, UserService, $location) {
    $scope.users = User.query();

    $scope.composeUser = () => {
        $location.path('/users/create')
    }
}])
.controller('CreateUserController', ['$scope', 'User', "$location", function ($scope, User, $location) {
    $scope.user = User.query();
    $scope.postUser = function () {
        let u = {
            firstname: $scope.newFirstname,
            lastname: $scope.newLastname,
            email: $scope.newEmail,
            password: $scope.newPassword
        };

        let newUser = new User(u);

        newUser.$save(() => {
            $location.path('/users');
        }, (err) => {
            console.log(err);
        })
    }
}])
.controller('DonationController', ['$scope','Donation', '$location', function ($scope, Donation, $location) {
    let elements = stripe.elements();
    let card = elements.create('card');
    card.mount('#card-field');

    $scope.process = function () {
        stripe.createToken(card)
        .then((result) => {
            if (result.error) {
                $scope.error = result.error.message;
            } else {
                let d = new Donation({
                    token: result.token.id,
                    amount: $scope.amount
                });
                d.$save(function() {
                    alert('Thank you for the generous donation!');
                    $location.path('/');
                }, function(err) {
                    console.log(err);
                });
            }
        });
    }
}])
.controller('LogoutController', ['$location', 'UserService', function($location, UserService) {
    UserService.logout()
    .then(()=> {
        $location.replace().path('/');
    });
}])