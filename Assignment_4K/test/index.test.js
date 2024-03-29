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
    else chai.expect(res.body).to.be.a("object");
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
            chai.expect(res.body).to.have.keys("id","name","description","tasks");
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
            chai.expect(res.body).to.have.keys("id","boardId","taskName","dateCreated","archived")
        });
        done();
    });

    it("POST /boards/", (done) => {
        chai.request(apiUrl)
        .post("/boards")
        .send({
            "name": "test",
            "description": "description test"
        }).set('Content-type', 'application/json')
        .end((err, res) => {
            rightResponseJSONStatus(res, 201, false);
            chai.expect(res.body).to.have.property("name").eql("test");
            chai.expect(res.body).to.have.property("description").eql("description test");
            chai.expect(res.body).to.have.property("tasks").to.be.empty;
            chai.expect(Object.keys(res.body).length).to.be.eql(4);
            chai.expect(res.body).to.have.keys("id","name","description","tasks")
        });
        done();
    });

    it("POST /boards/:boardId/tasks", (done) => {
        chai.request(apiUrl)
        .post("/boards/0/tasks")
        .send({
            "taskName": "test"
        }).set('Content-type', 'application/json')
        .end((err, res) => {
            rightResponseJSONStatus(res, 201, false);
            chai.expect(res.body).to.have.property("taskName").eql("test");
            chai.expect(res.body).to.have.property("boardId").eql("0");
            chai.expect(res.body).to.have.property("archived").eql(false);
            chai.expect(Object.keys(res.body).length).to.be.eql(5);
            chai.expect(res.body).to.have.keys("taskName","boardId","archived","id","dateCreated")
        });
        done();
    });

    it("PUT /boards/:boardId", (done) => {
        chai.request(apiUrl)
        .put("/boards/1")
        .send({
            "name": "update name",
            "description": "update description"
        })
        .end((err, res) => {
            rightResponseJSONStatus(res, 200, false)
            chai.expect(res.body).to.have.property("id").eql("1");
            chai.expect(res.body).to.have.property("name").eql("update name");
            chai.expect(res.body).to.have.property("description").eql("update description");
            chai.expect(res.body).to.have.property("tasks").to.be.empty;
            chai.expect(Object.keys(res.body).length).to.be.eql(4);
            chai.expect(res.body).to.have.keys("id","name","description","tasks")
        });
        done();
    });    

    it("PUT /boards/:boardId", (done) => {
        chai.request(apiUrl)
        .put("/boards/1")
        .send({"name": "test name"})
        .end((err, res) => {
            rightResponseJSONStatus(res, 400, false);
            chai.expect(res.body).to.have.property("message").eql(
                "To update a board, all attributes are needed (name and description)."
            );
            chai.expect(Object.keys(res.body).length).to.be.eql(1);
        });
        done();
    });

    it("DELETE /boards/:boardId", (done) => {
        chai.request(apiUrl)
        .post("/auth")
        .set('Content-type', 'application/json')
        .auth("admin", "secret")
        .end((err, res) => {
            let token = res.body["token"][0]
            chai.expect(Object.keys(res.body).length).to.be.eql(1);
            chai.expect(res.body).to.have.property("token");
            chai.request(apiUrl)
            .delete("/boards/1")
            .set({"Authorization": `Bearer ${token}`})
            .end((err, res) => {
                rightResponseJSONStatus(res, 200);
                chai.expect(res.body[0]).to.have.property("id").eql("1");
                chai.expect(res.body[0]).to.have.property("name").eql("Ongoing");
                chai.expect(res.body[0]).to.have.property("description").eql("Currently in progress.");
                chai.expect(res.body[0]).to.have.property("tasks").to.be.a("object").to.be.empty;
            });
        });
        done();
    });
});