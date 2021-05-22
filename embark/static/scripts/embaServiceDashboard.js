function embaProgress() {

// example for websocket setup in frontent TODO: remove the whole file later
    const socket = new WebSocket(
        'ws://'
        + '127.0.0.1:8001'
        + '/ws/progress'
    );

    socket.onopen = function (e) {
        console.log("[open] Connection established");
    };

    socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        //document.querySelector('#app').innerText = data.message;
        //console.log(data.percentage)
        makeProgress(data.percentage)
    }
    socket.onclose = function (event) {
        console.log(event.code)
        console.error('Chat socket closed unexpectedly');
    };

    function makeProgress(percent) {
        //$(".progressBar").css("width",  percent + "%").text(percent + " %");
        var p = percent * 100;
        $('#pBar').attr('aria-valuenow', p).css('width', p + '%').text(p + '%')
        // Wait for sometime before running this script again
        //setTimeout("makeProgress()", 100);
    }

}