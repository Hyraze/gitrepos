import { Component, OnInit } from '@angular/core';
import { NbSidebarService, NbThemeService } from '@nebular/theme';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private sidebarService: NbSidebarService, private themeService: NbThemeService,private spinner: NgxSpinnerService) {}
  title = 'gitrepos';
  sun = 'sun';
  moon = 'moon';
  icon = this.sun;

  items = [
    {
      title: 'Trending Repos',
      icon: 'book',
      link: '/trending',
      pathMatch: '/full'
    },
    {
      title: 'Trending Devs',
      icon: 'people',
      link: '/developer',
      pathMatch: '/full'
    },
    {
      title: 'About',
      icon: 'heart',
      link: '/about',
      pathMatch: '/full'
    },
  {
      title: 'Techbite',
      icon: 'code-outline',
      url: 'https://tx.me/techbite',
      target: '_blank'
    },
    {
      title: 'Community',
      icon: 'paper-plane-outline',
      url: 'https://tx.me/gitrepos',
      target: '_blank',
    },
  ];

  toggle() {
    this.sidebarService.toggle(false, 'right');
     }
     collapseAll(){
      this.sidebarService.toggle(false, 'right');

     }

  changeTheme() {
    if (this.icon === this.sun) {
      this.themeService.changeTheme('default');
      this.icon = this.moon;
    } else {
      this.themeService.changeTheme('cosmic');
      this.icon = this.sun;
    }
  }
  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();
 
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
  }
}
