import React from "react";
import classes from "./Button.module.scss";
import "./Button.module.scss";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackward, faForward } from '@fortawesome/free-solid-svg-icons'

const classNames = require('classnames');

export default function Button(props) {
  let innerContent = props.innerContent;

  const buttonClass = classNames(
    classes.button,
    props.add ? classes.buttonAdd : "",
    props.submit ? classes.buttonSubmit : "",
    props.next ? classes.buttonNext : "",
    props.back ? classes.buttonBack : "",
    props.wide ? classes.buttonWide : "",
    props.smallCircle ? classes.buttonSmallCircle : ""
  );
  
  innerContent = props.back ? innerContent = <FontAwesomeIcon className={classes.navIcon} icon={faBackward} /> : innerContent;
  innerContent = props.next ? innerContent = <FontAwesomeIcon className={classes.navIcon} icon={faForward} /> : innerContent;
  innerContent = props.submit ? innerContent = "Submit" : innerContent;

  return (
    <button
      className={buttonClass}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.submit ? "submit" : "button"}
      form={props.form ? props.form : ""}
    >
      {innerContent}
    </button>
  );
}