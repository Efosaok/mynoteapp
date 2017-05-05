const express = require("express");
const path = require("path");
const bodyparser = require("body-parser");
const firebase = require("firebase");
const app = express();
require("firebase/auth");

  var config = {
    apiKey: "AIzaSyA94QpYLUlQJ2lGuy58_EHt2jmjBn5GEMY",
    authDomain: "noteapp-6bed4.firebaseapp.com",
    databaseURL: "https://noteapp-6bed4.firebaseio.com",
    projectId: "noteapp-6bed4",
    storageBucket: "noteapp-6bed4.appspot.com",
    messagingSenderId: "59864116438"
  };
  firebase.initializeApp(config);

app.set("port",(process.env.PORT || 5000))

const auth = firebase.auth();

app.use(express.static(path.join(__dirname,"public")));

app.use(bodyparser.urlencoded({extended:true}));

app.get("/",function(req,res){
	if (!req.method === "GET"){
		console.log('invalid request method');
	};
	res.sendFile(__dirname + "/" + "index.html");
});

app.get("/signup.html",function(req,res){
	res.sendFile(__dirname + "/" + "signup.html");
});

app.post("/process_signup",function(req,res){
	var email = req.body.email;
	var password = req.body.password;
	var response = email+" "+password;
	auth.createUserWithEmailAndPassword(email,password).catch(function(error){
		console.log(error.message)
		res.end(error.message)
	})
	auth.onAuthStateChanged(function(user){
		if(user){
			console.log(user)
			res.sendFile(__dirname +"/" + "welcome.html")
		}
		console.log("not logged in")
		
	})
	
});

app.get("/login.html",function(req,res){
	res.sendFile(__dirname + "/" + "login.html");
});


app.post("/process_login",function(req,res,next){
	var email = req.body.email
	var password = req.body.password
	var response = email+" "+password
	auth.signInWithEmailAndPassword(email,password).catch(function(error){
		if(error){
			res.send(error.message)
			next(error.message)
		}
	})
	auth.onAuthStateChanged(function(user){
		if(user){
			console.log(user)
			res.sendFile(__dirname + "/" + "welcome.html")
		}
		console.log("not logged in")
		
	})
});

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})