import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import data from './dataset-full.json';
import DataPlotter from './components/DataPlotter';
import HistogramFilter from './components/HistogramFilter';
import FuzzySelect from './components/FuzzySelect';

function App() {
    const [transformedData, setTransformedData] = useState([]);
    // State variables for selecting the component type
    const [componentType1, setComponentType1] = useState('DataPlotter');
    const [componentType2, setComponentType2] = useState('HistogramFilter');

    // Refs for the FuzzySelect components
    const leftFuzzySelectRef = useRef(null);
    const rightFuzzySelectRef = useRef(null);

    useEffect(() => {
        // put the data transformation logic in a useEffect() so it only runs once
        const transformData = () => {
            const out = [];

            for (const [k, v] of Object.entries(data)) {
                const rowDict = {};
                rowDict['id'] = k;

                for (const [inputK, inputV] of Object.entries(v['inputs'])) {
                    rowDict[inputK + ' (input)'] = inputV;
                }

                for (const [outputK, outputV] of Object.entries(v['outputs'])) {
                    rowDict[outputK + ' (output)'] = outputV;
                }

                out.push(rowDict);
            }

            setTransformedData(out);
        };

        transformData();
    }, []);

    useEffect(() => {
        // TODO: handle these keybindings like how they're handled in DataPlotter and HistogramFilter
        const handleKeyDown = (event) => {
            if (event.altKey) {
                switch (event.key) {
                    case 'e':
                    case 'E':
                        event.preventDefault();
                        leftFuzzySelectRef.current.focus();
                        break;
                    case 'i':
                    case 'I':
                        event.preventDefault();
                        rightFuzzySelectRef.current.focus();
                        break;
                    default:
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const renderComponent = (type, data, position = 'left') => {
        switch (type) {
            case 'DataPlotter':
                return <DataPlotter data={data} position={position} />;
            case 'HistogramFilter':
                return <HistogramFilter data={data} position={position} />;
            default:
                return <DataPlotter data={data} />; // Default case
        }
    };

    const componentOptions = [
        { value: 'DataPlotter', label: 'Data Plotter' },
        { value: 'HistogramFilter', label: 'Histogram Filter' }
    ];

    return (
        <div className="App">
            <div className="half-page-plot">
                <label>Visualization Type </label>
                <FuzzySelect
                    options={componentOptions}
                    onChange={e => setComponentType1(e.value)}
                    value={componentType1}
                    ref={leftFuzzySelectRef}
                    placeholder="alt-E to focus..."
                />
                {renderComponent(componentType1, transformedData)}
            </div>
            <br/>
            <div className="half-page-plot">
                <label>Visualization Type</label>
                <FuzzySelect
                    options={componentOptions}
                    onChange={e => setComponentType2(e.value)}
                    value={componentType2}
                    ref={rightFuzzySelectRef}
                    placeholder="alt-I to focus..."
                />
                {renderComponent(componentType2, transformedData, 'right')}
            </div>
        </div>
    );
}

export default App;
