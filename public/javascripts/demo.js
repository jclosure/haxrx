// jshint laxcomma:true

var demo = demo || {};

(function(demo, d3, rx) {
  'use strict';

  demo.getRandomInt = function(min, max) {
  	return Math.floor(Math.random() * (max - min) + min);
	};

  var isNestedArray = function(array) {
    return array
      && Object.prototype.toString.call(array) === '[object Array]'
      && array.length
      && Object.prototype.toString.call(array[0]) === '[object Array]'
  }

  demo.visualizeCollection = function(element, data, options) {
    var defaults = {
     	width: 450
    , height: 450
    };
    options = _.defaults({}, options, defaults);

    var nestedArray = false;
    if (isNestedArray(data)) {
      nestedArray = true;
      data = data.map(function(subArray) {
        return {
          id: subArray[0].id * 10 + subArray[1].id,
          shapes: subArray,
          size: (subArray[0].size  + subArray[1].size) * .75,
        }
      })
    }

    var force = null
      , nodes = null
    ;

    var svg = d3.select(element).append('svg')
      .attr('width', options.width)
      .attr('height', options.height)
    ;

    var init = function() {
      svg.selectAll('*').remove();

      force = d3.layout.force()
        .size([options.width, options.height])
        .nodes(data)
        .links([])
        .gravity(0.1)
        .friction(0.83)
        .charge(function(d) {return -1 * d.size * d.size / 7000 - 10;})
      ;

      if (!nestedArray) {
        nodes = svg.selectAll('path')
          .data(data, function(d, index) {
            return d.id;
          });
        nodes.enter().append('path')
      		.attr("d", d3.svg.symbol()
        	  .size(function(d) { return d.size; })
        	  .type(function(d) { return d.type; })
          )
          .attr('class', function(d) {return d.color;})
          .attr('fill', function(d) {return d.color;})
          .call(force.drag);
      } else {
        nodes = svg.selectAll('g')
          .data(data, function(d, index) {
            return d.id;
          });
        var group = nodes.enter().append('g');
        group.append('path')
      		.attr("d", d3.svg.symbol()
        	  .size(function(d) { return d.shapes[0].size; })
        	  .type(function(d) { return d.shapes[0].type; })
          )
          .attr('class', function(d) {return d.shapes[0].color;})
          .attr('fill', function(d) {return d.shapes[0].color;})
          .attr("transform", function(d) { return "translate(-" + d.shapes[0].size / 40 + ",0)"; });
        group.append('path')
      		.attr("d", d3.svg.symbol()
        	  .size(function(d) { return d.shapes[1].size; })
        	  .type(function(d) { return d.shapes[1].type; })
          )
          .attr('class', function(d) {return d.shapes[1].color;})
          .attr('fill', function(d) {return d.shapes[1].color;})
        .attr("transform", function(d) { return "translate(" + d.shapes[1].size / 40 + ",0)"; });
        nodes.call(force.drag);
      }
      force.on('tick', function() {
        nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      });
    };

    init();
    force.start();
  }

  demo.visualizeObservable = function(element, dataStream, options) {
    var defaults = {
     	width: 1500
    , height: 50
    , duration: 2500
    };
    options = _.defaults({}, options, defaults);

    var svg = d3.select(element).append('svg')
      .attr('width', options.width)
      .attr('height', options.height)
    ;

    var particle = function(data) {
      data.start = {x: 0, y: options.height / 2}
      data.end = {x: options.width, y: options.height / 2}
    	svg.insert('path')
        .datum(data)
        .attr("transform", function(d) {
        	return "translate(" + d.start.x + "," + d.start.y + ")";
      	})
        .attr("d", d3.svg.symbol()
        .size(function(d) { return d.size; })
        .type(function(d) { return d.type; }))
        .attr('class', function(d) {return d.color;})
        .attr('fill', function(d) {return d.color;})
        .transition()
          .duration(options.duration)
          .delay(function(d) {return d.delay || 0})
          .ease('linear')
      		.attr("transform", function(d) {
        		return "translate(" + d.end.x + "," + d.end.y + ")";
      		})
      		.remove();
      ;
    };

    dataStream.tap(function(data) {
      //console.log('data', data);
      particle(data);
    }).subscribeOnError(function(err) {
      console.error(err.stack || err);
    });
  };
})(demo, d3, Rx);
