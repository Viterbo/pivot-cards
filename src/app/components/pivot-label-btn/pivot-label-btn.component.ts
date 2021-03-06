import { Component, OnInit, Input, Output, forwardRef, OnChanges, HostBinding, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStringsService } from 'src/app/services/common/common.services';
import { DeckService, Card } from 'src/app/services/deck.service';
import { VpeAbstractComponent } from '../vpe-components.service';
import { ResizeHandler, ResizeEvent } from '../vpe-resize-detector.directive';

@Component({
    selector: 'pivot-label-btn',
    templateUrl: "pivot-label-btn.component.html",
    styleUrls: ['pivot-label-btn.component.scss']
})
export class PivotLabelBtnComponent extends VpeAbstractComponent implements OnInit, OnChanges {

    @Input() color: string;
    @Input() label: string;
    @Input() texto: string;
    constructor(
        public elem: ElementRef,
        public local: LocalStringsService
    ) {
        super();
        this.local.onLocalChange.subscribe(key => {
            this.init();
        })
    }

    init() {
        console.log("PivotLabelBtnComponent.init()", this.color);
        switch(this.color) {
            case "red": this.label = this.local.string.what; break;
            case "blue": this.label = this.local.string.who; break;
            case "green": this.label = this.local.string.how; break;
            case "yellow": this.label = this.local.string.howmuch; break;
        }
    }

    ngOnChanges() {
        this.init();
    }

    ngOnInit() {
        this.init();
    }

    click() {
        console.log("PivotLabelBtnComponent.click()", this.color);
    }


}