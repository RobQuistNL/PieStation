$("ul.nav li a").on('click', function(event) {
    var url = $(this).attr('href');
    if (url!='#') {
        $("#realcontent").load("pages/" + url, null, function() {
            $('.devicebutton').unbind();
            $('.devicebutton').click(function(event) {
                var device = $(this).attr('data-device');
                var key = $(this).attr('data-key');
                $.ajax({url: "send/"+device+"/"+key+"?"+new Date().getTime()});
            });
        });
        $("#toggleOffcanvas").click();
        return false;
    }
});

$("#realcontent").load("pages/home.html");