import React from 'react';
import ReactDOM from 'react-dom';


export default class VehicleProgress extends React.Component {
  constructor(props) {
    super(props);

    this.bgStyle = {
      success : "bg-success",
      warning : "bg-warning",
      danger : "bg-danger"
    };

    this.voltageScope = {
      defaultVal: 0,
      maxVal: 300,
      minVal: 0,
      warningVal: 200,
      dangerVal: 240
    };    
  }

  getVoltagePercentage() {
    var max = this.voltageScope.maxVal;
    var voltage = this.props.vehicle.voltage;
    return voltage > max ? 100 : Math.round(voltage*100/max);
  }

  getVoltageStyle()  {
      return { width: `${this.getVoltagePercentage()}%` };
  }

  getVoltageProgressColor() {
    var voltage = this.props.vehicle.voltage;
    if (voltage < this.voltageScope.warningVal) return this.bgStyle.success;
    else if (voltage > this.voltageScope.dangerVal) return this.bgStyle.danger;
    else return this.bgStyle.warning;
  }


  render() {
    return (
      <div className="container" style={{padding: "20px"}}>
        <div className="row align-items-center no-gutters">
          <span className="col-sm-1">Voltage: </span>
          <div className="progress col-sm-2" >
            <div className={"progress-bar progress-bar-striped " + this.getVoltageProgressColor()} 
              style={this.getVoltageStyle()}>
              {this.props.vehicle.voltage}V
            </div>
          </div>
          <div className="progress col-sm-9" style={{background: "white"}}>&nbsp;
          </div>
        </div>
      </div>
    );
  }
}


