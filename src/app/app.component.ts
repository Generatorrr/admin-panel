import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ObjectToSend } from "./interfaces";
import { Router } from "@angular/router";
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private router: Router, public toastr: ToastsManager, vcr: ViewContainerRef, private http: HttpClient) {
    this.toastr = toastr;
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit(): void {

    console.log($('#'))

    if(this.router.url !== '/')
      this.getResults(this.router.url.slice(1));
  }

  selected = ['Clear', '3', '4', '5', '6', '7', '8', '10', '12'];
  matOptions = {
    BDSM: { 'Clear': {}, '3': {}, '4': {}, '5': {}, '6': {}, '7': {}, '8': {}, '10': {}, '12': {} },
    Accounting: { 'Clear': {}, '3': {}, '4': {}, '5': {}, '6': {}, '7': {}, '8': {}, '10': {}, '12': {} },
    QA: { 'Clear': {}, '3': {}, '4': {}, '5': {}, '6': {}, '7': {}, '8': {}, '10': {}, '12': {} },
    Embedded: { 'Clear': {}, '3': {}, '4': {}, '5': {}, '6': {}, '7': {}, '8': {}, '10': {}, '12': {} },
    Web: { 'Clear': {}, '3': {}, '4': {}, '5': {}, '6': {}, '7': {}, '8': {}, '10': {}, '12': {} },
    Mobile: { 'Clear': {}, '3': {}, '4': {}, '5': {}, '6': {}, '7': {}, '8': {}, '10': {}, '12': {} },
    ZGames: { 'Clear': {}, '3': {}, '4': {}, '5': {}, '6': {}, '7': {}, '8': {}, '10': {}, '12': {} },
    CrossDevice: { 'Clear': {}, '3': {}, '4': {}, '5': {}, '6': {}, '7': {}, '8': {}, '10': {}, '12': {} },
    HR: { 'Clear': {}, '3': {}, '4': {}, '5': {}, '6': {}, '7': {}, '8': {}, '10': {}, '12': {} }
  };
  pointsSent = false;
  results: Array<object>;
  objectToSend: ObjectToSend = {
    fromWho: '',
    results: {}
  };
  show:boolean = false;
  toggleCollapse() {
    this.show = !this.show
  }

  getResults(department: string) {

    fetch('/resultsForAdmin/' + department,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "GET"
      })
      .then((data) => {
        return data.json();
      } )
      .then( (data) => {
        this.results = data;
      })
      .then( () => {
        console.log(this.results);
        this.objectToSend.fromWho = this.router.url.slice(1);
        this.objectToSend.results = {};

        for (let i = 0; i < this.results.length; i++){
          if ( this.results[i]['fromWho'] === this.router.url.slice(1) ){
            for ( let option in this.matOptions ) {
              for ( let point in this.matOptions[option] ) {
                this.matOptions[option][point].disabled = true;
              }
            }
            break;
          }
        }
      })
      .catch( (err) => {
        return this.toastr.error(err.message, err.status);
      })
  }

  pointsToDepartment(event: any, department: string) {
    event.source._id = department + event.source.value;
    this.matOptions[department][`${event.source.value}`] = event.source;

    if ( this.objectToSend.results[department] ){
      this.matOptions[department]['Clear'].disabled = false;
    } else {
      this.matOptions[department]['Clear'].disabled = true;
    }

    if( event.source.selected ) {
      if(event.source.value !== 'Clear'){
        this.objectToSend.fromWho = this.router.url.slice(1);
        this.objectToSend.results[department] = event.source.value;
        for ( let option in this.matOptions[department] ){
          if ( this.matOptions[department][option].value != 'Clear'){
            this.matOptions[department][option].disabled = true;
          }
        }
        for ( let object in this.matOptions ){
          this.matOptions[object][event.source.value].disabled = true;
        }
        console.log(this.objectToSend);
      }
      if (event.source.value === 'Clear'){
        if ( !this.objectToSend.results ){
          for ( let option in this.matOptions[department] ) {
            this.matOptions[department][option].disabled = false;
          }
        }
        if ( this.objectToSend.results ){
          if (this.objectToSend.results[department]){
            for ( let object in this.matOptions ) {
              for (let point in this.matOptions[object]){
                for (let key in this.objectToSend.results) {
                  if (this.matOptions[object][point] !== 'Clear'){
                    this.matOptions[object][this.objectToSend.results[key]].disabled = true;
                  }
                }
              }
            }
            delete this.objectToSend.results[department];
            console.log(this.objectToSend);
          }
          let values = Object.values(this.objectToSend.results);
          if ( values.length !== 0 ){
            for ( let option in this.matOptions ) {
              for ( let point in this.matOptions[option] ) {
                if ( !this.objectToSend.results.hasOwnProperty(option) ){
                  for ( let i = 0; i < values.length; i++ ){
                    if ( point === values[i] ){
                      this.matOptions[option][point].disabled = true;
                      break;
                    } else {
                      this.matOptions[option][point].disabled = false;
                    }
                  }
                }
              }
            }
          } else {
            for ( let option in this.matOptions ) {
              for ( let point in this.matOptions[option] ) {
                if ( point !== 'Clear' ){
                  this.matOptions[option][point].disabled = false;
                } else {
                  this.matOptions[option][point].disabled = true;
                }
              }
            }
          }
        }
      }
    }
  }



  sendPoints(reqObj: ObjectToSend, points: string, event: any) {

    let object: ObjectToSend = {
      fromWho: reqObj.fromWho,
      results: {}
    };

    switch (points) {
      case 'low':
        for ( let key in reqObj.results ){
          if ( reqObj.results[key] === '3' || reqObj.results[key] === '4' || reqObj.results[key] === '5' ){
            object.results[key] = parseInt( reqObj.results[key] );
          }
        }
        if ( Object.values(object.results).length !== 3 ){
          return this.toastr.error('Please, choose departments for 3, 4 and 5 points!', 'Oops!');
        }
        break;
      case '6':
        for ( let key in reqObj.results ){
          if ( reqObj.results[key] === '6'){
            object.results[key] = parseInt( reqObj.results[key] );
          }
        }
        if ( Object.values(object.results).length !== 1 ){
          return this.toastr.error('Please, choose department for 6 points!', 'Oops!');
        }
        break;
      case '7':
        for ( let key in reqObj.results ){
          if ( reqObj.results[key] === '7' ){
            object.results[key] = parseInt( reqObj.results[key] );
          }
        }
        if ( Object.values(object.results).length !== 1 ){
          return this.toastr.error('Please, choose department for 7 points!', 'Oops!');
        }
        break;
      case '8':
        for ( let key in reqObj.results ){
          if ( reqObj.results[key] === '8' ){
            object.results[key] = parseInt( reqObj.results[key] );
          }
        }
        if ( Object.values(object.results).length !== 1 ){
          return this.toastr.error('Please, choose department for 8 points!', 'Oops!');
        }
        break;
      case '10':
        for ( let key in reqObj.results ){
          if ( reqObj.results[key] === '10' ){
            object.results[key] = parseInt( reqObj.results[key] );
          }
        }
        if ( Object.values(object.results).length !== 1 ){
          return this.toastr.error('Please, choose department for 10 points!', 'Oops!');
        }
        break;
      case '12':
        for ( let key in reqObj.results ){
          if ( reqObj.results[key] === '12' ){
            object.results[key] = parseInt( reqObj.results[key] );
          }
        }
        if ( Object.values(object.results).length !== 1 ){
          return this.toastr.error('Please, choose department for 12 points!', 'Oops!');
        }
        break;
      default:
        alert('Something went wrong...');
    }
    console.log(this.objectToSend);

    fetch('/',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(object)
      })
      .then(function (res) {
        return res.json();
      })
      .then((res) => {
        return this.toastr.success(res.title, 'Success!');
      })
      .catch((err) => {
        return this.toastr.error(err.message, 'Server error!');
      })

  }

  dropDepartmentPoints (department: string){
    fetch('/dropDepartmentPoints/' + department,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "DELETE"
      })
      .then(function (res) {
        return res.json();
      })
      .then( (res) => {
        this.toastr.success(res.title, 'Success delete!');
        setTimeout(function () {
          return window.location.reload();
        }, 2000);
      })
      .catch( (err) => {
        return this.toastr.error(err, 'Error while delete!');
      })
  }

  changeDepartment(department: 'string'){

    fetch('/changeDepartment',
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({title: department})
      })
      .then(function (res) {
        return res.json();
      })
      .then( (res) => {
        this.toastr.success(res.title, 'Success!');
        return window.location.reload();
      })
      .catch( (err) => {
        return this.toastr.error(err.message, 'Error!');
      })
  }

}
