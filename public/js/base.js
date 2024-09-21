var route_names = [
  { html: "landing.html", title: "Home", route: "/home", },
  { html: "profile.html", title: "Profile", route: "/profile", },
  { html: "not_found.html", title: "Not Found", route: "/not-found" },
]

evalTitle = (title) => { return title }, loadingPage = async () => {
  $(".preloader").removeClass("d-none")

  setTimeout(() => {

    $(".preloader").addClass("d-none")
  }, 1000)
}, navigateTo = (route, additionalParamString) => {

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
        ` + html + `     
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
    var nav = PhxApp.html("blog_nav.html")
    var footer_modals = PhxApp.html("footer_modals.html")
    var html = PhxApp.html("landing.html")
    var initPage = `
    `+ nav + `
        ` + html + `
            ` + footer_modals + ``
    $("#page").html(initPage)
    navigateCallback()

  }
}




async function navigateCallback() {

  setTimeout(() => {
  }, 1000)


}


$(document).on("click", "a.navi", function (event) {
  event.preventDefault();
  loadingPage()
  $("a.ms-link").removeClass("active")
  $(this)[0].classList.contains("ms-link") ? $(this)[0].classList.add("active") : null;
  setTimeout(() => {
    if ($(this).attr("href").includes("#")) { } else {
      navigateTo($(this).attr("href"))
    }
  }, 200)

});
window.curSwiper
function activateSwiper(dom) {

  curSwiper = new Swiper(".swiper", {
    // Optional parameters
    breakpoints: {
      576: {
        slidesPerView: 1
      },
    },
    slidesPerView: 'auto',
    spaceBetween: 24,
    loop: true,
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },

  });

}


$(document).ready(() => {
  // navigateTo();
  navigateCallback();

  /*================================================================= 
  Isotope initialization 
  ==================================================================*/
  var $grid = $('.grid').isotope({
    // options
  });
  // layout Isotope after each image loads
  $grid.imagesLoaded().progress(function () {
    $grid.isotope('layout');
  });

  // filter items on button click
  $('.filter-button-group').on('click', 'button', function () {
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
  });

  /* checking active filter */
  // change is-checked class on buttons
  var buttonGroups = document.querySelectorAll('.button-group');
  for (var i = 0, len = buttonGroups.length; i < len; i++) {
    var buttonGroup = buttonGroups[i];
    radioButtonGroup(buttonGroup);
  }

  function radioButtonGroup(buttonGroup) {
    buttonGroup.addEventListener('click', function (event) {
      // only work with buttons
      if (!matchesSelector(event.target, 'button')) {
        return;
      }
      buttonGroup.querySelector('.active').classList.remove('active');
      event.target.classList.add('active');
    });
  }



  /*================================================================= 
  Navbar fixed top
  ==================================================================*/
  $(document).ready(function () {

    var menu = $('.site-header nav');
    var origOffsetY = $('.hero-area').height();

    function scroll() {
      if ($(window).scrollTop() >= origOffsetY) {
        $('.site-header nav').addClass('fixed-top');

      } else {
        $('.site-header nav').removeClass('fixed-top');

      }
    }

    document.onscroll = scroll;

  });





  /*================================================================= 
  Animate on scroll initialization
  ==================================================================*/
  AOS.init({
    once: true,
  });

  $(".preloader").addClass("d-none")




})