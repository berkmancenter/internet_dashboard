var Default = {
	dims:  { width: 450, height: 200, scale: 90, squash: 0.90, bumpDown: 30, bumpLeft: 30 },
	iso: 2,
	colors: '#08519C',
	maxNumberOfCells: 5,
	valueKey: 'value',
	noDataColor: 'rgb(186,186,186)'
};
ChoroplethMap = function(){	console.log('[ChoroplethMap]: Constructed map.'); };
ChoroplethMap.prototype.draw = function(Options){
	/*
		Options:
			- selector: selector string or template-level selector (template.find('SELECTOR')) for the (empty) div for the map.
			- data: OBJECT with keys = country code (in upper case) and values = data object corresponding to that country. Only has to cover countries with data.
			- dims: OBJECT. DEFAULT: { width: 450, height: 200, scale: 90, squash: 0.90, bumpDown: 30, bumpLeft: 30 }.
			- iso: 2 or 3. 2 if the country codes are in ISO 3166-1 alpha-2 format, 3 if in ISO 3166-1 alpha-3. DEFAULT: 2.
			- colors: either a STRING (one color whose shades correspond to the value of the data in hex format) 
				OR an OBJECT, whose keys are the legend keys, and values are of type STRING representing the color in hex format.
				DEFAULT: '#08519C' (blue).
			- noDataColor: STRING (any color format). DEFAULT: 'rgb(186,186,186)' (gray)
			- maxNumberOfCells: NUMBER > 0. Only include if colors is a string, otherwise the number of label cells = number of keys in colors. DEFAULT: 5.
			- valueKey: STRING. The key in the data object that holds the value to be represented on the map. Either numerical (in case colors is a string) or a string corresponding to a legend key (in case colors is an object). DEFAULT: 'value'.
			- shadeKey: STRING. Only include if colors is an object AND you want colors to be shaded according to a specific key in the data. 
			For example: the map represents red and blue countries, and you also want it to show a difference between different red countries according to a value in the data. The value must in this case be numerical and must be >=0.
			- valueSuffix: STRING. If the value (in case of 1 color) or shadeKey (in case of many colors) represented has a common suffix, include that here.
	*/

	var self = this;
	self.noDataColor = Options.noDataColor ? Options.noDataColor : Default.noDataColor, self.colors = Options.colors ? Options.colors : Default.colors;

	// 1. All the variables
	var data = Options.data,
		selector = Options.selector,
		dims = Options.dims ? Options.dims : Default.dims,
		iso = Options.iso ? Options.iso : Default.iso,
		maxNumberOfCells = Options.maxNumberOfCells ? Options.maxNumberOfCells : Default.maxNumberOfCells,
		valueKey = Options.valueKey ? Options.valueKey : Default.valueKey,
		shadeKey = Options.shadeKey,
		valueSuffix = Options.valueSuffix ? Options.valueSuffix: '';

	if(!data){ error('"data" must be specified.'); return; }

	var labels = [], scores = [];
	var scoreKey = _.isObject(self.colors) ? shadeKey : valueKey;
	if(scoreKey){
		Object.keys(data).forEach(function(country){
			var val = data[country][scoreKey];
			if(scores.indexOf(val)===-1){ scores.push(val); }
		});
	}
	scores.sort(function(a, b){ return a-b; });
	$(selector).hide();
	// 2. Separate into 2 different types (1 color, or many colors)
	if(_.isString(self.colors)){
		// a. Error handling
		if(maxNumberOfCells < 1){ error('"maxNumberOfCells" must be a number that is >= 1'); return; }

		// b. Legend labels
		var numberOfCells = scores.length > maxNumberOfCells ? maxNumberOfCells : scores.length;
		// default:
		var range = makeRange(numberOfCells, self.colors);
		self.colorScale = d3.scale.quantile()
			.domain([scores[0], scores[scores.length - 1]])
			.range(range), quantile = true;
		// rule out cases where quantile isn't appropriate: 
		if(scores.length < maxNumberOfCells){ quantile = false; }
		else{
			for(var i=1; i<self.colorScale.quantiles().length; i++){
				if(self.colorScale.quantiles()[i-1] === self.colorScale.quantiles()[i]){ quantile = false; break; }
			}
		}
		// set legend labels:
		var labelPrecision = scores[scores.length - 1] > 1 ? 1 : 2;
		if(quantile){
			labels[0] = "< " + formatLegendLabelNumber(self.colorScale.quantiles()[0], labelPrecision);
			for(var i=0; i<self.colorScale.quantiles().length; i++){
				labels[i+1] = ">=" + formatLegendLabelNumber(self.colorScale.quantiles()[i], labelPrecision);
			}
		}
		else if(!quantile && scores.length <= maxNumberOfCells){
			self.colorScale = d3.scale.ordinal().domain(scores).range(range);
			for(var i=0; i<scores.length; i++){	labels[i] = formatLegendLabelNumber(scores[i], labelPrecision);	}
		}
		else{
			var min = scores[0];
			var max = scores[scores.length - 1] > 100 && min < 10 ? 80 : scores[scores.length - 1];
			self.colorScale = d3.scale.quantize().domain([min, max]).range(range);
			var buckets = _.map(range,function(color,i){ return min + ((i+1)*((max-min)/5)); });
			labels[0]= "<" + formatLegendLabelNumber(buckets[0],labelPrecision);
			for(var i=0; i<buckets.length; i++){ labels[i+1] = ">=" + formatLegendLabelNumber(buckets[i],labelPrecision); }
		}

	}
	else if(_.isObject(self.colors)){
		self.colorScale = d3.scale.ordinal()
			.domain(Object.keys(self.colors))
			.range(values(self.colors));
		labels = Object.keys(self.colors);
	}
	else{
		error('"colors" must be either a string or an object.');
		return;
	}

	// 3. Common
	var legend = d3.legend.color()
			.scale(self.colorScale)
			.labelOffset(5)
			.cells(labels.length)
			.labels(labels);

	var projection = d3.geo.winkel3()
		.scale(dims.scale)
		.translate([dims.width/2 - dims.bumpLeft, dims.height/2 + dims.bumpDown]);

	$(selector).empty();
	$(selector).show();
	self.svg = d3.select(selector).append('svg:svg')
		.attr('width', dims.width)
		.attr('height', dims.height);
	self.svg.append('g')
		.attr('class', 'legend')
		.attr('transform', 'translate(0, 100)');
	self.isoKey = iso === 2 ? 'iso2' : iso === 3 ? 'id' : '';
	if(self.isoKey===''){ error('"iso" must be 2 or 3.'); return; }
	CountryInfo.shapes(function(shapes){
		var feature = self.svg.selectAll('path')
			.data(shapes.features)
			.enter().append('svg:path')
			.attr('class', 'country')
			.style('fill', function(d){
				var country = data[d[self.isoKey]];
				if(country && _.isString(self.colors)){
					return self.colorScale(country[valueKey]);
				}
				else if(country && _.isObject(self.colors)){
					if(shadeKey){
						return formatColor(self.colors[country[valueKey]], country[shadeKey], scores);
					}
					else{
						return self.colors[country[valueKey]];
					}
				}
				else{
					return self.noDataColor;
				}
			})
			.style('transform', 'scaleY(' + dims.squash + ')')
			.attr("d", d3.geo.path().projection(projection));
		feature.append('title')
			.text(function(d){
				var title = d.properties.name;
				var country = data[d[self.isoKey]];
				if(country){
					var v = isNaN(country[valueKey]) ? country[valueKey] : formatLegendLabelNumber(country[valueKey]);
					var str = title + ': ' + v;
					if(shadeKey){
						str+=' (' + formatLegendLabelNumber(country[shadeKey]) + ' ' + valueSuffix + ')';
					}
					else{
						str+= ' ' + valueSuffix;
					}
					return str;
				}
				else{
					return title + ' (No data)';
				}
			});
	});
	self.svg.select('.legend').call(legend);
}

ChoroplethMap.prototype.update = function(Options){
	/*
		Options:
			- data: data object in same format as the draw function.
			- valueKey: same as the draw function. Added here in case for some reason that changes.
			- shadeKey: same as the draw function.
			- valueSuffix: same as the draw function.
	*/
	var self = this,
		data = Options.data, 
		shadeKey = Options.shadeKey, 
		valueKey = Options.valueKey ? Options.valueKey : Default.valueKey, 
		valueSuffix = Options.valueSuffix ? Options.valueSuffix : '',
		scores = [];
	if(shadeKey){
		Object.keys(data).forEach(function(country){
			var val = data[country][shadeKey];
			if(scores.indexOf(val)===-1){ scores.push(val); }
		});
		scores.sort(function(a, b){ return a-b; });
	}
	var countryShapes = self.svg.selectAll('.country');
	countryShapes.style('fill', function(d){
		var country = data[d[self.isoKey]];
		if(country && _.isString(self.colors)){
			return self.colorScale(country[valueKey]);
		}
		else if(country && _.isObject(self.colors)){
			if(shadeKey){
				return formatColor(self.colors[country[valueKey]], country[shadeKey], scores);
			}
			else{
				return self.colors[country[valueKey]];
			}
		}
		else{
			return self.noDataColor;
		}
	})
	.select('title')
	.text(function(d){
		var title = d.properties.name;
		var country = data[d[self.isoKey]];
		if(country){
			var v = isNaN(country[valueKey]) ? country[valueKey] : formatLegendLabelNumber(country[valueKey]);
			var str = title + ': ' + v;
			if(shadeKey){
				str+=' (' + formatLegendLabelNumber(country[shadeKey]) + ' ' + valueSuffix + ')';
			}
			else{
				str+=' ' + valueSuffix;
			}
			return str;
		}
		else{
			return title + ' (No data)';
		}
	}); 
}

function formatColor(hex, value, allValues){
	// allValues is sorted and all positive values
	var max = allValues[allValues.length - 1];
	var fraction = value === 0 ? 0.1 : value/max;
	var rgb = hexToRGB(hex);
	return 'rgba(' + [rgb.r, rgb.g, rgb.b].join() + ',' + fraction + ')';
}

function formatLegendLabelNumber (number, precision){
	number = Number(number);
	num = number>=1000000 ? {letter: 'M', div: 1000000} : number>=1000 ? {letter: 'K', div: 1000} : {letter: '', div: 1};
	precision = (number/num.div)%1===0 ? 0 : precision ? precision : 1;
	return (number/num.div).toFixed(precision) + num.letter;
}

function hexToRGB(hex){
	// src: http://stackoverflow.com/a/5624139
	// Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function makeRange(numberOfCells, hexColor){
	var color = hexToRGB(hexColor);
	if(!color){ error('"colors" is not in the correct hex format.'); return; }
	var unit = 1/numberOfCells;
	var common = 'rgba(' + [color.r, color.g, color.b].join();
	var arr = [];
	for(var i=0; i<numberOfCells; i++){
		var num = i*unit + unit;
		arr.push(common + ',' + num + ')');
	}
	return arr;
}

function error(message){
	console.log('[ChoroplethMap] ERROR: ' + message);
}

function values(obj){
	var arr = [];
	Object.keys(obj).forEach(function(key){
		arr.push(obj[key]);
	});
	return arr;
}