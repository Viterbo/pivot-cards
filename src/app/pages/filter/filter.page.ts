import { Component, ElementRef, HostBinding, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber, Subscription } from 'rxjs';
import { DeckService, Card, Deck } from 'src/app/services/deck.service';
import { VpeAppPage, AppService, OnEnterPageHandler } from 'src/app/services/common/app.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ColorCardListComponent } from 'src/app/components/color-card-list/color-card-list.component';
import { PivotCounterComponent } from 'src/app/components/pivot-counter/pivot-counter.component';
import { LocalStringsService } from 'src/app/services/common/common.services';

@Component({
    selector: 'filter-page',
    templateUrl: 'filter.page.html',
    styleUrls: ['filter.page.scss'],
})
export class FilterPage implements VpeAppPage, OnDestroy {


    answers:string[];
    render_selectors:boolean;
    constructor(
        public router: Router,
        public deck: DeckService,
        public app: AppService,
        public fb: FormBuilder,
        public elementRef: ElementRef,
        public local: LocalStringsService,

    ) {
        this.clearAnswers();
    }

    // Page common code block -------
    onResizeSuscriber: Subscriber<any> = null;
    page: OnEnterPageHandler;
    path: RegExp = /\/filter/i;
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
        console.log("FilterPage.onenterPage()");
        this.clearAll();
    }
    // --------------------------------
    

    get showGoToCanvas() {
        return this.enoughAnswers() && this.deck.isSelectionOK();
    }

    goToCanvas() {
        this.router.navigate(['/canvas']); 
    }

    onSelectionChange(index:number, e) {
        console.log("onSelectionChange()", index, e);
        this.answers[index] = e.value;
        this.updateFilteredCards();
    }

    updateFilteredCards() {
        this.deck.resetSelection();
        let filtered:Deck = this.deck.filterCards(this.answers);
        for (let c in filtered) {
            let card = filtered[c];
            this.deck.selectCard(card);
        }
        this.updateCounter();
    }

    debug(e) {
        console.log("debug:", e);
    }

    clearAll() {
        this.clearAnswers();
        this.clearCount();
        this.deck.resetSelection();
        this.deck.resetCanvas();
        this.deck.refreshFilters();
    }

    onCardClick(card:Card) {
        console.log("PivotDeckComponent.onCardClick()", card, "NO HACEMOS NADA....");
        /*
        setTimeout(_ => {
            if (this.deck.isCardSelected(card)) {
                this.deck.deselectCard(card);
            } else {
                this.deck.selectCard(card);
            }

            for (let name in {red:!!0,blue:!!0,green:!!0,yellow:!!0}) {
                if (this.list[name]) {
                    this.list[name].update();
                }                
            }
            
            this.updateCounter();
            
        });
        */
    }


    list: {[name:string]:ColorCardListComponent} = {};
    onListReady(name:string, list: ColorCardListComponent) {
        this.list[name] = list;
    }

    private clearAnswers() {
        this.answers = [null, null, null, null];
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


    enoughAnswers(): boolean {
        let counter = 0;
        if (this.answers[0]) counter++; 
        if (this.answers[1]) counter++; 
        if (this.answers[2]) counter++; 
        if (this.answers[3]) counter++; 
        return counter >= 3; 
    }
}
