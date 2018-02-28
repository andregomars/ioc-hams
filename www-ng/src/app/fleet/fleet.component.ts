import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as Rx from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../shared/data.service';
import { FleetTrackerService } from '../shared/fleet-tracker.service';
import { VehicleStatus } from '../models/vehicle-status';
import { FleetIdentity } from '../models/fleet-identity';

@Component({
  moduleId: module.id,
  templateUrl: 'fleet.component.html'
})
export class FleetComponent implements OnInit, OnDestroy {
  // layout of "table" or "cards" by default
  viewComponent = 'table';
  data: Array<VehicleStatus>;
  fname: string;
  timerSub: Subscription;
  fleet$: Observable<FleetIdentity>;

  constructor (
    private route: ActivatedRoute,
    private fleetTracker: FleetTrackerService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.getFleet();
    this.getFleetRemark();
  }

  ngOnDestroy() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }

  getFleetRemark(): void {
    this.fleet$ = this.route.params
      .map((params: Params) => params['fname'])
      .concatMap((fname: string) =>
        this.dataService.getFleetIdentityByFleetName$(fname))
  }

  getFleet(): void {
    this.route.params
      .switchMap((params: Params) => {
          this.fname = params['fname'];
          return this.dataService.getVehiclesStatusByFleet$(this.fname);
        }
      )
      .subscribe((statusList: Array<VehicleStatus>) => {
        this.data = statusList;
        this.fleetTracker.setFleetIDByFleet(this.fname);
      });

    this.timerSub = Observable.timer(60000, 60000)
      .subscribe(() => {
        this.dataService.getVehiclesStatusByFleet$(this.fname)
          .subscribe((statusList: Array<VehicleStatus>) => {
            this.data = statusList;
          });
      });
 }

  // toggleView(view: string) {
  //   console.log('toggled view is: '+view);
  //   this.viewComponent = view;
  // }

  toggleView() {
    this.viewComponent = this.viewComponent === 'table' ? 'cards' : 'table';
  }

  isShown(view: string) {
    return this.viewComponent === view;
  }
}

