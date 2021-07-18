let chai = require("chai");
let chaiHttp = require("chai-http");
const { expect } = chai;


chai.use(chaiHttp);
chai.should();

let baseUrl = 'https://comurule-salesapi.herokuapp.com';

describe('SalesBook API Testing', () => {
  
  before(done => {
    const key = {
      "private_key": "U2FsdGVkX19YIW4DoTAFyy5bFmMp0cpAyizM567IMUwI4X+gv/UqDRc3qPs/b4bR",
      "public_key": "lGqRvmf5OVDn6cm2Efqgbxr08f0aQ5",
      "module_id": 556
     };
    chai
      .request(baseUrl)
      .post("/free/login_using_keys")
      .send(key)
      .end((err, res) => {
        res.should.have.status(200);
        token  = res.body.token
        done();
      });
  });

  describe('POST Create a Preference', () => {
    it("POST create a Preference", function(done) {
     const message_body = {
          "preference": {
            "name":"Something" + Math.random(),
            "displayType":"Entity",
            "tier":"Tier 1",
            "parentPC": 1
        }
     }
     chai.request(baseUrl)
       .post('/main/preferences')
       .send(message_body)
       .set({ "Authorization": `Bearer ${token}` })
       .then((res) => {
          expect(res).to.have.status(200)
          expect(res.body.status).to.be.equal(true)
          expect(res.body.message).to.be.equal("Preference Center created successfully.")
          expect(res.body.data).to.be.an.instanceof(Object)
          expect(res.body.data).to.have.keys('id', 'name', 'tier', 'displayType', 'pcCode', 'parentPC')
          expect(res.body.data.id).to.be.a('number')
          expect(res.body.data.parentPC).to.be.a('number')
          res.body.should.have.keys('status', 'data', 'message')
          idForPreference = res.body.data.id
          done()
       }).catch((err) => done(err))
  })
 })

 describe('PUT Update a Preference', () => {
  it('PUT Update a Preference', function(done) {
   const message_body = {
    "preference": {
        "name":"Aeauty",
        "displayType":"Entity",
        "tier":"Tier 1",
        "parentPC": 2
    }
  }
   chai.request(baseUrl)
     .put('/main/preferences/1')
     .send(message_body)
     .set({ "Authorization": `Bearer ${token}` })
     .then((res) => {
        expect(res).to.have.status(200)
        expect(res.body.status).to.be.equal(true)
        expect(res.body.message).to.be.equal("Preference Center updated successfully.")
        res.body.should.have.keys('status',  'message')
        done()
     }).catch((err) => done(err))
})
})

  describe('GET All Preferences', () => {
    it("Get all Preferences", function(done) {
        chai.request(baseUrl)
          .get('/main/preferences')
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
             expect(res).to.have.status(200)
             expect(res.body.status).to.be.equal(true)
             expect(res.body.data).to.be.an.instanceof(Object)
             expect(res.body.data.entities).to.be.an('array')
             expect(res.body.data.entities[0]).to.contain.keys('id', 'name', 'tier', 'parentPC')
            res.body.should.have.keys('status', 'data', 'message')
            done()
          }).catch((err) => done(err))
     })

     it("Should return an error", function(done) {
      chai.request(baseUrl)
        .get('/preferenfce')
        .set({ "Authorization": `Bearer ${token}` })
        .then((res) => {
           expect(res).to.have.status(404)
          done()
        }).catch((err) => done(err))
    })
  })

  describe('GET A Preference', () => {
    it("Get a Preference", function(done) {
        chai.request(baseUrl)
          .get('/main/preferences/1')
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
             expect(res).to.have.status(200)
             expect(res.body.status).to.be.equal(true)
             expect(res.body.data).to.be.an.instanceof(Object)
            res.body.should.have.keys('status', 'data', 'message')
            done()
          }).catch((err) => done(err))
     })
  })


  describe('Delete A Preference', () => {
    it("Delete a Preference", function(done) {
        chai.request(baseUrl)
          .delete('/main/preferences/' + idForPreference)
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Preference Center deleted successfully.")
            res.body.should.have.keys('status',  'message')
            done()
          }).catch((err) => done(err))
     })
    })       
            
    describe('POST Create a Campaign', () => {
      it("POST create a Campaign", function(done) {
       const message_body = 
       {
           "campaign": {
               "name":"Cosmetics" + Math.random()
           }
       }
       chai.request(baseUrl)
         .post('/main/campaigns')
         .send(message_body)
         .set({ "Authorization": `Bearer ${token}` })
         .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Campaign created successfully.")
            expect(res.body.data).to.be.an.instanceof(Object)
            expect(res.body.data).to.contain.keys( 'name', "code")
            res.body.should.have.keys('status', 'data', 'message')
            idForCampaign = res.body.data.id
            done()
         }).catch((err) => done(err))
    })
   })
  
   describe('PUT Update a Campaign', () => {
    it('PUT Update a campaign', function(done) {
     const message_body = {
      "campaign": {
          "name": "Beauty" + Math.random()
      }
    }
     chai.request(baseUrl)
       .put('/main/campaigns/1')
       .send(message_body)
       .set({ "Authorization": `Bearer ${token}` })
       .then((res) => {
          expect(res).to.have.status(200)
          expect(res.body.status).to.be.equal(true)
          expect(res.body.message).to.be.equal("Campaign updated successfully.")
          res.body.should.have.keys('status', 'message')
          done()
       }).catch((err) => done(err))
  })
  })
  
    describe('GET All Campaigns', () => {
      it("Get all campaigns", function(done) {
          chai.request(baseUrl)
            .get('/main/campaigns')
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
               expect(res).to.have.status(200)
               expect(res.body.status).to.be.equal(true)
               expect(res.body.data).to.be.an.instanceof(Object)
               expect(res.body.data.entities).to.be.an('array')
               expect(res.body.data.entities[0]).to.contain.keys('name', 'code')
              res.body.should.have.keys('status', 'data', 'message')
              done()
            }).catch((err) => done(err))
       })
  
       it("Should return an error", function(done) {
        chai.request(baseUrl)
          .get('/capagn')
          .set({ "Authorization": `Bearer ${token}` })
          .then((res) => {
             expect(res).to.have.status(404)
            done()
          }).catch((err) => done(err))
      })
    })
  
    describe('GET A Campaign', () => {
      it("Get a campaign", function(done) {
          chai.request(baseUrl)
            .get('/main/campaigns/1')
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
               expect(res).to.have.status(200)
               expect(res.body.status).to.be.equal(true)
               expect(res.body.data).to.be.an.instanceof(Object)
              res.body.should.have.keys('status', 'data', 'message')
              done()
            }).catch((err) => done(err))
       })
    })
  
  
    describe('Delete A campaign', () => {
      it("Delete a campaign", function(done) {
          chai.request(baseUrl)
            .delete('/main/campaigns/' + idForCampaign)
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
              expect(res).to.have.status(200)
              expect(res.body.status).to.be.equal(true)
              expect(res.body.message).to.be.equal("Campaign deleted successfully.")
              res.body.should.have.keys('status',  'message')
              done()
            }).catch((err) => done(err))
       })
      })       

      describe('POST Create a Campaign Data', () => {
        it("POST create a campaign Data", function(done) {
         const message_body = 
         {
            "campaignData": {
              "dataLabel":"Hello" + Math.random(),
              "displayType":"text",
              "campaignId": 1
            }
         }
         chai.request(baseUrl)
           .post('/main/campaignData')
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Campaign Data created successfully.")
            expect(res.body.data).to.be.an.instanceof(Object)
            expect(res.body.data).to.have.keys('id', 'dataLabel', 'displayType', 'code', 'campaignId')
            expect(res.body.data.id).to.be.a('number')
            expect(res.body.data.campaignId).to.be.a('number')
            res.body.should.have.keys('status', 'data', 'message')
            idForCampaignData = res.body.data.id
              done()
           }).catch((err) => done(err))
      })
     })
    
     describe('PUT Update a Campaign Data', () => {
      it('PUT Update a campaign Data', function(done) {
       const message_body = {
          "campaignData": {
            "dataLabel":"Aeuty",
            "displayType":"text",
            "campaignId": 1
          }
      }
       chai.request(baseUrl)
         .put('/main/campaignData/2')
         .send(message_body)
         .set({ "Authorization": `Bearer ${token}` })
         .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Campaign Data updated successfully.")
            res.body.should.have.keys('status',  'message')
            done()
         }).catch((err) => done(err))
    })
    })
    
      describe('GET All Campaign Data', () => {
        it("Get all campaign Data", function(done) {
            chai.request(baseUrl)
              .get('/main/campaignData')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.message).to.be.equal('Campaign Data list.')
                 expect(res.body.data.entities).to.be.an('array')
                 expect(res.body.data.totalCount).to.be.a('number')
                 expect(res.body.data.entities[0]).to.contain.keys('id', 'dataLabel', 'code', 'campaignId')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
    
         it("Should return an error", function(done) {
          chai.request(baseUrl)
            .get('/campin')
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
               expect(res).to.have.status(404)
              done()
            }).catch((err) => done(err))
        })
      })
    
      describe('GET A Campaign Data', () => {
        it("Get a campaign Data", function(done) {
            chai.request(baseUrl)
              .get('/main/campaignData/2')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.data).to.contain.keys('id', 'dataLabel', 'code', 'campaignId')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
      })
    
    
      describe('Delete A Campaign Data', () => {
        it("Delete a campaign Data", function(done) {
            chai.request(baseUrl)
              .delete('/main/campaignData/' + idForCampaignData)
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.be.equal(true)
                expect(res.body.message).to.be.equal("Campaign Data deleted successfully.")
                res.body.should.have.keys('status',  'message')
                done()
              }).catch((err) => done(err))
         })
      })       

      describe('POST Create a User Token', () => {
        it("POST create a User Token", function(done) {
         const message_body = 
         {
              "userToken": {
                "rating":"Hot",
                "leadStatus":"Closed",
                "leadSource":"Facebook" + Math.random(),
                "campaignCode":"C93839",
                "pcCode":["P161","P796"]
            }
         }
         chai.request(baseUrl)
           .post('/main/tokens')
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("User Token created successfully.")
            expect(res.body.data).to.be.an.instanceof(Object)
            expect(res.body.data).to.contain.keys('id', 'leadSource', 'leadStatus', 'pcCode', 'userToken', 'rating')
            expect(res.body.data.id).to.be.a('number')
            expect(res.body.data.pcCode).to.be.an('array')
            res.body.should.have.keys('status', 'data', 'message')
            idForTokens = res.body.data.id
              done()
           }).catch((err) => done(err))
      })
     })
    
     describe('PUT Update a User Token', () => {
      it('PUT Update a User Token', function(done) {
       const message_body = {
            "userToken": {
              "rating":"Hot",
              "leadStatus":"Working",
              "leadSource":"WhatsApp",
              "campaignCode":"C137",
              "pcCode":["P236","P517"]
          }
      }
       chai.request(baseUrl)
         .put('/main/tokens/1')
         .send(message_body)
         .set({ "Authorization": `Bearer ${token}` })
         .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("User Token updated successfully.")
            res.body.should.have.keys('status',  'message')
            done()
         }).catch((err) => done(err))
    })
    })
    
      describe('GET All User Token', () => {
        it("Get all User Token", function(done) {
            chai.request(baseUrl)
              .get('/main/tokens')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.message).to.be.equal('User Token list.')
                 expect(res.body.data.entities).to.be.an('array')
                 expect(res.body.data.totalCount).to.be.a('number')
                 expect(res.body.data.entities[0]).to.contain.keys('id', 'leadSource', 'leadStatus', 'campaignCode')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
    
         it("Should return an error", function(done) {
          chai.request(baseUrl)
            .get('/tokns')
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
               expect(res).to.have.status(404)
              done()
            }).catch((err) => done(err))
        })
      })
    
      describe('GET A User Token', () => {
        it("Get a User Token", function(done) {
            chai.request(baseUrl)
              .get('/main/tokens/1')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.data).to.contain.keys('id', 'leadSource', 'leadStatus', 'campaignCode')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
      })
    
    
      describe('Delete A User Token', () => {
        it("Delete a User Token", function(done) {
            chai.request(baseUrl)
              .delete('/main/tokens/' + idForTokens)
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.be.equal(true)
                expect(res.body.message).to.be.equal("User Token deleted successfully.")
                res.body.should.have.keys('status',  'message')
                done()
              }).catch((err) => done(err))
         })
      })
      
      describe('GET HTML Script', () => {
        it("GET HTML Script", function(done) {
            chai.request(baseUrl)
              .get('/free/tokens/UT4411581913')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                done()
              }).catch((err) => done(err))
         })
      })
    
      describe('POST Create a Lead', () => {
        it("POST create a Lead", function(done) {
         const message_body = 
         {
          "lead": {
              "token":"UT4528208359",
              "email": Math.random() + "cee@gmail.com",
              "companyName":"Comurule",
              "lastName":"Chibuike"
          }
        }
         chai.request(baseUrl)
           .post('/main/leads')
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Lead created successfully.")
            
            done()
           }).catch((err) => done(err))
      })
     })

     describe('POST Create a Lead with User Token', () => {
      it("POST create a Lead with User Token", function(done) {
       const message_body = 
       {
        "lead": {
            "token":"UT4528208359",
            "email":"vee.cee@gmail.com",
            "companyName":"Comurule",
            "lastName":"Chibuike"
        }
      }
       chai.request(baseUrl)
         .post('/free/leads')
         .send(message_body)
         .set({ "Authorization": `Bearer ${token}` })
         .then((res) => {
          expect(res).to.have.status(200)
          expect(res.body.status).to.be.equal(true)
          expect(res.body.message).to.be.equal("Lead created successfully.")
          done()
         }).catch((err) => done(err))
    })
   })

   describe('POST Create a Lead with Associates', () => {
    it("POST create a Lead with Associates", function(done) {
     const message_body = 
     {
          "lead": {
            "status":"New",
            "rating":"Hot",
            "source":"Facebook",
            "email":"enwoko1@gmail.com",
            "lastName":"Chibuike",
            "companyName":"Comurule",
            "preferences":["P663"],
            "campaignCode": "C77861"
        }
    }
     chai.request(baseUrl)
       .post('/main/leads')
       .send(message_body)
       .set({ "Authorization": `Bearer ${token}` })
       .then((res) => {
        expect(res).to.have.status(200)
        expect(res.body.status).to.be.equal(true)
        expect(res.body.message).to.be.equal("Lead created successfully.")
          done()
       }).catch((err) => done(err))
  })
 })
    
     
    
      describe('GET All Leads', () => {
        it("Get all Leads", function(done) {
            chai.request(baseUrl)
              .get('/main/leads')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.message).to.be.equal('Lead list.')
                 expect(res.body.data.entities).to.be.an('array')
                 expect(res.body.data.totalCount).to.be.a('number')
                 expect(res.body.data.entities[0]).to.contain.keys('id', 'status', 'source', 'rating', 'code')
                res.body.should.have.keys('status', 'data', 'message')
                array = res.body.data.entities
                idForLeads = res.body.data.entities[array.length-1].id
                done()
              }).catch((err) => done(err))
         })
      })

      describe('PUT Update a Lead with Associates', () => {
        it('PUT Update a Lead with associates', function(done) {
         const message_body = {
              "lead": {
                "status":"New",
                "rating":"Hot",
                "source":"Facebook",
                "email":"enwshkasjdoko@gmail.com",
                "lastName":"Chibuike",
                "companyName":"Comurule",
                "preferences":["P362"],
                "campaignCode":"C77861"
            }
        }
         chai.request(baseUrl)
           .put('/main/leads/' + idForLeads)
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
              expect(res).to.have.status(200)
              expect(res.body.status).to.be.equal(true)
              expect(res.body.message).to.be.equal("Lead updated successfully.")
              res.body.should.have.keys('status',  'message')
              done()
           }).catch((err) => done(err))
        })
      })
  
      describe('PUT Update a Lead', () => {
        it('PUT Update a Lead', function(done) {
         const message_body = {
              "lead": {
                "status":"New",
                "rating":"Hot",
                "source":"Facebook",
                "email":"enwshkasjdoko@gmail.com",
                "lastName":"Chibuike",
                "companyName":"Comurule",
                "preferences":["P362"],
                "campaignCode":"C77861"
            }
        }
         chai.request(baseUrl)
           .put('/main/leads/' + idForLeads)
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
              expect(res).to.have.status(200)
              expect(res.body.status).to.be.equal(true)
              expect(res.body.message).to.be.equal("Lead updated successfully.")
              res.body.should.have.keys('status',  'message')
              done()
           }).catch((err) => done(err))
        })
      })
    
      describe('GET A Lead', () => {
        it("Get a Lead", function(done) {
            chai.request(baseUrl)
              .get('/main/leads/' + idForLeads)
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.data).to.contain.keys('id', 'source', 'rating', 'code', 'currency', 'language')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
      })    

      describe('GET Convert A Lead', () => {
        it("Get Convert A Lead", function(done) {
            chai.request(baseUrl)
              .get('/main/leads/' + idForLeads + '/convert')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.message).to.be.equal("Lead converted successfully.")
                res.body.should.have.keys('status', 'message')
                done()
              }).catch((err) => done(err))
         })
      })
    
      describe('Delete A Lead', () => {
        it("Delete a Lead", function(done) {
            chai.request(baseUrl)
              .delete('/main/leads/' + idForLeads)
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.be.equal(true)
                expect(res.body.message).to.be.equal("Lead deleted successfully.")
                res.body.should.have.keys('status',  'message')
                done()
              }).catch((err) => done(err))
         })
      })

      describe('POST Upsert Multiple Leads Csv', () => {
        it("POST Upsert Multiple Leads Csv", function(done) {
         chai.request(baseUrl)
           .post('/main/leads/upsertMultiple')
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
            expect(res).to.have.status(200)
              done()
           }).catch((err) => done(err))
      })
     })
      
  
      describe('POST Create an Account', () => {
        it("POST create an Account", function(done) {
         const message_body = 
         {
          "account": {
            "currency": "NGN",
            "language": "english",
            "name": "Comurule" + Math.random(),
            "email": "umebuike@gmail.com",
            "website": "www.hey.com",
            "address": "get t right this time",
            "city": "get",
            "country": "Nigeria"
          }
        }
         chai.request(baseUrl)
           .post('/main/accounts')
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Account created successfully.")
            expect(res.body.data).to.be.an.instanceof(Object)
            expect(res.body.data).to.contain.keys('id', 'currency', 'language', 'name', 'email', 'website', 'city', 'country')
            expect(res.body.data.id).to.be.a('number')
            res.body.should.have.keys('status', 'data', 'message')            
            idForAccounts = res.body.data.id
            done()
           }).catch((err) => done(err))
      })
     })

    describe('PUT Update an Account', () => {
      it('PUT Update an Account', function(done) {
       const message_body = {
            "account": {
              "currency": "NGN",
              "language": "english",
              "name": "Comurule",
              "email": "umebuike@gmail.com",
              "website": "www.hey.com",
              "address": "get t right this time",
              "city": "get",
              "country": "Nigeria"
          }
      }
       chai.request(baseUrl)
         .put('/main/accounts/1')
         .send(message_body)
         .set({ "Authorization": `Bearer ${token}` })
         .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Account updated successfully.")
            res.body.should.have.keys('status',  'message')
            done()
         }).catch((err) => done(err))
      })
    })
    
      describe('GET All Accounts', () => {
        it("Get all accounts", function(done) {
            chai.request(baseUrl)
              .get('/main/accounts')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.message).to.be.equal('Account list.')
                 expect(res.body.data.entities).to.be.an('array')
                 expect(res.body.data.totalCount).to.be.a('number')
                 expect(res.body.data.entities[0]).to.contain.keys('id', 'currency', 'language', 'name', 'email', 'website', 'city', 'country')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
    
         it("Should return an error", function(done) {
          chai.request(baseUrl)
            .get('/accunts')
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
              expect(res).to.have.status(404)
              done()
            }).catch((err) => done(err))
        })
      })
    
      describe('GET An Account', () => {
        it("Get an Account", function(done) {
            chai.request(baseUrl)
              .get('/main/accounts/1')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.data).to.contain.keys('id', 'currency', 'language', 'name', 'email', 'website', 'city', 'country')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
      })
    
    
      describe('Delete An Account', () => {
        it("Delete an Account", function(done) {
            chai.request(baseUrl)
              .delete('/main/accounts/' + idForAccounts)
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.be.equal(true)
                expect(res.body.message).to.be.equal("Account deleted successfully.")
                res.body.should.have.keys('status',  'message')
                done()
              }).catch((err) => done(err))
         })
      })

      describe('POST Create a Contact', () => {
        it("POST create a Contact", function(done) {
         const message_body = 
         {
              "contact": {
                "firstName": "",
                "lastName": "killam" + Math.random(),
                "email": Math.random() + "imilitus@ymail.com",
                "username": "",
                "address": "",
                "city": "",
                "state": "",
                "country": "",
                "accountId": 1
            }
        }
         chai.request(baseUrl)
           .post('/main/contacts')
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Contact created successfully.")
            expect(res.body.data).to.be.an.instanceof(Object)
            expect(res.body.data).to.contain.keys('id', "firstName", 'lastName', 'email', 'username', 'address', 'city', 'state', 'country')
            expect(res.body.data.id).to.be.a('number')
            res.body.should.have.keys('status', 'data', 'message')            
            idForContacts = res.body.data.id
            done()
           }).catch((err) => done(err))
      })
     })

    describe('PUT Update a Contact', () => {
      it('PUT Update a Contact', function(done) {
       const message_body = {
            "contact": {
              "firstName": "Comureul",
              "lastName": "catcham12",
              "email": "hello1@game.com",
              "username": "",
              "address": "",
              "city": "",
              "state": "",
              "country": "",
              "accountId": 1
          }
      }
       chai.request(baseUrl)
         .put('/main/contacts/1')
         .send(message_body)
         .set({ "Authorization": `Bearer ${token}` })
         .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Contact updated successfully.")
            res.body.should.have.keys('status',  'message')
            done()
         }).catch((err) => done(err))
      })
    })
    
      describe('GET All contacts', () => {
        it("Get all contacts", function(done) {
            chai.request(baseUrl)
              .get('/main/contacts')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.message).to.be.equal('Contact list.')
                 expect(res.body.data.entities).to.be.an('array')
                 expect(res.body.data.totalCount).to.be.a('number')
                 expect(res.body.data.entities[0]).to.contain.keys('id', "firstName", 'lastName', 'email', 'username', 'address', 'city', 'state', 'country')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
    
         it("Should return an error", function(done) {
          chai.request(baseUrl)
            .get('/cntacts')
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
               expect(res).to.have.status(404)
              done()
            }).catch((err) => done(err))
        })
      })
    
      describe('GET A Contact', () => {
        it("Get a Contact", function(done) {
            chai.request(baseUrl)
              .get('/main/contacts/1')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.data).to.contain.keys('id', "firstName", 'lastName', 'email', 'username', 'address', 'city', 'state', 'country')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
      })
    
    
      describe('Delete A Contact', () => {
        it("Delete a Contact", function(done) {
            chai.request(baseUrl)
              .delete('/main/contacts/' + idForContacts)
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.be.equal(true)
                expect(res.body.message).to.be.equal("Contact deleted successfully.")
                res.body.should.have.keys('status',  'message')
                done()
              }).catch((err) => done(err))
         })
      })

      describe('POST Create a Store', () => {
        it("POST create a Store", function(done) {
         const message_body = 
         {
              "store": {
                "name": "Comurule" + Math.random(),
                "currency": "USD",
                "welcomeMessage": "hello",
                "businessDescription": "Comurule is the issssh",
                "whatsapp": "2347039601940",
                "phoneNumber": "234703960190",
                "email": "umebuike@gmail.com",
                "facebook": "https://facebook.com/comurule",
                "twitter": "https://twitter.com/comurule",
                "instagram": "https://instagram.com/comurule"
            }
        }
         chai.request(baseUrl)
           .post('/main/stores')
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Store created successfully.")
            expect(res.body.data).to.be.an.instanceof(Object)
            expect(res.body.data).to.contain.keys('id', "name", 'currency', 'slug', 'status', 'contact', 'business')
            expect(res.body.data.id).to.be.a('number')
            res.body.should.have.keys('status', 'data', 'message')            
            idForStores = res.body.data.id
            done()
           }).catch((err) => done(err))
      })
     })

    describe('PUT Update a Store', () => {
      it('PUT Update a Store', function(done) {
       const message_body = {
            "store": {
              "name": "Comurule Ventures",
              "currency": "USD",
              "status": "active",
              "welcomeMessage": "hello",
              "businessDescription": "Comurule is the issssh",
              "whatsapp": "2347039601940",
              "phoneNumber": "234703960190",
              "email": "umebuike@gmail.com",
              "facebook": "https://facebook.com/comurule",
              "twitter": "https://twitter.com/comurule",
              "instagram": "https://instagram.com/comurule"
          }
      }
       chai.request(baseUrl)
         .put('/main/stores/1')
         .send(message_body)
         .set({ "Authorization": `Bearer ${token}` })
         .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Store updated successfully.")
            res.body.should.have.keys('status',  'message')
            done()
         }).catch((err) => done(err))
      })
    })
    
      describe('GET All stores', () => {
        it("Get all stores", function(done) {
            chai.request(baseUrl)
              .get('/main/stores')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.message).to.be.equal('Store list.')
                 expect(res.body.data.entities).to.be.an('array')
                 expect(res.body.data.totalCount).to.be.a('number')
                 expect(res.body.data.entities[0]).to.contain.keys('id', "name", 'currency', 'slug', 'status', 'contact', 'business')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
    
         it("Should return an error", function(done) {
          chai.request(baseUrl)
            .get('/stres')
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
               expect(res).to.have.status(404)
              done()
            }).catch((err) => done(err))
        })
      })
    
      describe('GET A Store', () => {
        it("Get a Store", function(done) {
            chai.request(baseUrl)
              .get('/main/stores/1')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.data).to.contain.keys('id', "name", 'currency', 'slug', 'status', 'contact', 'business')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
      })
    
    
      describe('Delete A Store', () => {
        it("Delete a Store", function(done) {
            chai.request(baseUrl)
              .delete('/main/stores/' + idForStores)
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.be.equal(true)
                expect(res.body.message).to.be.equal("Store deleted successfully.")
                res.body.should.have.keys('status',  'message')
                done()
              }).catch((err) => done(err))
         })
      })

      describe('POST Create a Product', () => {
        it("POST create a Product", function(done) {
         const message_body = 
         {
              "product": {
                "name": "Product " + Math.random(),
                "description": "A good product",
                "media": ["download_url"],
                "price": 10.01,
                "currency": "CAD",
                "isQuantityLimited": true,
                "quantity": 100,
                "lowStockAlert": true,
                "lowStockQuantity": 5,
                "storeId": 1
            }
        }
         chai.request(baseUrl)
           .post('/main/products')
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Product created successfully.")
            expect(res.body.data).to.be.an.instanceof(Object)
            expect(res.body.data).to.contain.keys('id', "name", 'description', 'slug', 'status', 'media', 'price', 'currency', 'quantity')
            expect(res.body.data.id).to.be.a('number')
            res.body.should.have.keys('status', 'data', 'message')            
            idForProducts = res.body.data.id
            done()
           }).catch((err) => done(err))
      })
     })

    describe('PUT Update a Product', () => {
      it('PUT Update a Product', function(done) {
       const message_body = {
            "product": {
              "name": "Product 2",
              "description": "A good product",
              "media": ["download_url"],
              "price": 10.01,
              "currency": "CAD",
              "isQuantityLimited": true,
              "quantity": 100,
              "lowStockAlert": true,
              "lowStockQuantity": 5,
              "storeId": 1
          }
      }
       chai.request(baseUrl)
         .put('/main/products/1')
         .send(message_body)
         .set({ "Authorization": `Bearer ${token}` })
         .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Product updated successfully.")
            res.body.should.have.keys('status',  'message')
            done()
         }).catch((err) => done(err))
      })
    })
    
      describe('GET All products', () => {
        it("Get all products", function(done) {
            chai.request(baseUrl)
              .get('/main/products')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.message).to.be.equal('Product list.')
                 expect(res.body.data.entities).to.be.an('array')
                 expect(res.body.data.totalCount).to.be.a('number')
                 expect(res.body.data.entities[0]).to.contain.keys('id', "name", 'description', 'slug', 'status', 'media', 'price', 'currency', 'quantity')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
    
         it("Should return an error", function(done) {
          chai.request(baseUrl)
            .get('/productss')
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
               expect(res).to.have.status(404)
              done()
            }).catch((err) => done(err))
        })
      })
    
      describe('GET A Product', () => {
        it("Get a Product", function(done) {
            chai.request(baseUrl)
              .get('/main/products/1')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.data.lowStockQuantity).to.be.a('number')
                 expect(res.body.data.lowStockAlert).to.be.a("boolean")
                 expect(res.body.data).to.contain.keys('id', "name", 'description', 'slug', 'status', 'media', 'price', 'currency', 'quantity')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
      })
    
    
      describe('Delete A Product', () => {
        it("Delete a Product", function(done) {
            chai.request(baseUrl)
              .delete('/main/products/' + idForProducts)
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.be.equal(true)
                expect(res.body.message).to.be.equal("Product deleted successfully.")
                res.body.should.have.keys('status',  'message')
                done()
              }).catch((err) => done(err))
         })
      })

      describe('POST Create an Order', () => {
        it("POST create an Order", function(done) {
         const message_body = 
         {
              "orders": [{
                "email": "umebuike@gmail.com",
                "firstName": "Chibuike" + Math.random(),
                "lastName": "Chibuike",
                "amount": 10.01,
                "quantity": 1,
                "storeId": 1,
                "productId": 1,
                "businessId": 179
            },{
                "email": "umebuike@gmail.com",
                "firstName": "Chibuike" + Math.random(),
                "lastName": "Chibuike",
                "amount": 20.02,
                "quantity": 2,
                "storeId": 1,
                "productId": 1,
                "businessId": 179
            }]
        }
         chai.request(baseUrl)
           .post('/main/orders')
           .send(message_body)
           .set({ "Authorization": `Bearer ${token}` })
           .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("All Entries are successful")
            expect(res.body.data).to.be.an.instanceof(Array)
            expect(res.body.data[0]).to.have.keys('ref', 'status', 'message')
            res.body.should.have.keys('status', 'data', 'message')            
            done()
           }).catch((err) => done(err))
      })
     })

    describe('PUT Update a Order', () => {
      it('PUT Update a Order', function(done) {
       const message_body = {
            "order": {
              "email": "umebuike@gmail.com",
              "firstName": "Chibuike",
              "lastName": "Chibuike",
              "status": "paid"
          }
      }
       chai.request(baseUrl)
         .put('/main/orders/1')
         .send(message_body)
         .set({ "Authorization": `Bearer ${token}` })
         .then((res) => {
            expect(res).to.have.status(200)
            expect(res.body.status).to.be.equal(true)
            expect(res.body.message).to.be.equal("Order updated successfully.")
            res.body.should.have.keys('status',  'message')
            done()
         }).catch((err) => done(err))
      })
    })
    
      describe('GET All orders', () => {
        it("Get all orders", function(done) {
            chai.request(baseUrl)
              .get('/main/orders')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.message).to.be.equal('Order list.')
                 expect(res.body.data.entities).to.be.an('array')
                 expect(res.body.data.totalCount).to.be.a('number')
                 expect(res.body.data.entities[0]).to.contain.keys('id', 'email', 'firstName', 'lastName', 'amount', 'currency')
                res.body.should.have.keys('status', 'data', 'message')
                array = res.body.data.entities
                idForOrders = res.body.data.entities[array.length-1].id
                done()
              }).catch((err) => done(err))
         })
    
         it("Should return an error", function(done) {
          chai.request(baseUrl)
            .get('/ordes')
            .set({ "Authorization": `Bearer ${token}` })
            .then((res) => {
               expect(res).to.have.status(404)
              done()
            }).catch((err) => done(err))
        })
      })
    
      describe('GET An Order', () => {
        it("Get an Order", function(done) {
            chai.request(baseUrl)
              .get('/main/orders/1')
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                 expect(res).to.have.status(200)
                 expect(res.body.status).to.be.equal(true)
                 expect(res.body.data).to.be.an.instanceof(Object)
                 expect(res.body.data).to.contain.keys('id', 'email', 'firstName', 'lastName', 'amount', 'currency', 'status')
                res.body.should.have.keys('status', 'data', 'message')
                done()
              }).catch((err) => done(err))
         })
      })
    
    
      describe('Delete An Order', () => {
        it("Delete an Order", function(done) {
            chai.request(baseUrl)
              .delete('/main/orders/' + idForOrders)
              .set({ "Authorization": `Bearer ${token}` })
              .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body.status).to.be.equal(true)
                expect(res.body.message).to.be.equal("Order deleted successfully.")
                res.body.should.have.keys('status',  'message')
                done()
              }).catch((err) => done(err))
         })
      })
});