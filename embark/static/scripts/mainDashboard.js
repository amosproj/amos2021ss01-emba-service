function get_load() {
    let url = window.location.origin + "/get_load/";

    return $.getJSON(url).then(function(data){

        return {
            time: data.timestamp,
            cpu: data.cpu_percentage,
            mem: data.memory_percentage
        }
    })
}