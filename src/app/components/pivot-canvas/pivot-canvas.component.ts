import { Component, OnInit, Input, Output, forwardRef, OnChanges, HostBinding, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { DeckService, Card } from 'src/app/services/deck.service';
import { VpeAbstractComponent } from '../vpe-components.service';
import { ResizeHandler, ResizeEvent } from '../vpe-resize-detector.directive';

@Component({
    selector: 'pivot-canvas',
    templateUrl: "pivot-canvas.component.html",
    styleUrls: ['pivot-canvas.component.scss'],
    providers: [
        {provide: VpeAbstractComponent, useExisting: forwardRef(() => PivotCanvasComponent)}
    ]
})
export class PivotCanvasComponent extends VpeAbstractComponent implements OnInit, OnChanges, ResizeHandler {


    @HostBinding('class') class = 'box';
    @Input() overlapping: boolean = true;
    @Input() description: boolean = true;
    @Output() public onclick:Subject<Card> = new Subject();
    useCanvasExtended: boolean = false;
    
    constructor(
        public deck: DeckService,
        public local: LocalStringsService
    ) {
        super();
        this.useCanvasExtended = true;
        if (this.description == false) {
            this.useCanvasExtended = false;
        }
        // console.log("this.description", this.description);
    }

    onResize(e: ResizeEvent) {
        
    }

    ngOnChanges() {
        console.log("PivotCanvasComponent.description", this.description);
        if (this.description == false) {
            this.useCanvasExtended = false;
        }
        if (this.description == true) {
            this.useCanvasExtended = true;
        }
        if (this.overlapping) {
            this.class = "overlapping";
        } else {
            this.class = "separated";
        }
    }

    ngOnInit() {
        
    }

    _click(card:Card) {
        this.onclick.next(card);
    }

}