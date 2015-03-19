var now = 0;

$.getJSON( "/config/local-config.json", function( data ) {
    window.config = data;

    var vegasArray = [];
    $.each(window.config.background.images, function(a, b) {
        vegasArray.push({src: b});
    });

    $('body').vegas({
        slides: vegasArray,
        preload: true,
        delay: window.config.background.timeout,
        timer: false,
        transition: 'random',
        animation: 'random'
    });

});