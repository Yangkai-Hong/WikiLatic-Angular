import { Component, OnInit } from '@angular/core';
import { ValidateService } from "../../services/validate.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  constructor(
    private validateService: ValidateService,
    private flashMessageService: FlashMessagesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

  }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // Required Fields
    if(!this.validateService.validateRegister(user)){
      //console.log('Please fill in all fields');
      this.flashMessageService.show('Please fill in all fields',{cssClass:'alert-danger', timeout:3000});
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(user.email)){
      //console.log('Please use a valid email');
      this.flashMessageService.show('Please use a valid email',{cssClass:'alert-danger', timeout:3000});
      return false;
    }

    // Register User
    this.authService.registerUser(user).subscribe(data =>{
      //console.log(data['success'])
    if (data['success'] == true){
      this.flashMessageService.show('You are now registered and can log in',{cssClass:'alert-success',timeout:3000})
      this.router.navigate(['/login'])
    } else {
      this.flashMessageService.show('',{cssClass:'alert-danger',timeout:3000})
      this.router.navigate(['/register'])
    }
    })
  }
}
