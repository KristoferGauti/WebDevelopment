//Importing the application to test
let server = require('../index');

//These are the actual modules we use
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let apiUrl = "http://localhost:3000/api/v1";

describe('Endpoint tests', () => {
    //###########################
    //The beforeEach function makes sure that before each test, 
    //there are exactly two boards and one task (for the first board).
    //###########################
    beforeEach((done) => {
        server.resetState();
        done();
    });

    //###########################
    //Write your tests below here
    //###########################

    // For endpoints that return arrays:
        // The status code shall be as expected
        // The response body is in json format
        // The return type is an array
        // The array contains the right amount of elements

    // For endpoints that return individual objects:
        // The status code shall be as expected
        // The response body is in json format
        // The response body is as expected
            // The right attributes are in the body
            // No additional attributes are in the body
            // All attributes have the expected values

    /*
        First I will handle the endpoints that RETURN ARRAYS
        according to requirements
    */
    it("GET /boards",function (done){
        chai.request(apiUrl).get('/boards').end( (err,res) => {
            // The status code shall be as expected
            chai.expect(res).to.have.status(200);
            // The response body is in json format
            chai.expect(res).to.be.json;
            // The return type is an array
            chai.expect(res.body).to.be.a("array");
            // The array contains the right amount of elements
            chai.expect(res.body.length).to.be.eql(2); 
            
            done();
        });
    })

    it("GET /boards/:boardId/tasks",function (done) {
        chai.request(apiUrl).get("/boards/0/tasks").end((err, res) => {
            // The status code shall be as expected
            chai.expect(res).to.have.status(200);
            // The response body is in json format
            chai.expect(res).to.be.json;
            // The return type is an array
            chai.expect(res.body).to.be.a("array");
            // The array contains the right amount of elements
            chai.expect(res.body.length).to.be.eql(1);

            done();
        });
    });

    /*
        Now I will handle the endpoints that RETURN INDIVIDUAL OBJECTS
        according to requirements
    */
    it("GET /boards/:boardId", function (done){
        chai.request(apiUrl).get("/boards/0").end((err, res) => {
            // The status code shall be as expected
            chai.expect(res).to.have.status(200);
            // The response body is in json format
            chai.expect(res).to.be.json;
            // The response body is as expected
                // The right attributes are in the body
                chai.expect(res.body).to.have.keys("id","name","description","tasks")
                // No additional attributes are in the body
                chai.expect(Object.keys(res.body).length).to.be.eql(4);
                // All attributes have the expected values
                // Is boardId = "0" ?
                chai.expect(res.body).to.have.property("id").eql("0");
                // Is the board "Planned" ?
                chai.expect(res.body).to.have.property("name").eql("Planned");
                // Is the description "My todo list." ?
                chai.expect(res.body).to.have.property("description").eql("My todo list.");
                // Is the task of type array ?
                chai.expect(res.body).to.have.property("tasks").to.be.a("array");
                // Does the tasks array contain task 0 ?
                chai.expect(res.body).to.have.property("tasks").that.does.include("0");
            
        });

        chai.request(apiUrl).get("/boards/1").end((err, res) => {
            // The status code shall be as expected
            chai.expect(res).to.have.status(200);
            // The response body is in json format
            chai.expect(res).to.be.json;
            // The response body is as expected
                // The right attributes are in the body
                chai.expect(res.body).to.have.keys("id","name","description","tasks")
                // No additional attributes are in the body
                chai.expect(Object.keys(res.body).length).to.be.eql(4)
                // All attributes have the expected values
                // Is boardId = "1" ?
                chai.expect(res.body).to.have.property("id").eql("1");
                // Is the board "Ongoing" ?
                chai.expect(res.body).to.have.property("name").eql("Ongoing");
                // Is the description "Currently in progress." ?
                chai.expect(res.body).to.have.property("description").eql("Currently in progress.");
                // Is the task of type array ?
                chai.expect(res.body).to.have.property("tasks").to.be.a("array");
                // Is the task array empty ?
                chai.expect(res.body).to.have.property("tasks").that.eql([]);
            
            done();
        });

   });

    it("GET /boards/:boardId/tasks/:taskId", function (done){
        chai.request(apiUrl).get("/boards/0/tasks/0").end((err, res) => {
            // The status code shall be as expected
            chai.expect(res).to.have.status(200);
            // The response body is in json format
            chai.expect(res).to.be.json;
            // The response body is as expected
                // The right attributes are in the body
                chai.expect(res.body).to.have.keys("id","boardId","taskName","dateCreated","archived")
                // No additional attributes are in the body
                chai.expect(Object.keys(res.body).length).to.be.eql(5)
                // Is taskId = "0" ?
                chai.expect(res.body).to.have.property("id").eql("0");
                // All attributes have the expected values
                // Is the boardId = "0" ?
                chai.expect(res.body).to.have.property("boardId").eql("0");
                // Is the taskName "A task" ?
                chai.expect(res.body).to.have.property("taskName").eql("A task");
                // Is the dateCreated = 1611244080000?
                chai.expect(res.body).to.have.property("dateCreated").eql(1611244080000);
                // Is the task not archived?
                chai.expect(res.body).to.have.property("archived").eql(false);

             done();

        });

    });
    
    it("POST /api/v1/boards", function (done){
        chai.request(apiUrl).post("/boards").set("Content-type", "application/json")
        .send({
            "name": "testBoard",
            "description": "posting board for testing purposes"
        })
        .end((err, res) => {
            // The status code shall be as expected
            chai.expect(res).to.have.status(201);
            // The response body is in json format
            chai.expect(res).to.be.json;
            // The response body is as expected
                // The right attributes are in the body
                chai.expect(res.body).to.have.keys("id","name","description","tasks")
                // No additional attributes are in the body
                chai.expect(Object.keys(res.body).length).to.be.eql(4);
                // All attributes have the expected values
                //chai.expect(res.body).to.have.property("id").eql("2");
                chai.expect(res.body).to.have.property("name").eql("testBoard");
                chai.expect(res.body).to.have.property("description").eql("posting board for testing purposes");
                chai.expect(res.body).to.have.property("tasks").that.eql([]);
        });

        done();
    });

    it("PUT /api/v1/boards/:boardId", function (done){
        chai.request(apiUrl).put("/boards/1")
        .send({
            "name": "nameTestPut",
            "description": "Testing put request"
        })
        .end((err, res) => {
            // The status code shall be as expected
            chai.expect(res).to.have.status(200);
            // The response body is in json format
            chai.expect(res).to.be.json;
            // The response body is as expected
                // The right attributes are in the body
                chai.expect(res.body).to.have.keys("id","name","description","tasks")
                // No additional attributes are in the body
                chai.expect(Object.keys(res.body).length).to.be.eql(4);
                // All attributes have the expected values
                chai.expect(res.body).to.have.property("name").eql("nameTestPut");
                chai.expect(res.body).to.have.property("description").eql("Testing put request");
                chai.expect(res.body).to.have.property("tasks").to.be.empty;
                
        });
        done();
    });

    it("POST /api/v1/boards/:boardId/tasks",function (done){
        chai.request(apiUrl).post("/boards/0/tasks")
        .send({
            "taskName": "test"
        })
        .end((err, res) => {
            // The status code shall be as expected
            chai.expect(res).to.have.status(201);
            // The response body is in json format
            chai.expect(res).to.be.json;
                // The right attributes are in the body
                chai.expect(res.body).to.have.keys("taskName","boardId","archived","id","dateCreated")
                // No additional attributes are in the body
                chai.expect(Object.keys(res.body).length).to.be.eql(5);
                // All attributes have the expected values
                chai.expect(res.body).to.have.property("taskName").eql("test");
                chai.expect(res.body).to.have.property("boardId").eql("0");
                chai.expect(res.body).to.have.property("archived").eql(false);
        });
        done();
    });

    it("POST /api/v1/auth",function (done){
        chai.request(apiUrl).post("/auth").auth("admin", "secret")
        .end((err, res) => {
            chai.expect(res).to.have.status(200);
        done();
        });
    });


    it("DELETE /api/v1/boards/:boardId", function (done){
        chai.request(apiUrl).post("/auth").auth("admin", "secret")
        .end((err, res) => {
            let token = res.body["token"]
            token = token[0]
            chai.request(apiUrl)
            .delete("/boards/1").set({"Authorization": "Bearer " +String(token)})
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
            });
        });
        done();
        
    });
    /*
        Test that ensures that PUT /api/v1/boards/:boardId does
        not succeed when a property is missing
    */
    it("PUT /boards/:boardId", (done) => {
        chai.request(apiUrl).put("/boards/1").send({"name": "testing for only name"})
        .end((err, res) => {
            // The status code shall be 400
            chai.expect(res).to.have.status(400);
            // The response body is in json format
            chai.expect(res).to.be.json;
            // The error message is as expected
            chai.expect(res.body).to.have.property("message").eql("To update a board, all attributes are needed (name and description).");
        });
        done();
    });
});