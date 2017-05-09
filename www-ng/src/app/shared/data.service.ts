import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as Rx from 'rxjs/RX';
import { Observable } from 'rxjs/Observable';

import { UtilityService } from './utility.service';
import { DailyNumber } from '../models/dailyNumber.model';
import { Vehicle } from '../models/vehicle.model';
import { Fleet } from '../models/fleet.model';
import { DataRemoteService } from './data-remote.service';
import { VehicleStatus } from '../models/vehicle-status';
import { VehicleSnapshot } from '../models/vehicle-snapshot';
import { VehicleIdentity } from '../models/vehicle-identity';
import { VehicleAlert } from '../models/vehicle-alert';

@Injectable()
export class DataService {

    private allVehicles: Array<VehicleIdentity>;
    private allVehiclesStatus: Array<VehicleStatus>;

    constructor(
        private utility: UtilityService,
        private dataService: DataRemoteService
    ) {
    }

   getAllFleetID$(): Observable<Array<string>> {
      return this.dataService.getFleetIdentities$();
   }

   getAllVehiclesData$(): Observable<Array<VehicleIdentity>> {
     return this.dataService.getVehicleIdentities$();
   }

   getVehiclesStatusByFleet$(fname: string): Observable<Array<VehicleStatus>> {
       return this.dataService.getAllVehicleStatusByFleetName$(fname);
    //   var data$ = this.getAllVehicleStatusData$();
    //   return data$.map(el => el.filter(status => status.fname === fname));
   }

   getRecentVehicleStatusList$(vname: string): Observable<Array<VehicleStatus>> {
       return this.dataService.getRecentAllVehicleStatusByVehicleName$(vname);
   }
 
   getRecentVehicleAlertList$(vname: string): Observable<Array<VehicleAlert>> {
       return this.dataService.getRecentAllVehicleAlertByVehicleName$(vname);
   }
   
//    getAllVehicleStatusData$(): Observable<Array<VehicleStatus>> {
//       var allVehicles$ = this.getAllVehiclesData$();
//       var allVehiclesStatus = 
//         allVehicles$.map(vList => vList.map(v => this.utility.genRandomVehicleStatus(v)));
//       return allVehiclesStatus;
//     }

    getVehicleStatus$(vname: string): Observable<VehicleStatus> {
        return this.dataService.getVehicleStatus$(vname);
    }

    getVehicleSnapshot$(vname: string): Observable<Array<VehicleSnapshot>> {
        return this.dataService.getVehicleSnapshot$(vname);
    }

    getVehicleWholeDaySnapshot$(vname: string, date: Date): Observable<Array<VehicleSnapshot>> {
        return this.dataService.getWholeDayVehicleSnapshot$(vname, date);
    }

    getVehicleWholeDaySnapshot(vname: string, date: Date): Promise<Array<VehicleSnapshot>> {
        return this.dataService.getWholeDayVehicleSnapshot(vname, date);
    }



//     getAllFleetID(): Array<string> {
//       var data = this.dataService.getFleetIdentities();
//       return data;
//    }

    getAllVehiclesData(): Array<VehicleIdentity> {
        if (this.allVehicles) return this.allVehicles;

        this.dataService.getVehicleIdentities$()
            .subscribe(data => this.allVehicles = data);
        
        return this.allVehicles;
    }

    getAllVehicleStatusData(): Array<VehicleStatus> {
    //   if (!this.allVehiclesStatus) return this.allVehiclesStatus;

      var allVehicles = this.getAllVehiclesData();
      // let vehicles : Array<VehicleIdentity>;
      // this.getAllVehiclesData().subscribe(vs => vehicles = vs);
      // this.allVehiclesStatus = vehicles.map(v => this.utility.genRandomVehicleStatus(v));
      this.allVehiclesStatus = allVehicles.map(v => this.utility.genRandomVehicleStatus(v));
      return this.allVehiclesStatus;
    }

    getVehicleStatus(vname: string): VehicleStatus {
      //if (!this.allVehiclesStatus) this.getAllVehicleStatusData();
      var statusArray = this.getAllVehicleStatusData();
      return statusArray.find(s => s.vname === vname);
    }

    getVehicleIdentity(vname: string): VehicleIdentity {
      if (!this.allVehicles) this.getAllVehiclesData();

      // let vehicles : Array<VehicleIdentity>;
      // this.getAllVehiclesData().subscribe(vs => vehicles = vs)
      // return vehicles.find(v => v.vid === vid);
      return this.allVehicles.find(v => v.vname === vname);
    }

    getVehiclesIdentityByFleet(fname: string): Array<VehicleIdentity> {
      if (!this.allVehicles) this.getAllVehiclesData();

      // let vehicles : Array<VehicleIdentity>;
      // this.getAllVehiclesData().subscribe(vs => vehicles = vs)
      // return vehicles.filter(v => v.fid === fid);
      return this.allVehicles.filter(v => v.fname === fname);
    }

    getVehiclesStatusByFleet(fname: string): Array<VehicleStatus> {
    //   if (!this.allVehiclesStatus) this.getAllVehicleStatusData();
      var allVehiclesStatus = this.getAllVehicleStatusData();
      return allVehiclesStatus.filter(s => s.fname === fname);
    }

    getLineChart(): any {
        return {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Energy',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    yAxisID: 'ySOC',
                    fill: false,
                    borderColor: '#4bc0c0'
                }, {
                    label: 'Voltage',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    yAxisID: 'yRange',
                    fill: false,
                    borderColor: '#565656'
                }, {
                    label: 'Current',
                    data: [10, 12, 16, 20, 12, 12, 16],
                    yAxisID: 'yCurrent',
                    fill: false,
                    borderColor: '#4286f4'
                }, {
                    label: 'Temperature',
                    data: [45, 30, 80, 96, 127, 134, 150],
                    yAxisID: 'yTemperature',
                    fill: false,
                    borderColor: '#f47d41'
                }
            ]
        }
    }

    getVehicleStatusData(): any {
        return [{
            "TypeCode": "0E",
            "Name": "Left Charge Gun",
            "Value": "0 bit"
        }, {
            "TypeCode": "0E",
            "Name": "Left Charge Gun",
            "Value": "0 bit"
        }, {
            "TypeCode": "0F",
            "Name": "Right Charge Gun",
            "Value": "0 bit"
        }, {
            "TypeCode": "1D",
            "Name": "Vehicle Speed",
            "Value": "0 mph"
        }, {
            "TypeCode": "1E",
            "Name": "SOC",
            "Value": "68.7 %"
        }, {
            "TypeCode": "1F",
            "Name": "Total Voltage",
            "Value": "620 V"
        }, {
            "TypeCode": "2F",
            "Name": "Total current",
            "Value": "3.7 A"
        }, {
            "TypeCode": "1G",
            "Name": "Lowest Battery Temp",
            "Value": "82.4 F"
        }, {
            "TypeCode": "2G",
            "Name": "Highest Battery Temp",
            "Value": "95 F"
        }, {
            "TypeCode": "1H",
            "Name": "Total Mileage",
            "Value": "5647.2 miles"
        }, {
            "TypeCode": "2H",
            "Name": "Range",
            "Value": "105.6 miles"
        }, {
            "TypeCode": "1I",
            "Name": "Charging Status",
            "Value": "Initialization"
        }, {
            "TypeCode": "1J",
            "Name": "kWh Usage",
            "Value": "177.3 kWh"
        }, {
            "TypeCode": "1K",
            "Name": "High Voltage",
            "Value": "1 bit"
        }, {
            "TypeCode": "1L",
            "Name": "Motor Input Voltage",
            "Value": "608 V"
        }, {
            "TypeCode": "2L",
            "Name": "Motor RPM",
            "Value": "0 RPM"
        }, {
            "TypeCode": "1M",
            "Name": "WAVE Status",
            "Value": "N/A"
        }]
    }

    getLatestAlertsData() {
        return [{
            "type": "Slow Charging",
            "value": "1000 A",
            "time": "2017-03-02 19:36:57"
        }, {
            "type": "Slow Charging",
            "value": "1000 A",
            "time": "2017-03-02 19:36:57"
        }, {
            "type": "Low Temp",
            "value": "35 F",
            "time": "2017-03-02 00:22:13"
        }, {
            "type": "Low Voltage",
            "value": "80 V",
            "time": "2017-03-01 12:26:07"
        }, {
            "type": "Slow Charging",
            "value": "1000 A",
            "time": "2017-02-27 10:07:25"
        }, {
            "type": "Slow Charging",
            "value": "1000 A",
            "time": "2017-02-22 07:25:33"
        }, {
            "type": "Low Temp",
            "value": "35 F",
            "time": "2017-02-20 17:36:57"
        }, {
            "type": "Low Voltage",
            "value": "80 V",
            "time": "2017-02-11 19:36:57"
        }, {
            "type": "Slow Charging",
            "value": "1000 A",
            "time": "2017-02-10 19:36:57"
        }, {
            "type": "Slow Charging",
            "value": "1000 A",
            "time": "2017-01-11 19:36:57"
        }, {
            "type": "Low Temp",
            "value": "35 F",
            "time": "2017-01-10 19:36:57"
        }]
    }

    getBackwardDaysVehicleDailyMileage(backwardDays: number): any {
        return {
            labels: this.utility.getBackwardDateList(backwardDays, new Date()),
            datasets: [
                {
                    label: 'Daily Mileage',
                    data: this.utility.getRandomNumberList(backwardDays, 0, 100),
                    //fill: false,
                    borderColor: '#4bc0c0'
                }
            ]
        }
    }

    getVehicleDailyMileage(beginDate: Date, endDate: Date): any {
        let dict: Array<DailyNumber> =
            this.utility.getDailyNumberList(beginDate, endDate, 0, 100);
        let days: Array<Date> = [];
        let numbers: Array<number> = [];
        dict.forEach((item: DailyNumber) => {
            days.push(item.date);
            numbers.push(item.value);
        });

        return {
            labels: days,
            data: numbers
        }
    }

    getVehicleDailySocEnergy(beginDate: Date, endDate: Date): any {
        let dictSoc: Array<DailyNumber> =
            this.utility.getDailyNumberList(beginDate, endDate, 0, 100);
        let dictEnergy: Array<DailyNumber> =
            this.utility.getDailyNumberList(beginDate, endDate, 0, 2500);
        let days: Array<Date> = [];

        let numbersSocCharged: Array<number> = [];
        let numbersSocUsed: Array<number> = [];
        let numbersEnergyCharged: Array<number> = [];
        let numbersEnergyUsed: Array<number> = [];

        dictSoc.forEach((item: DailyNumber) => {
            days.push(item.date);
            numbersSocCharged.push(item.value);
            numbersSocUsed.push(100 - item.value);
        });

        dictEnergy.forEach((item: DailyNumber) => {
            numbersEnergyCharged.push(item.value);
            numbersEnergyUsed.push(2500 - item.value);
        });

        return {
            labels: days,
            dataSocCharged: numbersSocCharged,
            dataSocUsed: numbersSocUsed,
            dataEnergyCharged: numbersEnergyCharged,
            dataEnergyUsed: numbersEnergyUsed
        }
    }

    getVehicleDailySocMileageEnergy(beginDate: Date, endDate: Date): any {
        let dictSoc: Array<DailyNumber> =
            this.utility.getDailyNumberList(beginDate, endDate, 1, 100);
        let dictMileage: Array<DailyNumber> =
            this.utility.getDailyNumberList(beginDate, endDate, 1, 100);
        let dictEnergy: Array<DailyNumber> =
            this.utility.getDailyNumberList(beginDate, endDate, 0, 2500);
        let days: Array<Date> = [];

        let numbersSocMileage: Array<number> = [];
        let numbersMileageSoc: Array<number> = [];
        let numbersMileageEnergy: Array<number> = [];
        let numbersEnergyMileage: Array<number> = [];

        let raitoListSocMileage = this.utility.getRatioList(dictSoc, dictMileage);
        raitoListSocMileage.forEach((item: DailyNumber) => {
            days.push(item.date);
            numbersSocMileage.push(item.value)
        });

        let raitoListMileageSoc = this.utility.getRatioList(dictMileage, dictSoc);
        raitoListMileageSoc.forEach((item: DailyNumber) => {
            numbersMileageSoc.push(item.value)
        });

        let raitoListMileageEnergy = this.utility.getRatioList(dictMileage, dictEnergy);
        raitoListMileageEnergy.forEach((item: DailyNumber) => {
            numbersMileageEnergy.push(item.value)
        });

        let ratioListEnergyMileage = this.utility.getRatioList(dictEnergy, dictMileage);
        ratioListEnergyMileage.forEach((item: DailyNumber) => {
            numbersEnergyMileage.push(item.value)
        });

        return {
            labels: days,
            dataSocMileage: numbersSocMileage,
            dataMileageSoc: numbersMileageSoc,
            dataMileageEnergy: numbersMileageEnergy,
            dataEnergyMileage: numbersEnergyMileage
        }
    }

    getVehicleAlertStats(beginDate: Date, endDate: Date): any {
        let eventCodes = ['Charging Stopped','Slow Charging', 'Battery Overheat', 'Charging System Malfunction'
            ,'Power Battery Malfunction', 'Battery Leaking', 'Electrical Motor Malfunction', 'ABS Malfunction'];
        let maxLength = 10, min = 1, max = 100;
        let events = this.utility.getEventList(10, eventCodes, min, max, beginDate, endDate);
        let stats = _.countBy(events, 'type');
        return {
            labels: _.keys(stats),
            data: _.values(stats)
        }
    }

    getFleetAlertStats(beginDate: Date, endDate: Date, fleetID: string): any {
        // let eventCodes = ['AZ01', 'AZ02'];
        let eventCodes = this.getVehiclesIdentityByFleet(fleetID).map(v => v.vname);
        let maxLength = 20, min = 1, max = 100;
        let events = this.utility.getEventList(10, eventCodes, min, max, beginDate, endDate);
        let stats = _.countBy(events, 'type');
        return {
            labels: _.keys(stats),
            data: _.values(stats)
        }
    }

    getDateOfACoupleWeeksAgo(endDate: Date): Date {
        return this.utility.getStartDateBackward(14, endDate);
    }

    getRandomMonthlyData(): any {
        let socCharged = _.random(100, 3000);
        let socUsed = _.random(10, socCharged);
        let actualDistance = _.random(500, 7500);
        let socMile = (socUsed / actualDistance).toFixed(2);
        let mileSoc = (actualDistance / socUsed).toFixed(2);

        return {
            socCharged: socCharged,
            socUsed: socUsed,
            actualDistance: actualDistance,
            socMile: socMile,
            mileSoc: mileSoc
        }
    }

    getRandomMonthlyDataSetWithVehicles(vehicles: Array<Vehicle>): Array<any> {
       let array = vehicles.map(v => Object.assign({}, v, this.getRandomMonthlyData()));
       let socChargedSum = array.map(el => el.socCharged).reduce((sum, value) => sum + value);
       let socUsedSum = array.map(el => el.socUsed).reduce((sum, value) => sum + value);
       let actualDistanceSum =
            array.map(el => el.actualDistance).reduce((sum, value) => sum + value);
        let socMileAvg = (socUsedSum / actualDistanceSum).toFixed(2);
        let mileSocAvg = (actualDistanceSum / socUsedSum).toFixed(2)

        //insert total line in first element of the array
        array.unshift({
            id: "All",
            socCharged: socChargedSum,
            socUsed: socUsedSum,
            actualDistance: actualDistanceSum,
            socMile: socMileAvg,
            mileSoc: mileSocAvg
        });

       return array;
    }


    getRandomMonthlyAlertData(): any {
        let chargingStoped = _.random(0, 5);
        let slowCharging = _.random(0, 10);
        let batteryOverhead = _.random(0, 2);
        let malfuncCharging = _.random(0, 1);
        let malfuncPowerBattery = _.random(0, 1);
        let batteryLeaking = _.random(0, 0);
        let malfuncElectricalMotor = _.random(0, 0);
        let malfuncABS = _.random(0, 2);

        return {
            chargingStoped: chargingStoped,
            slowCharging: slowCharging,
            batteryOverhead: batteryOverhead,
            malfuncCharging: malfuncCharging,
            malfuncPowerBattery: malfuncCharging,
            batteryLeaking: malfuncCharging,
            malfuncElectricalMotor: malfuncCharging,
            malfuncABS: malfuncCharging
        }
    }

     getRandomMonthlyAlertSummaryByFleet(fleetID: string): Array<any> {
       let vehicles = this.getVehiclesIdentityByFleet(fleetID).map(v => new Vehicle(v.vname));
       let array = vehicles.map(v => Object.assign({}, v, this.getRandomMonthlyAlertData()));
       let chargingStoped = array.map(el => el.chargingStoped).reduce((sum, value) => sum + value);
       let slowCharging = array.map(el => el.slowCharging).reduce((sum, value) => sum + value);
       let batteryOverhead = array.map(el => el.batteryOverhead).reduce((sum, value) => sum + value);
       let malfuncCharging = array.map(el => el.malfuncCharging).reduce((sum, value) => sum + value);
       let malfuncPowerBattery = array.map(el => el.malfuncPowerBattery).reduce((sum, value) => sum + value);
       let batteryLeaking = array.map(el => el.batteryLeaking).reduce((sum, value) => sum + value);
       let malfuncElectricalMotor = array.map(el => el.malfuncElectricalMotor).reduce((sum, value) => sum + value);
       let malfuncABS = array.map(el => el.malfuncABS).reduce((sum, value) => sum + value);

        //insert total line in first element of the array
        array.unshift({
            id: "All",
            chargingStoped: chargingStoped,
            slowCharging: slowCharging,
            batteryOverhead: batteryOverhead,
            malfuncCharging: malfuncCharging,
            malfuncPowerBattery: malfuncCharging,
            batteryLeaking: malfuncCharging,
            malfuncElectricalMotor: malfuncCharging,
            malfuncABS: malfuncCharging
        });

       return array;
    }

    getLogsInMonthOfDate(date: Date): Array<any> {
        let days = this.utility.getDatesInMonth(date);
        let array = days.map(d => {
            return {
                date: moment(d).format('YYYY-MM-DD'),
                fileName: moment(d).format('YYYYMMDD')
            }
        });

        return array;
    }

    getLogsInMonthOfDateByVehicles(vehicles: Array<Vehicle>, date: Date): Array<any> {
        let logs = this.getLogsInMonthOfDate(date);
        let array = logs.map(log =>
            vehicles.map(v =>
                Object.assign({}, v, log)
                )
            ).reduce((a, b) => a.concat(b));    //use reduce to turn nested array flat, e.g. [[a,b],[c,d]] => [a,b,c,d]
        return array;
    }
}