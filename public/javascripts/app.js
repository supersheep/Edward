var app = angular.module("Edward",["ui.bootstrap"]);

app.controller("panelCtrl",function($scope,$http){

    $scope.ua = 'desktop';
    $scope.url = 'http://jianshu.io/p/q8dAus';
    $scope.clip = function(){
        console.log($scope);

        $http.get('/api/clipper',{
            params:{
                url:$scope.url,
                desktop:true
            }
        }).
          success(function(data, status, headers, config) {
            $scope.image = data;
          }).
          error(function(data, status, headers, config) {
            console.error(data);
          });
    }
});