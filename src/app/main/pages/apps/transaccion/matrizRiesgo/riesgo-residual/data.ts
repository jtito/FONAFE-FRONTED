export const barChartOptions = {
    responsive: true,
    title: {
        display: true,
        text: 'My Chart Title',
        fontColor: 'black',
    },
    scales: {
        xAxes: [{
            stacked: true,
            ticks: {
                fontColor: 'black',
            },
            gridLines: {
                color: '#dbd9d9'
            }
        }],
        yAxes: [{
            stacked: true,
            ticks: {
                fontColor: 'black',
                min: 0,
                beginAtZero: true,

            },
            gridLines: {
                color: '#dbd9d9'
            },
            scaleLabel: {
                display: true,
                labelString: 'Scale Label',
                fontColor: 'black',
            }
        }]
    },
    legend: {
        display: true,
        labels: {
            fontColor: 'black'
        }
    },
};
