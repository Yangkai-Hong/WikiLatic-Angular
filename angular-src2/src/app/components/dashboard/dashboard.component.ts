import { Component, OnInit } from '@angular/core';
import {OverallService} from "../../services/overall.service";
import {FlashMessagesService} from "angular2-flash-messages";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mostRevs = [];
  leastRevs = [];
  largeGP = [];
  smallGP = [];
  longHis = [];
  shortHis = [];
  revNum: number = 3;

  constructor(private overallService:OverallService,
              private flashMessage:FlashMessagesService) { }

  ngOnInit() {
    this.overallService.getMostRevs(3).subscribe(data=>{
      //console.log(data.length);
      for (var i=0;i<3;i++){
        this.mostRevs.push(data[i]['_id'])
      }
      //console.log(this.mostRevs)
    })

    this.overallService.getLeastRevs(3).subscribe(data=>{
      for (var i=0;i<3;i++){
        this.leastRevs.push(data[i]['_id'])
      }
    })

    this.overallService.getLargeGP().subscribe(data=>{
      for (var i=0;i<1;i++){
        this.largeGP.push(data[i]['_id'])
      }
    })

    this.overallService.getSmallGp().subscribe(data=>{
      for (var i=0;i<1;i++){
        this.smallGP.push(data[i]['_id'])
      }
    })

    this.overallService.getLongHis3().subscribe(data=>{
      for (var i=0;i<3;i++){
        this.longHis.push(data[i]['_id'])
      }
    })

    this.overallService.getShortHis().subscribe(data=>{
      for (var i=0;i<1;i++){
        this.shortHis.push(data[i]['_id'])
      }
    })
  }

  changeRevNums(num){
    if (this.revNum < 1){
      this.flashMessage.show('The number should be at least 1.',{
        cssClass:'alert-danger',
        timeout:3000
      });
    }
    else {
      this.mostRevs = [];
      this.leastRevs = [];

      this.overallService.getMostRevs(num).subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          this.mostRevs.push(data[i]['_id'])
        }
      })

      this.overallService.getLeastRevs(num).subscribe(data => {
        for (var i = 0; i < data.length; i++) {
          this.leastRevs.push(data[i]['_id'])
        }
      })
    }
  }

  drawBarChart(){
    this.overallService.getChartData().subscribe(data=>{

    })
  }

  drawPieChart(){
    this.overallService.getChartData().subscribe(data=>{
      console.log(123)
    })
  }

}
