const renderGeneralStats = function (stats) {
	console.log(stats);
	$('.ping .number').text(stats.usage_data_received_count);
	$('.prod-instances-count .number').text(stats.production_instances_count);
	$('.total-instances-count .number').text(stats.hosted_instances_count);
};

window.onload = function () {
	$.get("api/data", function (responseData) {
		renderGeneralStats(responseData.general_stats);
		renderVersionPieChart(responseData.version_based_stats);
		renderRegionPieChart(responseData.region_based_stats);
		renderPipelineCountBarChart(responseData.pipeline_count_based_stats);
		renderPerYearInstancesCountBarChart(responseData.per_year_instances_count_stats);
	});
};
