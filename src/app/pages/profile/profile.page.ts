import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { FirebaseAuth } from '@angular/fire';
import { AngularFirestore } from "@angular/fire/firestore";
import { async } from 'rxjs/internal/scheduler/async';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {
  userEmail: string;
  email: string;
  password: string;
  currentUser : any;
  loggedIn : boolean;
  userNameFromAuth$ = new Subject<string>();
  hasEmailVerification : boolean;

  constructor(private db : AngularFirestore, private authService: AuthService, private fauthService: AngularFireAuth, public router: Router) { 
    //this.loggedIn = this.authService.isLoggedIn;

    fauthService.auth.onAuthStateChanged(function(user) {
      if (user) {
        console.log("logged");
        this.loggedIn = this.authService.isLoggedIn;
        this.userEmail = this.authService.userDetails().email;
        // User is signed in.
      } else {
        console.log("notlogged")
        // No user is signed in.
      }
    });
  }

  verifyEmail(){
    this.fauthService.authState.subscribe(user =>{
      if(user){
        this.hasEmailVerification = this.fauthService.auth.currentUser.emailVerified;
        if(this.hasEmailVerification){
          this.onSubmitLogin();
        }
      }
    });
  }

  ngOnInit(){   

  }

  ionViewWillEnter(){
    this.loggedIn = this.authService.isLoggedIn;
    this.userEmail = this.authService.userDetails().email;
    //this.userNameFromAuth = this.authService.userName;
    //this.userName = this.authService.userDetails().email.split('@')[0];
    //this.userName = this.authService.userDetails().displayName;
    //this.userName = user.displayName;
    //console.log(this.userNameFromAuth + " - " + this.userEmail + " - " + this.loggedIn);
  }

  onSubmitLogin()
  {
    this.authService.login(this.email, this.password).then( res =>{
      console.log("Log In exitoso");
      //this.loggedIn = true;
     // console.log(this.getUsername());

      
      this.router.navigate(['/tabs/food/']);
    }).catch(err => alert('los datos son incorrectos o no existe el usuario'))

  }

  Onlogout(){
    console.log("Saliste de la sesión");
    this.authService.logoutUser();
    this.reload();
    //this.router.navigate(['/tabs/profile/']);
  }

  reload() {
    window.location.reload();
  }
  
}