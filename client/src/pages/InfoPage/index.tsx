import React, { useState, useContext, useEffect } from "react";
import { AppGlobalData } from "../../App";
import DisplayPersonalDetails from "../../components/DisplayPersonalDetails";
import TableArea from "../../components/TableArea";

const InfoPage: React.FC = () => {
  const { apiToken, setApiToken, personalDetails } = useContext(AppGlobalData);
  const [loader, setLoader] = useState(true);

  console.log(apiToken, personalDetails);
  let localToken;
  useEffect(() => {
    if (apiToken === "") {
      localToken = window.localStorage.getItem("token");
      if (localToken !== "") {
        setApiToken(localToken ?? "");
      }
    }
  }, [apiToken]);

  return (
    <div>
      <h1>Info Page</h1>

      <DisplayPersonalDetails />
      <hr />
      <TableArea />
    </div>
  );
};

export default InfoPage;
