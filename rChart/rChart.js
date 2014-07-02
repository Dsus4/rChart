function rChart (settings) {

    var chart = {};
    switch(settings.type){
        case 'line':
            if(typeof rLineChart !== 'undefined')
              chart = new rLineChart(settings); 
            break;

        case 'bar':
            if(typeof rBarChart !== 'undefined')
              chart = new rBarChart(settings); 
            break;

        case 'stackedBar':
            if(typeof rStackedBarChart !== 'undefined')
              chart = new rStackedBarChart(settings); 
            break;

        case 'pie':
            if(typeof rPieChart !== 'undefined')
              chart = new rPieChart(settings); 
            break;

        default:
            if(typeof rLineChart !== 'undefined')
              chart = new rLineChart(settings);
    }
    init(chart);
    return chart;
}

function init(self){
    if(typeof self.settings === 'undefined' ||
      typeof self.settings.responsive === 'undefined' ||
      self.settings.responsive === true){
        window.addEventListener("resize",self.resizeHandler, false); 
    }
}