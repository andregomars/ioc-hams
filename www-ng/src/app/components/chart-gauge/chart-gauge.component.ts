import { Component, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-chart-gauge',
  templateUrl: './chart-gauge.component.html'
})
export class ChartGaugeComponent implements OnInit, OnChanges {

  datasets: any;
  options: any;
  colors: any[]; 
  @Input() value: number;
  @Input() max: number;
  @Input() title: string;

  constructor() { }

  ngOnInit() {
    this.colors = [{}];

    this.options = {
        rotation: 1 * Math.PI,
        circumference: 1 * Math.PI,
        legend: false,
        tooltips: false,
        responsive: false,
        title: {
            display: true,
            padding: 0,
            fontSize: 20,
            text: this.title 
        },
        animation: {
          duration: 0
        }
    }

    this.datasets = [{
      data: this.getData(this.value, this.max),
      backgroundColor: [
        "greenyellow",
        "lightgrey"
      ]
    }];

  }

  ngOnChanges() {
    this.datasets = [{
      data: this.getData(this.value, this.max),
      backgroundColor: [
        "greenyellow",
        "lightgrey"
      ]
    }];
  }

  private getData(value: number, max: number): number[] {
    if (value < 0) value = 0;
    if (value > max) value = max;
    var valueSection = value * 100 / max;
    var remainSection = 100 - valueSection;
    return [valueSection, remainSection];
  }

}
