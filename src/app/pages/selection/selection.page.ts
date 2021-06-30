import { Component, ElementRef, HostBinding, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { DeckService, Deck, Card } from 'src/app/services/deck.service';
import { CardSlotComponent } from 'src/app/components/card-slot/card-slot.component';
import { PivotFourSlotsComponent } from 'src/app/components/pivot-four-slots/pivot-four-slots.component';
import { ColorCardListComponent } from 'src/app/components/color-card-list/color-card-list.component';
import { VpeAppPage, AppService, OnEnterPageHandler } from 'src/app/services/common/app.service';
import { PivotCounterComponent } from 'src/app/components/pivot-counter/pivot-counter.component';
import { LocalStringsService } from 'src/app/services/common/common.services';

@Component({
    selector: 'selection-page',
    templateUrl: 'selection.page.html',
    styleUrls: ['selection.page.scss'],
})
export class SelectionPage implements VpeAppPage, OnDestroy {

    
    
    filter_color: string;
    availables_filtered: Deck;
    selection_filtered: Deck;
    
    constructor(
        public router: Router,
        public deck: DeckService,
        public app: AppService,
        public local: LocalStringsService,
        public elementRef: ElementRef,
    ) {
        this.onEnterPage();
    }

    // Page common code block -------
    onResizeSuscriber: Subscriber<any> = null;
    page: OnEnterPageHandler;
    path: RegExp = /\/selection/i;
    sub: Subscription;
    async ngOnInit() {
        this.app.subscribePage(this);
    }
    async ngOnDestroy() {
        this.app.unsubscribePage(this);
    }
    onResize() {}
    async onEnterPage() {
        if (this.app.prev_path == "/canvas") return;
        console.log("SelectionPage.onEnterPage()");
        this.clearAll();
    }
    // --------------------------------


    clearAll() {
        this.deck.resetSelection();
        this.deck.resetCanvas();         
        this.clearCount();
        this.updateCounter();  
    }



    //*/
    /*
    get availables(): Deck {
        return this.availables_filtered;
    }

    get selection(): Deck {
        return this.selection_filtered;
    }*/

    get showGoToCanvas() {
        return this.deck.isSelectionOK();
    }
    /*
    ionViewWillEnter() {
        this.filterColor('all');
    }    

    onFinish() {
        console.debug("SelectionPage.onFinish()",[]);
    }
    
    filterColor(color) {
        // console.debug("PivotDeckComponent.filterColor()", color);
        this.filter_color = color;
        // this.availables_filtered = this.deck.filterColor(this.filter_color, this.deck.availables);
        // this.selection_filtered = this.deck.filterColor(this.filter_color, this.deck.selection);
        this.updateFiltered(this.availables_filtered, this.deck.availables);
        this.updateFiltered(this.selection_filtered, this.deck.selection);
    }
    
    ordenarSeleccion() {
        this.deck.sortDeck(this.deck.selection);
        // this.selection_filtered = this.deck.filterColor(this.filter_color, this.deck.selection);
        this.updateFiltered(this.selection_filtered, this.deck.selection);
    }

    ordenarAvailables() {
        this.deck.sortDeck(this.deck.availables);
        this.updateFiltered(this.availables_filtered, this.deck.availables);
    }
    

    updateFiltered(filtered:Deck, deck:Deck) {
        filtered.splice(0,filtered.length);
        for (let i=0; i<deck.length; i++) {
            let card = deck[i];
            if (card.color == this.filter_color || this.filter_color == 'all') {
                filtered.push(card);
            }
        }
        return filtered;
    }
    */

    debug: boolean;
    onCardClick(card:Card) {
        console.debug("PivotDeckComponent.onCardClick()", card);
        setTimeout(_ => {
            if (this.deck.isCardSelected(card)) {
                this.deck.deselectCard(card);
            } else {
                if (this.counter.count[card.color] >= 6) return;
                this.deck.selectCard(card);
            }
            this.debug = true;

            
            // this.updateFiltered(this.availables_filtered, this.deck.availables);
            // this.updateFiltered(this.selection_filtered, this.deck.selection);


            // this.updateSelected();
            if (this.slots) {
                this.slots.update();
            }

            for (let name in {red:!!0,blue:!!0,green:!!0,yellow:!!0}) {
                if (this.list[name]) {
                    this.list[name].update();
                }
            }
            
            this.updateCounter();

            this.debug = false;    
        });
    }

    goToCanvas() {
        this.router.navigate(['/canvas']); 
    }

    goHome() {
        this.router.navigate(['/home']); 
    }

    slots: PivotFourSlotsComponent;
    onSlotsReady(slots: PivotFourSlotsComponent) {
        this.slots = slots;
    }

    list: {[name:string]:ColorCardListComponent} = {};
    onListReady(name:string, list: ColorCardListComponent) {
        console.log("SelectionPage.onListReady()", name);
        this.list[name] = list;
    }

    counter: PivotCounterComponent;
    clearCount() {
        if (this.counter) this.counter.clearCount();
    }

    updateCounter() {
        if (this.counter) this.counter.updateCounter();
    }

    onCounterInit(c: PivotCounterComponent) {
        this.counter = c;
    }

}
