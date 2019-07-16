/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectID;

module.exports = function (app,db) {
  
  app.route('/api/threads/:board')
    .post(function (req, res){
    var currentDate = new Date(Date.now());
    var createThread = {
      board: req.body.board,
      text: req.body.text,
      created_on: currentDate,
      bumped_on: currentDate,
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    };
    
    db.db('test').collection('thread').insertOne(
      createThread
    );
    
    
    
    // testing for output
    // console.log('board: ', req.body.board, ', thread text: ', req.body.text, ', password to delete: ', req.body.delete_password);
    
    //testing redirect
    res.redirect('/b/' + req.body.board + '/');
    
    
  })// ending for .post
    
  
    .get(function (req,res){
    
      db.db('test').collection('thread').find({board: req.params.board},{projection:{'reported':0, 'delete_password':0, 'replies': {$slice: -3}, 'replies.reported': 0, 'replies.delete_password': 0}}).sort({bumped_on: -1}).limit(10).toArray((err,result)=>{
        
        res.json(result);
        
      });
    
    // ).sort({bumped_on: -1}).limit(10).toArray(
    
  })// ending for .get
  
  .delete(function (req,res){
    
    try{
      
      db.db('test').collection('thread').findOne({_id: ObjectId(req.body.thread_id)}, (err,result)=>{
        if(result == null){
          res.send('thread not found.');
        }else if(req.body.delete_password == result.delete_password){
          db.db('test').collection('thread').deleteOne({_id: ObjectId(req.body.thread_id)});
          res.send('success');
        }else{
          res.send('incorrect password');
        }
      });
      
    }catch (e) {
      if (e instanceof Error){
        res.send('Error with ID');
      }
      
    } 
    
    
  })  // ending for .delete
  
  .put(function (req,res){
    try{
      // console.log(req.body);
      var tempId;
      if (req.body.report_id == null){
        tempId = req.body.thread_id;
      }else{
        tempId = req.body.report_id;
      }
      // console.log(tempId);
      
      db.db('test').collection('thread').findOne({_id: ObjectId(tempId)}, (err,result)=>{
        if(result == null){
          res.send('thread not found.');
        }else{
          db.db('test').collection('thread').updateOne({_id:ObjectId(tempId)},{$set:{reported: true}});
          res.send('success');
        }
      });
      
    }catch (e) {
      if (e instanceof Error){
        res.send('Error with ID');
      }
      
    } 
    
    
    
    
  })  // ending for .put
  
  
          
  ;// ending for app route /threads/:board
  
  
  
  
  
  
  app.route('/api/replies/:board')
    .post(function (req,res){
    var currentDate = new Date(Date.now());
    var createReply = {
      _id: ObjectId(),
      text: req.body.text,
      created_on: currentDate,
      reported: false,
      delete_password: req.body.delete_password
    };
    
    
    try{
      
      // console.log(req.body);
      var tempId;
      if (req.body.report_id == null){
        tempId = req.body.thread_id;
      }else{
        tempId = req.body.report_id;
      }
      // console.log(tempId);
      
    db.db('test').collection('thread').findOne({_id:ObjectId(req.body.thread_id)},(err,result)=>{
      // console.log(result);
      if (result == null){
        res.send('Board could not be found');
        
      }else{
        (async function wait(){
        await new Promise(function (resolve,reject){
          resolve(
          db.db('test').collection('thread').updateOne({_id:ObjectId(req.body.thread_id)},{$set:{bumped_on: currentDate}})
          );
        }).then(function (promise){
          return new Promise (function (resolve,reject){
            resolve(
            db.db('test').collection('thread').updateOne({_id:ObjectId(req.body.thread_id)},{$push:{replies: createReply}})
              );
          });
          
        }).then((promise)=>{
           res.redirect('/b/' + req.body.board + '/' + req.body.thread_id);
        });
          
      })();
        
       
      }
    });
    } catch (e) {
      
      if (e instanceof Error){
         res.send('Error with id');   
        
      }
    }
    
  })// ending for .post
  
    .get(function (req,res){
      var queryId = req.query.thread_id;
      // console.log(queryId);
    
      db.db('test').collection('thread').findOne({_id: ObjectId(queryId)},{projection:{'reported': 0, 'delete_password': 0, 'replies.reported': 0, 'replies.delete_password': 0}},(err,result)=>{
        // console.log(result);
        res.json(result);
        
      });
    
  })// ending for .get
  
    .delete(function (req,res){

        try{

          
          db.db('test').collection('thread').findOne({_id: ObjectId(req.body.thread_id)}, (err,result)=>{
            if(result == null){
              res.send('thread not found.');
            }else{
              // console.log(req.body);
              var tempIndex = result.replies.findIndex(i => i._id == req.body.reply_id);
              // console.log(tempIndex);
              if (tempIndex == -1){
                res.send('reply ID not found.');
              }else if (req.body.delete_password == result.replies[tempIndex].delete_password){
                db.db('test').collection('thread').updateOne({_id:ObjectId(req.body.thread_id), 'replies.text': result.replies[tempIndex].text},{$set:{'replies.$.text': '[deleted]'}});
                res.send('success');
              }else{
                res.send('incorrect password');  
              }
            }
          });

        }catch (e) {
          if (e instanceof Error){
            res.send('Error with ID');
          }

        } 


      })  // ending for .delete
  
    .put(function (req,res){
    try{
      
      db.db('test').collection('thread').findOne({_id: ObjectId(req.body.thread_id)}, (err,result)=>{
        if(result == null){
          res.send('thread not found.');
        }else{
          // console.log(req.body);
          var tempIndex = result.replies.findIndex(i => i._id == req.body.reply_id);
          // console.log(tempIndex);
          if (tempIndex == -1){
            res.send('reply ID not found.');
          }else {
            db.db('test').collection('thread').updateOne({_id:ObjectId(req.body.thread_id), 'replies._id': result.replies[tempIndex]._id},{$set:{'replies.$.reported': true}});
            res.send('success');
          }
        }
      });
      
    }catch (e) {
      if (e instanceof Error){
        res.send('Error with ID');
      }
      
    } 
    
    
    
    
  })  // ending for .put
  
  
  ;// ending for app route /threads/:board

};
