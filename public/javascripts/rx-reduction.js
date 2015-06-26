var colors = ['blue', 'red', 'yellow'];

var inputData = Rx.Observable.interval(100).map(function(index) {
  return {
    id: index
  , color: colors[demo.getRandomInt(0, colors.length)]
  , size: demo.getRandomInt(100, 1001)
  // ["circle", "cross", "diamond", "square", "triangle-down", "triangle-up"]
  , type: d3.svg.symbolTypes[demo.getRandomInt(0, d3.svg.symbolTypes.length)]
  };
}).share();

var inputElement = document.getElementById('input');
inputData = inputData.take(80)
demo.visualizeObservable(inputElement, inputData)

var outputData = inputData
  .reduce(function(acc, x) {
    return {
      id: x.id
    , color: 'green'
    , size: acc.size + x.size
    , type: 'square'
    };
  }, {size: 0});

var outputElement = document.getElementById('output');
demo.visualizeObservable(outputElement, outputData, {height: '200'});
