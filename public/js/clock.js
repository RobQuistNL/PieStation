//Dutch for now (sorry)
window.monthNames = [ "Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "October", "November", "December" ];
window.dayNames= ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];

$(document).ready(function() {
    setClock();
    setInterval('setClock()', 1000);
});

function setClock() {
    var newDate = new Date();
    newDate.setDate(newDate.getDate());
    var hours = newDate.getHours();
    var minutes = newDate.getMinutes();
    var seconds = newDate.getSeconds();

    $("#hours").html(( hours < 10 ? "0" : "" ) + hours);
    $("#min").html(( minutes < 10 ? "0" : "" ) + minutes);
    $("#sec").html(( seconds < 10 ? "0" : "" ) + seconds);

    $('#Date').html(dayNames[newDate.getDay()] + " " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
}