var live_containers = ["process 1"]
var process_num = 1
var base_tile
var new_tile

function embaProgress(dup) {
    console.log("Hello there" + dup)
    var current_module = "no module"
    var current_phase = "no phase"

    if(dup.localeCompare('1') === 0){
        console.log("Welcome")
        create_row()
    }
    function ws(node){
        // example for websocket setup in frontent TODO: remove the whole file later
        const socket = new WebSocket(
            'ws://'
            + location.hostname + ':8001'
            + '/ws/progress'
        );

        // this method is called when the connection is established
        socket.onopen = function (e) {
            console.log("[open] Connection established");
            // base_tile = document.getElementById("tile_id")
            // new_tile = base_tile.cloneNode(true)
            // new_tile.id = tmp
            // document.body.appendChild(new_tile)
        };

        // this method is called whenever a message from the backend arrives
        socket.onmessage = function (event) {

            var data = JSON.parse(event.data);
            if (current_phase !== data.phase) {
                //console.log(data.phase)
                livelog_phase(data.phase)
            }
            if (current_module !== data.module) {
                livelog_module(data.module)
            }
            current_phase = data.phase
            current_module = data.module

            makeProgress(data.percentage)
        }
        // this method is called when the websocket connection is closed
        socket.onclose = function (event) {
            console.log(event.code)
            console.error('Chat socket closed unexpectedly');
        };

        // method for progressBar progress
        function makeProgress(percent) {
            var p = percent * 100;
            var rounded = p.toFixed(2);
            $('#pBar').attr('aria-valuenow', rounded).css('width', rounded + '%').text(rounded + '%')
        }

        //log the current phase live
        function livelog_phase(phase) {
            var ul = document.getElementById("log_phase");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(phase));
            ul.appendChild(li);
        }

        //log current phase live
        function livelog_module(module) {
            var ul = document.getElementById("log_module");
            var li = document.createElement("li");
            li.appendChild(document.createTextNode(module));
            ul.appendChild(li);
        }
    }

    function duplicate_tile(){
        console.log(new_tile)
        process_num++
        tmp = "process " + process_num
        document.getElementById("header").innerHTML = tmp;
        live_containers.push(tmp)
        console.log(live_containers)
        document.getElementById("container_id").appendChild(new_tile)
    }

    function create_row(){
        // Test to see if the browser supports the HTML template element by checking
        // for the presence of the template element's content attribute.
        if ('content' in document.createElement('template')) {

            // Instantiate the table with the existing HTML tbody
            // and the row with the template
            let temp = document.getElementById('productrow')
            process_num++
            tmp = "process " + process_num
            //document.getElementById("header").innerHTML = tmp;
            live_containers.push(tmp)
            let content = temp.content.cloneNode(true)
            ws(content)
            var a = content.childNodes.item(0)
            console.log(a)
            document.getElementById("container_id").appendChild(content)


        } else {
          // Find another way to add the rows to the table because
          // the HTML template element is not supported.
        }

    }
}
