import { Component, HostBinding, AfterViewInit, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService, Card } from 'src/app/services/deck.service';
import { CardSlotComponent } from 'src/app/components/card-slot/card-slot.component';

@Component({
    selector: 'canvas-page',
    templateUrl: 'canvas.page.html',
    styleUrls: ['canvas.page.scss'],
})
export class CanvasPage implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

    page: string = "canvas";
    slots: {[name:string]:CardSlotComponent};
    pitch: string;
    initialized: boolean;

    selected: {[key:string]:number};
    
    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public deck: DeckService,
    ) {
        this.pitch = "";
        this.slots = {};
        this.selected = {
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
        };
        this.initialized = false;
    }
    
    btnDisable(color:string) {
        return this.selected[color] == 1;
    }

    btnHidden(color:string) {
        return this.selected[color] == 0;
    }

    private init() {
        if (this.initialized) return;
        this.initialized = true;
        console.debug("CanvasPage.init()");
        this.route.queryParams.subscribe(params => {
            console.debug("CanvasPage.init() params:", params);
            if (params && params.keepcanvas) {
                
            } else {
                this.deck.resetCanvas();
                this.deck.sortDeck(this.deck.subset);
                this.updateSelected();
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

    back() {
        window.history.back();
    }

    print() {
        // alert("Imprimir hoja A4 con canvas y pitch");
        console.log("this.deck", this.deck);
    }

    goHome() {
        this.initialized = false;
        this.router.navigate(['/home'], );
    }

    registerSlot(name:string, slot: CardSlotComponent) {
        this.slots[name] = slot;
        // slot.shuffle();
    }

    onCardChange(color, card) {
        if (!card) return;
    }

    next(color:string) {
        this.slots[color].next();
    }
    
    prev(color:string) {
        this.slots[color].prev();
    }

    agregar(card:Card) {
        console.log("CanvasPage.agregar", card);
        this.deck.addToCanvas(card);
        this.slots[card.color].update();
        this.pitch = this.deck.getPitch();
        this.updateSelected();
    }
    
    descartar(card:Card) {
        console.log("CanvasPage.descartar", card);
        this.deck.removeFromCanvas(card);
        this.slots[card.color].update();
        this.pitch = this.deck.getPitch();
        this.updateSelected();
    }

    onIndusstriaChange() {
        this.pitch = this.deck.getPitch();
    }

    updateSelected() {
        this.selected.red = this.deck.filterColor('red', this.deck.subset).length;
        this.selected.blue = this.deck.filterColor('blue', this.deck.subset).length;
        this.selected.green = this.deck.filterColor('green', this.deck.subset).length;
        this.selected.yellow = this.deck.filterColor('yellow', this.deck.subset).length;
    }
    
}
