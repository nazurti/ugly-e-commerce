var productsList;
var card = [];
var sum = 0;
var PRODUCTS_LIST_URL =  "https://dummy-ecomm-api-stopster.c9.io/product";
var imageURL_prefix =  "https://dummy-ecomm-api-stopster.c9.io/images/";

$(document).ready(function() {
  loadProductsList();
});

function loadProductsList() {
  $(".preloader_wrapper").show();
  $(".error").hide();
  var request = $.get(PRODUCTS_LIST_URL);
  request.success(function(data) {
    productsList = data;
    buildNewProductsView(productsList);
    activateToggle();
    $(".preloader_wrapper").hide();
  });
  request.error(function(jqXHR, textStatus, errorThrown) {
    if (textStatus == 'timeout') {
    //  console.log('The server is not responding');
    }
    if (textStatus == 'error') {
    //  console.log(errorThrown + ":" + jqXHR.status);
    }
    showErrorDiv();
    $(".preloader_wrapper").hide();
  });
  /*$.get(PRODUCTS_LIST_URL, function (data, status) {
    productsList = data;
    buildNewProductsView(productsList)
  });*/
}

function activateToggle() {
  $(".view_toggle div").click(function(){
    if (!$(this).hasClass("selected")) {
      $("#listToggle").toggleClass("selected");
      $("#gridToggle").toggleClass("selected");
      buildNewProductsView(productsList);
    }
  });
}

function showErrorDiv() {
  if($(".error").length > 0) {
    $(".error").show();
  }
  else {
    $(".products").before("<div class='error'>Cannot load products list. <a href='#'>Try again</a></div>");
    $(".error a").click(function() {
      $(".error").hide();
      loadProductsList();
    });
  }
}

function buildNewProductsView(products) {
  var i = 0;
  var $productsWrapperDiv = $("#products_wrapper"); 
  $productsWrapperDiv.empty();
  $(".products").undelegate(".add_to_card_btn", "click");
  if ($("#listToggle").hasClass("selected")) {
    for (i = 0; i < products.length; i++) {
      addProductToDOMInList(products[i].title, products[i].description, products[i].price, products[i].image, i);  
    }
    $productsWrapperDiv.addClass("wrapper_list_view");
    $productsWrapperDiv.removeClass("wrapper_grid_view");
    $(".products").delegate(".product", "click", function () {
      showProductDetails($(this).attr('id').substring(7));
    });
  }
  else {
    $(".product_details").hide();
    $(".products").undelegate(".product", "click");
    
    for (i = 0; i < products.length; i++) {
      addProductToDOMInGrid(products[i].title, products[i].description, products[i].price, products[i].image, i);  
    }
    $productsWrapperDiv.removeClass("wrapper_list_view");
    $productsWrapperDiv.addClass("wrapper_grid_view");
  }
  $(".products").delegate(".add_to_card_btn", "click", function () {
      addProductToCard($(this).attr('id').substring(10));
    }) 
  $(".products").show();
}

function showProductDetails(productIndex) {
  $(".product_details").show();
  $(".product_details img").attr('src', imageURL_prefix + productsList[productIndex].image);
  $(".product_details_name").html(productsList[productIndex].title);
  $(".product_details_description").html(productsList[productIndex].description);
  $(".product_details span").html("$" + productsList[productIndex].price);
  $(".product_details .add_to_card_btn").attr('id', 'addProduct' + productIndex);
}

function addProductToDOMInGrid(title, description, price, imageURL, index) {
  var div = "<div class='product view_grid' id='product" + index + "'>" +
              "<div class='product_title'>" + 
                "<a href='#'><span class='product_name'>" + title + "</span></a>" +
              "</div>" +  
              "<div class='product_image_column'>" + 
                "<img src='" + imageURL_prefix + imageURL + "'/>" +
              "</div>" +
          "<div class='product_info_column'>" + 
            "<div class='price'>$" + price + "</div>" + 
            "<div class='add_to_card_btn' id='addProduct" + index + "'>Add to card</div>" +
          "</div>" +
        "</div>";
  $("#products_wrapper").append(div);
}

function addProductToDOMInList(title, description, price, imageURL, index) {
  var imageURL_prefix = "https://dummy-ecomm-api-stopster.c9.io/images/"
  var div = 
        "<div class='product view_list' id='product" + index + "'>" +
          "<div class='product_image_column_list'>" + 
            "<img src='" + imageURL_prefix + imageURL + "'/>" +
          "</div>" + 
          "<div class='product_title_column'>" +  
            "<a href='#'><span class='product_name'>" + title + "</span></a>" +
            "<div class='price'>$" + price + "</div>" + 
          "</div>" +
          "<div class='product_info_column_list'>" +   
            "<div class='add_to_card_btn' id='addProduct" + index + "'>Add to card</div>" +
          "</div>" +
        "</div>";
  $("#products_wrapper").append(div);
}

function addProductToCard(productIndex) {
  card.push(productsList[productIndex]);
  sum += parseFloat(productsList[productIndex].price); 
  refreshCardInfo(); 
}

function refreshCardInfo() {
  $("#card_info").html("Card: <a href='#'>" + card.length + " item(s)</a>. Total price: $" + sum.toFixed(2) + ".");
  $("#card_info a").click(function() {
    viewCard();
  });
}

function viewCard() {
  var result = "";
  for (var i = 0; i < card.length; i++) {
    result += (card[i].title + " for " + card[i].price + "\n"); 
  }
  alert(result);
}
