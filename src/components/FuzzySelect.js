import React, { useState, useEffect, forwardRef } from 'react';
import Select from 'react-select';
import Fuse from 'fuse.js';

// placeholder is one word, thus the lack of camelCase...
const FuzzySelect = forwardRef(({ options, onChange, placeholder="Search..."}, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  // Options for Fuse.js
  const fuseOptions = {
    keys: ['label'], // Adjust this if your options format is different
  };

  useEffect(() => {
    const fuse = new Fuse(options, fuseOptions);

    if (inputValue) {
      const matches = fuse.search(inputValue).map(element => element.item);
      // const matches = results.map(result => result.item);
      setFilteredOptions(matches);
    } else {
      setFilteredOptions(options);
    }
  }, [inputValue, options]);

  return (
    <Select
      ref={ref} // Attach the forwarded ref to Select
      options={filteredOptions}
      onInputChange={setInputValue}
      onChange={onChange}
      placeholder={placeholder} 
    />
  );
});

export default FuzzySelect;
