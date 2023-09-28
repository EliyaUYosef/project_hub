import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  Column,
  FilterValue,
} from "react-table";
import { AppGlobalData } from "../App";
type UseTableObject = {
  name: string;
  score: number;
  durationInDays: number;
  bugsCount: number;
  madeDadeline: boolean;
};

const UserDetailsComponent: React.FC = () => {
  const { apiToken } = useContext(AppGlobalData);

  const [scoreAverage, setScoreAverage] = useState(0);
  const [successPercent ,setSuccessPercent] = useState(0);
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading indicator
  const [searchText, setSearchText] = useState(""); // User input for searching

  const columns = React.useMemo<any>(
    () => [
      {
        Header: "Project Name",
        accessor: "name",
      },
      {
        Header: "Score",
        accessor: "score",
        Filter: ScoreFilter,
      },
      {
        Header: "Duration (Days)",
        accessor: "durationInDays",
      },
      {
        Header: "Bugs Count",
        accessor: "bugsCount",
      },
      {
        Header: "Made Deadline",
        accessor: "madeDadeline",
        // Filter: MadeDeadlineFilter,
        // filter: 'equals',
        Cell: ({ value }: { value: boolean }) => (value ? "Yes" : "No"),
      },
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = useTable<UseTableObject>(
    { columns, data, initialState: { globalFilter: "" } },
    useGlobalFilter,
    useSortBy
  );
  useEffect(() => {
    // Define your API endpoint
    const apiUrl = "https://private-052d6-testapi4528.apiary-mock.com/info";

    // Make an HTTP GET request with the token as a Bearer token
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      })
      .then((response) => {
        // Set the fetched data to the state
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false); // Turn off loading indicator
      });
  }, [apiToken]);

  const calculateScoreSum = (filteredRows: any[]) => {
    let sum = 0;
    let counter = 0;
    for (const row of filteredRows) {
      counter++;
      sum += row.values.score;
    }
    return Math.ceil(sum / counter);
  };
  const calculateSuccessPercent = (filteredRows: any[]) => {
    let allCounter = 0;
    let trueCounter = 0;
    for (const row of filteredRows) {
      allCounter++;
      if (row.values.madeDadeline) trueCounter++; // * 100 / allCounter
    }
    return Math.ceil(trueCounter * 100 / allCounter);
  };

  useEffect(() => {
    // Calculate the score sum when data or search text changes
    const filteredRows = rows.filter((row) =>
      row.original.name.toLowerCase().includes(searchText.toLowerCase())
    );
    const successPercentTemp = calculateSuccessPercent(filteredRows);
    const scoreAverageTemp = calculateScoreSum(filteredRows);
    setScoreAverage(scoreAverageTemp);
    setSuccessPercent(successPercentTemp);
  }, [data, searchText, rows]);
  return (
    <div>
      <h2>Table Area</h2>
      <div>
        <div>
          Score Average : {scoreAverage}
        </div>
        <div>successPercent : {successPercent}%</div>
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            setGlobalFilter(e.target.value || undefined);
            setSearchText(e.target.value);
          }}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column: any) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? " 🔽"
                            : " 🔼"
                          : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      if (cell.column.id === "score") {
                        const score = cell.value; // Get the score value for the "Score" cell
                        const cellStyle = {
                          backgroundColor:
                            score < 70 ? "red" : score > 90 ? "green" : "white",
                        };
                        return (
                          <td
                            {...cell.getCellProps()}
                            style={cellStyle}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      } else {
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      }
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ScoreFilter: React.FC<any> = ({ column }) => {
  const { setGlobalFilter } = column;
  return (
    <input
      onChange={(e) => {
        setGlobalFilter(e.target.value || undefined); // Use undefined to clear the filter
      }}
      placeholder={`Filter ${column.id}...`}
    />
  );
};

export default UserDetailsComponent;
