/*
  --- Html ---
  <div class="venus-slider-vignette">
    <div class="venus-slider-vignette-slide">
      <div>a</div>
      <div>b</div>
      <div>c</div>
      <div>d</div>
    </div>
    <div class="venus-slider-vignette-nav">
      <div>a</div>
      <div>b</div>
      <div>c</div>
      <div>d</div>
    </div>
  </div>
  --- Attr ---
  venus-slider-autoplay="1"
  venus-slider-autoplay-time="7000"
  venus-slider-autoplay-hoverstop="1"
*/

$('.venus-slider-classic, .venus-slider-vignette').each(function(){
  let slider = $(this);
  let sliderSlide = $(this).children('*[class$="-slide"]');
  let sliderNav = $(this).children('*[class$="-nav"]');

  let slideHeight = 0;
  sliderSlide.children('*')
    .each(function(index){
      $(this)
        .attr('venus-slider-position', index);
      $(this)
        .addClass('active');
      slideHeight=(slideHeight<$(this).height())?$(this).height():slideHeight;
      $(this)
        .removeClass('active');
    });

  sliderSlide.height(slideHeight);

  sliderSlide.children('*:first-child')
    .addClass('active');

  if( slider.hasClass('venus-slider-classic')){
    sliderNav.children('.venus-slider-classic-nav-prev')
      .on('click', function(e){
        venusSliderPrev();
      });
    sliderNav.children('.venus-slider-classic-nav-next')
      .on('click', function(e){
        venusSliderNext();
      });
  }

  if( slider.hasClass('venus-slider-vignette')){
    sliderNav.children('*')
      .each(function(index){
        $(this)
          .attr('venus-slider-position', index)
          .click(function(e){
            sliderSlide.children('*')
              .removeClass('active');
            sliderSlide.children('*[venus-slider-position="'+$(this).attr('venus-slider-position')+'"]')
              .addClass('active');

            sliderNav.children('*')
              .removeClass('active');
            $(this)
              .addClass('active');
          });
      });
    sliderNav.children('*:first-child')
      .addClass('active');
  }

  //Autoplay
  if( slider.attr('venus-slider-autoplay') && slider.attr('venus-slider-autoplay')=="1" ){
    var timer = (slider.attr('venus-slider-autoplay-time'))?parseInt(slider.attr('venus-slider-autoplay-time')):5000;
    let loop = setInterval(function(){venusSliderNext(slider);}, timer);

    if( slider.attr('venus-slider-autoplay-hoverstop') && slider.attr('venus-slider-autoplay-hoverstop')=="1" ){
      slider.hover(function(e){
        clearInterval(loop);
      }, function(e){
        loop = setInterval(function(){venusSliderNext(slider);}, timer);
      });
    }
  }

  function venusSliderPrev(slider){
    let current = sliderSlide.children('*.active').index();
    let cpt = sliderSlide.children().length-1;
    current = current-1;
    let position = ( current>=0)?current:cpt;

    sliderSlide.children('*')
      .removeClass('active');
    sliderSlide.children('*[venus-slider-position="'+position+'"]')
      .addClass('active');
    sliderNav.children('*')
      .removeClass('active');
    sliderNav.children('*[venus-slider-position="'+position+'"]')
      .addClass('active');
  }
  function venusSliderNext(slider){
    let current = sliderSlide.children('*.active').index();
    let cpt = sliderSlide.children().length-1;
    let position = ( current<cpt)?current+1:0;

    sliderSlide.children('*')
      .removeClass('active');
    sliderSlide.children('*[venus-slider-position="'+position+'"]')
      .addClass('active');
    sliderNav.children('*')
      .removeClass('active');
    sliderNav.children('*[venus-slider-position="'+position+'"]')
      .addClass('active');
  }
});