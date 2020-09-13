import { Component, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DeckService } from 'src/app/services/deck.service';
import { Subject } from 'rxjs';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

/** @title Input with a custom ErrorStateMatcher */
@Component({
    selector: 'pivot-industria-input',
    templateUrl: './pivot-industria-input.component.html',
    styleUrls: ['./pivot-industria-input.component.scss'],
})
export class PivotIndustriaInputComponent implements OnInit {

    @Output() public onInit:Subject<PivotIndustriaInputComponent> = new Subject();
    @ViewChild('setFocusField') setFocusField: ElementRef;
    
    ctrl = new FormControl('', [
        Validators.required,
    ]);

    matcher = new MyErrorStateMatcher();

    constructor(public deck: DeckService) {
        
    }

    ngOnInit() {
        // deck
        this.onInit.next(this);
        // this.onChange.next(null);
    }

    showErrors() {
        this.setFocusField.nativeElement.focus();
        this.ctrl.markAsTouched();
        this.ctrl.updateValueAndValidity();
    }

    onValueChange(e) {
        console.log("PivotIndustriaInputComponent.onValueChange()", this.ctrl);
    }
}
