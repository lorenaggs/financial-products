import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient} from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [ provideHttpClient()],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have title as 'financial-products'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('financial-products');
  });

  it('should contain a RouterOutlet directive', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).not.toBeNull();
  });

  it('should contain the ProductsComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const productsComponent = fixture.nativeElement.querySelector('app-products');
    expect(productsComponent).not.toBeNull();
  });
});
