$(document).ready(() => {
  // read the current url params
  var routes = [
    { fn: "dashboardInit();", title: "Home" },
    { fn: "searchAll();", title: "Search" },
    { fn: "listDeliveries()", title: "Deliveries" },
    { fn: "listRiders()", title: "Riders" },
    { fn: "listCustomers()", title: "Customers" },
    { fn: "listProducts()", title: "Products" },
    { fn: "listShops()", title: "Shops" },
        { fn: "uploadFood()", title: "UploadFoods" },
    { fn: "listSettings()", title: "Settings" },


    // { fn: "supplierDebitNotes();", title: "All Supplier Invoices" }


  ]
  var title = getUrlParameter("get")

  if (title != null) {

    var res = routes.filter((v, i) => {
      return v.title == title;
    })[0]
    if (res != null) {
      setCurrentPage(res.fn, title)
    } else {
      App.notify("cant find route")
      // setCurrentPage(routes[0].fn, routes[0].title)
    }
  }




})

function toggleDarkLight() {

  App.show()
  if ($("link[href='/css/bootstrap_pulse.min.css']").length != 0) {
    $("link[href='/css/bootstrap_pulse.min.css']").attr("href", "/css/bootstrap_vapor.min.css")
  } else {
    $("link[href='/css/bootstrap_vapor.min.css']").attr("href", "/css/bootstrap_pulse.min.css")
  }
    App.hide()



}