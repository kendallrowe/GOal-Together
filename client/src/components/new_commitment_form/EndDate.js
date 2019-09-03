import React from "react";
import classes from "./Styles.module.scss";
import Button from "../button/Button";

export default function EndDate(props) {
  return (
    <div className={classes.formRow}>
      <Button 
        back={true}
        smallCircle={true}
        onClick={props.clickBack}
      />
      <label htmlFor="date"><h2>When will your commitment end?</h2></label>
      <input type="date" name="end-date" value={props.endDate} max="2020-12-31" onChange={props.setEndDate}/>
      <Button
        next={true}
        smallCircle={true}
        onClick={props.clickNext}
      />
    </div>
  );
};