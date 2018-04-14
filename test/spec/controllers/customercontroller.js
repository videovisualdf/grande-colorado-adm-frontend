
describe('Controller: CustomersController', function () {

  // load the controller's module
  beforeEach(module('invitationsApp'));

  var CustomersController,
    scope, $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, _$httpBackend_,  $rootScope, customersFactory) {
          // place here mocked dependencies
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET("http://localhost:3000/Customers").respond([
        {
          "id": 0,
          "username": "admin",
          "photo": "images/joao.jpg",
          "admin": true,
          "email": "admin@admin"
        },
        {
          "id": 1,
          "username": "joao",
          "photo": "images/joao.jpg",
          "admin": false,
          "email": "joao@joao"
        }
      ]);

    scope = $rootScope.$new();
    CustomersController = $controller('CustomersController', {
      $scope: scope, customersFactory: customersFactory
    });


  }));

  it('should have showDetails as false', function () {
    expect(scope.showDetails).toBe(false);
  });
  it('should create "customers" with 2 customers fetched from xhr', function() {
      // expect(scope.dishes.length).toBe(0);
      $httpBackend.flush();
      expect(scope.customers.length).toBe(2);
      expect(scope.customers[0].username).toBe("admin");
      expect(scope.customers[1].email).toBe("joao@joao");

  });

});
