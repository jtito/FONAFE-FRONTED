import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MainBoardComponent} from './main-board.component';

const routes: Routes = [
  {
    path: '',
    component: MainBoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MainBoardRoutingModule {}
