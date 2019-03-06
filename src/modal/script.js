/*
 VENUS-MODAL

 <a class="venus-modal-open" data-modal="alpha" href="#">open</a>
 <div class="venus-modal" data-modal="alpha">
 <div class="venus-modal-content">
 <a class="venus-modal-close" href="#">&nbsp;</a>
 </div>
 </div>
*/
$(document).ready(function () {
	$('div.venus-modal').appendTo("body");

	$(document).on('click', 'a.venus-modal-open, button.venus-modal-open', function (e) {
		e.preventDefault();

		// Lock le scroll de la page
		$('body').css({'overflow': 'hidden','position': 'relative', 'height': '100%'});

		// affiche la modal
		var data = $(this).attr('venus-modal');
		$('div.venus-modal[venus-modal="' + data + '"]').show();

    // pour le mobile, on adapte
    if( $('.onDesktop').css('display')=='none') {
			$('div.venus-modal[venus-modal="' + data + '"]')
				.css('top', $(window).scrollTop()+'px');
    }

		// Si click dans le contenu, on ne fait rien
		$('div.venus-modal-content')
      .on('click',function (e) {
			e.stopPropagation();
		});

    // Fermeture de la modal
    $('div.venus-modal')
      .on('click',function (e) {
      e.preventDefault();
      venusModalClose();
    });
    $('a.venus-modal-close')
      .off('click')
      .on('click',function (e) {
      e.preventDefault();
      //console.log($(this).data('venus-modal-close-callback'));

      if(
        $(this).attr('venus-modal-close-callback')!=undefined
			){
      	console.log('callback');
				var fnstring = $(this).attr('venus-modal-close-callback')+'()';
				var fnparams = null;
				var fn = eval(fnstring);
				if (typeof fn === "function")
					fn.apply(null, fnparams);
			}

      venusModalClose();
    });

		// Si click sur un lien
		$('div.venus-modal-content a')
      .on('click', function (e) {
				if( !$(this).hasClass('venus-modal-close') ) {
					if($(this).attr('href')=="#"){
						return false;
					}
					var attr = $(this).attr('target');
					if (typeof attr !== typeof undefined && attr !== false) {
						window.open(
								$(this).attr('href'),
								attr
						);
					}else{
						window.location.href = $(this).attr('href');
					}
				}
				e.preventDefault();
			});
	});

	function venusModalClose(callback=null) {
		// On enleve la modal
		$('div.venus-modal').hide();

		// On reactive le scroll
		$('body').css({'overflow': 'visible'});
	}
});