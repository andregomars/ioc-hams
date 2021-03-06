import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Params } from '@angular/router'
import { DataTableModule, ChartModule, UIChart } from 'primeng/primeng';
import { IMyOptions, IMyDateModel } from 'mydatepicker';
import * as Rx from 'rxjs/Rx';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';
const jsPDF = require('jspdf');
const html2canvas = require('html2canvas');

import { DataService } from '../shared/data.service';
import { VehicleIdentity } from '../models/vehicle-identity';
import { YAxis } from '../models/yAxis.model';
import { FleetTrackerService } from '../shared/fleet-tracker.service';
import { VehicleStatus } from '../models/vehicle-status'
import { VehicleSnapshot } from '../models/vehicle-snapshot'
import { VehicleAlert } from '../models/vehicle-alert'

@Component({
  moduleId: module.id,
  templateUrl: 'vehicle.component.html',
  styleUrls: ['vehicle.component.css'],
})
export class VehicleComponent implements OnInit {

  vehicleName: string;
  lastVehicleStatus: VehicleStatus = this.getDefaultVehicleStatus();
  recentStatusList: Array<VehicleStatus>;
  recentAlertList: Array<VehicleAlert>;
  vehicleSnapshot: Array<VehicleSnapshot>;
  optionGaugeSOC: any;
  optionGaugeSpeed: any;

  optionDatePicker: IMyOptions;
  // selectedDate: Date = moment().subtract(1, 'day').startOf('day').toDate();
  selectedDate: Date = moment().startOf('day').toDate();

  optionSocRangeChart: any;
  optionEstActualDistanceChart: any;
  optionChargingRunningStatusChart: any;
  optionComplexChart: any;

  @ViewChild('divDualCharts')
  divDualCharts: ElementRef;

  @ViewChild('datePicker')
  datePicker: UIChart;

  @ViewChild('chartSocRange')
  chartSocRange: UIChart
  @ViewChild('chartEstActualDistance')
  chartEstActualDistance: UIChart;
  @ViewChild('chartChargingRunningStatus')
  chartChargingRunningStatus: UIChart;

  @ViewChild('chartComplex')
  chartComplex: UIChart;


  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private fleetTracker: FleetTrackerService
  ) { }

  ngOnInit(): void {
    this.setGaugeOptions();
    this.setDatePicker();
    this.setDualChartsOptions();
    this.setComplexChartOptions();
    this.initData();
  }

  initData(): void {
    this.route.params
      .switchMap((params: Params) => Rx.Observable.of(params['vname']))
      .subscribe(vname => {
        this.vehicleName = vname;
        this.fleetTracker.setFleetIDByVehicle(vname);

        this.loadLastVehicleStatus();
        this.loadRecentVehicleSnapshots();
        // this.loadRecentVehicleAlerts();
        this.loadLastVehicleSnapshot();
        this.loadChartsData();
        // this.loadDualChartsData();
        // this.loadComplexChartData();
      });
  }

  loadLastVehicleStatus(): void {
    this.dataService.getVehicleStatus$(this.vehicleName)
      .subscribe((data: VehicleStatus) => {
        this.lastVehicleStatus = data ? data : this.getDefaultVehicleStatus();
      });
  }

  loadLastVehicleSnapshot(): void {
    this.dataService.getVehicleSnapshot$(this.vehicleName)
      .subscribe((data: Array<VehicleSnapshot>) => {
         this.vehicleSnapshot = data;
      });
  }

  loadVehicleSnapshotByDataId(dataId: string): void {
    this.dataService.getVehicleSnapshotByDataId$(dataId)
      .subscribe((data: Array<VehicleSnapshot>) => {
         this.vehicleSnapshot = data;
      });
  }

  loadRecentVehicleSnapshots(): void {
    this.dataService.getRecentVehicleStatusList$(this.vehicleName)
      .subscribe((data: Array<VehicleStatus>) => {
        this.recentStatusList = data;
      });
  }

  loadRecentVehicleAlerts(): void {
    this.dataService.getRecentVehicleAlertList$(this.vehicleName)
      .subscribe((data: Array<VehicleAlert>) => {
        this.recentAlertList = data;
      });
  }

  loadChartsData(): void {
    this.dataService.getVehicleWholeDayStatus$(this.vehicleName, this.selectedDate)
      .subscribe(data => {
        if (!data) {
          return
        };

        this.chartSocRange.data = this.getChartDataSOCEnergy(data);
        this.chartEstActualDistance.data = this.getChartDataEstActualDistance(data);
        this.chartChargingRunningStatus.data = this.getChargingRunningStatusData(data);
        this.chartComplex.data = this.getChartDataComplex(data);

        this.chartSocRange.reinit();
        this.chartEstActualDistance.reinit();
        this.chartChargingRunningStatus.reinit();
        this.chartComplex.reinit();
      });
  }

  getDefaultVehicleStatus(): VehicleStatus {
    return new VehicleStatus('00000000-0000-0000-0000-000000000000', 0, '', 0, '', 'bus', 34.134330, 117.928273, 0, 0, 0, 0, 0, 0, 0,
      0, 0, -40, -40, 0, 0, 0, 0, new Date());
  }

  setDatePicker(): void {
    this.optionDatePicker = {
      dateFormat: 'mm/dd/yyyy',
      width: '200px',
      height: '23px',
      editableDateField: false,
      openSelectorOnInputClick: true,
      selectionTxtFontSize: '12px'
    }
  }

  setDualChartsOptions(): void {
    let leftY = new YAxis("SOC", "#4286f4", 0, 200);
    let rightY = new YAxis("kWh", "#565656", 0, 600);
    this.optionSocRangeChart = this.getChartOptions(leftY, rightY);

    leftY = new YAxis("Range", "#4286f4", 0, 300);
    rightY = new YAxis("ActualDistance", "#565656", 0, 250);
    this.optionEstActualDistanceChart = this.getChartOptions(leftY, rightY);

    leftY = new YAxis("ChargingStatus", "#4286f4", 0, 10);
    rightY = new YAxis("HighVoltageStatus", "#565656", 0, 1, 1);
    this.optionChargingRunningStatusChart = this.getChartOptions(leftY, rightY);
  }

  setGaugeOptions(): void {
    this.optionGaugeSOC = {
      id: "gauge-Soc",
      value: 0,
      title: "SOC(%)",
      symbol: "",
      decimals: 1,
      startAnimationTime: 0,
      refreshAnimationTime: 0,
      pointer: false,
      gaugeWidthScale: 1.5,
      levelColors: ["#a9d70b", "#a9d70b", "#a9d70b"]
    };
    this.optionGaugeSpeed = {
      id: "gauge-Speed",
      value: 0,
      title: "Speed(mph)",
      symbol: "",
      decimals: 1,
      startAnimationTime: 0,
      refreshAnimationTime: 0,
      pointer: false,
      gaugeWidthScale: 1.5,
      levelColors: ["#a9d70b", "#a9d70b", "#a9d70b"]
    };
  }

  setComplexChartOptions(): void {
    this.optionComplexChart = {
      animation: {
        duration: 0
      },
      hover: {
        animationDuration: 0
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'hour',
            tooltipFormat: 'HH:mm',
            min: moment(this.selectedDate).startOf('day'),
            max: moment(this.selectedDate).add(1, 'day').startOf('day'),
            displayFormats: {
              hour: 'HH:mm'
            }
          },
       }],
        yAxes: [{
          id: 'yEnergy',
          scaleLabel: {
            display: true,
            labelString: 'Energy',
            fontColor: '#4bc0c0'
          },
          type: 'linear',
          position: 'left',
          ticks: {
            fontColor: '#4bc0c0',
            max: 600,
            min: 0
          }
        }, {
          id: 'yVoltage',
          scaleLabel: {
            display: true,
            labelString: 'Voltage',
            fontColor: '#565656'
          },
          type: 'linear',
          position: 'right',
          ticks: {
            fontColor: '#565656',
            max: 800,
            min: 0
          }
        }, {
          id: 'yCurrent',
          scaleLabel: {
            display: true,
            labelString: 'Current',
            fontColor: '#4286f4'
          },
          type: 'linear',
          position: 'right',
          ticks: {
            fontColor: '#4286f4',
            max: 400,
            min: -400
          }
        }, {
          id: 'yTemperature',
          scaleLabel: {
            display: true,
            labelString: 'Temperature',
            fontColor: '#f47d41'
          },
          type: 'linear',
          position: 'right',
          ticks: {
            fontColor: '#f47d41',
            max: 220,
            min: 0
          }
        }]
      }
    };
  }

  onDateChanged(event: IMyDateModel) {
    if (event.jsdate) {
      this.selectedDate = event.jsdate;
      this.resetChartsOptions();
      this.loadChartsData();
      // this.loadDualChartsData();
      // this.loadComplexChartData();
    }
  }

  private resetChartsOptions(): void {
    this.updateTimeScope(this.chartSocRange);
    this.updateTimeScope(this.chartEstActualDistance);
    this.updateTimeScope(this.chartChargingRunningStatus);
    this.updateTimeScope(this.chartComplex);
  }

  private updateTimeScope(chart: UIChart): void {
    chart.options.scales.xAxes[0].time.min = moment(this.selectedDate).startOf('day');
    chart.options.scales.xAxes[0].time.max =
      moment(this.selectedDate).add(1, 'day').startOf('day');
  }

  getChartDataComplex(list: VehicleStatus[]): any {
    const labels = list.map(x => x.updated);
    const dataEnergy = list.map(x => x.remainingenergy === 0 ? null : x.remainingenergy.toFixed(1));
    const dataVoltage = list.map(x => x.voltage === 0 ? null : x.voltage.toFixed(1));
    const dataCurrent = list.map(x => x.current === 0 ? null : x.current.toFixed(1));
    const dataTempHigh = list.map(x => x.temperaturehigh === 0 ? null : x.temperaturehigh.toFixed(1));
    // const dataEnergy = list.map(x => x.remainingenergy.toFixed(1));
    // const dataVoltage = list.map(x => x.voltage.toFixed(1));
    // const dataCurrent = list.map(x => x.current.toFixed(1));
    // const dataTempHigh = list.map(x => x.temperaturehigh.toFixed(1));

    return {
      labels: labels,
      datasets: [
        {
          label: 'Energy',
          data: dataEnergy,
          yAxisID: 'yEnergy',
          fill: false,
          pointRadius: 2,
          borderColor: '#4bc0c0'
        }, {
          label: 'Voltage',
          data: dataVoltage,
          yAxisID: 'yVoltage',
          fill: false,
          pointRadius: 2,
          borderColor: '#565656'
        }, {
          label: 'Current',
          data: dataCurrent,
          yAxisID: 'yCurrent',
          fill: false,
          pointRadius: 2,
          borderColor: '#4286f4'
        }, {
          label: 'Temperature',
          data: dataTempHigh,
          yAxisID: 'yTemperature',
          fill: false,
          pointRadius: 2,
          borderColor: '#f47d41'
        }
      ]
    }
  }

  getChartDataSOCEnergy(list: VehicleStatus[]): any {
    const labels = list.map(x => x.updated);
    const dataSoc = list.map(x => x.soc === 0 ? null : x.soc.toFixed(1));
    const dataEnergy = list.map(x => x.remainingenergy === 0 ? null : x.remainingenergy.toFixed(1));
    // const dataSoc = list.map(x => x.soc.toFixed(1));
    // const dataEnergy = list.map(x => x.remainingenergy.toFixed(1));

    return {
      labels: labels,
      datasets: [
        {
          label: 'SOC',
          data: dataSoc,
          yAxisID: 'ySOC',
          fill: false,
          pointRadius: 1,
          borderColor: '#4286f4'
        }, {
          label: 'kWh',
          data: dataEnergy,
          yAxisID: 'ykWh',
          fill: false,
          pointRadius: 1,
          borderColor: '#565656',
        }
      ]
    }
  }

  getChartDataEstActualDistance(list: VehicleStatus[]): any {
    const labels = list.map(x => x.updated);
    const dataRange = list.map(x => x.range === 0 ? null : x.range.toFixed(1));
    const dataMileage = list.map(x => x.actualdistance === 0 ? null : x.range.toFixed(1));
    // const dataRange = list.map(x => x.range.toFixed(1));
    // const dataMileage = list.map(x => x.actualdistance.toFixed(1));


    return {
      labels: labels,
      datasets: [
        {
          label: 'Range',
          data: dataRange,
          yAxisID: 'yRange',
          fill: false,
          pointRadius: 1,
          borderColor: '#4286f4'
        }, {
          label: 'Actual Distance',
          data: dataMileage,
          yAxisID: 'yActualDistance',
          fill: false,
          pointRadius: 1,
          borderColor: '#565656',
        }
      ]
    }
  }

  getChargingRunningStatusData(list: VehicleStatus[]): any {
    const labels = list.map(x => x.updated);
    const dataChargingStatus = list.map(x => x.status === 0 ? null : x.status.toFixed(1));
    const dataHighVoltageStatus = list.map(x => x.highvoltagestatus === 0 ? null : x.highvoltagestatus.toFixed(1));
    // const dataChargingStatus = list.map(x => x.status.toFixed(1));
    // const dataHighVoltageStatus = list.map(x => x.highvoltagestatus.toFixed(1));

    return {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: 'Charging Status',
          data: dataChargingStatus,
          yAxisID: 'yChargingStatus',
          fill: false,
          pointRadius: 1,
          borderColor: '#4286f4'
        }, {
          type: 'line',
          label: 'High Voltage Status',
          data: dataHighVoltageStatus,
          yAxisID: 'yHighVoltageStatus',
          fill: false,
          pointRadius: 1,
          borderColor: '#565656',
        }
      ]
    }
  }

  getChartOptions(leftY: YAxis, rightY: YAxis): any {
    return {
      animation: {
        duration: 0
      },
      hover: {
        animationDuration: 0
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            unit: 'hour',
            tooltipFormat: 'HH:mm',
            min: moment(this.selectedDate).startOf('day'),
            max: moment(this.selectedDate).add(1, 'day').startOf('day'),
            displayFormats: {
              hour: 'HH:mm'
            }
          },
       }],
        yAxes: [{
          id: 'y' + leftY.label,
          scaleLabel: {
            display: true,
            labelString: leftY.label,
            fontColor: leftY.color
          },
          position: 'left',
          ticks: {
            fontColor: leftY.color,
            stepSize: leftY.stepSize,
            max: leftY.max,
            beginAtZero: true
          }
        }, {
          id: 'y' + rightY.label,
          scaleLabel: {
            display: true,
            labelString: rightY.label,
            fontColor: rightY.color
          },
          position: 'right',
          ticks: {
            fontColor: rightY.color,
            stepSize: rightY.stepSize,
            max: rightY.max,
            beginAtZero: true
          }
        }]
      }
    };
  }

  selectStatus(status: VehicleStatus): void {
    this.lastVehicleStatus = status;
    this.loadVehicleSnapshotByDataId(status.dataId);
  }

  exportDualCharts(): void {
    html2canvas(this.divDualCharts.nativeElement, {
      onrendered: function (canvas) {
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(contentDataURL, 'PNG', 20, 0);
        pdf.save('Vehicle.DualCharts.pdf');
      }
    })
  }



}

