const express= require("express");
const bodyParser= require("body-parser");
const _=require('lodash');
var{mongoose}=require('./db/mongoose');
var{User}=require('./models/user');
var{Todo}=require('./models/todo');


var app= express();
app.use(bodyParser.json());

app.get('/nfn/:id',(req,res)=>{
var id=req.params.id;

 User.find({"id":id}).then((doc)=>{
 	console.log(doc);
 	res.send({doc})
})});


//TODO GET
app.get('/todos',(req,res)=>{
	Todo.find().then((doc)=>{
		res.send({doc});
	}).catch((e)=>{
		res.status(400).send(e);
	})
})

//TODO POST
app.post('/todos',(req,res)=>{
	var body = _.pick(req.body,['text']);
	var todo = new Todo(body);
	todo.save().then((doc)=>{
		res.send({doc});
	}).catch((e)=>
	{
		res.status(400).send(e);
	}
)});

//TODO DELETE

 app.delete('/todos/:id',(req,res)=>{

var id = req.params.id;
Todo.findByIdAndRemove(id).then((doc)=>
{	if(!doc){
		return res.status(400).send()
	}

	res.send(doc);
}).catch((e)=>{
	res.status(404).send(e);
})
})


//TODO PATCH
app.patch('/todos/:id',(req,res)=>{
	var id =  req.params.id;
	var body = _.pick(req.body,['text','completed']);
	if(_.isBoolean(body.completed)&&body.completed){
		body.completedAt = new Date().getTime();
	}else{
		body.completed= false;
		body.completedAt=null;
	}
	Todo.findByIdAndUpdate(id , { $set : body},{new:true}).then((todo)=>{
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











app.listen(3000);