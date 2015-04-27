angular.module('starter.controllers', ['uiGmapgoogle-maps'])

.controller('AppCtrl', function ($scope, $ionicPlatform, $ionicModal, $timeout, $cordovaToast, $cordovaProgress, $interval, $http, uiGmapGoogleMapApi, uiGmapIsReady, $cordovaDialogs, $cordovaGeolocation) {
    $scope.dialogShown = false;
    angular.extend($scope, {
        init: function () {},
        map: {
            center: {
                latitude: 0,
                longitude: 0
            },
            zoom: 13,
            control: {},
            markers: []
        }
        /*,
        positionReady: function (position) {
            $scope.map.center.latitude = position.coords.latitude;
            $scope.map.center.longtitude = position.coords.longtitude;
            //clear any previous markers, and add one for where we are right now
                    $scope.map.markers.length = 0;
                    $scope.map.markers.push({
                        id: 0,
                        coords: position.coords
                    });
                    $scope.$apply();
                }

        */
    }).init();
    $scope.dialog = function (message, title, buttonName) {
        $ionicPlatform.ready(function () {
            $cordovaDialogs.alert(message, title, buttonName)
                .then(function () {
                    $scope.imageUrl = "./img/default.jpg" + '?' + new Date().getTime();
                    $scope.isLiveChecked.value = false;
                    $interval.cancel(intervalPromise);
                    $scope.dialogShown = false;
                });

        });
    };


    $scope.loginData = {};
    $scope.imageUrl = "./img/default.jpg";
    $scope.isLiveChecked = {
        value: false
    };

    var intervalPromise;
    $scope.isLive = function () {

        if ($scope.isLiveChecked.value === true) {
            intervalPromise = $interval(function () {
                $scope.imageUrl = "http://timmycam.conestogac.on.ca/IMAGE.JPG" + '?' + new Date().getTime();
                $scope.currentTime = Date.now();
            }, 1000, 0, true);

        } else {

            $interval.cancel(intervalPromise);
            $scope.imageUrl = "./img/default.jpg" + '?' + new Date().getTime();
        }
    };
    $scope.isLive();

    $scope.getLocation = function () {

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $cordovaGeolocation
            .getCurrentPosition(posOptions)
            .then(function (position) {

                $scope.map.center.latitude = position.coords.latitude;
                $scope.map.center.longitude = position.coords.longitude;
                $scope.map.markers.length = 0;
                $scope.map.markers.push({
                    id: 0,
                    coords: position.coords
                });
                $scope.$apply();
                TimSearch(position);

            }, function (err) {
                $scope.dialog("Please turn on the location from settings.", "Location off", "Ok");
            });


        var watchOptions = {
            frequency: 1000,
            timeout: 3000,
            enableHighAccuracy: false // may cause errors if true
        };

        var watch = $cordovaGeolocation.watchPosition(watchOptions);
        watch.then(
            null,
            function (err) {
                // error
            },
            function (position) {
                $scope.map.center.latitude = position.coords.latitude;
                $scope.map.center.longitude = position.coords.longitude;
                $scope.map.markers.length = 0;
                $scope.map.markers.push({
                    id: 0,
                    coords: position.coords
                });
                $scope.$apply();
                TimSearch(position);
            });


        watch.clearWatch();


        var TimSearch = function (pos) {

            var request = {
                location: {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                },
                radius: 5000,
                query: 'Tim Hortons'
            };

            var map = $scope.map.control.getGMap();



            var homeControlDiv = document.createElement('div');
            var homeControl = new HomeControl(homeControlDiv, map);
            //  homeControlDiv.index = 1;
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);




            var service = new google.maps.places.PlacesService(map);

            service.textSearch(request, callback);

            var infowindow = new google.maps.InfoWindow();

            function callback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }
                }
            }

            function createMarker(place) {
                var placeLoc = place.geometry.location;
                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(place.name);
                    infowindow.open(map, this);
                });
            }


            return;
        };
    }

    // Add a Home control that returns the user to London
    function HomeControl(controlDiv, map) {
        controlDiv.style.padding = '5px';
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = 'yellow';
        controlUI.style.border = '1px solid';
        controlUI.style.cursor = 'pointer';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Set map to your current location';
        controlDiv.appendChild(controlUI);
        var controlText = document.createElement('div');
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingLeft = '4px';
        controlText.style.paddingRight = '4px';
        controlText.innerHTML = '<b>Current Location<b>'
        controlUI.appendChild(controlText);

        var home = new google.maps.LatLng($scope.map.center.latitude, $scope.map.center.longitude);


        // Setup click-event listener: simply set the map to London
        google.maps.event.addDomListener(controlUI, 'click', function () {
            map.setCenter(home);

        });
    }


    // when the app starts (or the refresh button is clicked) call html5 location
    $scope.getWeatherInfo = function () {
        $cordovaGeolocation
            .getCurrentPosition()
            .then(function (position) {
                sendCoordinate(position);

            }, function (err) {
                $scope.dialog("Please turn on the location from settings.", "Location off", "Ok");
            });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(sendCoordinate);
        } else {}
    }




    function sendCoordinate(position) {

        $http({
                method: 'GET',
                url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude
                    /*url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + '22.29' + '&lon=' + '-120'*/
            })
            .success(function (data, status, headers, config) {

                $scope.names = data.name;
                $scope.lat = data.coord.lat;
                $scope.lon = data.coord.lon;
                $scope.iconUrl = './img/' + data.weather[0].icon + '.png';


                $scope.main = data.main;
                $scope.temp = Math.round($scope.main.temp);
                $scope.windSpeed = data.wind.speed;
                $scope.weather = data.weather[0];
                $scope.sys = data.sys;


            })
            .error(function (data, status, headers, config) {
                throw new Error('Unable to get weather');
            });

    }








});