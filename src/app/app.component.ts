import { Component, HostListener, HostBinding } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppService } from './services/common/app.service';
import { VpeComponentsService } from './components/vpe-components.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

    @HostBinding('class') class = 'box';
    
    constructor(
        public app: AppService,
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private components: VpeComponentsService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.app.init("v1.0.0");
        });

        this.app.onWindowResize.subscribe(d => {
            this.components.windowHasResized(d);
        });
        this.onWindowsResize();
    }

    @HostListener('window:resize')
    onWindowsResize() {
        // console.log("onWindowsResize(event)");
        this.app.onWindowsResize();
        this.class = this.app.device.class;
    }


    
}
