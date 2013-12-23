var app = angular.module("Edward",["ui.bootstrap"]);

app.controller("panelCtrl",function($scope,$http){

    $scope.ua = 'desktop';
    $scope.url = 'http://jianshu.io/p/q8dAus';
    $scope.image = '/images/crab.png';
    $scope.clip = function(){
        var params = {
                url:$scope.url,
                desktop:$scope.ua === "desktop"
            };

        if($scope.viewport && $scope.viewport.width && $scope.viewport.height){
          params.viewport = [$scope.viewport.width , $scope.viewport.height].join(",")
        }

        if($scope.size && $scope.size.width && $scope.size.height){
          params.size = [$scope.size.width , $scope.size.height].join(",")
        }

        if($scope.offset && $scope.offset.top && $scope.offset.left){
          params.offset = [$scope.offset.top , $scope.offset.left].join(",")
        }

        if($scope.selector){
          params.selector = $scope.selector;
        }

        $scope.loading = true;
        $http.get('/api/clipper',{
            params:params
        }).success(function(data, status, headers, config) {
            $scope.image = data;
            $scope.loading = false;
        }).error(function(data, status, headers, config) {
            console.error(data);
            $scope.loading = false;
        });
    }
});