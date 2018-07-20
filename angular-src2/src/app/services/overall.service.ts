import {Injectable} from "@angular/core";
import { HttpClient,HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Container} from "@angular/compiler/src/i18n/i18n_ast";
import {mergeAnimationOptions} from "@angular/animations/browser/src/util";

@Injectable(
  {providedIn: 'root'}
)
export class OverallService {
  baseUrl = "http://localhost:3000/overall"

  constructor(private http:HttpClient) { }

  getMostRevs(num){
    let params = new HttpParams().set('num',num);
    return this.http.get(this.baseUrl+'/mostRevisions',{params:params})
      .pipe(map(res =>{return res}))
  }
  getLeastRevs(num){
    let params = new HttpParams().set('num',num);
    return this.http.get(this.baseUrl+'/leastRevisions',{params:params})
      .pipe(map(res=>res))
  }
  getLargeGP(){
    return this.http.get(this.baseUrl+'/largestGroup')
      .pipe(map(res=>res))
  }
  getSmallGp(){
    return this.http.get(this.baseUrl+'/smallestGroup')
      .pipe(map(res=>res))
  }
  getLongHis3(){
    return this.http.get(this.baseUrl+'/longestHistory')
      .pipe(map(res=>res))
  }
  getShortHis(){
    return this.http.get(this.baseUrl+'/shortestHistory')
      .pipe(map(res=>res))
  }
  getChartData(){
    return this.http.get(this.baseUrl+'/chartData')
      .pipe(map(res=>res))
  }
  addUserType(){
    return this.http.get(this.baseUrl+'/addUserType')
      .pipe(map(res=>res))
  }
}
