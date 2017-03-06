import { NgModule }      from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DrillComponent } from './drill.component';
import { FleetComponent } from './fleet/fleet.component';
import { VehicleComponent } from './vehicle/vehicle.component';

const routes: Routes = [
    { path: 'drill', component: DrillComponent },
    { path: 'fleet', component: FleetComponent },
    { path: 'vehicle/:vid', component: VehicleComponent },
    { path: '', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
