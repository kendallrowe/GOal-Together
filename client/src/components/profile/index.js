import React, { useState } from "react";
import classes from "./Styles.module.scss";
import "./Styles.module.scss";
import {useVisualMode } from "../../hooks/useVisualMode";
import Donut from "../charts/Donut";


export default function Profile(props) {
  const { mode, transition, back } = useVisualMode("FIRST");

  const [type, setType] = useState(props.type || "");
  
  return (
    <section className={classes.profileSection}>
      <div className={classes.useStatusContainer}>

      </div>
      <div className={classes.chartContainer}>
        <Donut data={props.state.attendance}/>
      </div>
    </section>
  );
};