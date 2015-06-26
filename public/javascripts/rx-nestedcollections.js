var colors = ['blue', 'red', 'yellow'];

var inputData = Rx.Observable.interval(150).map(function(index) {
  return {
    id: index
  , color: colors[demo.getRandomInt(0, colors.length)]
  , size: demo.getRandomInt(100, 1001)
  // ["circle", "cross", "diamond", "square", "triangle-down", "triangle-up"]
  , type: d3.svg.symbolTypes[demo.getRandomInt(0, d3.svg.symbolTypes.length)]
  };
}).share();

var inputElement = document.getElementById('input');
demo.visualizeObservable(inputElement, inputData)

var outputData = inputData
  // .map(function(x) {
  //   var y = _.clone(x);
  //   y.id = y.id + 80;
  //   y.color = 'green';
  //   var z = _.clone(x);
  //   y.size = y.size / 1.5;
  //   z.size = z.size / 1.5;
  //   y.delay = 75;
  //   return Rx.Observable.fromArray([y, z]);
  // })
  // .mergeAll();
  .flatMap(function(x) {
    var y = _.clone(x);
    y.id = y.id + 80;
    y.color = 'green';

    var z = _.clone(x);
    y.size = y.size / 1.5;
    z.size = z.size / 1.5;

    return [y, z];
  });
console.log(outputData)

var outputElement = document.getElementById('output');
demo.visualizeObservable(outputElement, outputData);
