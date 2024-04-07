
var route_names = [

  { html: "landing.html", title: "Home", route: "/home", },
  { html: "profile.html", title: "Profile", route: "/profile", },
  { html: "not_found.html", title: "Not Found", route: "/not-found" },

]

loadingPage = async () => {
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
let blog_url;
$.ajax({
  method: "get",
  url: "/api/webhook/blog_url"
}).done((j) => {
  blog_url = j
})
const blogs = PhxApp.api('blogs', {category: 'Portfolio'});
window.curSwiper
function readBlog(id) {

  var blog = PhxApp.api('blog', { id: id })
  console.log(blog)

  if (window.curSwiper != null) {
    curSwiper.destroy()
  }
  $(".sw").html(`
  
      <div class="swiper" style="height:100%;" >
        <div class="swiper-wrapper" id="covers">
        </div>
        <div class="swiper-pagination">
        </div>
      </div>
        `)
  for (let index = 0; index < blog.stored_medias.length; index++) {

    // var url = 'image/portfolio/portfolio_large_' + (index + 1) + '.jpg'
    var url = blog_url + "/" + blog.stored_medias[index].url

    var cover = `
      <div class="swiper-slide d-flex justify-content-center align-items-center" >
        <a class="glightbox" href="`+ url + `">
        <img id="cover " style="max-height: 800px; width: auto; max-width: 800px;" src="`+ url + `" alt="portfolio image">
        </a>
      </div>
    `
    $("#covers").append(cover)
  }

  $(".portfolio-section .modal").modal('show')
  $(".portfolio-section .modal .content-wrapper").html(blog.content)
  activateSwiper("#covers")
  var options = {}
  const lightbox = GLightbox({ ...options });
}

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

async function navigateCallback() {

  setTimeout(() => {
    /* Text Animation on Hero Area */
    $('#tech-tools').textition({
      animation: 'ease-out',
      map: { x: 200, y: 100, z: 0 },
      autoplay: true,
      interval: 3,
      speed: 1
    });


    $('[data-tilt]').each((i, v) => {
      VanillaTilt.init($(v)[0])

    })
    initMap()

  }, 1000)

  // toTop();
}
const initMap = () => {
  var map = L.map('mapwrapper').setView([3.03917, 101.7058389], 15.87);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}, toTop = () => {
  $("body")[0].scrollIntoView();
  $("#preloader").addClass("preloader-hide")
}, updatePageParams = (obj) => {
  window.stateObj = obj
  history.pushState(obj, obj.title, obj.route);
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
  Testimonial carousel
  ==================================================================*/
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    breakpoints: {
      1200: {
        slidesPerView: 3,
      },
      992: {
        slidesPerView: 2,
      },
      576: {
        slidesPerView: 1
      },
    },
    //slidesPerView: 3,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 5000,
    },


    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },

  });


  /*================================================================= 
  Partner carousel
  ==================================================================*/
  const swiper2 = new Swiper('.partnerCarousel', {
    // Optional parameters
    breakpoints: {
      1200: {
        slidesPerView: 6,
      },
      992: {
        slidesPerView: 4,
      },
      576: {
        slidesPerView: 3
      },
      320: {
        slidesPerView: 2
      },
    },
    //slidesPerView: 6,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 5000,
    },

  });





  // var greenIcon = L.icon({
  //   iconUrl: "image/location.png",

  //   iconSize: [48, 48], // size of the icon
  // });

  // L.marker([-37.817160, 144.955937], { icon: greenIcon }).addTo(map);



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
  Animating numbers
  ==================================================================*/
  $('.counter').counterUp({
    delay: 10,
    time: 3000
  });


  /*================================================================= 
  Progress bar animation
  ==================================================================*/
  var waypoint = new Waypoint({
    element: document.getElementById('skill-section'),
    handler: function () {
      $('.progress .progress-bar').css("width", function () {
        return $(this).attr("aria-valuenow") + "%";
      })
    },
    //offset: 'bottom-in-view',
    offset: 700,
  })


  /*================================================================= 
  Animate on scroll initialization
  ==================================================================*/
  AOS.init({
    once: true,
  });

  $(".preloader").addClass("d-none")




})