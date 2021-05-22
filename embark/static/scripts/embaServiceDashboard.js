function saveFiles() {

// example for websocket setup in frontent TODO: remove the whole file later
    const socket = new WebSocket(
        'ws://'
        + '127.0.0.1:8001'
        + '/ws/progress'
    );

    socket.onopen = function (e) {
        alert("[open] Connection established");
    };

    socket.onmessage = function (event) {
        var data = JSON.parse(event.data);
        console.log(data);
        makeProgress()
        //document.querySelector('#app').innerText = data.message;
    }
    socket.onclose = function (event) {
        console.error('Chat socket closed unexpectedly');
    };
    // count lines of emba log
    var i = 0;

    function makeProgress() {
        $(".progress-bar").css("width", i + "%").text(i + " %");
        $('#progressBar').attr('aria-valuenow', percent).css('width', percent + '%').text(percent + '%')
        // Wait for sometime before running this script again
        setTimeout("makeProgress()", 100);
    }

}