import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './../views/root.html',
  styleUrls: ['./../styles/root.css']
})
export class RootComponent {
  title = 'app';

  // lineChart
  public lineChartData: Array<any> = [
    { data: [15, 29, 20, 41, 96, 55, 20, 76, 35, 22, 67, 34, 71, 21, 35, 86, 34, 56, 90, 21, 46, 73, 45, 66, 80], label: 'Series A' },
  ];
  public lineChartLabels: Array<any> = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  public lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          suggestedMax: 100,
          suggestedMin: 0
        }
      }]
    }
  };
  public lineChartLegend = true;
  public lineChartType = 'line';

  /**卷积加权数组 */
  private ConvolutionArray = [
    200 / 320, 30 / 320, 12 / 320, 12 / 320, 6 / 320, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];

  /**离散盒式滤波器，半径=5 */
  private ConBox = (radius: number): number => {
    if (Math.abs(radius) <= 5) {
      return 1 / 11;
    } else {
      return 0;
    }
  }

  /**有限边界的卷积平滑算法 */
  private convolve = (con_arr: number[] | ((v: number) => number), tobecon: number[], radius: number, index: number): number => {
    const readCon: (s: number) => number =
      con_arr instanceof Array ?
        s => con_arr[s] :
        s => con_arr(s);
    let result = 0;
    for (let j = -radius; j <= radius; j++) {
      result = result + readCon(Math.abs(j)) * tobecon[index - j < 0 ? -(index - j) :
        index - j > tobecon.length - 1 ? index + j :
          index - j];
    }
    return result;
  }

  public showInt = (val: number): number => Math.round(val);

  public randomize(): void {
    let bbb = 0;
    for (let sss = 0; sss < 11; sss++) {
      bbb += this.lineChartData[0].data[sss];
    }
    console.log(`AVERAGE : ${Math.round(bbb / 11)}`);
    const _lineChartData: Array<any> = new Array(this.lineChartData.length);
    _lineChartData[0] = { data: new Array(this.lineChartData[0].data.length), label: this.lineChartData[0].label };
    for (let j = 0; j < this.lineChartData[0].data.length; j++) {
      _lineChartData[0].data[j] = this.convolve(this.ConvolutionArray, this.lineChartData[0].data, 5, j);
    }
    this.lineChartData = _lineChartData;
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
