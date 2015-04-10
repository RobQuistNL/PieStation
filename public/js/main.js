$("ul.nav li a").on('click', function(event) {
    var url = $(this).attr('href');
    if (url!='#') {
        $("#realcontent").load("pages/" + url, null, function() {
            $('.devicebutton').unbind();
            $('.devicebutton').click(function(event) {
                sendIRKey($(this).attr('data-device'), $(this).attr('data-key'));
            });
        });
        $("#toggleOffcanvas").click();
        return false;
    }
});

$("#realcontent").load("pages/home.html");

function sendIRKey(device, key) {
    $.ajax({url: "send/"+device+"/"+key+"?"+new Date().getTime()});
}