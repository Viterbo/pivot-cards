import { Component, HostBinding, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService } from 'src/app/services/deck.service';
import { AppPage, AppService } from 'src/app/services/common/app.service';
import { CardSlotComponent } from 'src/app/components/card-slot/card-slot.component';
import { LocalStringsService } from 'src/app/services/common/common.services';


@Component({
    selector: 'slots-page',
    templateUrl: 'slots.page.html',
    styleUrls: ['slots.page.scss'],
})
export class SlotsPage implements AppPage, OnDestroy {

    public path: RegExp = /\/slots/i;;
    page: AppPage;
    slots: {[name:string]:CardSlotComponent} = {};
    holds: {[name:string]:boolean} = {};
    interactionAllowed: boolean;
    constructor(
        public router: Router,
        public deck: DeckService,
        public app: AppService,
        public local: LocalStringsService,
    ) {
        this.interactionAllowed = true;
        this.app.subscribeOnEnterPage(this);
    }

    get showGoToCanvas() {
        return this.deck.isCanvasOK();
    }

    onEnterPage() {
        this.clearAll();
    }

    ngOnDestroy() {
        this.app.unsubscribeOnEnterPage(this);
    }

    addSlotsToCanvas(until: number) {
        console.log("addSlotsToCanvas()", until);
        // this.deck.resetCanvas();
        switch (until) {
            case 4: this.deck.addToCanvas(this.slots.yellow.getCard()); break;
            case 3: this.deck.addToCanvas(this.slots.green.getCard()); break;
            case 2: this.deck.addToCanvas(this.slots.blue.getCard()); break;
            case 1: this.deck.addToCanvas(this.slots.red.getCard()); break;
        }
        this.interactionAllowed = this.deck.isCanvasOK(); // case 4 (el pitch vuelve a ser editable)
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
            if (this.holds.red) {
                this.addSlotsToCanvas(1);
            } else {
                this.timer1 = setTimeout(_ => { this.addSlotsToCanvas(1); }, 2000);
            }
            if (this.holds.blue) {
                this.addSlotsToCanvas(2);
            } else {
                this.timer2 = setTimeout(_ => { this.addSlotsToCanvas(2); }, 3000);
            }
            if (this.holds.green) {
                this.addSlotsToCanvas(3);
            } else {
                this.timer3 = setTimeout(_ => { this.addSlotsToCanvas(3); }, 4000);
            }
            if (this.holds.yellow) {
                this.addSlotsToCanvas(4);
            } else {
                this.timer4 = setTimeout(_ => { this.addSlotsToCanvas(4); }, 5000);
            }
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
        this.interactionAllowed = false;
        ///if (!this.holds.red) this.slots.red.shuffle();
        ///if (!this.holds.blue) this.slots.blue.shuffle();
        ///if (!this.holds.green) this.slots.green.shuffle();
        ///if (!this.holds.yellow) this.slots.yellow.shuffle();

        this.slots.red.shuffle(!this.holds.red);
        this.slots.blue.shuffle(!this.holds.blue);
        this.slots.green.shuffle(!this.holds.green);
        this.slots.yellow.shuffle(!this.holds.yellow);
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

    clearAll() {
        this.interactionAllowed = true;
        this.holds = {};
        this.deck.resetSelection();
        this.deck.resetCanvas();
        this.deck.updatePitch();
        this.clearTimers();
        this.clearSlots();
    }

    // botón hold
    
    hold(name:string, slot: CardSlotComponent) {
        if (!this.interactionAllowed) return;
        if (parseInt(slot.card.card) > 0) {
            this.holds[name] = true;
        }        
    }

}
