var accumulatedDonut = document.getElementById('accumulatedDonut').getContext('2d');
var accumulatedCvePie = document.getElementById('accumulatedCvePie').getContext('2d');

get_individual_report().then(function (returnData) {

    let cvePieChart = new Chart(accumulatedCvePie, {
        type: 'pie',
        data : {
            labels: [
                'CVE-High',
                'CVE-Low',
                'CVE-Medium'
            ],
            datasets: [{
                label: 'CVE DATA',
                data: [returnData.cve_high, returnData.cve_low, returnData.cve_medium],
                backgroundColor: [
                  'rgb(255, 99, 132)',
                  'rgb(54, 162, 235)',
                  'rgb(255, 205, 86)'
                ],
                hoverOffset: 4
              }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: false,
                    text: 'CVE Data',
                    fontSize: 25
                },
                legend: {
                    display: false,
                    position: 'right',
                    labels: {
                        fontColor: '#000'
                    }
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 0
                    }
                },
                tooltips: {
                    enabled: true
                }
        }
    });

    let doughnutChart = new Chart(accumulatedDonut, {
        type: 'doughnut',
        data: {
            datasets: [
                {
                    labels: ['binaries with NX', 'binaries without NX'],
                    data: [returnData.nx, (returnData.bins_checked - returnData.nx)],
                    backgroundColor: ['#493791', '#291771'],
                },
                {
                    label: 'PIE',
                    data: [returnData.pie, (returnData.bins_checked - returnData.pie)],
                    backgroundColor: ['#1b1534', '#000014'],
                },
                {
                    label: 'RELRO',
                    data: [returnData.relro, (returnData.bins_checked - returnData.relro)],
                    backgroundColor: ['#7b919d', '#5b717d'],
                },
                {
                    label: 'CANARY',
                    data: [returnData.canary, (returnData.bins_checked - returnData.canary)],
                    backgroundColor: ['#525d63', '#323d43'],
                },
                {
                    label: 'Stripped',
                    data: [returnData.stripped, (returnData.bins_checked - returnData.stripped)],
                    backgroundColor: ['#009999', '#005050'],
                },
            ],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false,
                text: 'Binary Protections',
                fontSize: 25
            },
            legend: {
                position: 'top',
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips: {
                  callbacks: {
                    label: function(item, data) {
                    console.log(data.labels, item);
                        return data.datasets[item.datasetIndex].label;
                    }
                }
            }
        }
    });

    let data_to_display = {
        "firmware name": returnData.name,
        "start date": returnData.start_date.replace('T', ' - '),
        "end date": returnData.end_date.replace('T', ' - '),
        "architecture verified": returnData.architecture_verified,
        "vendor": returnData.vendor,
        "version": returnData.version,
        "notes": returnData.notes,
        "files": returnData.files,
        "directories": returnData.directories,
        "bins checked": returnData.bins_checked,
        "exploits": returnData.exploits,
        "entropy_value": returnData.entropy_value,
        "1 entropy": "1",
        "2 entropy": "1",
        "3 entropy": "1",
        "4 entropy": "1",
        "5 entropy": "1",
        "path to logs": returnData.path_to_logs,
        "emba command": "./emba.sh -f /app/embark/uploadedFirmwareImages/active_2/170.pdf -l /app/emba/emba_logs/2  -g -s -z -W -F -t",
    }

    const table = document.getElementById("detail_body");
    for (const [key, value] of Object.entries(data_to_display)) {
        let row = table.insertRow();
        let date = row.insertCell(0);
        date.innerHTML = key
        let name = row.insertCell(1);
        name.innerHTML = value;
    }
});

function get_individual_report() {
    let report_index = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
    let url = window.location.origin + "/get_individual_report/" + report_index;

    return $.getJSON(url).then(function(data){
        data.cve_high = 100
        data.cve_medium = 200
        data.cve_low = 500

        data.pie = 100
        data.nx = 200
        data.relro = 500
        data.canary = 200

        return data
    })
}