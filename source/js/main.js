$(document).ready(function () {
  //////////////////
  // Skrollr
  var photo_wrapper = $('.photo-wrapper');
  var s = skrollr.init({
    //easing: "cubic",
    constants: {
      photo: photo_wrapper.height(),
      photorow: photo_wrapper.height() * 0.3
    },
    render: function(data) {
      //Debugging - Log the current scroll position.
      //console.log(data.curTop);
    }
  });
  //////////////////

  //////////////////
  // LETTERING.JS
  $('.standout h1').lettering('words');
  //////////////////
});
