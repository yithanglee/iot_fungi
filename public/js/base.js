function evalTitle(label) {

  if (localStorage.getItem("default-lang") == "cn") {
    switch (label.replace(" ", "")) {
      case "Home":
        label = "首页"
        break;

      default:
        label = label

    }
  }
  return label
}


var route_names = [

  { html: "landing.html", title: "Home", route: "/home", skipNav: true },
  { html: "profile.html", title: "Profile", route: "/profile", skipNav: true },
  { html: "not_found.html", title: "Not Found", route: "/not-found", skipNav: true },

]

async function loadingPage() {
  $("#preloader").removeClass("preloader-hide")

  setTimeout(() => {

    $("#preloader").addClass("preloader-hide")
  }, 5000)
}

function navigateTo(route, additionalParamString) {

  PhxApp.show()
  if (route == null) {
    route = window.location.pathname
  }
  var current_pattern = route.split("/").filter((v, i) => {
    return v != "";
  })
  console.log(current_pattern)

  var match_1 = route_names.filter((rroute, i) => {
    var z = rroute.route.split("/").filter((v, i) => {
      return v != "";
    })
    console.log(z[z.length - 1])

    if (z[z.length - 1].includes(":")) {
      return z.length == current_pattern.length
    } else {

      return z.length == current_pattern.length && z[z.length - 1] == current_pattern[z.length - 1];
    }
  })

  var match_2 =
    match_1.filter((rroute, i) => {
      console.log(rroute)
      var z = rroute.route.split("/").filter((v, i) => {
        return v != "";
      })
      return z[0] == current_pattern[0]
    })

  if (match_2.length > 0) {

    var params = {}
    match_2.forEach((rroute, i) => {
      var z = rroute.route.split("/").forEach((v, ii) => {
        if (v.includes(":")) {
          params[v.replace(":", "")] = current_pattern[ii - 1]
        }
      })
    })
    console.log("params here")
    console.log(params)
    window.pageParams = params
    var xParamString = ""
    if (additionalParamString == null) {
      xParamString = ""
    } else {
      xParamString = additionalParamString
    }

    if (window.back) {
      window.back = false
    } else {
      var stateObj = { fn: `navigateTo('` + route + `', '` + xParamString + `')`, params: params };
      console.log("xparams")
      console.log(xParamString)
      console.log("route")
      console.log(route)
      window.stateObj = stateObj
      window.matchTitle = match_2[0].title
      window.matchRoute = route


      if (Object.keys(params).includes("title")) {
        $("title").html(evalTitle(params.title))

        history.pushState(stateObj, evalTitle(params.title), route);
      } else {
        $("title").html(evalTitle(match_2[0].title))

        history.pushState(stateObj, evalTitle(match_2[0].title), route);
      }
    }
    var footer_modals = PhxApp.html("footer_modals.html")
    var html = PhxApp.html(match_2[0].html)
    var initPage = `
      <div class="page-content pb-0">
        ` + html + `
    
      </div>
        ` + footer_modals + `
          `
    var keys = Object.keys(match_2[0])
    if (keys.includes("skipNav")) {

      $("#page").html(initPage)
      navigateCallback()

    } else {
      var nav = PhxApp.html("blog_nav.html")

      if (keys.includes("customNav")) {
        var nav = PhxApp.html(match_2[0].customNav)
      }


      $("#page").html(nav)
      $("#page").append(initPage)
      navigateCallback()
    }
    return match_2[0]
  } else {
    var footer_modals = PhxApp.html("footer_modals.html")
    var html = PhxApp.html("landing.html")
    var initPage = `
      <div class="page-content pb-0">
        ` + html + `
      </div>        ` + footer_modals + ``
    $("#page").html(initPage)
    navigateCallback()

  }
}

async function navigateCallback() {

  if (window.pdata != null) {

    evaluateLang()
  }

  toTop();
}

function toTop() {
  $("body")[0].scrollIntoView();
  $("#preloader").addClass("preloader-hide")
}

function updatePageParams(obj) {
  window.stateObj = obj
  history.pushState(obj, obj.title, obj.route);
}

function toggleLabel() {


  if (localStorage.getItem("default-lang") == "en") {
    localStorage.setItem("default-lang", "cn")
  } else if (localStorage.getItem("default-lang") == "cn") {
    localStorage.setItem("default-lang", "en")
  }

  $("[aria-data-cn]").each((i, v) => {
    var en = $(v).html()
    var cn = $(v).attr("aria-data-cn")
    $(v).html(cn)
    $(v).attr("aria-data-cn", en)
  })
}

function evaluateLang() {

  lang = localStorage.getItem("default-lang")

  if (lang == "cn") {
    $(document).ready(() => {

      $("[aria-data-cn]").each((i, v) => {
        var en = $(v).html()
        var cn = $(v).attr("aria-data-cn")
        $(v).html(cn)
        $(v).attr("aria-data-cn", en)
      })
    })
  }
}

$(document).on("click", "a.navi", function(event) {
  event.preventDefault();
  loadingPage()
  $("a.ms-link").removeClass("active")
  $(this)[0].classList.contains("ms-link") ? $(this)[0].classList.add("active") : null;
  setTimeout(() => {
    if ($(this).attr("href").includes("#")) {} else {
      navigateTo($(this).attr("href"))
    }
  }, 200)

});


$(document).ready(() => {
  navigateTo();
})