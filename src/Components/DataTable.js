import React from "react";

const DataTable = ({ location }) => {
  console.log("DataTable props:", location);

  if (!location || !location.state) {
    return <p>No data available</p>;
  }

  const { state = {} } = location;
  const { data = [], fields = [] } = state;

  if (!Array.isArray(data) || !data.length || !fields.length) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <h2>Data Table</h2>
      <table>
        <thead>
          <tr>
            {fields.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {fields.map((field, colIndex) => (
                <td key={colIndex}>{row[field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
