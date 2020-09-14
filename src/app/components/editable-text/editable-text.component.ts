import { Component, OnInit, Input, Output, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';


const MDEO_EXTENT = [-6358249.62941, -4213839.90042, -6226491.30192, -4114146.90629 ];

interface ToiletFeature {
    get(string): any;
    getProperties(): string[];
    getId(): string;
}

@Component({
    selector: 'editable-text',
    templateUrl: "editable-text.component.html",
    styleUrls: ['editable-text.component.scss']
})
export class EditableTextComponent implements OnInit, OnChanges {

    @Output() public oninit:Subject<EditableTextComponent> = new Subject();
    @Output() public onedit:Subject<string> = new Subject();
    @Input() text: string;
    @ViewChild('setFocusField') setFocusField: ElementRef;
    current: string;
    editting: boolean;
    constructor(
        
    ) {
        this.editting = false;
    }
    
    ngOnInit() {
        this.oninit.next(this);
    }

    ngOnChanges() {
        if (!this.editting) {
            this.current = this.text;
        }
    }

    startEditting() {
        this.editting = true;
        this.setFocusField.nativeElement.focus();
    }

    endEdition() {
        this.editting = false;
        this.onedit.next(this.current);
    }

    onTextChange() {
        // console.log("onTextChange()", this.editting);
        // console.log("onTextChange()", this.text);
        // console.log("onTextChange()", this.current);
        
        if (this.current != this.text) {
            // this.dirty = true;
            // this.onedit.next(this.current);
        } else {
            // this.dirty = false;
        }
    }

}