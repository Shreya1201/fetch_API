import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const TableWrapper = styled.div`
  margin: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const StyledTh = styled.th`
  border: 1px solid #ddd;
  padding: 10px; /* Adjusted padding for better spacing */
  text-align: left;
  background-color: #f2f2f2; /* Light gray background for header */
`;

const StyledTd = styled.td`
  border: 1px solid #ddd;
  padding: 10px; /* Adjusted padding for better spacing */
  text-align: left;
`;

const TableComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://s3.amazonaws.com/open-to-cors/assignment.json"
        );
        setData(response.data.products);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderTableHeader = () => {
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    const headers = Object.keys(data[Object.keys(data)[0]]);

    return headers.map((header) => <StyledTh key={header}>{header}</StyledTh>);
  };

  const renderTableData = () => {
    if (!data || Object.keys(data).length === 0) {
      return null;
    }

    const sortedData = Object.values(data).sort(
      (a, b) => parseInt(b.popularity, 10) - parseInt(a.popularity, 10)
    );

    return sortedData.map((product, index) => {
      return (
        <tr key={index}>
          <StyledTd>{product.subcategory}</StyledTd>
          <StyledTd>{product.title}</StyledTd>
          <StyledTd>{product.price}</StyledTd>
          <StyledTd>{product.popularity}</StyledTd>
        </tr>
      );
    });
  };

  return (
    <TableWrapper>
      <h2>Product</h2>
      <StyledTable>
        <thead>
          <tr>{renderTableHeader()}</tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default TableComponent;
