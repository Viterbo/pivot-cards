import { Component, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { DeckService } from 'src/app/services/deck.service';

@Component({
    selector: 'canvas-page',
    templateUrl: 'canvas.page.html',
    styleUrls: ['canvas.page.scss'],
})
export class CanvasPage {

    page: string = "canvas";
    toilet_card_fade:string;
    // private onToiletSelectedSubscriber: Subscriber<any>;
    
    constructor(
        public router: Router,
        public deck: DeckService,
    ) {
        this.toilet_card_fade = "";
        // this.onToiletSelectedSubscriber = new Subscriber<any>(this.onToiletSelected.bind(this));
    }

    ngOnInit() {
        // this.toilets.onSelected.subscribe(this.onToiletSelectedSubscriber);
    }

    ngOnDestroy() {
        // this.onToiletSelectedSubscriber.unsubscribe();
    }

    back() {
        window.history.back();
    }

    print() {
        alert("Imprimir hoja A4 con canvas y pitch")
    }

    goHome() {
        this.router.navigate(['/home']);
    }
    
}
