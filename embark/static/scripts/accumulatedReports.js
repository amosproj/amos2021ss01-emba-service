var nxpie = document.getElementById('nxpie').getContext('2d');
var piepie = document.getElementById('piepie').getContext('2d');
var relropie = document.getElementById('relropie').getContext('2d');
var canarypie = document.getElementById('canarypie').getContext('2d');
var strippedpie = document.getElementById('strippedpie').getContext('2d');

var accumulatedCvePie = document.getElementById('accumulatedCvePie').getContext('2d');
var accumulatedEntropy = document.getElementById('accumulatedEntropy');

var accumulatedArchitecture = document.getElementById('accumulatedArchitecture').getContext('2d');
var accumulatedOs = document.getElementById('accumulatedOs').getContext('2d');

var firmwareAnalysed = document.getElementById('firmwareAnalysed');
var totalFiles = document.getElementById('totalFiles');
var totalDirectories = document.getElementById('totalDirectories');
var totalBinaries = document.getElementById('totalBinaries');
var totalCve = document.getElementById('totalCve');
var totalIssues = document.getElementById('totalIssues')
// var topEntropies = document.getElementById('topEntropies');



function getRandomColors(num) {
    var r = Math.round(Math.random() * 255);
    var g = Math.round(Math.random() * 255);
    var b = Math.round(Math.random() * 255);
    var colors = [];
    for (var i = 0; i < num; i++) {
        colors.push(`rgb (${r}, ${g}, ${b})`)
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

    // var topEntropies = returnData.top_entropies;

    // for (var i = 0; i < 5; i++) {
    //     var topEntropyHtml = '< label for = "accumulatedEntropy"> ' + topEntropies[i]["name"] + ' </label> <meter id = "accumulatedEntropy" min = "0" max = "8" value = ' + topEntropies[i]["entropy_value"] + '></meter>';
    //     document.getElementById("topEntropy").innerAdjacentHTML('afterend', topEntropyHtml);

    // }

    let cvePieChart = new Chart(accumulatedCvePie, {
        type: 'pie',
        data: {
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

    let nxpiechart = new Chart(nxpie, {
        type: 'pie',
        data: {
            labels: [
                'Binaries with NX',
                'Binaries without NX',
            ],
            datasets: [{
                labels: ['binaries with NX', 'binaries without NX'],
                data: [returnData.nx['mean'], (returnData.bins_checked['mean'] - returnData.nx['mean'])],
                backgroundColor: ['#493791', '#291771'],
            }, ],
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
        }
    });

    let piepiechart = new Chart(piepie, {
        type: 'pie',
        data: {
            labels: [
                'Binaries with PIE',
                'Binaries without PIE',
            ],
            datasets: [{
                labels: ['binaries with PIE', 'binaries without PIE'],
                data: [returnData.pie['mean'], (returnData.bins_checked['mean'] - returnData.pie['mean'])],
                backgroundColor: ['#1b1534', '#000014'],
            }, ],
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
        }
    });

    let relropiechart = new Chart(relropie, {
        type: 'pie',
        data: {
            labels: [
                'Binaries with RELRO',
                'Binaries without RELRO',
            ],
            datasets: [{
                labels: ['binaries with RELRO', 'binaries without RELRO'],
                data: [returnData.relro['mean'], (returnData.bins_checked['mean'] - returnData.relro['mean'])],
                backgroundColor: ['#7b919d', '#5b717d'],
            }, ],
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
        }
    });

    let canarypiechart = new Chart(canarypie, {
        type: 'pie',
        data: {
            labels: [
                'Binaries with CANARY',
                'Binaries without CANARY',
            ],
            datasets: [{
                labels: ['binaries with CANARY', 'binaries without CANARY'],
                data: [returnData.canary['mean'], (returnData.bins_checked['mean'] - returnData.canary['mean'])],
                backgroundColor: ['#525d63', '#323d43'],
            }, ],
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
        }
    })

    let strippedpiechart = new Chart(strippedpie, {
        type: 'pie',
        data: {
            labels: [
                'Binaries with Stripped',
                'Binaries without Stripped',
            ],
            datasets: [{
                labels: ['binaries with STRIPPED', 'binaries without STRIPPED'],
                data: [returnData.stripped['mean'], (returnData.bins_checked['mean'] - returnData.stripped['mean'])],
                backgroundColor: ['#009999', '#005050'],
            }, ],
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
        }
    });

    var archLabels = Object.keys(returnData.architecture_verified);
    var archCounts = Object.values(returnData.architecture_verified);

    var colors = [];
    for (var i = 0; i < archLabels.length; i++) {
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        colors.push(`rgb (${r}, ${g}, ${b})`)
    }
    let architectureBarChart = new Chart(accumulatedArchitecture, {
        type: 'bar',
        data: {
            labels: archLabels,
            datasets: [{
                label: 'Architecture Distribution',
                data: archCounts,
                borderWidth: 1
            }]
        },
        backgroundColor: colors
    });

    var osLabels = Object.keys(returnData.os_verified);
    var osCounts = Object.values(returnData.os_verified);

    var colors_2 = [];
    for (var i = 0; i < archLabels.length; i++) {
        var r = Math.round(Math.random() * 255);
        var g = Math.round(Math.random() * 255);
        var b = Math.round(Math.random() * 255);
        colors_2.push(`rgb (${r}, ${g}, ${b})`)
    }
    let osBarChart = new Chart(accumulatedOs, {
        type: 'bar',
        data: {
            labels: osLabels,
            datasets: [{
                label: 'OS Distribution',
                data: osCounts,
                borderWidth: 1
            }]
        },
        backgroundColor: colors_2
    });

});


function get_accumulated_reports() {
    let url = window.location.origin + "/get_accumulated_reports/";

    return $.getJSON(url).then(function (data) {
        console.log(data);
        return data;
    })
}