var accumulatedDonut = document.getElementById('accumulatedDonut').getContext('2d');
var accumulatedCvePie = document.getElementById('accumulatedCvePie').getContext('2d');
var accumulatedEntropy = document.getElementById('accumulatedEntropy');

var accumulatedArchitecture = document.getElementById('accumulatedArchitecture').getContext('2d');
var accumulatedOs = document.getElementById('accumulatedOs').getContext('2d');

var firmwareAnalysed = document.getElementById('firmwareAnalysed');
var totalFiles = document.getElementById('totalFiles');
var totalDirectories = document.getElementById('totalDirectories');
var totalBinaries = document.getElementById('totalBinaries');
var totalCve= document.getElementById('totalCve');
var totalIssues = document.getElementById('totalIssues')

var topBinaryTypes = document.getElementById('topBinaryTypes')



function getRandomColors(num) {
    var colors = [];
    for (var i = 0; i < num; i++ ) {
        var r = Math.round (Math.random () * 255);
        var g = Math.round (Math.random () * 255);
        var b = Math.round (Math.random () * 255);
        colors.push(`rgba(${r}, ${g}, ${b})`)
    }
    return colors;
}


get_accumulated_reports().then(function (returnData) {

    accumulatedEntropy.setAttribute('value', returnData.entropy_value['mean']);
    firmwareAnalysed.textContent = returnData.total_firmwares;
    totalFiles.textContent = returnData.files['sum'];
    totalDirectories.textContent = returnData.directories['sum'];
    totalBinaries.textContent = returnData.bins_checked['sum'];
    totalCve.textContent = returnData.cve_medium['sum'] + returnData.cve_low['sum'] + returnData.cve_high['sum'];
    totalIssues.textContent = returnData.exploits['sum'];

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



    var archLabels = Object.keys(returnData.architecture_verified);
    var archCounts = Object.values(returnData.architecture_verified);
    let architectureBarChart = new Chart(accumulatedArchitecture, {
        type: 'bar',
        data: {
                  labels: archLabels,
                  datasets: [{
                    label: 'Architecture Distribution',
                    labels: archLabels,
                    data: archCounts,
                    borderWidth: 1,
                    backgroundColor: getRandomColors(archLabels.length)
                  }],
                  options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            text: 'Architecture Distribution',
                            fontSize: 20
                        },
                        tooltips: {
                            enabled: true
                        }
                    }
            },
    });

    var osLabels = Object.keys(returnData.os_verified);
    var osCounts = Object.values(returnData.os_verified);
    let osBarChart = new Chart(accumulatedOs, {
        type: 'bar',
        data: {
                  labels: osLabels,
                  datasets: [{
                    label: 'OS Distribution',
                    labels: osLabels,
                    data: osCounts,
                    borderWidth: 1,
                    backgroundColor: getRandomColors(osLabels.length)
                  }],
                  options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            text: 'OS Distribution',
                            fontSize: 20
                        },
                        tooltips: {
                            enabled: true
                        }
                    }
            },

    });


    var topBinaryLabels = Object.keys(returnData.top_strcpy_bins);
    var topBinaryCounts = Object.values(returnData.top_strcpy_bins);
    let topBinaryBar = new Chart(topBinaryTypes, {
        type: 'bar',
        data: {
                  labels: topBinaryLabels,
                  datasets: [{
                    label: 'Top strcpy Binaries',
                    labels: topBinaryLabels,
                    data: topBinaryCounts,
                    borderWidth: 1,
                    backgroundColor: getRandomColors(topBinaryLabels.length)
                  }],
                  options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            text: 'Top strcpy Binaries',
                            fontSize: 20
                        },
                        tooltips: {
                            enabled: true
                        }
                    }
            },

    });

});


function get_accumulated_reports() {
    let url = window.location.origin + "/get_accumulated_reports/";

    return $.getJSON(url).then(function(data){
        console.log(data);
        return data;
    })
}