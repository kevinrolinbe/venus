$(document).ready(function () {
  if( !sessionStorage.getItem('venus-cookiedisclaimer') ){
    $('div[class^="venus-cookiedisclaimer"]')
      .addClass('show');
  }


  $('.venus-cookiedisclaimer-confirm')
    .on('click', function(e){
      sessionStorage.setItem('venus-cookiedisclaimer', true);

      $('div[class^="venus-cookiedisclaimer"]')
        .removeClass('show');
    });
});