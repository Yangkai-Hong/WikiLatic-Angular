import { Injectable } from '@angular/core';
import { HttpClient,HttpParams} from "@angular/common/http";
import {map} from "rxjs/operators";
import {Params} from "@angular/router";

@Injectable(
  {providedIn: 'root'}
)
export class AuthorService {
  //baseUrl = "http://localhost:3000/author"
	baseUrl = "https://www.hyk.party/author"

  constructor(
    private http:HttpClient
  ) { }

  getAllUniqueAuthors(){
    return this.http.get(this.baseUrl+'/all')
      .pipe(map(res=>res))
  }

  getRevsOfAuthor(author){
    let params = new HttpParams().set('author',author)
    return this.http.get(this.baseUrl+'/revisions',{params:params})
      .pipe(map(res=>res))
  }
}
