function removePopovers () {
  $('.popover').each(function() {
    $(this).remove();
  }); 
}

function showPopover (d) {
  $(this).popover({
    title: d.name,
    placement: 'auto top',
    container: 'body',
    trigger: 'manual',
    html : true,
    content: function() { 
      return "Quarter: " + d.label + 
             "<br/>Value: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
  });
  $(this).popover('show')
} 

function rLineChart (settings) {

    //defaults
    this.defaults = {
      element_id: 'chart',
      margin: {top: 20, right: 55, bottom: 30, left: 40},
      yTitle: '',
      point:  { radius: '3px', stroke: 'grey', strokeWidth: '0px'},
      path: {width: '2px'}
    };
    var _this = this;

    this._init = function(settings) {
        this.settings=$.extend(true,this.defaults,settings);
    }

    this._erase = function () {
        $('#'+this.settings.element_id).empty();
        removePopovers();
    }

    this._destroy = function() {
        _this._erase();
        window.removeEventListener('resize', _this.resizeHandler, false);
    }

    this.resizeHandler = function(e) {
        _this.render();
    }

    this.render = function() {
        _this._erase();
        var settings = this.settings;
        var w  = parseInt(d3.select("#"+settings.element_id).style('width'), 10),
            pr = parseInt(d3.select("#"+settings.element_id).style('padding-right'), 10),
            pl = parseInt(d3.select("#"+settings.element_id).style('padding-left'), 10);
            width  =  w - pr - pl - settings.margin.left - settings.margin.right,
            height = 300  - settings.margin.top  - settings.margin.bottom;

        var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
          .rangeRound([height, 0]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

        var line = d3.svg.line()
          .interpolate("cardinal")
          .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
          .y(function (d) { return y(d.value); });

        var svg = d3.select("#"+settings.element_id).append("svg")
          .attr("id", "chart")
          .attr("class", settings.element_id)
          .attr("width",  width  + settings.margin.left + settings.margin.right)
          .attr("height", height + settings.margin.top  + settings.margin.bottom)
          .append("g")
          .attr("transform", "translate(" + settings.margin.left + "," + settings.margin.top + ")");

        var seriesNames = settings.series.map(function (serie) {
          return serie.name;
        });

        var color = {};
        if(typeof settings.color !== 'undefined')
          color = d3.scale.ordinal().range(settings.color);
        else 
          color = d3.scale.category20();
        color.domain(seriesNames);

        var xAxisLabels = settings.xAxis.labels;
        var values = settings.series;
        var seriesData = seriesNames.map(function (name, i) {
            return {
              name: name,
              values: values[i].data.map(function (d,i) {
                return {name: name, label: xAxisLabels[i], value:d};
              })
            };
        }, self);

        x.domain(xAxisLabels.map(function (d) { return d; }));
        y.domain([
          d3.min(seriesData, function (c) { 
            return d3.min(c.values, function (d) { return d.value; });
          }),
          d3.max(seriesData, function (c) { 
            return d3.max(c.values, function (d) { return d.value; });
          })
        ]);

        var xAxisLine = svg.append("g")
            .attr("class", "x axis")
             .attr("transform", "translate(0," + height + ")");

        xAxisLine.call(xAxis);

        var yAxisLine = svg.append("g")
            .attr("class", "y axis");

        yAxisLine.call(yAxis);
        
        yAxisLine.append("text")
            .attr("class","y-text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(settings.yTitle);

        var series = svg.selectAll(".series")
            .data(seriesData)
          .enter().append("g")
            .attr("class", "series");

        series.append("path")
          .attr("class", "line")
          .attr("d", function (d) { return line(d.values); })
          .style("stroke", function (d) { return color(d.name); })
          .style("stroke-width", settings.path.width)
          .style("fill", "none")

        series.selectAll(".point")
          .data(function (d) { return d.values; })
          .enter().append("circle")
           .attr("class", "point")
           .attr("cx", function (d) { return x(d.label) + x.rangeBand()/2; })
           .attr("cy", function (d) { return y(d.value); })
           .attr("r", settings.point.radius)
           .style("fill", function (d) { return color(d.name); })
           .style("stroke", settings.point.stroke)
           .style("stroke-width", settings.point.strokeWidth)
           .on("mouseover", function (d) { showPopover.call(this, d); })
           .on("mouseout",  function (d) { removePopovers(); })

        var legend = svg.selectAll(".legend")
            .data(seriesNames.slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });

        legend.append("rect")
            .attr("class", "legend-rect")
            .attr("x", width - 10)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", color)
            .style("stroke", "grey");

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", width - 12)
            .attr("y", 6)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d; });
    }

    if(settings.element_id !== 'undefined' && $('#'+settings.element_id).width()){
        this._init(settings);
        this.render();
    }else
        console.log('width of ',settings.element_id,': ',$('#'+settings.element_id).width());
}
