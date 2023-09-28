import React from "react";
import loaderStyles from "./loader.module.css";

class Loader extends React.Component {
  render() {
    return (
      <div className={loaderStyles.loader_background}>
      <div className={loaderStyles.loader_parent}>
        <div className={loaderStyles.custom_loader}></div>
      </div>
      </div>
    );
  }
}

export default Loader;
