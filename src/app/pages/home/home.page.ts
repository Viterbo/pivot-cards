import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService } from 'src/app/services/deck.service';
import { AppService } from 'src/app/services/common/app.service';

@Component({
    selector: 'home-page',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {


    @HostBinding('class') class = 'box';

    page: string = "home";
    toilet_card_fade:string;
    private onWindowResize: Subscriber<any>;
    show_errors:boolean;
    
    public industria;

    constructor(
        public app: AppService,
        public router: Router,
        public deck: DeckService,
    ) {
        this.toilet_card_fade = "";
        this.class = this.app.device.class;
        console.log("HomePage.constructor()",this.class);
        this.onWindowResize = new Subscriber<any>(this.handleWindowResize.bind(this));
    }

    handleWindowResize() {
        this.class = this.app.device.class;
        console.log("HomePage.handleWindowResize()",this.class);
    }

    ngOnInit() {
        this.show_errors = false;
        this.app.onWindowResize.subscribe(this.onWindowResize);
    }


    ngOnDestroy() {
        this.onWindowResize.unsubscribe();
    }

    
    onCardClick(card) {
        console.log("onCardClick",card);
        if (!this.deck.industria) {
            this.show_errors = true;
            return;
        }
        // this.router.navigate(['/home']);
        this.deck.resetCanvas();
        this.deck.resetSelection();
        switch(card){
            case 1: return this.router.navigate(['/selection']); 
            case 2: return this.router.navigate(['/filter']); 
            case 3: return this.router.navigate(['/slots']); 
        }
    }

    // onInput(algo) {
    //     console.log("onInput()", algo);
    // }

    //  TEMP-----------------------------------------
    task: Task = {
        name: 'Indeterminate',
        completed: false,
        color: 'primary',
        subtasks: [
          {name: 'Primary', completed: false, color: 'primary'},
          {name: 'Accent', completed: false, color: 'accent'},
          {name: 'Warn', completed: false, color: 'warn'}
        ]
    };
    
    
    allComplete: boolean = false;
    
    updateAllComplete() {
      this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    }
  
    someComplete(): boolean {
      if (this.task.subtasks == null) {
        return false;
      }
      return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
    }
  
    setAll(completed: boolean) {
      this.allComplete = completed;
      if (this.task.subtasks == null) {
        return;
      }
      this.task.subtasks.forEach(t => t.completed = completed);
    }    
    //  TEMP-----------------------------------------

}


import {ThemePalette} from '@angular/material/core';
export interface Task {
    name: string;
    completed: boolean;
    color: ThemePalette;
    subtasks?: Task[];
}