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
    
    initialized: boolean;
    lockcanvas: boolean;
    useCanvasExtended: boolean;
    useCardsExtended: boolean;

    // selected: {[key:string]:number};
    
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public deck: DeckService,
        public app: AppService
    ) {
        this.lockcanvas = false;
        this.useCanvasExtended = true;
        this.useCardsExtended = true;
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

    get showPrintBtn() {
        return this.deck.isCanvasOK();
    }

    onEditPitch(pitch: string) {
        this.deck.setPitch(pitch);
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
                this.deck.getPitch();
                this.deck.resetCanvas();
                this.deck.sortDeck(this.deck.subset);
            }
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
        // console.log("CanvasPage.agregar", card);
        this.deck.addToCanvas(card);
        this.slots.update();
        this.deck.getPitch();
    }

    descartar(card:Card) {
        if (this.lockcanvas) {
            return;
        }
        // console.log("CanvasPage.descartar", card);
        this.deck.removeFromCanvas(card);
        this.slots.update();
        this.deck.getPitch();
    }
    
    

    onIndustriaChange() {
        this.deck.getPitch();
    }

    slots: PivotFourSlotsComponent;
    onSlotsReady(slots: PivotFourSlotsComponent) {
        this.slots = slots;
    }    
    
}
