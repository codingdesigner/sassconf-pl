$(document).ready(function () {
  //////////////////
  // LETTERING.JS
  $('.standout h1').lettering('words');
  //////////////////

  //////////////////
  // MOMENT.JS
  function currentSchedule() {
    $('.schedule--live tbody tr').each(function() {
      var t = moment($(this).attr("data-start")).twix($(this).attr("data-end"));
      if (t.isCurrent() == true) {
        $(this).addClass("current");
      } else {
        $(this).removeClass("current");
      }
    });
  }
  currentSchedule();
  var currentScheduleInterval = window.setInterval(currentSchedule, 1000);
  //////////////////
});
