angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicPlatform, $ionicModal, $timeout, $cordovaToast, $cordovaProgress, $interval, $http) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.imageUrl = "./img/default.jpg";
    $scope.isLiveChecked = {
        value: false
    };

    var intervalPromise;
    $scope.isLive = function () {

        if ($scope.isLiveChecked.value == true) {
            $ionicPlatform.ready(function () {
                $cordovaToast
                    .show('Live!', 'long', 'bottom')
                    .then(function (success) {
                        intervalPromise = $interval(function () {
                            $scope.imageUrl = "http://timmycam.conestogac.on.ca/IMAGE.JPG" + '?' + new Date().getTime();
                            $scope.currentTime= Date.now();
                        }, 1000, 0, true);
                    }, function (error) {
                        // error
                    });
            });

        } else {

            $interval.cancel(intervalPromise);
            $ionicPlatform.ready(function () {
                $cordovaToast
                    .show('Live off!', 'long', 'bottom')
                    .then(function (success) {
                        $scope.imageUrl = "http://timmycam.conestogac.on.ca/IMAGE.JPG" + '?' + new Date().getTime();
                    }, function (error) {
                        // error
                    });

            });
        }
    };
    $scope.isLive();

});