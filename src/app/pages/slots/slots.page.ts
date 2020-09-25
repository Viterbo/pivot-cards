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


    timer = null;
    updateResultado() {
        console.log("updateResultado()");
        clearTimeout(this.timer);
        this.timer = setTimeout(_ => {
            console.log("updateResultado() timeout");
            this.deck.resetCanvas();
            this.deck.addToCanvas(this.slots.red.getCard());
            //this.deck.addToCanvas(this.slots.blue.getCard());
            //this.deck.addToCanvas(this.slots.green.getCard());
            //this.deck.addToCanvas(this.slots.yellow.getCard());
            //this.deck.getPitch();
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
        console.error("cosas sacadas temporalmente");
        // this.slots.blue.shuffle();
        // this.slots.green.shuffle();
        // this.slots.yellow.shuffle();
    }
    
    toCanvas() {
        this.router.navigate(['/canvas'], {
            queryParams: {
                lockcanvas:true
            }
        }); 
    }

}
