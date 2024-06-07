import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import FuzzySelect from './FuzzySelect';
import './Plot.css';

function HistogramFilter({ data, position='left'}) {
    const [inputColumn, setInputColumn] = useState('');
    const [outputColumn, setOutputColumn] = useState('');
    const [rangeMin, setRangeMin] = useState(0);
    const [rangeMax, setRangeMax] = useState(100000);
    const [numBins, setNumBins] = useState(10); // Default bucket size

    // Extract column names for the dropdowns
    const columnNames = data.length > 0 ? Object.keys(data[0]).map(key => ({ label: key, value: key })) : [];

    const inputColumnNames = columnNames.filter(column => column.value.includes('(input)'));
    const outputColumnNames = columnNames.filter(column => column.value.includes('(output)'));

    // have keybindings be in the left hand if position is left, or right hand if position is right
    const keyBindings = {
        input: { key: position === 'left' ? 'd' : 'j', ref: useRef(null) },
        output: { key: position === 'left' ? 'f' : 'k', ref: useRef(null) },
        min: { key: position === 'left' ? 's' : 'h', ref: useRef(null) },
        max: { key: position === 'left' ? 'g' : 'l', ref: useRef(null) },
        bins: { key: position === 'left' ? 'c' : 'n', ref: useRef(null) }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.altKey) {
                Object.values(keyBindings).forEach(binding => {
                    if (event.key === binding.key) {
                        event.preventDefault();
                        binding.ref.current.focus();
                    }
                });
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [keyBindings]); // Include position in dependencies to re-run when/if keyBindings changes

    // Filter data based on output column range
    const filteredData = data.filter(row => 
        row[outputColumn] >= Number(rangeMin) && row[outputColumn] <= Number(rangeMax)
    );

    const maxNumBins = filteredData.length > 0 ? filteredData.length : 1;
    // Data for histogram
    const histogramData = [
        {
            x: filteredData.map(row => row[inputColumn]),
            type: 'histogram',
            nbinsx: numBins, // Control number of bins dynamically
        }
    ];

    return (
        <div className="data-plotter-container"> 
            <div className="plot-controls-container">  
                <div className="controls-row">
                    <div className="control-column">
                        <label> Input Column: </label>
                        <FuzzySelect
                            // id="x-select-input"
                            ref={keyBindings.input.ref}
                            options={inputColumnNames} // for the input column, only show input columns
                            onChange={option => setInputColumn(option.value)}
                            placeholder={`alt-${keyBindings.input.key.toUpperCase()} to focus...`}
                        />
                    </div>
                    <div className="control-column">
                        <label> Output Column: </label>
                        <FuzzySelect
                            // id="x-select-input"
                            ref={keyBindings.output.ref}
                            options={outputColumnNames} // for the output column, only show input columns
                            onChange={option => setOutputColumn(option.value)}
                            placeholder={`alt-${keyBindings.output.key.toUpperCase()} to focus...`}
                        />
                    </div>
                </div>
                <div className="controls-row">
                    <div className="control-column">
                        <label> 
                            Output Range Min:
                            <input type="number" value={rangeMin} onChange={e => setRangeMin(e.target.value)} ref={keyBindings.min.ref} /> 
                        </label> 
                    </div>
                    <div className="control-column">
                        <label> 
                            Output Range Max:
                            <input type="number" value={rangeMax} onChange={e => setRangeMax(e.target.value)} ref={keyBindings.max.ref} /> 
                        </label> 
                    </div>
                    <div className="control-column">
                        <label> 
                            # of bins: 
                            <input 
                                type="range" 
                                min="1" 
                                max={maxNumBins} // Dynamically set the maximum value for the bucket size 
                                value={numBins} 
                                onChange={e => setNumBins(Number(e.target.value))} 
                                ref={keyBindings.bins.ref}
                            /> 
                            {numBins} 
                        </label> 
                    </div>
                </div>
            </div>
            <div className="plot-display-container">
                <Plot
                    data={histogramData}
                    layout={{ title: `Histogram of ${inputColumn}<br>filtered by ${outputColumn} between ${rangeMin} and ${rangeMax}`}}
                />
            </div>
        </div>
    );
}

export default HistogramFilter;
