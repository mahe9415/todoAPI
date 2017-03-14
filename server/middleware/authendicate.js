var {User}=require('./../models/user');


var authendicate = (req,res,next)=>{
	var token = req.header('x-auth');
	User.findByToken(token).then((user)=>{
		if(!user){
			res.status(400).send();
		}
		req.user=user;
		req.token=token;
		next();
	}).catch((e)=>{
		res.status(404).send();
	})
}
module.exports={authendicate}