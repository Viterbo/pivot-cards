import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PivotCardComponent } from './pivot-card/pivot-card.component';
import { PivotDeckComponent } from './pivot-deck/pivot-deck.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        PivotCardComponent,
        PivotDeckComponent
    ],
    entryComponents: [
    ],
    providers: [
        
    ],
    exports: [
        PivotCardComponent,
        PivotDeckComponent
    ]
})
export class PivotComponentsModule {}
