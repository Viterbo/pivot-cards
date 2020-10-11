import { Component, HostBinding, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService, Card, Deck } from 'src/app/services/deck.service';
import { AppPage, AppService } from 'src/app/services/common/app.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ColorCardListComponent } from 'src/app/components/color-card-list/color-card-list.component';

@Component({
    selector: 'filter-page',
    templateUrl: 'filter.page.html',
    styleUrls: ['filter.page.scss'],
})
export class FilterPage implements AppPage, OnDestroy {

    public path: RegExp = /\/filter/i;
    page: AppPage;
    answers:string[];
    render_selectors:boolean;
    constructor(
        public router: Router,
        public deck: DeckService,
        public app: AppService,
        public fb: FormBuilder

    ) {
        this.app.subscribeOnEnterPage(this);
    }

    get showGoToCanvas() {
        return this.deck.isSelectionOK();
    }

    onEnterPage() {
        if (this.app.prev_path == "/canvas") return;
        console.log("FilterPage.onenterPage()");
        this.clearAll();
    }


    ngOnDestroy() {
        this.app.unsubscribeOnEnterPage(this);
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
        console.debug("PivotDeckComponent.onCardClick()", card);
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
    }


    list: {[name:string]:ColorCardListComponent} = {};
    onListReady(name:string, list: ColorCardListComponent) {
        this.list[name] = list;
    }

    private clearAnswers() {
        this.answers = [null, null, null, null];
    }

    count: {[key:string]:number};
    private clearCount() {
        this.count = {
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
        };
    }

    private async updateCounter() {
        await this.deck.waitLoaded;
        this.clearCount();
        this.count.red = this.deck.filterColor('red', this.deck.selection).length;
        this.count.blue = this.deck.filterColor('blue', this.deck.selection).length;
        this.count.green = this.deck.filterColor('green', this.deck.selection).length;
        this.count.yellow = this.deck.filterColor('yellow', this.deck.selection).length;
    }
    

}
