$("ul.nav li a").on('click', function(event) {
    var url = $(this).attr('href');
    if (url!='#') {
        $("#realcontent").load("pages/" + url, null, function() {
            bindButtons();
        });
        $("#toggleOffcanvas").click();
        return false;
    }
});

function bindButtons() {
    $('.devicebutton').unbind();
    $('.devicebutton').click(function(event) {
        sendIRKey($(this).attr('data-device'), $(this).attr('data-key'));
    });
}

$("ul.nav li a").each(function( index ) {
    //Load up the data-homepage things on the left as the homepage.
    if ($(this).attr('data-homepage') == 1) {
        $.get('pages/' + $(this).attr('href'), function(data){
            $(data).appendTo("#realcontent");
            bindButtons();
        });
    }
});

function sendIRKey(device, key) {
    $.ajax({url: "send/"+device+"/"+key+"?"+new Date().getTime()});
}

