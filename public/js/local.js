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

        animation: 'random',
        animationDuration: 10000,
        transition: 'random'

        //Setup these if the transitions of backgrounds are very slow
        //transitionDuration: 0,
        //transition: 'none',
        //animation: 'none'
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
                    window.ytplayer.pauseVideo();
                    break;
                case 'resumevideo':
                    window.ytplayer.playVideo();
                    break;
                case 'stopvideo':
                    stopYoutubeVideo();
                    break;
                case 'position':
                    var pos = data.value;
                    var total = window.ytplayer.getDuration();
                    var seconds = (total/1000) * pos;
                    window.ytplayer.seekTo(seconds, true);
                    break;
            }
            break;
    }
});

function playYoutubeVideo(videoId) {
    stopYoutubeVideo();
    $('body').vegas('pause');

    if ($('.fullscreen').length == 0) {
        $('body').append('<div class="fullscreen" id="player"></div>');
    }

    /*$('.fullscreen').html(
        "<iframe id='player' width='100%'  height='100%' src='http://www.youtube.com/embed/"+videoId+"?autoplay=1&controls=0&modestbranding=1&rel=0&theme=dark&iv_load_policy=3&vq=hd720&origin=http://thuis.dukesoft.nl' frameborder='0' type='text/html'></iframe>"
    );
     */
    window.ytplayer = new YT.Player('player', {
        videoId: videoId,
        playerVars: {
            'modestbranding': 1,
            'controls': 0,
            'rel': 0,
            'theme': 'dark',
            'iv_load_policy': 3,
            'vq': 'hd720' //Put this to hd1080 for better quality (but my htpc cant handle that)
        },
        events: {
            'onReady': function(event) {
                event.target.playVideo();
            },
            'onStateChange': function(event) {
                if (event.data == YT.PlayerState.ENDED) {
                    stopYoutubeVideo();
                }
                console.log(event);
            }
        }
    });
}

function stopYoutubeVideo() {
    if (window.ytplayer) {
        window.ytplayer.destroy();
    }

    $('.fullscreen').remove();
    $('body').vegas('play');
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
