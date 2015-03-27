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
        transitionDuration: 0,
        transition: 'none',
        animation: 'none'
    });

});

socket.on('localevent', function(data){
    console.log(data);
    switch (data.action) {
        case 'refresh':
            window.location = window.location;
            break;
        case 'youtube':
            switch (data.do) {
                case 'newvideo':
                    playYoutubeVideo(data.video);
                    break;
                case 'pausevideo':
                    pauseYoutubeVideo();
                    break;
                case 'resumevideo':
                    resumeYoutubeVideo();
                    break;
                case 'stopvideo':
                    stopYoutubeVideo();
                    break;
            }
            break;
    }
});

function playYoutubeVideo(videoId) {
    if ($('.fullscreen').length == 0) {
        $('body').append('<div class="fullscreen"></div>');
    }

    $('.fullscreen').html(
        "<iframe width='100%' height='100%' src='http://www.youtube.com/embed/"+videoId+"?autoplay=1&controls=0&modestbranding=1&rel=0&theme=dark&iv_load_policy=3&vq=hd1080' frameborder='0' type='text/html'></iframe>"
    );
}

function stopYoutubeVideo() {
    $('.fullscreen').remove();
}