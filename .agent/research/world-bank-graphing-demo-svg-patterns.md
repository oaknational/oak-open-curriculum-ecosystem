# World Bank Graphing Demo: SVG Patterns and Visual Design Analysis

> **Purpose**: Deep dive analysis of the `reference/world-bank-graphing-demo` project, focusing on SVG-related logic, presentation layer patterns, positioning, highlighting, tooltips, and UI/UX techniques.

## Project Overview

The World Bank Graphing Demo is a D3.js v3-based bubble chart visualisation displaying economic indicators (GDP, population, life expectancy, etc.) for world regions over time. It demonstrates mature patterns for interactive SVG data visualisation.

**Key Technologies**:

- D3.js v3.4.13
- Browserify for module bundling
- Lodash utilities (throttle, assign, clone, isNaN, compact)
- Q promises for async data loading
- Superagent for HTTP requests

## Architecture: Separation of Concerns

The project uses a clean **Model-View-Controller-like** architecture with **prototype mixins**:

```
chart-types/
  └── worldBankIndicators/
      ├── model/index.js      # Data processing and transformation
      ├── controls/index.js   # UI controls and event handling
      └── chart/
          ├── index.js        # Chart orchestration (main prototype)
          ├── config.js       # Static configuration
          ├── viewModel.js    # Data derivation and accessors
          ├── scales.js       # D3 scale functions
          ├── axes.js         # Axis rendering and labelling
          ├── dataPoints.js   # Data point rendering and interactions
          ├── tooltip.js      # Tooltip positioning and content
          ├── legend.js       # Legend rendering and interactions
          └── helpers.js      # Formatting utilities
```

**Pattern**: Each module exports methods that are **mixed into the main prototype** using `lodash.assign`, creating a composable chart object:

```javascript
_assign(WorldBankIndicatorChartPrototype, viewModel);
_assign(WorldBankIndicatorChartPrototype, scales);
_assign(WorldBankIndicatorChartPrototype, legend);
_assign(WorldBankIndicatorChartPrototype, axes);
_assign(WorldBankIndicatorChartPrototype, dataPoints);
_assign(WorldBankIndicatorChartPrototype, tooltip);
```

---

## SVG Structure and DOM Organisation

### SVG Element Hierarchy

The chart creates a layered SVG structure with semantic grouping:

```javascript
// From chart/index.js init()
d3Objects.axes = {};
d3Objects.axes.x = d3Svg.append('g').classed('axis x-axis', true);
d3Objects.axes.y = d3Svg.append('g').classed('axis y-axis', true);
d3Objects.legend = d3Svg.append('g').classed('legend', true);
d3Objects.chartArea = d3Svg.append('g').classed('chart__area', true);
d3Objects.tooltip = d3Objects.chartArea.append('g').classed('tooltip', true);
```

**Key insight**: The tooltip is a **child of the chart area**, not a separate overlay. This means:

1. It uses the same coordinate system as data points
2. It can be positioned relative to data points easily
3. It respects the chart area's transform

### CSS Classes for Semantic Styling

```
.chart--world-bank-indicators  # Chart-type modifier class
.axis, .x-axis, .y-axis        # Axis groups
.legend                         # Legend container
.legend__item                   # Individual legend items
.chart__area                    # Main plot area
.data-point                     # Data point groups
.tooltip                        # Tooltip container
.highlight                      # Highlighting state class
.label                          # Axis labels
```

---

## Positioning Patterns

### 1. Padding and Margins

The chart uses an explicit **padding object** to manage chart area margins:

```javascript
// From chart/index.js setAreaChartPadding()
chart.padding = {
  top: 50,
  right: 30,
  bottom: 50,
  yAxis: 65, // Special padding for y-axis labels
};

chart.padding.left = chart.padding.yAxis + 20;

// Adjust for legend position
if (legendAboveChart) {
  chart.padding.top = chart.padding.top + legendHeight;
} else {
  chart.padding.top = chart.padding.top - 30;
  chart.padding.bottom = chart.padding.bottom + legendHeight + 20;
}
```

**Key insight**: Padding is **dynamic** based on computed legend dimensions from `getBoundingClientRect()`.

### 2. Transform-Based Positioning

All positioning uses **SVG transforms** rather than absolute coordinates:

```javascript
// Position x-axis
chart.d3Objects.axes.x.attr(
  'transform',
  'translate(' + chart.padding.left + ', ' + (chart.dimensions.height - chart.padding.bottom) + ')',
);

// Position y-axis
chart.d3Objects.axes.y.attr(
  'transform',
  'translate(' + chart.padding.yAxis + ',' + chart.padding.top + ')',
);

// Position chart area
chart.d3Objects.chartArea.attr(
  'transform',
  'translate(' + chart.padding.left + ', ' + chart.padding.top + ')',
);
```

### 3. Data Point Positioning via Scales

Data points are positioned using D3 linear scales within the chart area coordinate system:

```javascript
// From dataPoints.js updateDataPoints()
updateSelection
  .transition()
  .ease('linear')
  .duration(transitionDuration)
  .attr({
    transform: function (d) {
      return 'translate(' + chart.scales.x(d.x) + ',' + chart.scales.y(d.y) + ')';
    },
  });
```

**Pattern**: Data points are `<g>` elements containing `<circle>` elements. The group is positioned; the circle is sized.

---

## Scale Architecture

### Three Scale Types

```javascript
// From scales.js

// 1. ORDINAL SCALE: Region → Colour
scales.regionColour = d3.scale
  .ordinal()
  .domain(this.data.regions)
  .range(
    config.coloursRange.map(function (colour) {
      return d3.rgb(colour);
    }),
  );

// 2. LINEAR SCALES: Data → Position/Size
['X', 'Y', 'Z'].forEach(function (dimension) {
  scales[dimension.toLowerCase()] = d3.scale
    .linear()
    .domain([extremes['min' + dimension], extremes['max' + dimension]])
    .nice();
});

// X scale maps to horizontal position
scales.x.range([0, chartDimensions.width - padding.left - padding.right]);

// Y scale maps to vertical position (INVERTED for SVG coordinates)
scales.y.range([chartDimensions.height - padding.top - padding.bottom, 0]);

// Z scale maps to circle radius
scales.z.range(this.zRange); // e.g. [10, 30]
```

**Key insight**: The Y scale range is **inverted** (`[height, 0]` not `[0, height]`) because SVG's Y-axis increases downward.

### Scale Domain: Finding Data Extremes

```javascript
// From viewModel.js findDataExtremes()
data.regions.forEach(function (region) {
  data.years.forEach(function (year) {
    ['X', 'Y', 'Z'].forEach(function (dimension) {
      var currentValue = rawData[region][accessors[dimension.toLowerCase()]][year];

      if (_isNaN(currentValue)) return false;

      ['min', 'max'].forEach(function (extreme) {
        if (extremes[extreme + dimension] === undefined) {
          extremes[extreme + dimension] = currentValue;
        } else {
          extremes[extreme + dimension] = Math[extreme](
            extremes[extreme + dimension],
            currentValue,
          );
        }
      });
    });
  });
});
```

**Pattern**: Extremes are computed across ALL years, not just the current year. This prevents scale changes during animation.

---

## Highlighting Patterns

### CSS-Based State Management

Highlighting uses **CSS class toggling** with animation:

```css
/* From chart--world-bank-indicators.css */
.highlight circle,
.highlight rect {
  -webkit-animation: throb 0.6s 1 ease-in-out;
  animation: throb 0.6s 1 ease-in-out;
  opacity: 1;
  stroke-width: 2px;
  stroke: black !important;
}

@keyframes throb {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
```

**Key features**:

1. **Opacity animation** ("throb") draws attention
2. **Increased stroke-width** and black stroke for visibility
3. **Full opacity** (vs default 0.8) to bring element forward visually

### Bidirectional Highlighting (Data Point ↔ Legend)

```javascript
// From dataPoints.js enableDataPointInteractions()

// Data point hover → highlight legend
newDataPoints.on('mouseover', function (d) {
  d3.select(node).classed('highlight', true);
  chart.highlightLegendByRegion(d.region);
});

newDataPoints.on('mouseout', function (d) {
  dataPoint.classed('highlight', false);
  chart.deHighlightLegendByRegion(d.region);
});

// From legend.js
// Legend hover → highlight data point
legendRegions.on('mouseover', function (regionName) {
  legendItem.classed('highlight', true);
  chart.highlightDataPointByRegion(regionName);
});
```

### Bringing Elements to Top (Z-Index in SVG)

SVG has no z-index; elements are rendered in **DOM order**. Solution:

```javascript
// From dataPoints.js
function nodeToTop(node) {
  var parent = node.parentNode;
  parent.appendChild(node); // Removes and re-appends at end
}

// Usage on hover (with IE detection to avoid bugs)
if (!isIe()) {
  nodeToTop(node);
}
```

**Pattern**: Remove the element and append it to the same parent. This moves it to the end of the children list, rendering it on top.

### Data Attribute Selection

Elements are found using **data attributes**:

```javascript
// From dataPoints.js highlightDataPointByRegion()
var dataPoint = this.d3Objects.chartArea.select('[data-region="' + regionName + '"]');
dataPoint.classed('highlight', true);
nodeToTop(dataPoint.node());
```

---

## Tooltip Implementation

### SVG-Based Tooltip (Not HTML Overlay)

The tooltip is an **SVG group** containing text elements:

```javascript
// From tooltip.js showTooltip()

// Build tooltip content with D3 data binding
var updateSelection = tooltip.selectAll('text').data(data);

updateSelection.enter().append('text');

updateSelection.exit().remove();

updateSelection
  .text(function (d) {
    return d;
  })
  .attr({
    y: function (d, i) {
      return 20 * i;
    }, // 20px line height
  });
```

### Quadrant-Aware Positioning

The tooltip positions itself **away from the cursor** based on which quadrant of the chart the data point is in:

```javascript
// From tooltip.js showTooltip()

var xOffsetSign = 1; // Default: right
var yOffsetSign = 1; // Default: down
var textAnchor = 'start';

var plotWidth = chart.dimensions.width - chart.padding.left - chart.padding.right;
var plotHeight = chart.dimensions.height - chart.padding.top - chart.padding.bottom;

// Get current data point position
var translate = d3.transform(dataPoint.attr('transform')).translate;
var xTranslate = translate[0];
var yTranslate = translate[1];

// Right half → flip to left
if (xTranslate >= plotWidth / 2) {
  xOffsetSign = -1;
  textAnchor = 'end';
}

// Bottom half → flip to top
if (yTranslate >= plotHeight / 2) {
  yOffsetSign = -1;
}
```

**Key insight**: Uses `d3.transform()` to **parse the transform attribute** and extract translation values.

### Tooltip Offset Calculation

```javascript
// Position relative to circle
var circleRadius = chart.scales.z(dataObject.z);

// Vertical offset
var yOffset = yTranslate + yOffsetSign * circleRadius * 0.5;
if (yOffsetSign === -1) {
  // Moving up: account for tooltip height
  yOffset =
    yTranslate + yOffsetSign * (tooltip.node().getBoundingClientRect().height - circleRadius);
}

// Horizontal offset: past circle edge plus constant gap
var xOffset = xTranslate + xOffsetSign * (circleRadius + 4);

tooltip.attr('transform', 'translate(' + xOffset + ',' + yOffset + ')');
tooltip.style({ 'text-anchor': textAnchor });
```

### Tooltip Visibility

```javascript
// Show (must set display before measuring)
tooltip.style('display', 'initial');

// Hide
this.d3Objects.tooltip.style('display', 'none');
```

### Pointer Events

Tooltips should not capture mouse events:

```css
.tooltip {
  pointer-events: none;
}
```

---

## Legend Patterns

### Responsive Column Layout

```javascript
// From legend.js numLegendColumns()
exports.numLegendColumns = function () {
  var chart = this;
  if (chart.isAtleastMedium()) {
    return 3;
  } else if (chart.isAtleastNarrow()) {
    return 2;
  }
  return 1;
};
```

### Grid-Based Item Positioning

```javascript
// From legend.js positionLegendItems()
legendItems.attr({
  transform: function (d, index) {
    var column = Math.floor(index / maxItemsInColumn);
    var row = index % maxItemsInColumn;

    var xOffset = groupXoffset * column;
    var yOffset = groupYOffset * row;

    return 'translate(' + xOffset + ',' + yOffset + ')';
  },
});
```

### Centered Legend Positioning

```javascript
// From legend.js positionLegend()
var xOffset = Math.max(0, chart.dimensions.width / 2 - chart.legendWidth / 2);
var yOffset = chart.legendAboveChart() ? 0 : chart.dimensions.height - legendHeight;

chart.d3Objects.legend.attr({
  transform: 'translate(' + xOffset + ',' + yOffset + ')',
});
```

### Legend Item Structure

```javascript
// From legend.js populateLegend()
legendRegions
  .append('rect')
  .attr({ height: rectHeight })
  .style({
    fill: function (d) {
      return chart.scales.regionColour(d);
    },
  });

legendRegions
  .append('text')
  .text(function (d) {
    return /[^\()]*/.exec(d)[0];
  }) // Truncate at (
  .attr({ x: 5, y: rectHeight / 1.25 });

legendRegions
  .append('title') // Full text on hover
  .text(function (d) {
    return d;
  });
```

---

## Colour Design

### Colour Palette Source

From [ColorBrewer](http://colorbrewer2.org/) - a tool for cartographic colour palettes:

```javascript
// From config.js
coloursRange: [
  'rgb(166,206,227)', // Light blue
  'rgb(31,120,180)', // Blue
  'rgb(178,223,138)', // Light green
  'rgb(51,160,44)', // Green
  'rgb(251,154,153)', // Light red
  'rgb(227,26,28)', // Red
  'rgb(253,191,111)', // Light orange
  'rgb(255,127,0)', // Orange
  'rgb(202,178,214)', // Light purple
];
```

**9 colours, high contrast, distinguishable for colour blindness considerations.**

### Darker Stroke for Depth

```javascript
// From dataPoints.js
.append('circle')
    .style({
        fill: function(d) {
            return chart.scales.regionColour(d.region);
        },
        stroke: function(d) {
            return chart.scales.regionColour(d.region).darker();
        }
    });
```

**Pattern**: D3's `.darker()` method creates depth/contrast.

---

## Responsive Design Patterns

### Breakpoint Hinting (CSS → JS Communication)

```javascript
// From chart/index.js
function getbreakpointWidth() {
  var breakpointHintEl = document.getElementById('breakpointHint');

  if (!breakpointHintEl) {
    breakpointHintEl = document.createElement('div');
    breakpointHintEl.id = 'breakpointHint';
    document.body.appendChild(breakpointHintEl);
  }

  return window.getComputedStyle(breakpointHintEl).width;
}
```

```css
/* From chart.css */
#breakpointHint {
  display: none;
}

@media (min-width: 400px) {
  #breakpointHint {
    width: 400px;
  }
}
@media (min-width: 520px) {
  #breakpointHint {
    width: 520px;
  }
}
@media (min-width: 768px) {
  #breakpointHint {
    width: 768px;
  }
}
@media (min-width: 1024px) {
  #breakpointHint {
    width: 1024px;
  }
}
```

**Pattern**: A hidden element's width is set by CSS media queries, then read by JavaScript. This keeps breakpoint definitions in CSS.

### Breakpoint-Aware Methods

```javascript
WorldBankIndicatorChartPrototype.isAtleastNarrow = function () {
  return parseInt(this.breakpointWidth) >= this.config.breakPoints.narrow;
};

WorldBankIndicatorChartPrototype.isAtleastMedium = function () {
  return parseInt(this.breakpointWidth) >= this.config.breakPoints.medium;
};

WorldBankIndicatorChartPrototype.isAtleastWide = function () {
  return parseInt(this.breakpointWidth) >= this.config.breakPoints.wide;
};
```

### Throttled Resize Handler

```javascript
// From client/index.js
function addResizeListener(component) {
  var throttleLimit = 100; // Max once per 100ms
  var onResize = component.onResize.bind(component);
  window.addEventListener(
    'resize',
    throttle(onResize, throttleLimit, {
      trailing: true,
    }),
  );
}
```

### Resize Update Cycle

```javascript
// From chart/index.js onResize()
Chart.prototype.onResize = function () {
  if (this.recordDimensions()) {
    // Only if dimensions changed
    this.recordBaseFontsize();
    this.recordbreakpointWidth();

    if (this.config.hasLegend) {
      this.resetLegendDimensions();
      this.positionLegend();
    }

    this.setAreaChartPadding();
    this.positionChartElements();
    this.calculateScales();
    this.drawAxes();
    this.positionAxesLabels();
    this.rescaleDataPoints();
  }
};
```

---

## Animation Patterns

### D3 Transitions

```javascript
// From dataPoints.js
updateSelection
  .transition()
  .ease('linear')
  .duration(transitionDuration) // 333ms from config
  .attr({
    transform: function (d) {
      /* ... */
    },
  });

updateSelection
  .select('circle')
  .transition()
  .ease('linear')
  .duration(transitionDuration)
  .attr({
    r: function (d) {
      return chart.scales.z(d.z);
    },
  });
```

### Time-Based Playback

```javascript
// From worldBankIndicators/controls/index.js playYears()
WorldBankIndicatorControlsPrototype.playYears = function (endYear) {
  var controls = this;
  var transitionDuration = controls.transitionDuration;
  var timeoutId;

  if (controls.playing) return; // Idempotent
  controls.playing = true;

  controls.d3Objects.stop.on('click', stop);
  timeoutId = setTimeout(progressYears, transitionDuration);

  function progressYears() {
    var nextYear = parseInt(controls.accessors.year) + 1;
    if (nextYear <= endYear) {
      controls.setYear(nextYear);
      timeoutId = setTimeout(progressYears, transitionDuration);
    } else {
      controls.playing = false;
    }
  }

  function stop() {
    clearTimeout(timeoutId);
    controls.playing = false;
  }
};
```

---

## Axes and Labels

### Axis Creation

```javascript
// From axes.js drawAxes()
var xAxisFactory = d3.svg.axis();
var yAxisFactory = d3.svg.axis();

// Responsive tick count
var numTicks = chart.isAtleastMedium() ? 9 : 3;
xAxisFactory.ticks(numTicks);

xAxisFactory.scale(chart.scales.x);
xAxisFactory.tickFormat(formatValuesFactory(xSymbol));

yAxisFactory.scale(chart.scales.y);
yAxisFactory.tickFormat(formatValuesFactory(ySymbol));
yAxisFactory.orient('left');

chart.d3Objects.axes.x.call(xAxisFactory);
chart.d3Objects.axes.y.call(yAxisFactory);
```

### Value Formatting

```javascript
// From helpers.js formatValuesFactory()
exports.formatValuesFactory = function (symbol) {
  return function (d) {
    switch (symbol) {
      case '%':
        return d3.format(',f')(d) + symbol;
      case '$':
      case '£':
        return symbol + d3.format(',.2s')(d);
      default:
        return d3.format(',.2s')(d);
    }
  };
};
```

### Axis Label Positioning

```javascript
// From axes.js positionAxesLabels()

// X-axis label: centered below axis
chart.d3Objects.axes.x
  .select('.label')
  .attr({
    transform:
      'translate(' +
      (chart.dimensions.width - chart.padding.left - chart.padding.right) / 2 +
      ', 45)',
  })
  .style({ 'text-anchor': 'middle' });

// Y-axis label: centered, rotated -90°
// After rotation, first translate coord is effectively Y, second is X
chart.d3Objects.axes.y
  .select('.label')
  .attr({
    transform:
      'rotate(-90) translate(' +
      -(chart.dimensions.height - chart.padding.top - chart.padding.bottom) / 2 +
      ', -50)',
  })
  .style({ 'text-anchor': 'middle' });
```

**Key insight**: After `rotate(-90)`, the coordinate system is rotated, so translations behave differently.

### Truncated Labels with Titles

```javascript
// From axes.js labelAxes()
var labelString = accessor.length > 40 ? data.indicators[accessor].descriptor : accessor;

d3TextEl.text(labelString); // Visible (possibly truncated)
d3TitleEl.text(accessor); // Full text on hover (via <title>)
```

---

## Data Enter-Update-Exit Pattern

### Classic D3 Pattern

```javascript
// From dataPoints.js updateDataPoints()

// UPDATE selection (existing elements)
var updateSelection = chartArea.selectAll('g.data-point').data(chart.data.derived, function (d) {
  return d.region;
}); // Key function

// EXIT selection (removed data)
updateSelection.exit().remove();

// ENTER selection (new data)
updateSelection
  .enter()
  .append('g')
  .classed('data-point', true)
  .attr('data-region', function (d) {
    return d.region;
  })
  .append('circle')
  .style({
    fill: function (d) {
      return chart.scales.regionColour(d.region);
    },
    stroke: function (d) {
      return chart.scales.regionColour(d.region).darker();
    },
  });

// UPDATE all (enter + existing)
updateSelection.transition();
// ... position updates
```

**Key function** (`function(d) { return d.region; }`) ensures D3 tracks elements by region name, not array index.

---

## Key Patterns Summary

| Category         | Pattern            | Implementation                                     |
| ---------------- | ------------------ | -------------------------------------------------- |
| **Positioning**  | Transform-based    | All positioning via SVG `transform` attribute      |
| **Layering**     | DOM order          | `nodeToTop()` re-appends elements to bring forward |
| **Highlighting** | CSS class toggle   | `.classed('highlight', true/false)`                |
| **Tooltips**     | Quadrant-aware     | Position based on data point location in plot      |
| **Responsive**   | Breakpoint hints   | Hidden CSS-sized element read by JS                |
| **Animation**    | D3 transitions     | `.transition().duration(ms).attr()`                |
| **Scales**       | Domain from data   | Extremes computed across all time periods          |
| **Colours**      | Ordinal + darker() | Colour palette + automatic stroke contrast         |
| **State**        | EventEmitter       | Controls emit events, chart subscribes             |

---

## Applicability to Oak Open Curriculum Widget Renderers

These patterns could inform the knowledge graph and other widget SVG renderers:

1. **Transform-based positioning** for nodes and edges
2. **CSS class-based highlighting** for interactive states
3. **Quadrant-aware tooltip positioning** for info panels
4. **Ordinal colour scales** for node categories
5. **Enter-update-exit** pattern for dynamic data updates
6. **Breakpoint hints** for responsive widget sizing
7. **nodeToTop()** pattern for bringing selected elements forward
8. **Group + element** structure (group for position, child for styling)

---

_Generated: 2025-12-04_
