import { Component, OnInit, Input } from '@angular/core';
import {OverallService} from "../../services/overall.service";
import {IndividualService} from "../../services/individual.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Chart} from "chart.js"
import {AlertsService} from "angular-alert-module";
import {FormControl} from "@angular/forms";
import {MatFormField} from "@angular/material";
import {usesServiceWorker} from "@angular-devkit/build-angular/src/angular-cli-files/utilities/service-worker";
import {discardPeriodicTasks} from "@angular/core/testing";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  section = 1;

  mostRevs = [];
  leastRevs = [];
  largeGP = [];
  smallGP = [];
  longHis = [];
  shortHis = [];
  revNum: number = 3;
  chart = [];

  articles = [];

  constructor(private overallService:OverallService,
              private individualService:IndividualService,
              private flashMessage:FlashMessagesService,
              private alerts:AlertsService) { }

  ngOnInit() {
    // Add User Type to all revisions
    this.overallService.addUserType().subscribe(data=>{
      console.log('User type has been added')
    });

    this.overallService.getInfos(3).subscribe(data=>{
      //console.log(data);
      for (var i=0;i<3;i++){
        this.mostRevs.push(data['mostRevisions'][i]);
        this.leastRevs.push(data['leastRevisions'][i]);
        this.longHis.push(data['longestHistory'][i]);
      }
        this.shortHis.push(data['shortestHistory'][0]);
        this.largeGP.push(data['largestGroup'][0]);
        this.smallGP.push(data['smallestGroup'][0]);
      //console.log(this.mostRevs)
    })

    this.individualService.getAllArticles().subscribe(data =>{
      for (var i=0;i<data['length'];i++){
        this.articles.push(data[i]['_id'])
      }
      //console.log(this.articles)
    })

  }

// *******************************************************************

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

      this.overallService.getInfos(num).subscribe(data => {
        //console.log(data)
        for (var i = 0; i < num; i++) {
          this.mostRevs.push(data['mostRevisions'][i]);
          this.leastRevs.push(data['leastRevisions'][i])
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
          //console.log(data)
          //console.log(data['length'])
          for (let i=0;i<data['length'];i++){
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
          for (var i=0;i<data['length'];i++){
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

  articleTitle = null;
  articleRevNum = null;
  articleTop5 = null;
  articleRevs = null;
  top5 = null;

  getArticleInfo(title){
    this.individualService.getArticleRevs(title).subscribe(data=>{
      this.flashMessage.show('Updatad '+data['count']+' revisions for the selected article.',{
        cssClass:'alert-success',
        timeout:5000
        });
    })
    this.individualService.getArticleInfo(title).subscribe(data=>{
      //console.log(data)
      this.articleTitle = data['Title']
      this.articleRevNum = data['RevNum']
      this.articleTop5 = data['top5']
      this.articleRevs = data['result']
      //console.log(this.articleRevs)
    })
    this.selectedTop5 = [];
  }

  drawArticleChart(type){
    //console.log(this.articleRevs)
    if (type == 'null'){
      // Do nothing
    } else {
      if (type == 'line') {
        this.top5 = null;

        var labels:number[] = [];
        let admin = [];
        let anon = [];
        let bot = [];
        let user = [];

        for (let i=0;i<this.articleRevs.length;i++) {
            labels.push(+this.articleRevs[i]['year']);
            admin.push(this.articleRevs[i]['admin']);
            anon.push(this.articleRevs[i]['anon']);
            bot.push(this.articleRevs[i]['bot']);
            user.push(this.articleRevs[i]['user']);
        }

          this.chart = new Chart('articleChart',{
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
                text:'Revision Number Distribution by Year and by User Type of the Selected Article',
                display:true
              }
            }
          })
        }

      else if (type == 'pie'){
        this.top5 = null;

        let admin = 0;
        let anon = 0;
        let bot = 0;
        let user = 0;

          for (var i=0;i<this.articleRevs.length;i++){
            admin += this.articleRevs[i]['admin'];
            anon += this.articleRevs[i]['anon'];
            bot += this.articleRevs[i]['bot'];
            user += this.articleRevs[i]['user'];
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
          this.chart = new Chart('articleChart',{
            type:'pie',
            data:chartData,
            options:{
              title:{
                text:'Revision Number Distribution by User Type of the Selected Article',
                display:true
              }
            }
          })
        }

        else if (type == 'top5'){
        this.top5 = [];
        this.selectedTop5 = [];
      }

      }
    }

    selectedTop5 = [];

    selectTop5(e){
      if (e.target.checked){
        this.selectedTop5.push(e.target.value)
      }
      else {
        var index = this.selectedTop5.indexOf(e.target.value);
        this.selectedTop5.splice(index,1);
      }
      //console.log(this.selectedTop5)
    }

    drawArticleTop5(){
      this.individualService.getArticleTop5(this.articleTitle,this.selectedTop5).subscribe(data=>{
        console.log(data)

        var part1 = data['length']/this.selectedTop5.length;

        var labels = [];
        var userData = [];

        for (var i=0;i<part1;i++){
          labels.push(data[i]['year'])
        }

        for (var i=0;i<this.selectedTop5.length;i++){
          userData[i] = [];
          for (var j=i*part1;j<(i+1)*part1;j++){
            userData[i].push(data[j]['revNum'])
          }
        }
        let colors = [
          '#ff6384',
          '#36a2eb',
          '#cc65fe',
          '#ffce56',
          'green'];

        let chartData = [];
        for (var i=0;i<this.selectedTop5.length;i++){
          chartData.push({
            label:this.selectedTop5[i],
            data:userData[i],
            fill:false,
            lineTension:0.2,
            borderColor:colors[i],
            borderWidth:1
          })
        }

        this.chart = new Chart('articleChart',{
          type:'line',
          data:{
            labels:labels,
            datasets:chartData,
          },
          options:{
            title:{
              text:'Revision Number Distribution by Selected Top5 Users',
              display:true
            }
          }
        })
      })
    }

  selectSection($event){
    let clickedElement = $event.target || $event.srcElement;
    this.section = clickedElement.name;
    let isCertainButtonAlreadyActive = clickedElement.parentElement.parentElement.querySelector(".active");
    // if a Button already has Class: .active
    if( isCertainButtonAlreadyActive ) {
      isCertainButtonAlreadyActive.classList.remove("active");
    }
    clickedElement.className += " active";
  }

}
