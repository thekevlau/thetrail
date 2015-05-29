var trailExtension = angular.module('trail-extension',['ngResource']);

trailExtension.controller('popupController', ['$scope', '$http', function($scope, $http) {
    //TODO: Call API to determine if user is login
  chrome.cookies.get({url:"http://localhost:8000/",name:"login-cookie"},
    function (check) {
        if (check) {
            console.log(check);
            $scope.loggedIn = true;
            var getTrails = {
                method: 'get',
                url: "http://localhost:8000/api/user/" + check.value,
                headers: {
                    'Content-Type': "application/json"
                }
            };
            $http(getTrails)
                .success(function(data) {
                  $scope.trails = data.Trails;
                });
        } else {
            $scope.loggedIn = false;
        }
    });
  $scope.end = false;

    chrome.tabs.getSelected(null, function(tab) {
        $scope.$apply(function () {
            $scope.url = tab.url;
        });
    });

    $scope.saveStep = function(id) {
        // comments if time
        var req = {
            method: 'post',
            url: "http://localhost:8000/api/resource",
            headers: {
                'Content-Type': "application/json"
            },
            data: {
              "type": "link",
              "data": $scope.url,
              "trailId": id,
              "annotations": ""
            }
        };

        $http(req)
        .success(function(data) {
          $scope.trails = data;
          $scope.end = true;
        })
        .error (function(data, status, headers, config) {
            //uhoh
        });
    }

    $scope.login = function(username, password){
      //POST to /api/login
      console.log(username + " " + password);
      var req = {
        method: 'post',
        url: "http://localhost:8000/api/login",
        headers: {
            'Content-Type': "application/json"
        },
        data: {
        "email": username,
        "password": password
        }
      };

      $http(req)
      .success(function(data) {
        chrome.cookies.set({url:"http://localhost:8000/",name:"login-cookie",value:data.id.toString(),expirationDate:(new Date().getTime()/1000) + 3600});
        $scope.loggedIn = true;
        $scope.userId = data.id;


        var getTrails = {
            method: 'get',
            url: "http://localhost:8000/api/user/" + $scope.userId,
            headers: {
                'Content-Type': "application/json"
            }
        };

        $http(getTrails)
        .success(function(data) {
          $scope.trails = data.Trails;
        })

      })
    }
}]);
