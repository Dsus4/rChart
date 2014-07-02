function rPieChart (settings) {

    //defaults
    this.defaults = {
      element_id: 'chart',
      height: 300,
      margin: {top: 20, right: 55, bottom: 30, left: 40},
      sector: {innerRadius: 0, stroke: 'white', strokeWidth: '3px'},
      sort: 'desc'
    };
    var _this = this;

    this._init = function(settings) {
        this.settings=$.extend(true,this.defaults,settings)
    }

    this._erase = function () {
        $('#'+this.settings.element_id).empty();
        removePopovers();
    }

    this._destroy = function() {
        this._erase();
        window.removeEventListener('resize', _this.resizeHandler, false);
    }

    this.resizeHandler = function(e) {
        _this.render();
    }

    this.render = function() {
        
        this._erase();
        var settings = this.settings;
        var w  = parseInt(d3.select("#"+settings.element_id).style('width'), 10),
            pr = parseInt(d3.select("#"+settings.element_id).style('padding-right'), 10),
            pl = parseInt(d3.select("#"+settings.element_id).style('padding-left'), 10);
            width  =  w - pr - pl - settings.margin.left - settings.margin.right,
            height = this.settings.height  - settings.margin.top  - settings.margin.bottom,
            radius = Math.min(width, height) / 2;

        var arc = d3.svg.arc()
            .outerRadius(radius - 10)
            .innerRadius(this.settings.sector.innerRadius);

        var pie = d3.layout.pie()
            .sort(this.d3sortFunc)
            .value(function(d) { return d.value; });

        var svg = d3.select("#"+settings.element_id).append("svg")
            .attr("id", "chart")
            .attr("class", settings.element_id)
            .attr("width", width + settings.margin.left + settings.margin.right)
            .attr("height", height + settings.margin.top  + settings.margin.bottom)
          .append("g")
            .attr("transform", "translate(" + (w / 2 - settings.margin.right/6) + "," + this.settings.height / 2 + ")");

        var categories = settings.categories || settings.series.data.map(function() {return '';});
        var seriesNames = settings.series.name;

        var color = {};
        if(typeof settings.color !== 'undefined')
          color = d3.scale.ordinal().range(settings.color);
        else 
          color = d3.scale.category20();
        color.domain(seriesNames);

        var values = settings.series.data.map(function (d,i) {
          return {value: d, category: categories[i]};
        });

        var orderedData = settings.series.data.slice();
        if(this.sortFunc.call(1,2) !== null) orderedData.sort(this.sortFunc);
        var categoryIndex = settings.series.data.map(function (d,i) {
          return orderedData.indexOf(d);
        });

        var angles = svg.selectAll(".arc")
            .data(pie(values))
          .enter().append("g")
            .attr("class", "arc");

        angles.append("path")
            .attr("d", arc)
            .style("stroke", settings.sector.stroke)
            .style("stroke-width", settings.sector.strokeWidth)
            .style("fill", function(d) { return color(d.data.category); })
            .on("mouseover", function (d) { _this.showPopover.call(this, d.data); })
            .on("mouseout",  function (d) { _this.removePopovers(); });

        angles.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", ".35em")
            .attr("class","pie-text")
            .style("text-anchor", "middle")
            .text(function(d) { return d.data.value; });

        var legend = svg.selectAll(".legend")
            .data(pie(values))
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) { return "translate(" + (width/-2 + settings.margin.right)  + "," + (categoryIndex[i] * 20 - height/2) + ")"; });

        legend.append("rect")
            .attr("class", "legend-rect")
            .attr("x", width - 10)
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function (d, i) { return color(d.data.category); })
            .style("stroke", "grey");

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", width - 12)
            .attr("y", 6)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) { return d.data.category; });
    }

    this.removePopovers = function () {
      $('.popover').each(function() {
        $(this).remove();
      }); 
    }

    this.showPopover = function (d) {
      $(this).popover({
        title: d.category,
        placement: 'auto top',
        container: 'body',
        trigger: 'manual',
        html : true,
        content: function() { 
          return "Quarter: " + d.category + 
                 "<br/>Value: " + d3.format(",")(d.value ? d.value: d.y1 - d.y0); }
      });
      $(this).popover('show')
    }

    this.sortFunc = function (a,b) {
      if (typeof settings.sort === 'undefined' || typeof settings.sort !== 'string' || settings.sort.toLowerCase() === 'desc' )
        return b-a;
      else if(settings.sort.toLowerCase() === 'asc')
        return a-b;
      else
        return null;
    }

    this.d3sortFunc = function (a,b) {
      if (typeof settings.sort === 'undefined' || typeof settings.sort !== 'string' || settings.sort.toLowerCase() === 'desc' )
        return d3.descending(a.value,b.value);
      else if(settings.sort.toLowerCase() === 'asc')
        return d3.ascending(a.value,b.value);
      else
        return null;
    }    

    if(settings.element_id !== 'undefined' && $('#'+settings.element_id).width()){
        this._init(settings);
        this.render();
    }else
        console.log('width of ',settings.element_id,': ',$('#'+settings.element_id).width());
}
