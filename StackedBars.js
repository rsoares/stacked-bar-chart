( function( d3 ) {
  if( d3 === undefined ) {
    return console.error( "d3 lib is not available globally." );
  }

  angular.module( "stackedBarChart", [] )
    .directive( "stackedBars", function() {

      // TODO: maybe move directive definition into it's own file.

      return {
        restrict: "E",
        template: '<svg width="450" height="400"></svg>',
        scope: {
          data: "&",
          options: "="
        },
        link: function( scope, element, attr ){
          var options = optionsSetup( scope.options );
          var chart = createChart( element, options );

          scope.$watch( scope.data, function(d) {
            draw( scope.options, chart, d );
          }, true );
        }
      };
    });

  function createChart( el, options ){
    var chart = {};

    chart.width = options.width - options.marginLeft - options.marginRight;
    chart.height = options.height - options.marginTop - options.marginBottom;

    // Setup x/y scales
    chart.x = d3.scale.ordinal().rangeRoundBands( [0, chart.width], 0.1 );
    chart.y = d3.scale.linear().range( [chart.height, 0] );

    // Setup stacks
    if( !!options.stacksColor.length && !!options.stacks.length ) {
      chart.stacks = d3.scale.ordinal()
        .range( options.stacksColor );
    }

    // Setup chart axis
    if( options.visibleXX ) {
      chart.xAxis = d3.svg.axis().scale( chart.x ).orient( "bottom" );
    }
    if( options.visibleYY ) {
      chart.yAxis = d3.svg.axis().scale( chart.y ).orient( "left" );
    }

    chart.svg = d3.select( el.find("svg")[0] )
      .attr( "width", options.width )
      .attr( "height", options.height )
      .append( "g" )
      .attr( "transform", "translate(" + options.marginLeft + "," + options.marginTop + ")" );

    return chart;
  }

  function draw( options, chart, data ) {
    var xValues, bars;

    data = preppData( chart, data, options );

    // Setup axis domains
    chart.x.domain( data.map( function( d ) { return d[options.xx]; }) );
    chart.y.domain( [0, d3.max( data, function( d ) { return d.total; } )] );

    drawAxis( chart );

    xValues = chart.svg.selectAll( ".xvalue" )
      .data( data )
      .enter()
      .append( "g" )
      .attr( "transform", function( d ) {
        return "translate(" + chart.x( d[options.xx] ) + ", 0)";
      });

    xValues.selectAll( "rect" )
      .data( function( d ) { return d.stacks; } )
      .enter()
      .append( "rect" )
      .attr( "width", chart.x.rangeBand() )
      .attr( "y", function( d ) {
        return chart.y( d.y1 );
      })
      .attr( "height", function( d ) { return chart.y( d.y0 ) - chart.y( d.y1 ); } )
      .style( "fill", function( d ) { return chart.stacks( d.stack ); } );
  }

  function drawAxis( chart ) {
    if( !!chart.xAxis ) {
      chart.svg.append( "g" )
        .attr( "class", "x axis" )
        .attr( "transform", "translate(0," + chart.height + ")" )
        .call( chart.xAxis );
    }
    if( !!chart.yAxis ) {
      chart.svg.append( "g" )
        .attr( "class", "y axis" )
        .call( chart.yAxis );
    }
  }

  function optionsSetup( options ) {
    var defaultOptions = {
      width: 730,
      height: 340,
      marginLeft: 30,
      marginRight: 30,
      marginTop: 20,
      marginBottom: 20,
      visibleXX: true,
      visibleYY: true,
      stacksColor: [],
      stacks: [],
      xx: null
    };

    for( var attr in defaultOptions ) {
      if( !!options && options.hasOwnProperty( attr ) ) {
        defaultOptions[attr] = options[attr];
      }
    }

    return defaultOptions;
  }

  function preppData( chart, data, options ) {
    if( chart.hasOwnProperty( "stacks" ) ) {
      chart.stacks.domain( options.stacks );
      data.forEach( function( d ) {
        var y0 = 0;
        d.stacks = chart.stacks.domain().map( function( stack ) {
          return {
            stack: stack,
            y0: y0,
            y1: y0 += +d[stack]
          };
        });
        d.total = d.stacks[d.stacks.length - 1].y1;
      });
    }
    return data;
  }
}) ( window.d3 );
