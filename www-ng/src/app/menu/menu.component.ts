import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuModule, MenuItem } from 'primeng/primeng';
import { CookieService } from 'ngx-cookie';

import { FleetTrackerService } from '../shared/fleet-tracker.service';
import { DataService } from '../shared/data.service';
import { VehicleIdentity } from '../models/vehicle-identity'

@Component({
  selector: 'app-menu',
  moduleId: module.id,
  templateUrl: 'menu.component.html',
  styleUrls: [ 'menu.component.css' ],
})
export class MenuComponent implements OnInit {

    fleetItems : MenuItem[];
    vehicleItems : MenuItem[];
    alertItems : MenuItem[];
    dailyReportItem: any[];
    monthlyReportItem: any[];
    dailyLogItem: any[];
    vehicles: VehicleIdentity[];

    @Input() show: boolean;

    constructor(
      private router: Router,
      private cookie: CookieService,
      private fleetTracker: FleetTrackerService,
      private dataService: DataService
    ){}
    
    ngOnInit() {
      var userLoginName = this.cookie.get('ioc_loggedin');

      this.fleetTracker.getFleetID().subscribe(fname => 
        {
          // this.dataService.getAllVehiclesData$()
          this.dataService.getVehicleIdentitiesByLoginName$(userLoginName)
            .map(el => el.filter( v => v.fname === fname))
            .subscribe(vehicles => 
             { 
                this.vehicles = vehicles;
                this.loadDailyAnalysisItems();
                this.loadAlertAnalysisItems();
             });

          this.loadDailyReportItem(fname);
          this.loadMonthlyReportItem(fname);
          this.loadDailyLogItem(fname);
        });
      
      this.dataService.getVehicleIdentitiesByLoginName$(userLoginName).subscribe(data =>
        this.loadFleetItems(data)
      );
    }

    private loadFleetItems(data: any): void {
      if (!data) return;
      var fleetIDs = 
        data.map(v => v.fname).filter((el, i, arr) => arr.indexOf(el) === i); 

      if (!fleetIDs) return;
      var fLinks = fleetIDs.map(fname => { 
        var vLinks = data.filter( el => el.fname === fname ).map(v => {
          return { label: v.vname, routerLink: ['/vehicle', v.vname]}
        });
        return {
          label: fname,
          routerLink: ['/fleet', fname],
          items: vLinks 
        };
      });

      this.fleetItems = fLinks;
    }

    private loadDailyAnalysisItems(): void {
      var vLinks = this.vehicles.map(v => {
        return {
          label: v.vname,
          routerLink: ['/vehicledaily', v.vname]
        };
      });
      this.vehicleItems = vLinks;
    }

    private loadAlertAnalysisItems(): void {
      var vLinks = this.vehicles.map(v => {
        return {
          label: v.vname,
          routerLink: ['/vehiclealert', v.vname]
        };
      });
      this.alertItems = vLinks;
    }

    private loadDailyReportItem(fname: string): void {
      this.dailyReportItem = ['/dailyreport', fname];
    }

    private loadMonthlyReportItem(fname: string): void {
      this.monthlyReportItem = ['/monthlyreport', fname];
    }

    private loadDailyLogItem(fname: string): void {
      this.dailyLogItem = ['/dailylog', fname];
    }

}

/* loaded data examples
  this.fleetItem: [
        {
            label: 'LBT',
            routerLink: ['/fleet', 'LBT'],
            items: [
                { 
                  label: 'AZ01',
                  routerLink: ['/vehicle', 'AZ01'],
                }, { 
                  label: 'AZ02',
                  routerLink: ['/vehicle', 'AZ02'],
                }
            ]
        },
        {
            label: 'BYD',
            routerLink: ['/fleet', 'BYD'],
            items: [
                { 
                  label: 'P01',
                  routerLink: ['/vehicle', 'P01'],
                }, { 
                  label: 'P02',
                  routerLink: ['/vehicle', 'P02'],
                }
            ]
        }
    ];

  this.vehicleItems = [
        {
            label: 'AZ01',
            routerLink: ['/vehicledaily', 'AZ01'],
        }, {
            label: 'AZ02',
            routerLink: ['/vehicledaily', 'AZ02'],
        }
    ];

  this.alertItems = [
    {
        label: 'AZ01',
        routerLink: ['/vehiclealert', 'AZ01'],
    }, {
        label: 'AZ02',
        routerLink: ['/vehiclealert', 'AZ02'],
    }
  ];
*/