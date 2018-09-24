let checkOutStaging = [];




$(function() {

  function addClickHandler() {
      // Add button
    $('.btn.btn-primary').click( function() {
      let itemId = $(this).parent().data("id");
      let itemName = $(this).parent().data("name");
      let itemQuantity =  Number($(this).parent().find('option:selected').val());
      let newCheckOutItem = {id: itemId, name: itemName, quantity: itemQuantity};

        //loop through array and if item is the same, change item quantity instead of new item
        let itemAdded;

        // modifyCheckoutAmmounts(itemId, itemQuantity, true)
        for (let i = 0; i < checkOutStaging.length; i++) {
          if (checkOutStaging[i]["id"] === itemId) {
            checkOutStaging[i]["quantity"] = itemQuantity;
            itemAdded = true;
            break;
          }
        }
        // if item neeed to be changed, don't push new item
        if (!itemAdded) {
        checkOutStaging.push(newCheckOutItem);
        }
        // checkOutStaging.sort((a, b) => a.id < b.id ? a : b);
        itemAdded = false;
      // clear and then populate checkout container
      $('.checkOutContainer > div').empty();
      createCheckoutItem();
    })
  }


  function renderItems (items) {

      items.forEach( (item) => {

        $('#menu-container').append(`
          <div class="card"  >
            <img class="card-img-top" src="${item.urlPath}">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.description}</p>
              <div class="form-group" data-id="${item.id}" data-name="${item.name}">
                <button type="submit" class="btn btn-primary">Add</button>
                <label for="exampleFormControlSelect1">Example select</label>
                <select class="form-control">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>
          </div>
          `)
        })
      addClickHandler();
    }

  //for each item in the array show in checkout
  function createCheckoutItem() {
    checkOutStaging.forEach((item) => {
      $('.checkOutContainer > div').append(`
        <div class="itemRow" data-id="${item['id']}">
            <p>${item['name']}</p>
            <p>${item['quantity']}</p>
        </div>
        `)
     });
    /*$('.itemRow').append(lessButton).append(moreButton);*/
  }

  //refactor as callback?
  function modifyCheckoutAmmounts(itemId, itemQuantity, setToo) {
    for (let i = 0; i < checkOutStaging.length; i++) {
        if(setToo) {
          if (checkOutStaging[i]["id"] === itemId) {
            checkOutStaging[i]["quantity"] = itemQuantity
            itemAdded = true;
            break;
          } else {
            if (checkOutStaging[i]["id"] === itemId) {
            checkOutStaging[i]["quantity"] += itemQuantity;
            console.log(checkOutStaging)
            itemAdded = false;
            break;
          }
        }
      }
    }
    return itemAdded;
  }
  // on checkout item minus click, remove one item from count and array
// move up to when created to function
  // $('.less').on('click', function() {
  //   console.log("test")
  //   let itemId = $(this).parent().data("id");
  //   modifyCheckoutAmmounts(itemId, -1, false);
  //   console.log(checkOutStaging);
  // })

  // // on check items plus click, add one item from count and array
  // $('.more').on('click', function() {
  //   let itemId = $(this).parent().data("id");
  //   modifyCheckoutAmmounts(itemId, 1, false);
  //   console.log(checkOutStaging);
  // })

  // pull values from menu tiles submit



  // on checkout button click, send objects array to server
   $('#checkoutBtn').on('click', function () {
    console.log('Button clicked, performing ajax call...');

    var test = JSON.stringify(checkOutStaging)
    console.log(checkOutStaging)

    $.ajax('/checkout_confirmation', {
        method: 'POST',
        contentType: 'application/json',
        data: test
      })
        .then(function () {
          checkOutStaging = [];
          //clear all chilcren out of checkout
          $('.checkOutContainer > div').empty();
        });

   });

  $.ajax({method: "GET", url: 'api/items'})
    .done((items) => {
      renderItems(items);
    })
      //write error catch

});
