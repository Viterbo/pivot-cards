import { Component, HostBinding, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService } from 'src/app/services/deck.service';
import { AppPage, AppService } from 'src/app/services/common/app.service';
import { CardSlotComponent } from 'src/app/components/card-slot/card-slot.component';

@Component({
    selector: 'slots-page',
    templateUrl: 'slots.page.html',
    styleUrls: ['slots.page.scss'],
})
export class SlotsPage implements AppPage, OnDestroy {

    public path: RegExp = /\/slots/i;;
    page: AppPage;
    slots: {[name:string]:CardSlotComponent};

    constructor(
        public router: Router,
        public deck: DeckService,
        public app: AppService,
    ) {
        this.slots = {};
        this.app.subscribeOnEnterPage(this);
    }

    get showGoToCanvas() {
        return this.deck.isCanvasOK();
    }

    onEnterPage() {
        this.deck.resetSelection();
        this.deck.resetCanvas();
        this.deck.updatePitch();
        this.clearTimers();
        this.clearSlots();
    }

    ngOnDestroy() {
        this.app.unsubscribeOnEnterPage(this);
    }

    onIndustriaChange() {
        this.deck.updatePitch();
    }

    addSlotsToCanvas(until: number) {
        this.deck.resetCanvas();
        switch (until) {
            case 4: this.deck.addToCanvas(this.slots.yellow.getCard());
            case 3: this.deck.addToCanvas(this.slots.green.getCard());
            case 2: this.deck.addToCanvas(this.slots.blue.getCard());
            case 1: this.deck.addToCanvas(this.slots.red.getCard());
        }
        this.deck.updatePitch();
    }


    timer = null;
    timer1 = null;
    timer2 = null;
    timer3 = null;
    timer4 = null;
    clearTimers() {
        clearTimeout(this.timer);
        clearTimeout(this.timer1);
        clearTimeout(this.timer2);
        clearTimeout(this.timer3);
        clearTimeout(this.timer4);        
    }

    updateResultado() {
        console.log("updateResultado()");
        this.clearTimers();
        this.timer = setTimeout(_ => {
            console.log("updateResultado() timeout");
            this.deck.resetCanvas();
            this.deck.updatePitch();
            this.timer1 = setTimeout(_ => { this.addSlotsToCanvas(1); }, 2000);
            this.timer2 = setTimeout(_ => { this.addSlotsToCanvas(2); }, 3000);
            this.timer3 = setTimeout(_ => { this.addSlotsToCanvas(3); }, 4000);
            this.timer4 = setTimeout(_ => { this.addSlotsToCanvas(4); }, 5000);
            // console.error("cosas sacadas temporalmente");
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
        // console.error("cosas sacadas temporalmente");
    }

    clearSlots() {
        if (this.slots.red) this.slots.red.clear();
        if (this.slots.blue) this.slots.blue.clear();
        if (this.slots.green) this.slots.green.clear();
        if (this.slots.yellow) this.slots.yellow.clear();        
    }
    
    toCanvas() {
        this.router.navigate(['/canvas'], {
            queryParams: {
                lockcanvas:true
            }
        }); 
    }

}
