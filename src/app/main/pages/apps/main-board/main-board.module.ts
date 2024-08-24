import {NgModule} from '@angular/core';
import {MainBoardComponent} from './main-board.component';
import {MainBoardRoutingModule} from './main-board-routing.module';

@NgModule({
  imports: [
    MainBoardRoutingModule
  ],
  declarations: [MainBoardComponent]
})

export class MainBoardModule {}
