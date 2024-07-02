/**
 * Helper to creat a chart
 * @param chartId
 * @param type	Type of the chart: pie, doughnut, line, bar, radar, bubble, ...
 * @param data Array of data for the chart, it have value and the config to display data: value, label, backgroundColor
 * 			[{value:10, label: "data_1", backgroundColor: { type : "color", "value": "green"}}, {value:20, label: "data_2", backgroundColor: { type : "pattern", "value": "square #ff6384"}}]
 * @param options Other options for the chart : legend, responsive, ...
 * @returns
 */

function do_gl_create_chart(divId, type, data, options) {
	var template_option = {
		responsive: true,
		legend : { position: "right"}
	}
	var default_backgroundColor = {
			type : "color",
			value: "auto"
	}
	var color_pool = [
		"#bede69", "#69bede", "gray", "#bede96", "green", "red", "blue", "#96bede", "#be69de", "#f75164"
	]
	var pattern_pool = [
		"plus", "cross", "dash", "cross-dash", "dot", "dot-dash", "disc", "ring", "line", "line-vertical", "weave", "zigzag", "zigzag-vertical", "diagonal",
		"diagonal-right-left", "square", "box", "triangle", "triangle-inverted", "diamond", "diamond-box"
	]
	
	var custom_options = $.extend(true, {}, template_option, options);
	
	var div = $(divId)[0];
	
	if(!div) {
		console.log("ChartTool Error: div not found !");
	}
	
	var canvas	= document.createElement("canvas");
	div.append(canvas);
	
	var ctx = canvas.getContext('2d');
	
	var labels 			= [];
	var datas			= [];
	var backgroundColor = [];
	
	var chart = {};
	
	requirejs(['patternomaly'], function( pattern) {
		//normalize data for type
		$.each(data, function( i, e ){
			labels.push(e.label);
			datas.push(e.value);
			var b = e.backgroundColor;
			if(!b) {
				b = $.extend(true, {}, default_backgroundColor);
			}
			if(b.type == "color") {
				if(b.value == "auto") {
					b.value = do_generate_color();
				}
				backgroundColor.push(b.value);
			} else if(b.type == "pattern") {
				var parts = b.value.split(" ");
				backgroundColor.push(pattern.draw(parts[0], parts[1]));
			}
		});

		var chartData = {
				datasets: [{
					data: datas,
					backgroundColor: backgroundColor
				}],
				labels: labels
		};

		chart = new Chart(ctx, {
			type : type,
			data: chartData,
			options: custom_options
		});
	});
	
	var do_generate_color = function() {
		var colorNb = color_pool.length;
		var found = false;
		var color = "#bede69";
		while(!found) {
			var c = Math.floor(Math.random() * (colorNb - 1));
			color = color_pool[c];
			if($.inArray(color, backgroundColor) >= 0) {
				//already used
			} else {
				found = true;
			}
		}
		return color;
	};
	
	return chart;
}

function do_gl_create_chart_bar(divId, type, dataChart, options) {
	var div = $(divId);
	var canvas	= document.createElement("canvas");
	div.append(canvas);
	var ctx = canvas.getContext('2d');
	
	new Chart(ctx, {
	    type: type,
	    data: dataChart,
	    options: options
	});
}

function do_gl_create_chart_bar_ApexChart(divId, options) {
	let {series = [], categories = [], colors = []} = options;
	
	let opt = {
		    chart: {
		        height: 359,
		        type: "bar",
		        stacked: !0,
		        toolbar: {
		            show: !1
		        },
		        zoom: {
		            enabled: !0
		        }
		    },
		    plotOptions: {
		        bar: {
		            horizontal: !1,
		            columnWidth: "15%",
		            endingShape: "rounded"
		        }
		    },
		    dataLabels: {
		        enabled: !1
		    },
		    series: series,
		    xaxis: {
		        categories: categories
		    },
		    colors: colors,
		    legend: {
		        position: "bottom"
		    },
		    fill: {
		        opacity: 1
		    }
		};
		(chart = new ApexCharts(document.querySelector(divId),opt)).render();
}

function do_gl_create_chart_radialBar_ApexChart(divId, options) {
	let {series = [], labels = [], colors = []} = options;
	
	let opt = {
		    chart: {
		        height: 180,
		        type: "radialBar",
		        offsetY: -10
		    },
		    plotOptions: {
		        radialBar: {
		            startAngle: -135,
		            endAngle: 135,
		            dataLabels: {
		                name: {
		                    fontSize: "13px",
		                    color: void 0,
		                    offsetY: 60
		                },
		                value: {
		                    offsetY: 22,
		                    fontSize: "16px",
		                    color: void 0,
		                    formatter: function(e) {
		                        return e + "%"
		                    }
		                }
		            }
		        }
		    },
		    colors: colors,
		    fill: {
		        type: "gradient",
		        gradient: {
		            shade: "dark",
		            shadeIntensity: .15,
		            inverseColors: !1,
		            opacityFrom: 1,
		            opacityTo: 1,
		            stops: [0, 50, 65, 91]
		        }
		    },
		    stroke: {
		        dashArray: 4
		    },
		    series: series,
		    labels: labels
		};
		(chart = new ApexCharts(document.querySelector(divId), opt)).render();
}

/**
 * Pattern and color supported
 * 
 * Pattern -----
 * plus cross dash cross-dash dot dot-dash disc ring line line-vertical weave zigzag zigzag-vertical diagonal diagonal-right-left square box triangle triangle-inverted diamond diamond-box
 * ----------
 * 
 * Color ----------
 * 'red', 'green', 'blue', 'purple', ....
 * or rgb(0,0,0)
 * or hsl(
 * or #bede69
 */