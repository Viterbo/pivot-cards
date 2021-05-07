import { Component, HostBinding, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService } from 'src/app/services/deck.service';
import { AppPage, AppService } from 'src/app/services/common/app.service';

@Component({
    selector: 'home-page',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements AppPage, OnDestroy {


    @HostBinding('class') class = 'box';

    public path: RegExp = /\/home/i;
    page: AppPage;
    toilet_card_fade:string;
    private onWindowResize: Subscriber<any>;
    show_errors:boolean;
    
    public industria;

    constructor(
        public app: AppService,
        public router: Router,
        public deck: DeckService,
        public local: LocalStringsService,
    ) {
        this.toilet_card_fade = "";
        this.class = this.app.device.class;
        console.log("HomePage.constructor()",this.class);
        this.onWindowResize = new Subscriber<any>(this.handleWindowResize.bind(this));
        this.app.subscribeOnEnterPage(this);
    }

    handleWindowResize() {
        this.class = this.app.device.class;
        console.log("HomePage.handleWindowResize()",this.class);
    }

    async ngOnInit() {
        this.show_errors = false;
        this.app.onWindowResize.subscribe(this.onWindowResize);
        await this.deck.waitLoaded;
    }
    
    async ngOnDestroy() {
        this.onWindowResize.unsubscribe();
        this.onEnterPage();
        this.app.unsubscribeOnEnterPage(this);
    }

    async onEnterPage() {
        await this.deck.waitLoaded;
        this.deck.resetCanvas();
        this.deck.resetSelection();
    }
    

    
    onDinamica(dinamica:number) {
        console.log("onDinamica",dinamica);
        if (!this.deck.industria) {
            setTimeout(_ => {
                this.input.showErrors();
                this.show_errors = true;    
            }, 10);
            return;
        }
        switch(dinamica){
            case 1: return this.router.navigate(['/selection']); 
            case 2: return this.router.navigate(['/filter']); 
            case 3: return this.router.navigate(['/slots']); 
        }
    }


    debug() {
        console.log("-- Debug --");
        console.log(this);
    }



    // onInput(algo) {
    //     console.log("onInput()", algo);
    // }


    input: PivotIndustriaInputComponent;
    onIndustriaInit(input: PivotIndustriaInputComponent) {
        this.input = input;
        // this.input.showErrors();
    }

    ctrl = new FormControl('', [
        Validators.required,
    ]);

    matcher = new MyErrorStateMatcher();    
}

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      const isSubmitted = form && form.submitted;
      return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';import { PivotIndustriaInputComponent } from 'src/app/components/pivot-industria-input/pivot-industria-input.component';
import { LocalStringsService } from 'src/app/services/common/common.services';

