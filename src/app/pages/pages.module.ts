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
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Angular-Material ----------------------------------
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
// Angular-Material ----------------------------------



@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        IonicModule,
        CommonModule,
        CommonServicesModule,
        PivotComponentsModule,
        // Angular-Material ----------------------------------
        MatCardModule, 
        MatButtonModule, 
        MatMenuModule, 
        MatToolbarModule, 
        MatIconModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule        
        // Angular-Material ----------------------------------
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
        WelcomePage,
        // Angular-Material ----------------------------------
        MatCardModule, 
        MatButtonModule, 
        MatMenuModule, 
        MatToolbarModule, 
        MatIconModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule        
        // Angular-Material ----------------------------------
    ]
})
export class PagesModule {}
