$(document).ready(function() {
	var charts = {};
	var settings = {
		type: 'line',
		xAxis: {
			labels: ["09-Q1","09-Q2","09-Q3","09-Q4","10-Q1","10-Q2","10-Q3","10-Q4","11-Q1","11-Q2","11-Q3","11-Q4","12-Q1","12-Q2","12-Q3","12-Q4","13-Q1","13-Q2","13-Q3","13-Q4"]
		},
		yTitle: 'Y Title'
	};
	var color = ["#001c9c","#101b4d","#475003","#9c8305","#d3c47c"];
	var series = [{
			name: "Data 1",
			data: [320,225,237,190,447,309,339,322,622,497,642,602,892,728,794,730,1053,925,986,693]
		},
		{
			name: "Data 2",
			data: [203,145,157,231,288,230,262,283,321,326,372,354,375,376,354,320,404,502,576,506]
		},
		{
			name: "Data 3",
			data: [123,105,112,146,164,135,144,118,165,146,165,152,135,152,118,123,147,166,202,198]
		},
		{
			name: "Data 4",
			data: [121,123,98,109,116,159,131,148,150,147,136,109,146,151,143,125,144,140,175,161]
		},
		{
			name: "Data 5",
			data: [245,208,278,569,981,893,891,835,937,887,752,721,808,819,771,715,608,733,596,1015]
		}];
	settings.element_id = 'chart-1';
	settings.series = series.slice(0,4);
	charts[1] = new rChart(settings);
	settings.element_id = 'chart-2';
	settings.type = 'bar';
	settings.series = series.slice(2,3);
	charts[2] = new rChart(settings);
	settings.element_id = 'chart-3';
	settings.type = 'bar';
	settings.series = series.slice(0,3);
	charts[3] = new rChart(settings);
	settings.element_id = 'chart-4';
	settings.type = 'stackedBar';
	settings.series = series.slice(0,3);
	charts[4] = new rChart(settings);
	settings.type = 'pie';
	settings.element_id = 'chart-5';
	settings.series = {name: "Data 1", data: series.slice(0,1)[0].data.slice(0,5)};
	settings.categories = settings.xAxis.labels.slice(0,5);
	charts[5] = new rChart(settings);
	settings.type = 'pie';
	settings.element_id = 'chart-6';
	settings.series = {name: "Data 3", data: series.slice(2,3)[0].data.slice(0,5)};
	settings.categories = settings.xAxis.labels.slice(0,5);
	settings.sector = {innerRadius: 60};
	charts[6] = new rChart(settings);
});