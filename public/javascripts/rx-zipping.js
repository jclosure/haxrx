var colors = ['blue', 'red', 'yellow'];

var input1Data = Rx.Observable.interval(200).map(function(index) {
  return {
    id: index
  , color: colors[demo.getRandomInt(0, colors.length)]
  , size: demo.getRandomInt(100, 1001)
  // ["circle", "cross", "diamond", "square", "triangle-down", "triangle-up"]
  , type: d3.svg.symbolTypes[demo.getRandomInt(0, d3.svg.symbolTypes.length)]
  };
}).share();

var input2Data = Rx.Observable.interval(200).map(function(index) {
  return {
    id: index
  , color: colors[demo.getRandomInt(0, colors.length)]
  , size: demo.getRandomInt(100, 1001)
  // ["circle", "cross", "diamond", "square", "triangle-down", "triangle-up"]
  , type: d3.svg.symbolTypes[demo.getRandomInt(0, d3.svg.symbolTypes.length)]
  };
}).share();

var input1Element = document.getElementById('input1');
demo.visualizeObservable(input1Element, input1Data)

var input2Element = document.getElementById('input2');
demo.visualizeObservable(input2Element, input2Data)

var outputData = Rx.Observable.zip(
  input1Data,
  input2Data,
  function(x1, x2) {
    return {
      id: x1.id
    , color: x1.color
    , size: x2.size
    , type: x2.type
    };
  });

var outputElement = document.getElementById('output');
demo.visualizeObservable(outputElement, outputData);
