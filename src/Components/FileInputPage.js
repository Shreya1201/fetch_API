import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin: 20px;
  background: #fafafb;
  height: 100vh;
  padding: 10px;
`;

const Text = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;

const Section = styled.div`
  background: #ffffff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 70%;

  input[type="file"] {
    display: block;
  }

  button {
    cursor: pointer;
    background: white;
    padding: 5px 10px;
  }
`;

const AvailableFields = styled.select`
  width: 15%;
  height: 160px;
  margin-bottom: 10px;
`;

const DisplayedFields = styled.select`
  width: 15%;
  height: 160px;
  margin-bottom: 10px;
`;

const MoveButton = styled.button`
  background-color: white;
  margin: auto;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const FileInputPage = () => {
  const [fields, setFields] = useState([]);
  const [displayedFields, setDisplayedFields] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        let parsedFields;

        if (file.name.endsWith(".csv")) {
          parsedFields = parseCSV(content);
        } else if (file.name.endsWith(".json")) {
          parsedFields = parseJSON(content);
        }

        setFields(parsedFields);
        setAvailableFields(parsedFields);
      };

      reader.readAsText(file);
    }
  };

  const parseCSV = (content) => {
    const lines = content.split("\n");
    const headers = lines[0].split(",");
    return headers;
  };

  const parseJSON = (content) => {
    try {
      const data = JSON.parse(content);

      if (data && data.products) {
        const productKeys = Object.keys(data.products);

        if (productKeys.length > 0) {
          const firstProduct = data.products[productKeys[0]];
          return Object.keys(firstProduct);
        }
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    return [];
  };

  const handleFieldClick = (field) => {
    const newDisplayedFields = [...displayedFields];

    if (!newDisplayedFields.includes(field)) {
      newDisplayedFields.push(field);
      setDisplayedFields(newDisplayedFields);
    } else {
      setDisplayedFields(newDisplayedFields.filter((f) => f !== field));
    }
  };

  const moveFields = (direction) => {
    const newAvailableFields = [...availableFields];
    const newDisplayedFields = [...displayedFields];

    if (direction === "add") {
      setDisplayedFields([...newDisplayedFields, ...newAvailableFields]);
    } else if (direction === "remove") {
      setDisplayedFields(
        newDisplayedFields.filter(
          (field) => !newAvailableFields.includes(field)
        )
      );
    }

    setAvailableFields([]);
  };

  return (
    <Container>
      <Text>File Input Page</Text>
      <Section>
        <div>
          <p>Select File:</p>
          <input type="file" accept=".csv, .json" onChange={handleFileChange} />
          <p>Supported File Type(s): .CSV, .JSON</p>
        </div>
      </Section>
      <Section>
        <p>Fields:</p>
        {fields.length > 0 ? (
          <div>
            <Field>
              <AvailableFields multiple>
                {availableFields.map((field, index) => (
                  <option key={index} onClick={() => handleFieldClick(field)}>
                    {field}
                  </option>
                ))}
              </AvailableFields>
              <MoveButton onClick={() => moveFields("add")}>
                &gt;&gt;
              </MoveButton>
              <DisplayedFields multiple>
                {displayedFields.map((field, index) => (
                  <option key={index}>{field}</option>
                ))}
              </DisplayedFields>
              <MoveButton onClick={() => moveFields("remove")}>
                &lt;&lt;
              </MoveButton>
            </Field>
          </div>
        ) : (
          <p>No fields to display</p>
        )}
      </Section>
    </Container>
  );
};

export default FileInputPage;
