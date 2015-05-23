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
        "<iframe width='100%' height='100%' src='http://www.youtube.com/embed/"+videoId+"?autoplay=1&controls=0&modestbranding=1&rel=0&theme=dark&iv_load_policy=3&vq=hd720' frameborder='0' type='text/html'></iframe>"
    );
}

function stopYoutubeVideo() {
    $('.fullscreen').remove();
}

function refreshComics() {
    $.getJSON( "http://projects.dukesoft.nl/getcomics.php", function( data ) {
        $('#xkcd_title').html(data.xkcd.title);
        $('#xkcd_description').html(data.xkcd.description);
        $('#xkcd_image').attr('src', data.xkcd.img);
        $('#explosm_image').attr('src', data.explosm.img);
    });
}

function setGreeting() {
    var hours = new Date().getHours();

    greeting = 'Gaat es slapen';
    if (hours >= 6) {
        greeting = 'Goeiemorgen Rob';
    }
    if (hours >= 12) {
        greeting = 'Goeiemiddag Rob';
    }
    if (hours >= 18) {
        greeting = 'Goeieavond Rob';
    }
    if (hours >= 23) {
        greeting = 'Goeienacht Rob';
    }

    $('#greeting').html(greeting);
}

setInterval("refreshComics()",60*60*1000); //Every hour
setInterval("setGreeting()",60*1000); //Every minute
refreshComics();
setGreeting();
