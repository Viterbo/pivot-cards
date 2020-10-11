import { Component, HostBinding } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService, Deck, Card } from 'src/app/services/deck.service';
import { CardSlotComponent } from 'src/app/components/card-slot/card-slot.component';
import { PivotFourSlotsComponent } from 'src/app/components/pivot-four-slots/pivot-four-slots.component';
import { ColorCardListComponent } from 'src/app/components/color-card-list/color-card-list.component';
import { AppService } from 'src/app/services/common/app.service';

@Component({
    selector: 'selection-page',
    templateUrl: 'selection.page.html',
    styleUrls: ['selection.page.scss'],
})
export class SelectionPage {

    page: string = "selection";
    filter_color: string;
    availables_filtered: Deck;
    selection_filtered: Deck;
    // private onToiletSelectedSubscriber: Subscriber<any>;
    
    constructor(
        public router: Router,
        public deck: DeckService,
        public app: AppService
    ) {
        // this.availables_filtered = [];
        // this.selection_filtered = [];
        // this.filterColor('all');
        this.onEnterPage();

        this.router.events.subscribe((val) => {
            console.log(val instanceof NavigationEnd, val);
            if (val instanceof NavigationEnd) {
                let nav = <NavigationEnd>val;
                if (nav.url = "/selection") {
                    this.onEnterPage();
                }
            }
        });
    }

    onEnterPage() {
        console.log("SelectionPage.onEnterPage()");
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
        this.list[name] = list;
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
