/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('api/threads/:board .post', function(done) {
       chai.request(server)
        .post('/api/threads/1')
        .send({
          board: '1',
          text: 'test',
          delete_password: 'test'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('api/threads/:board .get', function(done) {
        chai.request(server)
        .get('/api/threads/1')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          // console.log(res.body);
          assert.property(res.body[0], 'board');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.notProperty(res.body[0], 'reported');
          assert.notProperty(res.body[0], 'delete_password');
          assert.property(res.body[0], 'replies');
          done();
        });

      });
    });
    
    suite('DELETE', function() {
      test('api/threads/:board .delete', function(done) {
        chai.request(server)
        .delete('/api/threads/1')
        .send({thread_id: '5d2dd7736eacf20687ec601d',
              delete_password: 'test'})
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');

          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('api/threads/:board .put', function(done) {
       chai.request(server)
        .put('/api/threads/1')
        .send({
          thread_id:'5d2dd63f815a157c7be91382'
        })
        .end(function(err, res){

          assert.equal(res.status, 200);
         assert.equal(res.text, 'success');
          done();
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('api/replies/:board .post', function(done) {
       chai.request(server)
        .post('/api/replies/1')
        .send({
          board: '1',
          thread_id: '5d2dd7fc1a4ed9090d0e674f',
          text: 'test',
          delete_password: 'test'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('api/replies/:board .get', function(done) {
        chai.request(server)
        .get('/api/replies/1')
        .query({thread_id: '5d2dd7fc1a4ed9090d0e674f'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          // console.log(res.body);
          assert.property(res.body, 'board');
          assert.property(res.body, 'text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.notProperty(res.body, 'reported');
          assert.notProperty(res.body, 'delete_password');
          assert.property(res.body, 'replies');
          assert.propertyVal(res.body.replies[0], 'text', 'test');
          assert.notProperty(res.body.replies[0], 'reported');
          assert.notProperty(res.body.replies[0], 'delete_password');
          done();
        });

      });
    });
    
    suite('PUT', function() {
      test('api/replies/:board .put', function(done) {
       chai.request(server)
        .put('/api/replies/1')
        .send({
          board:'1',
          thread_id:'5d2dd63f815a157c7be91382',
          reply_id:'5d2dd7ff1a4ed9090d0e6750'
        })
        .end(function(err, res){

          assert.equal(res.status, 200);
         assert.equal(res.text, 'success');
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('api/threads/:board .delete', function(done) {
        chai.request(server)
        .delete('/api/threads/1')
        .send({
              board: '1',
              thread_id: '5d2dd63f815a157c7be91382',
              reply_id: '5d2dd7ff1a4ed9090d0e6750',
              delete_password: 'test'})
        .end(function(err,res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');

          done();
        });
      });
    });
    
  });

});
