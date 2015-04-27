'use strict'
angular.module('starter').directive('onError', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                if(!scope.dialogShown)
                {
                  scope.dialog("It seems you are not on College network. Please try when you are on College network.", "Oops!", "Ok");  
                  scope.dialogShown=true;
                }
                            
            });
        }
    }
});