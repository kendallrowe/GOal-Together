import React from "react";
import Button from "../button/Button";

export default function Type(props) {
  return (
    <div>
      <Button 
        back={true}
        smallCircle={true}
        onClick={props.clickBack}
      />
      <label htmlFor="type"><h2>Enter the type of commitment:</h2></label>
      <select>
        <option value="fitness">Fitness</option>
        <option value="academic">Academic</option>
        <option value="reading">Reading</option>
        <option value="social">Social</option>
        <option value="other">Other</option>
      </select>
      <Button
        next={true}
        smallCircle={true}
        onClick={props.clickNext}
      />
    </div>
  );
};