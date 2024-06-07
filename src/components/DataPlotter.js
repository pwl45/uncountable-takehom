import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import FuzzySelect from './FuzzySelect';
import './Plot.css';

function DataPlotter({ data, position='left'}) {
    const [selectedX, setSelectedX] = useState('');
    const [selectedY, setSelectedY] = useState('');

    // set inputKey to 'd' and outputKey to 'd' if the position is 'left', otherwise set inputKey to 'j' and outputKey to 'k'
    const keyBindings = {
        input: { key: position === 'left' ? 'd' : 'j', ref: useRef(null) },
        output: { key: position === 'left' ? 'f' : 'k', ref: useRef(null) }
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
    }, [keyBindings]); // Include position in dependencies to handle updates

    const columnNames = data.length > 0 ? Object.keys(data[0]).map(key => ({ label: key, value: key })) : [];

    // Prepare data for plotting
    const plotData = [
        {
            x: data.map(row => row[selectedX]),
            y: data.map(row => row[selectedY]),
            type: 'scatter',
            mode: 'markers',
        }
    ];

    // Update layout to include dynamic axis titles
    const layout = {
        title: `${selectedY} vs. ${selectedX}`,
        xaxis: {
            title: selectedX
        },
        yaxis: {
            title: selectedY
        },
    };

    return (
        <div className="data-plotter-container"> 
            <div className="plot-controls-container">  
                <div className="controls-row">
                    <div className="control-column">
                        <label>X-axis:</label>
                        <FuzzySelect
                            id="x-select-input"
                            ref={keyBindings.input.ref}
                            options={columnNames}
                            onChange={option => setSelectedX(option.value)}
                            placeholder={`alt-${keyBindings.input.key.toUpperCase()} to focus...`}
                        />
                    </div>
                    <div className="control-column">
                        <label>Y-axis:</label>
                        <FuzzySelect
                            id="y-select-input"
                            ref={keyBindings.output.ref}
                            options={columnNames}
                            onChange={option => setSelectedY(option.value)}
                            placeholder={`alt-${keyBindings.output.key.toUpperCase()} to focus...`}
                        />
                    </div>
                </div>
            </div>
            <div className="plot-display-container">
                <Plot
                    data={plotData}
                    layout={layout}
                />
            </div>
        </div>
    );
}

export default DataPlotter;
