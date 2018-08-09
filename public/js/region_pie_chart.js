window.renderRegionPieChart = function (stats) {
	const data = [];
	for (let country in stats) {
		data.push({
			name: country,
			y: stats[country]
		});
	}

	Highcharts.chart('region_pie', {
		chart: {
			plotBackgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			type: 'pie'
		},
		title: {
			text: 'GoCD Country Based Distribution'
		},
		tooltip: {
			pointFormat: '<b>{point.y}</b> instances covering <b>{point.percentage:.1f}%</b> of total.'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: false
				},
				showInLegend: true
			}
		},
		series: [{
			colorByPoint: true,
			data
		}]
	});
};
