import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShoppingListsPage } from './shopping-lists.page';

describe('ShoppingListsPage', () => {
    let component: ShoppingListsPage;
    let fixture: ComponentFixture<ShoppingListsPage>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShoppingListsPage],
            imports: [IonicModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(ShoppingListsPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
