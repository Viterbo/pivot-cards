import { Component, OnInit, Input, Output, forwardRef, OnChanges, HostBinding, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { DeckService, Card } from 'src/app/services/deck.service';
import { VpeAbstractComponent } from '../vpe-components.service';
import { ResizeHandler, ResizeEvent } from '../vpe-resize-detector.directive';

@Component({
    selector: 'pivot-card',
    templateUrl: "pivot-card.component.html",
    styleUrls: ['pivot-card.component.scss'],
    providers: [
        {provide: VpeAbstractComponent, useExisting: forwardRef(() => PivotCardComponent)}
    ]
})
export class PivotCardComponent extends VpeAbstractComponent implements OnInit, OnChanges, ResizeHandler {

    auxiliar: Card;
    @Input() card: Card;
    @Input() description: boolean = true;
    @Output() public onclick:Subject<Card> = new Subject();
    //show_desc: boolean;
    @HostBinding('class.full-card') show_desc: boolean = false;
    
    maxdesc: string = "Modelo de negocio fuertemente asociado a los juegos y aplicaciones en el que los usuarios pueden comprar productos virtuales a través de micropagos, proporcionando una fuente de ingresos para los desarrolladores.";

    constructor(
        public service: DeckService,
        public elem: ElementRef,
        public local: LocalStringsService,
    ) {
        super();
        this.show_desc = true;
        if (this.description == false) {
            this.show_desc = false;
        }

        // console.log("this.description", this.description);
    }

    get color() {
        if (this.card) return this.card.color; 
        return "default";
    }

    onResize(e: ResizeEvent) {
        //console.log("PivotCardComponent.onResize()", e);
    }

    ngOnChanges() {
        console.log("PivotCardComponent.description", this.description);
        if (this.description == false) {
            this.show_desc = false;
        }
        if (this.description == true) {
            this.show_desc = true;
        }
        this.auxiliar = this.card;
    }

    ngOnInit() {
        
    }

    _click() {
        console.log("PivotCardComponent._click()", [this.card]);
        this.onclick.next(this.card);
    }

    changeAuxiliar() {
        console.log("PivotCardComponent.changeAuxiliar()", [this.auxiliar]);
        if (this.auxiliar) {
            this.auxiliar = this.service.deck.filter(c => parseInt(this.auxiliar.card) < parseInt(c.card))[0];
            if (!this.auxiliar) {
                this.auxiliar = this.service.deck[0];
            }
        } else {
            this.auxiliar = this.service.deck[0];
        }
    }

}