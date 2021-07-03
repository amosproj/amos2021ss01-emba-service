var accumulatedDonut = document.getElementById('accumulatedDonut').getContext('2d');
var accumulatedCvePie = document.getElementById('accumulatedCvePie').getContext('2d');
var accumulatedEntropy = document.getElementById('accumulatedEntropy');

//let accumulatedArchitecture = document.getElementById('accumulatedArchitecture').getContext('2d');
//let accumulatedOs = document.getElementById('accumulatedOs').getContext('2d');


get_accumulated_reports().then(function (returnData) {

    accumulatedEntropy.setAttribute('value', returnData.entropy_value['mean']);

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
                            data: [returnData.cve_high.sum, returnData.cve_low.sum, returnData.cve_medium.sum],
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
                            data: [returnData.nx['mean'], (returnData.bins_checked['mean'] - returnData.nx['mean'])],
                            backgroundColor: ['#493791', '#291771'],
                        },
                        {
                            label: 'PIE',
                            data: [returnData.pie['mean'], (returnData.bins_checked['mean'] - returnData.pie['mean'])],
                            backgroundColor: ['#1b1534', '#000014'],
                        },
                        {
                            label: 'RELRO',
                            data: [returnData.relro['mean'], (returnData.bins_checked['mean'] - returnData.relro['mean'])],
                            backgroundColor: ['#7b919d', '#5b717d'],
                        },
                        {
                            label: 'CANARY',
                            data: [returnData.canary['mean'], (returnData.bins_checked['mean'] - returnData.canary['mean'])],
                            backgroundColor: ['#525d63', '#323d43'],
                        },
                        {
                            label: 'Stripped',
                            data: [returnData.stripped['mean'], (returnData.bins_checked['mean'] - returnData.stripped['mean'])],
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
                display: true,
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
                enabled: true
            }
        }
            });


//    let architectureBarChart = new Chart(accumulatedArchitecture, {
//        type: 'bar'
//    });
//
//    let osBarChart = new Chart(accumulatedOs, {
//        type: 'bar'
//    });

});


function get_accumulated_reports() {
    let url = window.location.origin + "/get_accumulated_reports/";

    return $.getJSON(url).then(function(data){
        console.log(data)
        return{
            pie: data.pie,
            nx: data.nx,
            relro: data.relro,
            stripped: data.stripped,
            canary: data.canary,
            bins_checked: data.bins_checked,
            cve_high: data.cve_high,
            cve_medium: data.cve_medium,
            cve_low: data.cve_low,
            entropy_value: data.entropy_value
        }
    })
}