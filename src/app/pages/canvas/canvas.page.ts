import { Component, HostBinding, AfterViewInit, OnInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService } from 'src/app/services/deck.service';
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
    
    constructor(
        public router: Router,
        public deck: DeckService,
    ) {
        console.log("this.deck", this.deck);
        this.pitch = "";
        this.slots = {};
        this.initialized = false;

        // this.pitch = this.deck.getPitch();
    }

    private init() {
        if (this.initialized) return;
        this.initialized = true;
        console.log("* this.deck.sortDeck(this.deck.selection); !!!!!!!!!!!!!!");
        this.deck.sortDeck(this.deck.selection);
    }


    ngAfterViewChecked() {
        console.log("* ngAfterViewChecked()");
        this.init();
    }

    ngAfterViewInit() {

    }

    ngOnInit() {}

    ngOnDestroy() {
        console.log("* ngOnDestroy()");
        
    }

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
        console.log("CanvasPage.onCardChange()",[color, card]);
        if (!card) return;
    }

    next(color:string) {
        this.slots[color].next();
    }
    
    prev(color:string) {
        this.slots[color].prev();
    }
    
}
