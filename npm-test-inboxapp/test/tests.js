let chai = require("chai");
let chaiHttp = require("chai-http");
const { expect } = chai;


chai.use(chaiHttp);
chai.should();

let baseUrl = 'https://manifest-inbox-app.herokuapp.com'

describe('Inbox App API Testing', () => {
  
  before(done => {
    const key = {
      "public_key": "rJqbI7JgyCklbimFVgRig4SEUmyHD3",
      "private_key": "U2FsdGVkX19B9J/DsCcq7aU5ko0s++QUlPLp/CDXxsPYck87D35OluI6DCTyPjHa",
      "module_id": "544"
    };
    chai
      .request(baseUrl)
      .post("/login")
      .send(key)
      .end((err, res) => {
        token = res.body.token;
        res.should.have.status(200);
        done();
      });
  });

  describe('GET All messages', () => {
    it("Get all the messages", function(done) {
        chai.request(baseUrl)
          .get('/messages')
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
             expect(res).to.have.status(200)
             expect(res.body.status).to.be.equal(true)
             expect(res.body.data)
                .to.be.an.instanceof(Array)
                .and.to.have.property(0)
            expect(res.body.data[0]).to.have.property('id').and.to.be.a('number')
            res.body.data[0].should.all.have.property('senderId')
            res.body.should.have.keys('status', 'data')
            done()
          }).catch((err) => done(err))
     })

     it("Should return an error", function(done) {
      chai.request(baseUrl)
        .get('/miessagex')
        .set({ "Authorization": `Bearer ${token}` })
        .then((res) => {
           expect(res).to.have.status(404)
          done()
        }).catch((err) => done(err))
   })
  })

  describe('POST One message', () => {
     it("POST get one message", function(done) {
      const id = {
        "id": 30
      }
      chai.request(baseUrl)
        .post('/message/get')
        .send(id)
        .set({ "Authorization": `Bearer ${token}` })
        .then((res) => {
           expect(res).to.have.status(200)
           expect(res.body.status).to.be.equal(true)
           expect(res.body.data)
              .to.be.an.not.instanceof(Array)
              .and.to.have.property(0)
          expect(res.body.data).to.contain.keys('id', 'receiverId', 'senderId')
          res.body.should.have.keys('status', 'data')
          done()
        }).catch((err) => done(err))
   })
  })

    describe('POST Send a message', () => {
        it("POST send a message", function(done) {
        const message_body ={
          "subject": "hello world1",
          "body": "message body",
          "receiverId": "617e38be-49d1-4a66-a0f6-704756383812"
          }
        chai.request(baseUrl)
          .post('/message/create')
          .send(message_body)
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
              expect(res).to.have.status(201) //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
              expect(res.body.status).to.be.equal(true)
              expect(res.body.message).to.be.equal("message sent successfully!")
              expect(res.body.data)
                .to.be.an.not.instanceof(Array)
                .and.to.have.property(0)
            expect(res.body.data).to.contain.keys('id', 'receiverId', 'senderId')
            res.body.should.have.keys('status', 'data', 'message')
            done()
          }).catch((err) => done(err))
      })
    })

 describe('POST Send Multiple messages', () => {
    it("POST send multiple messages", function(done) {
    const message_body ={
      "subject": "hello world",
      "body": "message body",
      "receivers": ["617e38be-49d1-4a66-a0f6-704756383812", "7b544312-82d1-482d-982b-370f9d3e2fdf", "7b544312-82d1-482d-982b-370f9d3e2fdf"]
      }
    chai.request(baseUrl)
      .post('/message/createMultiple')
      .send(message_body)
      .set({ "Authorization": `Bearer ${token}` })
      .then((res) => {
          expect(res).to.have.status(201) //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
          expect(res.body.status).to.be.equal(true)
          expect(res.body.message).to.be.equal("Operation complete!")
          expect(res.body.data)
            .to.be.an.not.instanceof(Array)
            .and.to.have.property(0)
        expect(res.body.data).to.contain.keys('totalRecords', 'successful', 'failed', 'failedRows')
        res.body.should.have.keys('status', 'data', 'message')
        done()
      }).catch((err) => done(err))
    })
  })

  describe('POST Create Draft message', () => {
    it("POST create draft message", function(done) {
    const message_body ={
      "body": "i want to leave this message to send later",
      "subject": "not sure i want to send this yet",
      "receiverId": ""
    }
    chai.request(baseUrl)
      .post('/message/draft/create')
      .send(message_body)
      .set({ "Authorization": `Bearer ${token}` })
      .then((res) => {
          expect(res).to.have.status(200) //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
          expect(res.body.status).to.be.equal(true)
          expect(res.body.message).to.be.equal("draft saved successfully!")
        res.body.should.have.keys('status', 'message')
        done()
      }).catch((err) => done(err))
    })
  })

  describe('POST Delete a Message', () => {
    it("POST delete a message", function(done) {
    const message_body ={
      "id": 46
    }
    chai.request(baseUrl)
      .post('/message/delete')
      .send(message_body)
      .set({ "Authorization": `Bearer ${token}` })
      .then((res) => {
          expect(res).to.have.status(200) //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
          expect(res.body.status).to.be.equal(true)
          expect(res.body.message).to.be.equal("message deleted successfully!")
        res.body.should.have.keys('status', 'message')
        done()
      }).catch((err) => done(err))
    })
  })

  describe('POST Delete Multiple messages', () => {
    it("POST send multiple messages", function(done) {
    const message_body ={
      "ids": [ 38, 39, 42]
    }
    chai.request(baseUrl)
      .post('/message/deleteMultiple')
      .send(message_body)
      .set({ "Authorization": `Bearer ${token}` })
      .then((res) => {
          expect(res).to.have.status(200) //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
          expect(res.body.status).to.be.equal(true)
          expect(res.body.message).to.be.equal("Operation complete!")
          expect(res.body.data)
            .to.be.an.not.instanceof(Array)
            .and.to.have.property(0)
        expect(res.body.data).to.contain.keys('totalRecords', 'successful', 'failed', 'failedRows')
        res.body.should.have.keys('status', 'data', 'message')
        done()
      }).catch((err) => done(err))
    })
  })

  describe('GET All inbox messages', () => {
    it("Get all inbox messages", function(done) {
        chai.request(baseUrl)
          .get('/messages/inbox')
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
             expect(res).to.have.status(200)
             expect(res.body.status).to.be.equal(true)
             expect(res.body.data)
                .to.be.an.instanceof(Array)
                .and.to.have.property(0)
            expect(res.body.data[0]).to.have.property('id').and.to.be.a('number')
            //res.body.data.should.all.have.property('senderId')
            res.body.should.have.keys('status', 'data')
            res.body.should.be.a('object')
            done()
          }).catch((err) => done(err))
     })

     it("Should return an error", function(done) {
      chai.request(baseUrl)
        .get('/message/inboxes')
        .set({ "Authorization": `Bearer ${token}` })
        .then((res) => {
           expect(res).to.have.status(404)
          done()
        }).catch((err) => done(err))
   })
  })

  describe('GET All sent messages', () => {
    it("Get all sent messages", function(done) {
        chai.request(baseUrl)
          .get('/messages/sent')
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
             expect(res).to.have.status(200)
             expect(res.body.status).to.be.equal(true)
             expect(res.body.data)
                .to.be.an.instanceof(Array)
                .and.to.have.property(0)
            expect(res.body.data[0]).to.have.property('id').and.to.be.a('number')
            //res.body.data.should.all.have.property('senderId')
            res.body.should.have.keys('status', 'data')
            res.body.should.be.a('object')
            done()
          }).catch((err) => done(err))
     })

     it("Should return an error", function(done) {
      chai.request(baseUrl)
        .get('/messagei/seni')
        .set({ "Authorization": `Bearer ${token}` })
        .then((res) => {
           expect(res).to.have.status(404)
          done()
        }).catch((err) => done(err))
   })
  })

  describe('GET All trash messages', () => {
    it("Get all trash messages", function(done) {
        chai.request(baseUrl)
          .get('/messages/trash')
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
             expect(res).to.have.status(200)
             expect(res.body.status).to.be.equal(true)
             expect(res.body.data)
                .to.be.an.instanceof(Array)
                .and.to.have.property(0)
            expect(res.body.data[0]).to.have.property('id').and.to.be.a('number')
            res.body.should.have.keys('status', 'data')
            res.body.should.be.a('object')
            done()
          }).catch((err) => done(err))
     })

     it("Should return an error", function(done) {
      chai.request(baseUrl)
        .get('/messagei/thrashi')
        .set({ "Authorization": `Bearer ${token}` })
        .then((res) => {
           expect(res).to.have.status(404)
          done()
        }).catch((err) => done(err))
   })
  })

  describe('GET All draft messages', () => {
    it("Get all draft messages", function(done) {
        chai.request(baseUrl)
          .get('/messages/draft/all')
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
             expect(res).to.have.status(200)
             expect(res.body.status).to.be.equal(true)
             expect(res.body.data)
                .to.be.an.instanceof(Array)
                .and.to.have.property(0)
            expect(res.body.data[0]).to.have.property('id').and.to.be.a('number')
            res.body.should.have.keys('status', 'data')
            res.body.should.be.a('object')
            done()
          }).catch((err) => done(err))
     })

     it("Should return an error", function(done) {
      chai.request(baseUrl)
        .get('/message/draft/al')
        .set({ "Authorization": `Bearer ${token}` })
        .then((res) => {
           expect(res).to.have.status(404)
          done()
        }).catch((err) => done(err))
   })
  })
  
  describe('POST Reply a Message', () => {
    it("POST reply a message", function(done) {
    const message_body ={
      "body": "I am replying to your initial business proposal",
      "id": 46
    }
  
    chai.request(baseUrl)
      .post('/message/reply')
      .send(message_body)
      .set({ "Authorization": `Bearer ${token}` })
      .then((res) => {
          expect(res).to.have.status(200) //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
          expect(res.body.status).to.be.equal(true)
          expect(res.body.message).to.be.equal("message sent successfully!")
        res.body.should.have.keys('status', 'message')
        done()
      }).catch((err) => done(err))
    })
  })

  describe('POST Mark as Read', () => {
    it("POST Mark as Read", function(done) {
    const message_body ={
      "id": 46
    }
  
    chai.request(baseUrl)
      .post('/message/status/update')
      .send(message_body)
      .set({ "Authorization": `Bearer ${token}` })
      .then((res) => {
          expect(res).to.have.status(200) //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
          expect(res.body.status).to.be.equal(true)
          expect(res.body.message).to.be.equal("message sent successfully!")
        res.body.should.have.keys('status', 'message')
        done()
      }).catch((err) => done(err))
    })
  })

  describe('POST All Users', () => {
    it("POST all users", function(done) {
        chai.request(baseUrl)
          .post('/users')
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
             expect(res).to.have.status(200)
             expect(res.body.status).to.be.equal(true)
             expect(res.body.data).to.be.an.instanceof(Object)
            expect(res.body.data.users[0]).to.have.property('id')
            res.body.should.have.keys('status', 'data')
            done()
          }).catch((err) => done(err))
     })
  })

});
