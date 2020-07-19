import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasPage } from './canvas/canvas.page';
import { FilterPage } from './filter/filter.page';
import { HomePage } from './home/home.page';
import { PrintPage } from './print/print.page';
import { SelectionPage } from './selection/selection.page';
import { SlotsPage } from './slots/slots.page';
import { WelcomePage } from './welcome/welcome.page';
import { PivotComponentsModule } from '../components/components.module';
import { CommonServicesModule } from '../services/common/common.module';

@NgModule({
    imports: [
        CommonModule,
        CommonServicesModule,
        PivotComponentsModule
    ],
    declarations: [
        CanvasPage,
        FilterPage,
        HomePage,
        PrintPage,
        SelectionPage,
        SlotsPage,
        WelcomePage
    ],
    entryComponents: [
    ],
    providers: [
        
    ],
    exports: [
        CanvasPage,
        FilterPage,
        HomePage,
        PrintPage,
        SelectionPage,
        SlotsPage,
        WelcomePage
    ]
})
export class PagesModule {}
