import { Injectable } from '@angular/core';
import { HttpClient,HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Params} from "@angular/router";

@Injectable(
  {providedIn: 'root'}
)
export class IndividualService {
  //baseUrl = "http://localhost:3000/article"
	baseUrl = "https://www.hyk.party/article"

  constructor(
    private http:HttpClient
  ) { }

  getAllArticles(){
    return this.http.get(this.baseUrl+'/all')
      .pipe(map(res =>res))
  }

  getArticleRevs(title){
    let params = new HttpParams().set('title',title);
    return this.http.get(this.baseUrl+'/individual/revisions',{params:params})
      .pipe(map(res=>res))
  }

  getArticleInfo(title){
    let params = new HttpParams().set('title',title);
    return this.http.get(this.baseUrl+'/individual',{params:params})
      .pipe(map(res=>res))
  }

  getArticleTop5(title,users){
    let params = new HttpParams().set('title',title)
      .set('users',users);
    //console.log(params)
    return this.http.get(this.baseUrl+'/individual/top5',{params:params})
      .pipe(map(res=>res))
  }
}
