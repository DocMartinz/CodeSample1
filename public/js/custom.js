/**
 * Clientside helper functions
 */
var stripe;
$(document).ready(function () {
  var amounts = document.getElementsByClassName("amount");
  // iterate through all "amount" elements and convert from cents to dollars
  for (var i = 0; i < amounts.length; i++) {
    amount = amounts[i].getAttribute('data-amount') / 100;
    amounts[i].innerHTML = amount.toFixed(2);
  }


   
  //after we got token now we send our token to server and server verify our public key token with private key or secret key
  var details 
  $.get("/get-public-key", function (key) {
    details = mountCard(key);
          });
  //on click of pay button this eventlistener will fire 
  let form = document.getElementById("payment-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitPayment(details.card);
  });
})



  //create a card text box and add some validation using public key of stripe



//here get selected item price
var amount = document.getElementById("ammount").getAttribute("data-amount")



function mountCard(publishable_key) {
  // Create a Stripe client view text box.
  stripe = Stripe(publishable_key);
  let elements = stripe.elements();
  let style = {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  let card = elements.create("card", { style: style });
  card.mount("#card-element");

  card.addEventListener('change', ({ error }) => {
    const displayError = document.getElementById('card-errors');
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = '';
    }
  });

  return {
    card: card
  };
}


function submitPayment(card) {
  //this will create a token of card using card detail and this token is valid for this card only

  stripe.createToken(card,
  )
    .then(function (result) {
      if (result.error) {
        swal({
          title: "Error!",
          text: result.error.message,
          icon: "error",
        });
      } else {
        orderComplete(result.token.id);
      }
    });
};

function orderComplete(token) {
  //after we got token now we send our token to server and server verify our public key token with private key or secret key
  $.post("/charges?token=" + token + "&amount=" + amount,
    {
      token: token,
    }, function (data) {
      if (data.paid) {
        swal({
          title: "Payment Successfull",
          text: "You payment is complete with Amount : " + (data.amount / 100.0).toFixed(2),
          icon: "success",
          buttons: true,
          buttonText: "okk",
          dangerMode: true,
          confirmButtonText: 'Yes, I am sure!',
          cancelButtonText: "No, cancel it!",
          buttons: ['Ok', 'View Reciept']
        })
          .then((willDelete) => {
            if (willDelete) {
              location.href = data.receipt_url
            } else {
              swal("Thanks for shopping");
              location.href = "/"

            }
          });
      }
      else {
        swal({
          title: "Error!",
          text: data.code,
          icon: "error",
        }).then(() =>
          location.reload())
      }
    });
};






