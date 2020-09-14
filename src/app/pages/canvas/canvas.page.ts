import { Component, HostBinding, AfterViewInit, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService, Card } from 'src/app/services/deck.service';
import { CardSlotComponent } from 'src/app/components/card-slot/card-slot.component';
import { PivotFourSlotsComponent } from 'src/app/components/pivot-four-slots/pivot-four-slots.component';
import { AppService } from 'src/app/services/common/app.service';

@Component({
    selector: 'canvas-page',
    templateUrl: 'canvas.page.html',
    styleUrls: ['canvas.page.scss'],
})
export class CanvasPage implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

    page: string = "canvas";
    // slots: {[name:string]:CardSlotComponent};
    pitch: string;
    initialized: boolean;
    lockcanvas: boolean;
    useDescription: boolean;

    // selected: {[key:string]:number};
    
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public deck: DeckService,
        public app: AppService
    ) {
        this.lockcanvas = false;
        this.pitch = "";
        this.useDescription = true;
        // this.slots = {};
        /*
        this.selected = {
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
        };
        */
        this.initialized = false;
    }
    /*
    btnDisable(color:string) {
        return this.selected[color] == 1;
    }

    btnHidden(color:string) {
        return this.selected[color] == 0;
    }
    */


    onEditPitch(pitch: string) {
        this.pitch = pitch;
    }

    private init() {
        if (this.initialized) return;
        this.initialized = true;
        console.debug("CanvasPage.init()");
        this.route.queryParams.subscribe(params => {
            console.debug("CanvasPage.init() params:", params);
            if (params && params.lockcanvas) {
                this.lockcanvas = true;
            } else {
                this.deck.resetCanvas();
                this.deck.sortDeck(this.deck.subset);
            }
            this.updatePitch();
        });
    }

    ngAfterViewChecked() {
        this.init();
    }

    ngAfterViewInit() {

    }

    ngOnInit() {}

    ngOnDestroy() {}

    
    print() {
        // alert("Imprimir hoja A4 con canvas y pitch");
        console.log("this.deck", this.deck);
    }

    goHome() {
        this.initialized = false;
        this.router.navigate(['/home'], );
    }

    agregar(card:Card) {
        console.log("CanvasPage.agregar", card);
        this.deck.addToCanvas(card);
        this.slots.update();
        this.updatePitch();
    }

    descartar(card:Card) {
        if (this.lockcanvas) {
            return;
        }
        console.log("CanvasPage.descartar", card);
        this.deck.removeFromCanvas(card);
        this.slots.update();
        this.updatePitch();
    }
    
    updatePitch() {
        this.pitch = this.deck.getPitch();
    }

    onIndusstriaChange() {
        this.updatePitch();
    }

    slots: PivotFourSlotsComponent;
    onSlotsReady(slots: PivotFourSlotsComponent) {
        this.slots = slots;
    }    
    
}
