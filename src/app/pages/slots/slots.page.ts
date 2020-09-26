import { Component, HostBinding, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService } from 'src/app/services/deck.service';
import { AppService } from 'src/app/services/common/app.service';
import { CardSlotComponent } from 'src/app/components/card-slot/card-slot.component';

@Component({
    selector: 'slots-page',
    templateUrl: 'slots.page.html',
    styleUrls: ['slots.page.scss'],
})
export class SlotsPage {

    page: string = "slots";
    slots: {[name:string]:CardSlotComponent};

    constructor(
        public router: Router,
        public deck: DeckService,
        public app: AppService,
    ) {
        this.slots = {};
        this.deck.resetCanvas();
    }

    get showGoToCanvas() {
        return this.deck.isCanvasOK();
    }

    ngOnInit() {
        // this.toilets.onSelected.subscribe(this.onToiletSelectedSubscriber);
    }


    ngOnDestroy() {
        // this.onToiletSelectedSubscriber.unsubscribe();
    }

    onIndustriaChange() {
        this.deck.getPitch();
    }

    onEditPitch(pitch: string) {
        this.deck.setPitch(pitch);
    }

    addSlotsToCanvas(until: number) {
        this.deck.resetCanvas();
        switch (until) {
            case 4: this.deck.addToCanvas(this.slots.yellow.getCard());
            case 3: this.deck.addToCanvas(this.slots.green.getCard());
            case 2: this.deck.addToCanvas(this.slots.blue.getCard());
            case 1: this.deck.addToCanvas(this.slots.red.getCard());
        }
        this.deck.getPitch();
    }


    timer = null;
    timer1 = null;
    timer2 = null;
    timer3 = null;
    timer4 = null;
    updateResultado() {
        console.log("updateResultado()");
        clearTimeout(this.timer);
        clearTimeout(this.timer1);
        clearTimeout(this.timer2);
        clearTimeout(this.timer3);
        clearTimeout(this.timer4);
        this.timer = setTimeout(_ => {
            console.log("updateResultado() timeout");
            this.deck.resetCanvas();
            this.deck.getPitch();
            this.timer1 = setTimeout(_ => { this.addSlotsToCanvas(1); }, 2000);
            this.timer2 = setTimeout(_ => { this.addSlotsToCanvas(2); }, 3000);
            this.timer3 = setTimeout(_ => { this.addSlotsToCanvas(3); }, 4000);
            this.timer4 = setTimeout(_ => { this.addSlotsToCanvas(4); }, 5000);
            console.error("cosas sacadas temporalmente");
        }, 10);
    }

    onCardChange(color, card) {
        console.log("onCardChange",[color, card]);
        if (card) {
            this.updateResultado();
        }
    }

    registerSlot(name:string, slot: CardSlotComponent) {
        this.slots[name] = slot;
    }

    runSlots() {
        this.slots.red.shuffle();
        this.slots.blue.shuffle();
        this.slots.green.shuffle();
        this.slots.yellow.shuffle();
        console.error("cosas sacadas temporalmente");
    }
    
    toCanvas() {
        this.router.navigate(['/canvas'], {
            queryParams: {
                lockcanvas:true
            }
        }); 
    }

}
