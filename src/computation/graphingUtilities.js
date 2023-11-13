import * as d3 from 'd3';
import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as time from 'd3-time';
import * as format from 'd3-time-format';
import * as d3Array from 'd3-array';
import * as axis from 'd3-axis';
import * as selection from 'd3-selection';

const bigD = {
  time,
  format,
  scale,
  shape,
  axis,
  selection
};

//We need a way to create scales for both time base axes and linear(numeric) axes

/**
 * Create an x-scale.
 * @param {number} start Start time in seconds.
 * @param {number} end End time in seconds.
 * @param {number} width Width to create the scale with.
 * @return {Function} D3 scale instance.
 */
export const createTimeScale = (start, end, width) => {
return bigD.scale.scaleTime()
    .domain([new Date(start), new Date(end)])
    .range([20, width]);
};

//Note: We require 2 separate functions because of the differences in rendering on the X versus Y axes

/**
 * Create a y-scale.
 * @param {number} minY Minimum y value to use in our domain.
 * @param {number} maxY Maximum y value to use in our domain.
 * @param {number} height Height for our scale's range.
 * @return {Function} D3 scale instance.
 */
export const createLinearXScale = (minX, maxX, width) => {
return bigD.scale.scaleLinear()
    .domain([minX, maxX]).nice()
    .range([20, width-10]);
};

/**
 * Create a y-scale.
 * @param {number} minY Minimum y value to use in our domain.
 * @param {number} maxY Maximum y value to use in our domain.
 * @param {number} height Height for our scale's range.
 * @return {Function} D3 scale instance.
 */
export const createLinearYScale = (minY, maxY, height) => {
return bigD.scale.scaleLinear()
    .domain([minY, maxY]).nice()
    // We invert our range so it outputs using the axis that React uses.
    .range([height-30, 5]);
};


/**
 * For creating the scales in the X and Y dimensions
 * @param {Object} This is the graph data from witch to determine domain and range for scales
 * @param {number} The width of the canvas for the garph
 * @param {number} The height of the canvas for the graph
 */
export const getScales = (data, width, height) => {

    /////Since X axis values are always pre sorted 
    //we can just get first and last values

    //Get first item in array
    const firstDatum = data[0];
    console.log('firstDatum: ', firstDatum.x);

    // Get last item in the array.
    console.log('Data length: ', data.length );
    console.log('Last Datum Object: ', data[data.length-1]);
    const lastDatum = data[data.length-1];
    console.log('Inside Graph Last Datum: ', lastDatum.x);

    // Create our x-scale base is on whether or not its time or linear in nature
    var scaleXFunc = '';
    if(typeof firstDatum.x === 'number') {
         scaleXFunc = createLinearXScale (
            firstDatum.x,
            lastDatum.x,
            width
        );
    } else {
         scaleXFunc = createTimeScale (
            firstDatum.x.getTime(),
            lastDatum.x.getTime(),
            width
        );
    }
  
    const scaleX = scaleXFunc;

    // Y values are not pre sorted so we find the extents in the data
    console.log('The DATA: ', data);
    const allYValues = data.reduce((all, datum) => {
        all.push(datum.y);
        return all;
    }, []);


    // Get the min and max y value.
    const extentY = d3Array.extent(allYValues);

    // Create our y-scale.
    console.log('Y min: ', extentY[0]);
    console.log('Y max: ', extentY[1]);

    const scaleY = createLinearYScale(extentY[0], extentY[1], height);
    console.log('What is scale X: ', scaleX);
    console.log('What is scale Y: ', scaleY);
    return { scaleX, scaleY };
};

//                          (vertical, xyOffset, width, ticks, scale, this.state.TICKSIZE);
//For building Axes ticks
export const getTickPoints = (vertical, xyOffset, width, height, numTicks, scale, tickSize) => {
    let res = [];
    console.log('numTicks: ', numTicks);
    var tickArr = scale.ticks(numTicks);
    console.log('The Tick Array: ', tickArr);
    var idx = 0;
    if (vertical) {
        idx = numTicks;
        console.log('The Y height value: ', height);
        var ticksEvery = Math.floor(height / (numTicks - 1));
        for (let cur = xyOffset; cur <= height; cur += ticksEvery) {
        console.log('Current Y value: ', cur);
        let d = simplelineGenerator(10, cur-15, tickSize + 10, cur-15);
        console.log('Push: Y: ', cur);
        res.push({path: d, x: 0, y: cur-xyOffset, tickText: tickArr[idx--]});
        }
    } else {
        idx = 0;
        var ticksEvery = Math.floor(width / (numTicks - 1));        
        for (let cur = xyOffset; cur <= width; cur += ticksEvery) {
        let d = simplelineGenerator(cur, height-xyOffset, cur, height - xyOffset + tickSize);
        console.log('Push X: ', cur);
        //var d = new Date(tickArr[idx++]);
        //var t_millis = d.getTime();
        res.push({path: d, x: cur, y: height-xyOffset, tickText: tickArr[idx++]});
        }
    }
    return res;
};

//For drawing the lines of the X and Y Axes
export const simplelineGenerator = (startX, startY, endX, endY) => {
    console.log('x: ', startX);
    d = `M ${startX} ${startY} L ${endX} ${endY}`;
    console.log('Tick D Path: ', d);
    return d;
};

//ptArr is the peakTrough Array
export const buildPeakTroughBars = (ptArr, scaleX, scaleY) => {
  //Need to build an array of simple line d paths to pass into the PeakTroughMarker component
  dpArr = [];
  ptArr.peaks.map((ele) => {
    dpArr.push(simplelineGenerator(scaleX(ele), 2, scaleX(ele), 450));
  });
  return dpArr;
};

/*
    if (!scale) {
      scale = typeof startVal === 'number' ? d3scale.scaleLinear() : d3scale.scaleTime()
      scale.domain(vertical ? [y, endY] : [x, endX]).range([startVal, endVal])
}
*/

export const lineGenerator = (xScale, yScale) => {
    // Use the d3-shape line generator to create the `d={}` attribute value.
    const gen = bigD.shape.line()
    // For every x and y-point in our line shape we are given an item from our
    // array which we pass through our scale function so we map the domain value
    // to the range value.
    .x((d) => { var val = typeof d.x === 'number' ? d.x : d.x.getTime();
                console.log('lineGenerator Value X: ', xScale(val));
                return xScale(val);
            })
    .y((d) => { console.log('linGenerator Value Y: ', yScale(d.y));
                return yScale(d.y);
            });

    return gen;
};

export const findPeaksTroughs = (data) => {
    var start = 2;                        // Starting index to search
    var end = data.length - 2;           // Last index to search
    var obj = { peaks: [], troughs: [] };// Object to store the indexs of peaks/thoughs
    
    for(var i = start; i<=end; i++)
    {
        var current = data[i].y;
        var last = data[i-1].y;
        var lastlast = data[i-2].y;
        var next = data[i+1].y;
        var nextnext = data[i+2];
        console.log('Inside findPeaksTroughs: ', current, last, next);
        if(current > next && current > last) {
            console.log('Push next peak index: ', i);
            obj.peaks.push(data[i].x);
        }
        else if(current < next && current < last) {
            console.log('Push next peak index: ', i);        
            obj.troughs.push(data[i].x);
        }
    }
    return obj;
};