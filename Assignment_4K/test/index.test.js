//Importing the application to test
let server = require('../index');

//These are the actual modules we use
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let apiUrl = "http://localhost:3000/api/v1";

function rightResponseJSONStatus(res, statuscode, isArray=true) {
    chai.expect(res).to.have.status(statuscode);
    chai.expect(res).to.be.json;
    if (isArray) chai.expect(res.body).to.be.a("array");
}

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

    // This test doesn't do much
    it("GET /boards ", (done) => {
        chai.request(apiUrl)
        .get("/boards")
        .end((err, res) => {
            rightResponseJSONStatus(res, 200);
            chai.expect(res.body.length).to.be.eql(2);
            done();
        });    
    });

    it("GET /boards/:boardId", (done) => {
        chai.request(apiUrl)
        .get("/boards/0")
        .end((err, res) => {
            rightResponseJSONStatus(res, 200, false);
            chai.expect(res.body).to.have.property("id").eql("0");
            chai.expect(res.body).to.have.property("name").eql("Planned");
            chai.expect(res.body).to.have.property("description").eql("My todo list.");
            chai.expect(res.body).to.have.property("tasks").to.be.a("array");
            chai.expect(res.body).to.have.property("tasks").that.does.include("0");
            chai.expect(Object.keys(res.body).length).to.be.eql(4)
            done();
        });
    }); 

    it("GET /boards/:boardId/tasks", (done) => {
        chai.request(apiUrl)
        .get("/boards/0/tasks")
        .end((err, res) => {
            rightResponseJSONStatus(res, 200);
            chai.expect(res.body.length).to.be.eql(1);
            done();
        });
    });

    it("GET /boards/:boardId/tasks/:taskId", (done) => {
        chai.request(apiUrl)
        .get("/boards/0/tasks/0")
        .end((err, res) => {
            rightResponseJSONStatus(res, 200, false)
            chai.expect(res.body).to.have.property("id").eql("0");
            chai.expect(res.body).to.have.property("boardId").eql("0");
            chai.expect(res.body).to.have.property("taskName").eql("A task");
            chai.expect(res.body).to.have.property("dateCreated").eql(1611244080000);
            chai.expect(res.body).to.have.property("archived").eql(false);
            chai.expect(Object.keys(res.body).length).to.be.eql(5);
        });
        done();
    });

    // it("POST /boards/:boardId", (done) => {
    //     chai.request(apiUrl)
    //     .get("/boards/5")
    //     .end((err, res) => {
            
    //     });
    //     done();
    // });

    // it("GET /boards/:boardId", (done) => {
    //     chai.request(apiUrl)
    //     .get("/boards/0")
    //     .end((err, res) => {

    //     });
    //     done();
    // });

    // it("GET /boards/:boardId", (done) => {
    //     chai.request(apiUrl)
    //     .get("/boards/0")
    //     .end((err, res) => {

    //     });
    //     done();
    // });

    // it("GET /boards/:boardId", (done) => {
    //     chai.request(apiUrl)
    //     .get("/boards/0")
    //     .end((err, res) => {

    //     });
    //     done();
    // });

});