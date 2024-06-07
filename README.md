# Quickstart

To install dependencies and run the webapp locally, run
`npm install && npm start`

The interface is designed to be self-explanatory and keyboard-driven. Two data visualization components are rendered on the screen at a time, one on the left hand side and one on the right. The keybindings for modifying these components are designed to be symmetrical. The left hand is used to control the left component, the right hand is used to control the right component.

Currently, there are two component options, DataPlotter and HistogramFilter. DataPlotter allows the user to select two input or output variables to plot on a scatterplot. HistogramFilter allows the user to select an input column, an output column, and a range of output values. The HistogramFilter then displays a histogram of input values that were used to generate an output in the specified range.
