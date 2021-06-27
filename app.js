const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars')
require('dotenv').config()
//here stripe library
const stripe = require('stripe')(process.env.SECRET_KEY);

var app = express();
// view engine setup (Handlebars)
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Home route
 */
app.get('/', function(req, res) {
  res.render('index');
});
/**
 * Checkout route
 */

app.get('/checkout', function(req, res) {
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item;
  let title, amount, error;

  switch (item) {
    case '1':
      title = "The Art of Doing Science and Engineering"
      amount = 2300      
      break;
    case '2':
      title = "The Making of Prince of Persia: Journals 1985-1993"
      amount = 2500
      break;     
    case '3':
      title = "Working in Public: The Making and Maintenance of Open Source"
      amount = 2800  
      break;     
    default:
      // Included in layout view, feel free to assign error
      error = "No item selected"      
      break;
  }

  res.render('checkout', {
    title: title,
    amount: amount,
    error: error,
  });
});


/**
 * Start server
 */
app.listen(3000, () => {
  console.log('Getting served on port 3000');
});


//getting public key of stripe
app.get("/get-public-key", async (req, res) => {
 res.send(process.env.PUBLIC_KEY)
});



//this API call when we click to pay button  this will verify our token and create payment
app.use("/charges", async (req, res) => {
  console.log(req.query)
  stripe.charges
    .create({
      amount: req.query.amount*100,
      currency: 'usd',
      source: req.query.token,
    })

    .then((charge) => res.send(charge))
    .catch((err) => res.send(err));
});


