# Stacked Bar Charts - an AngularJS directive

This is a dead simple directive that implements a basic AngularJS directive for stacked bar charts. It was made taking into account a **very specific environment**:
* Angular 1.3.x
* Globally available d3 object

## Install

For now, I'd suggest to use **npm** and [napa](https://github.com/shama/napa) to install the module.

## Usage

Just add `<stacked-bars data="{{controller.data}}" options="{{controller.options}}"></stacked-bars>`

## Directive Options

### Options

An hash of params to setup  the chart behaviour:

* **width** (int): the width of the `svg` element;
* **height** (int): the height of the `svg` element;
* **margin[Left|Right|Top|Bottom]** (int): sets the margin of the chart relatively to the `svg` element;
* **visibleXX** (boolean): sets the visibility of the XX axis;
* **visibleYY** (boolean): sets the visibility of the YY axis;
* **stacksColor** (array): an array of colors for each stack in the chart;
* **stacks** (array): an array of values to build the stacks;
* **xx** (string): a string defining which values should be used in XX axis;

E.g.:

```
$scope.options = {
  visibleYY: false,
  stacksColor: ['orange', 'yellow'],
  xx: 'x',
  stacks: ['y', 'z']
}
```

### Data

An array of data structures. E.g.:

```
(...)
$scope.data = [
  {x: 'Foo', y: 5, z: 8},
  {x: 'Bar', y: 7, z: 3}
];
(...)
```

## Example

**Controller**
```
angular.module( "app" )
  .controller( "ChartController" ["$scope", function( $scope ) {
    $scope.data = [
      {x: "Foo", y: 5, z: 8},
      {x: "Post B", y: 7, z: 3}
    ];

    $scope.options = {
      visibleYY: false,
      stacksColor: ["orange", "yellow"],
      xx: "x",
      stacks: ["y", "z"]
    };
  }]);
```

**Template**
```
<stacked-bars
  data="{{data}}"
  options="{{options}}">
</stacked-bars>
```

## TODO

* Tidy up the code and add tests;
* Make this a proper package;
* Accept CSS classes to style bars, axis and other relevant elements;
* ...

## License
WTFPL
