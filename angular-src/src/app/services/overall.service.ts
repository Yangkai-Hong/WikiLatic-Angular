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

  getInfos(num){
    let params = new HttpParams().set('num',num);
    return this.http.get(this.baseUrl+'/infos',{params:params})
      .pipe(map(res =>{return res}))
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
