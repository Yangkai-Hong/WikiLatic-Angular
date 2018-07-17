import {Injectable} from "@angular/core";
import { HttpClient,HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable(
  {providedIn: 'root'}
)
export class OverallService {
  baseUrl = "http://localhost:3000/overall"

  constructor(private http:HttpClient) { }

  getMostRevs(num){
    let params = new HttpParams().set('num',num);
    return this.http.get(this.baseUrl+'/mostRevisions',{params:params})
      .pipe(map(res=>res))
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
}
