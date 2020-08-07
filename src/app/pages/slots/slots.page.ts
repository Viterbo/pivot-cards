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
    toilet_card_fade:string;
    pitch: string;
    // private onToiletSelectedSubscriber: Subscriber<any>;
    // @ViewChild(CardSlotComponent) slot_red: CardSlotComponent;
    // @ViewChild(CardSlotComponent) slot_blue: CardSlotComponent;
    // @ViewChild(CardSlotComponent) slot_green: CardSlotComponent;
    // @ViewChild(CardSlotComponent) slot_yellow: CardSlotComponent;
    slots: {[name:string]:CardSlotComponent};

    constructor(
        public router: Router,
        public deck: DeckService,
        public app: AppService,
    ) {
        this.slots = {};
        this.toilet_card_fade = "";
        this.pitch = "";
        // this.onToiletSelectedSubscriber = new Subscriber<any>(this.onToiletSelected.bind(this));
    }

    ngOnInit() {
        // this.toilets.onSelected.subscribe(this.onToiletSelectedSubscriber);
    }


    ngOnDestroy() {
        // this.onToiletSelectedSubscriber.unsubscribe();
    }

    toCanvas() {
        this.router.navigate(['/canvas']); 
    }

    timer = null;
    updateResultado() {
        console.log("updateResultado()");
        clearTimeout(this.timer);
        this.timer = setTimeout(_ => {
            console.log("updateResultado() timeout");
            this.deck.resetCanvas();
            this.deck.addToCanvas(this.slots.red.getCard());
            this.deck.addToCanvas(this.slots.blue.getCard());
            this.deck.addToCanvas(this.slots.green.getCard());
            this.deck.addToCanvas(this.slots.yellow.getCard());
            this.pitch = this.deck.getPitch();
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
        this.slots.red.run();
        this.slots.blue.run();
        this.slots.green.run();
        this.slots.yellow.run();
    }

    

}
