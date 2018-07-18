import { Component, OnInit, Input } from '@angular/core';
import {OverallService} from "../../services/overall.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Chart} from "chart.js"
import {AlertsService} from "angular-alert-module";

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
  chart = [];
  top5 = [];

  constructor(private overallService:OverallService,
              private flashMessage:FlashMessagesService,
              private alerts:AlertsService) { }

  ngOnInit() {
    this.alerts.setDefaults('timeout',0);
    this.alerts.setMessage('All the fields are required','error');

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
        //console.log(data)
        for (var i = 0; i < num; i++) {
          this.mostRevs.push(data[i]['_id'])
        }
      })

      this.overallService.getLeastRevs(num).subscribe(data => {
        for (var i = 0; i < num; i++) {
          this.leastRevs.push(data[i]['_id'])
        }
      })
    }
  }

  drawChart(type) {
    if (type == 'null'){
      // Do nothing
    } else {
      if (type == 'line') {
        var labels:number[] = [];
        let admin = [];
        let anon = [];
        let bot = [];
        let user = [];
        this.overallService.getChartData().subscribe(data => {
          console.log(data)
          for (let i=0;i<18;i++){
            labels.push(+data[i]['Year']);
            admin.push(data[i]['Administrator']);
            anon.push(data[i]['Anonymous']);
            bot.push(data[i]['Bot']);
            user.push(data[i]['Regular_user']);
          }

          this.chart = new Chart('chart',{
            type:'line',
            data:{
              labels:labels,
              datasets:[
                {
                  label: 'Admin',
                  data:admin,
                  fill:false,
                  lineTension:0.2,
                  borderColor:'#ff6384',
                  borderWidth:1
                },
                {
                  label:'Anonymous',
                  data:anon,
                  fill:false,
                  lineTension:0.2,
                  borderColor:'#36a2eb',
                  borderWidth:1
                },
                {
                  label:'Bot',
                  data:bot,
                  fill:false,
                  lineTension:0.2,
                  borderColor:'#cc65fe',
                  borderWidth:1
                },
                {
                  label:'Regular User',
                  data:user,
                  fill:false,
                  lineTension:0.2,
                  borderColor:'#ffce56',
                  borderWidth:1
                }
              ]
            },
            options:{
              title:{
                text:'Revision Number Distribution by Year and by User Type',
                display:true
              }
            }
          })

        })
      }
      else if (type == 'pie'){
        let admin = 0;
        let anon = 0;
        let bot = 0;
        let user = 0;
        this.overallService.getChartData().subscribe(data => {
          for (var i=0;i<18;i++){
            admin += data[i]['Administrator'];
            anon += data[i]['Anonymous'];
            bot += data[i]['Bot'];
            user += data[i]['Regular_user'];
          }
          let chartData = {
            datasets:[{
              data:[admin,anon,bot,user],
              backgroundColor: [
                '#ff6384',
                '#36a2eb',
                '#cc65fe',
                '#ffce56']
            }],
            labels:[
              'Admin',
              'Anonymous',
              'Bot',
              'User'
            ]
          }
          this.chart = new Chart('chart',{
            type:'pie',
            data:chartData,
            options:{
              title:{
                text:'Revision Number Distribution by User Type',
                display:true
              }
            }
          })
        })
      }
    }
  }

}
