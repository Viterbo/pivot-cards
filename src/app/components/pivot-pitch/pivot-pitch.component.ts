import { Component, OnInit, Input, Output, OnChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subject, Subscriber } from 'rxjs';
import { DeckService, Pitch } from 'src/app/services/deck.service';


const MDEO_EXTENT = [-6358249.62941, -4213839.90042, -6226491.30192, -4114146.90629 ];

interface ToiletFeature {
    get(string): any;
    getProperties(): string[];
    getId(): string;
}

@Component({
    selector: 'pivot-pitch',
    templateUrl: "pivot-pitch.component.html",
    styleUrls: ['pivot-pitch.component.scss']
})
export class PivotPitchComponent implements OnInit, OnChanges, OnDestroy {

    @Output() public oninit:Subject<PivotPitchComponent> = new Subject();
    @Input() editable: boolean;
    @ViewChild('setFocusField') setFocusField: ElementRef;

    pitch: string;
    pitch_html: string;
    current: string;
    editting: boolean;
    private onPitchSubscriber: Subscriber<Pitch>;


    htmlStr:string;
    constructor(
        public deck: DeckService
    ) {
        this.onPitchSubscriber = new Subscriber<Pitch>(this.handleNewPitch.bind(this));
        this.editting = false;
        this.editable = true;
        setTimeout(_ => {
            this.deck.updatePitch();
        }, 0);
    }
    
    ngOnInit() {
        this.oninit.next(this);
        this.deck.onpitch.subscribe(this.onPitchSubscriber);
    }

    ngOnDestroy() {
        this.onPitchSubscriber.unsubscribe();
    }

    ngOnChanges() {
        if (!this.editting) {
            this.current = this.pitch;
        }
    }

    handleNewPitch(pitch:Pitch) {
        if (!this.editting) {
            this.pitch_html = pitch.html;
            this.pitch = pitch.text;
            this.current = this.pitch;
        }
    }

    startEditting() {
        if (!this.editable) return;
        this.editting = true;
        this.setFocusField.nativeElement.focus();
    }

    endEdition() {
        this.editting = false;
        this.deck.setPitch(this.current);
        console.log("endEdition()", this.editting);
    }

    onTextChange() {
        // console.log("onTextChange()", this.editting);
        // console.log("onTextChange()", this.text);
        // console.log("onTextChange()", this.current);
        
        // if (this.current != this.text) {
        //     // this.dirty = true;
        //     // this.onedit.next(this.current);
        // } else {
        //     // this.dirty = false;
        // }
    }

}