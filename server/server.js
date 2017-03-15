const express= require("express");
const bodyParser= require("body-parser");
const _=require('lodash');
var{mongoose}=require('./db/mongoose');
var{User}=require('./models/user');
var{Todo}=require('./models/todo');
var{authendicate} = require('./middleware/authendicate')
var moment = require('moment');

var app= express();
app.use(bodyParser.json());

app.get('/nfn/:id',(req,res)=>{
var id=req.params.id;

 User.find({"id":id}).then((doc)=>{
 	console.log(doc);
 	res.send({doc})
})});


//TODO GET
app.get('/todos',authendicate,(req,res)=>{
	Todo.find({'_creator':req.user._id }).then((doc)=>{
		res.send({doc});
	}).catch((e)=>{
		res.status(400).send(e);
	})
})

//TODO POST
app.post('/todos',authendicate,(req,res)=>{
	// var body = _.pick(req.body,['text']);

	var todo = new Todo({
		'text':req.body.text,
		'_creator':req.user._id
	});
	todo.save().then((doc)=>{
		res.send({doc});
	}).catch((e)=>
	{
		res.status(400).send(e);
	}
)});

//TODO DELETE

 app.delete('/todos/:id',authendicate,(req,res)=>{

var id = req.params.id;
Todo.findOneAndRemove({
	_id : id,
	_creator : req.user._id

}).then((doc)=>
{	if(!doc){
		return res.status(400).send()
	}

	res.send(doc);
}).catch((e)=>{
	res.status(404).send(e);
})
})


//TODO PATCH
app.patch('/todos/:id',authendicate,(req,res)=>{
	var id =  req.params.id;
	var body = _.pick(req.body,['text','completed']);
	if(_.isBoolean(body.completed)&&body.completed){
		body.completedAt = moment().format('MMMM Do YYYY , h:mm:ss a');

	}else{
		body.completed= false;
		body.completedAt=null;
	}
	Todo.findOneAndUpdate({_id:id,_creator:req.user._id }, { $set : body},{new:true}).then((todo)=>{
		res.send({todo})
	}).catch((e)=>{
		res.send(e).status(400);
	})
});



//USER POST

	app.post('/user',(req,res)=>{
	var body = _.pick(req.body,['email','password']);
	var user = new User(body);
	user.save().then(()=>{
		return user.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth',token).send(user);
	}).catch((e)=>{
		res.status(400).send();

	})
	})






//USER GET CHECK USING REQ HEADER

app.get('/user/me',authendicate,(req,res)=>{
	res.send(req.user);
});


//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OGM3ZGYzMTU3NzgxMTIyYjg5ZWMyMGQiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDg5NDkzODA5fQ.vMSOuh2GcJcWwShAeJFi5qYLT4eFEUQPBBO_T7SsCFU



app.listen(3000);