const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const ejs = require('ejs')
const bycrpt = require('bcrypt')
// const Connection = require('mysql/lib/Connection');

const app = express();
const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    database:'habibi',
    password:'root'
})

db.connect( (error) => {
    if(error) {
        console.log(error)
    } else {
        console.log('Database Connected!!')
    }
})

app.set('view engine', 'ejs');
app.listen(3000, ()=> {
    console.log('Server started at port 3000');
    console.log('Database Connected')
})

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) =>{
      res.render('Home.ejs')
})


app.get('/signup',(req,res)=> {
    res.render('signup.ejs')
})

//This is the route to get the information from the sign up form where the password is hashed
app.post('/users/signup',async (req,res)=> {
        const salt = await bycrpt.genSalt()
        const hashedPassword= await bycrpt.hash(req.body.password, salt)
        var sql = "INSERT INTO habibi.users (`frst_name`,`last_name`,`email`,`password`,`gender`) VALUES ('" + req.body.firstName + "', '" + req.body.lastName + "', '" + req.body.email + "', '"+ hashedPassword + "', '" + req.body.gridRadios + "')"
        db.query(sql, (err, rows, fields)=>{
            if(!err){
                res.redirect("/login")
            }else {
                console.log(err)
            }

        })
})


app.post('/users/login',async (req,res)=>{
   const userfirstName = req.body.firstName;
   const userlastName = req.body.lastName;
   if(userfirstName || userlastName== null){
      res.send('Cannot find user')
   }try{
      if(bycrpt.compare(req.body.password,user.password)){
          res.redirect('/menu')
      }else{
          res.redirect('/error')
      }
   }catch{
      res.status(500).send()
   }
})


app.get('/login',(req,res) =>{
    res.render('login.ejs')
})

app.get('/error', (req, res) =>{
    res.render('error.ejs')
})

app.get('/menu', (req, res) =>{
    let sql = "SELECT * FROM habibi.meals, habibi.meal_category WHERE habibi.meal_category.id = habibi.meals.meal_category";
    db.query(sql, (err,food)=> {
        if(!err) {
            res.render('menu.ejs',{
                meals: food
               });
        } else {
            console.log(err);
        }

    })
})


//ADD TO CART SECTION


// function addMeal(event){
// //   var button = event.target
//   var mealName = meals.getElementsByClassName('itemName')[0].innertext
//   var mealImage = getElementsByClassName('mealImage')[0].src
//   var mealPrice = getElementsByClassName('price')[0].innertext
//   console.log(mealName,mealPrice,mealImage)
// }


