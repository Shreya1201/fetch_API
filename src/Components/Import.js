import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ImportMain = styled.div`
  margin: 20px;
  background: #fafafb;
  height: 100vh;
  padding: 10px;
`;

const Text = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  gap: 20px;
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

const Select = styled.select`
  width: 100%;
  padding: 5px;
  margin-top: 5px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;

  input {
    margin-left: 5px;
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

const SectionBig = styled.div`
  margin-top: 20px;
  background: #ffffff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  padding: 20px;
  padding-bottom: 60px;
`;

const Button = styled.div`
  display: flex;
  margin: 20px;
  flex-direction: row-reverse;
  gap: 20px;
`;

const Next = styled.div`
  button {
    cursor: pointer;
    background-color: #71be58;
    color: white;
    border: none;
    padding: 10px 15px;
    transition: background-color 0.3s;
    margin-bottom: 5px;

    &:hover {
      background-color: #417621;
    }
  }
`;

const Cancel = styled.div`
  button {
    cursor: pointer;
    color: red;
    border: none;
    padding: 10px 15px;
    margin-bottom: 5px;
  }
`;

const Arrow2 = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
`;

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const TableContainer = styled.div`
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }
`;

const filterDataByFields = (data, selectedFields) => {
  if (!data || !selectedFields || selectedFields.length === 0) {
    return [];
  }

  return data.map((row) => {
    const newRow = {};
    selectedFields.forEach((field) => {
      newRow[field] = row[field];
    });
    return newRow;
  });
};

const Import = () => {
  const navigate = useNavigate();
  const [fileType, setFileType] = useState("csv");
  const [encoding, setEncoding] = useState("utf8");
  const [delimiter, setDelimiter] = useState("comma");
  const [hasHeader, setHasHeader] = useState(true);

  const [file, setFile] = useState(null);
  const [fields, setFields] = useState([]);
  const [displayedFields, setDisplayedFields] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableFields, setTableFields] = useState([]);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        let parsedFields;

        if (selectedFile.name.endsWith(".csv")) {
          parsedFields = parseCSV(content);
        } else if (selectedFile.name.endsWith(".json")) {
          parsedFields = parseJSON(content);
        }

        setFields(parsedFields);
        setAvailableFields(parsedFields);
      };

      reader.readAsText(selectedFile);
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

      if (Array.isArray(data)) {
        return data;
      } else {
        console.error("JSON file does not contain an array of objects.");
        return [];
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return [];
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dataToSend = {
      displayedFields,
      fileType,
      encoding,
      delimiter,
      hasHeader,
      file: null,
    };

    try {
      const fileContent = await fetchFileContent(file);
      dataToSend.file = fileContent;

      if (!Array.isArray(dataToSend.file)) {
        console.error("File content is not an array.");
        return;
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
    }

    const filteredData = filterDataByFields(
      dataToSend.file,
      dataToSend.displayedFields
    );

    setTableData(filteredData);
    setTableFields(dataToSend.displayedFields);
  };

  const fetchFileContent = async (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const content = e.target.result;
        const fileType = getFileType(file.name);

        if (fileType === "csv") {
          const parsedContent = parseCSV(content);
          resolve(parsedContent);
        } else if (fileType === "json") {
          const parsedContent = parseJSON(content);
          resolve(parsedContent);
        } else {
          reject(new Error("Unsupported file type"));
        }
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsText(file);
    });
  };

  const getFileType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "csv") {
      return "csv";
    } else if (extension === "json") {
      return "json";
    } else {
      return "";
    }
  };

  const filterDataByFields = (data, selectedFields) => {
    if (
      !Array.isArray(data) ||
      !selectedFields ||
      selectedFields.length === 0
    ) {
      return [];
    }

    return data.map((row) => {
      const newRow = {};
      selectedFields.forEach((field) => {
        newRow[field] = row[field];
      });
      return newRow;
    });
  };

  const handleFieldClick = (field) => {
    const isFieldDisplayed = displayedFields.includes(field);

    if (isFieldDisplayed) {
      setDisplayedFields(displayedFields.filter((f) => f !== field));
    } else {
      setDisplayedFields([...displayedFields, field]);
    }
  };

  const moveFields = (direction) => {
    if (direction === "add") {
      setDisplayedFields([...displayedFields, ...availableFields]);
    } else if (direction === "remove") {
      setDisplayedFields(
        displayedFields.filter((field) => !availableFields.includes(field))
      );
    }
  };

  const handleCancel = () => {
    setFile(null);
    setFields([]);
    setDisplayedFields([]);
    setAvailableFields([]);
  };

  return (
    <ImportMain>
      <Text>Import Products</Text>
      <form onSubmit={handleSubmit}>
        <Container>
          <Section>
            <div>
              <p>Step 1: Select File</p>
              <p>Select File:</p>
              <input
                type="file"
                accept=".csv, .json"
                onChange={handleFileChange}
              />
              <p>Supported File Type(s): .CSV, .JSON</p>
            </div>
          </Section>
          <Section>
            <div>
              <p>Step 2: Specific Format</p>
              <Arrow2>
                <label htmlFor="fileType">File Type</label>
                <Select
                  id="fileType"
                  name="fileType"
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </Select>

                <label htmlFor="encoding">Character Encoding</label>
                <Select
                  id="encoding"
                  name="encoding"
                  value={encoding}
                  onChange={(e) => setEncoding(e.target.value)}
                >
                  <option value="utf8">UTF-8</option>
                  <option value="utf16be">UTF-16BE</option>
                  <option value="utf32be">UTF-32BE</option>
                </Select>

                <label htmlFor="delimiter">Delimiter</label>
                <Select
                  id="delimiter"
                  name="delimiter"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                >
                  <option value="comma">comma</option>
                </Select>
              </Arrow2>
              <CheckboxLabel>
                Has Header
                <input
                  type="checkbox"
                  id="hasheader"
                  name="hasheader"
                  checked={hasHeader}
                  onChange={() => setHasHeader((prev) => !prev)}
                />
              </CheckboxLabel>
            </div>
          </Section>
        </Container>
        <SectionBig>
          Step 3: Display Handling<br></br>
          Select the fields to be displayed<br></br>
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
                <MoveButton type="button" onClick={() => moveFields("add")}>
                  &gt;&gt;
                </MoveButton>
                <DisplayedFields multiple>
                  {displayedFields.map((field, index) => (
                    <option key={index}>{field}</option>
                  ))}
                </DisplayedFields>
                <MoveButton type="button" onClick={() => moveFields("remove")}>
                  &lt;&lt;
                </MoveButton>
              </Field>
            </div>
          ) : (
            <p>No fields to display</p>
          )}
        </SectionBig>
        <Button>
          <Cancel>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </Cancel>
          <Next>
            <button type="submit">Next</button>
          </Next>
        </Button>
      </form>
      {tableData.length > 0 && (
        <TableContainer>
          <h2>Selected Data</h2>
          <StyledTable>
            <thead>
              <tr>
                {tableFields.map((field, index) => (
                  <th key={index}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {tableFields.map((field, colIndex) => (
                    <td key={colIndex}>{row[field]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}
    </ImportMain>
  );
};

export default Import;
