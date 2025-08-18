import { TestBed, tick } from '@angular/core/testing';

import { CartItem, CartService } from './cart.service';
import { AlertService } from './alert.service';
import { HttpClient } from '@angular/common/http';
import { delay, of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;
  let alertServiceMock = jasmine.createSpyObj('AlertService', ['openAlert']);
  const mockCartItems: CartItem[] = [
    {
      "id": "56c55b58-d08b-4563-bfe1-af0e4e6f31cc",
      "collectionItem": "courses",
      "itemId": 4,
      "price": 130000,
      "quantity": 1,
      "type": "class",
      "name": "Pilates Core"
    },
    {
      "id": "56c55h28-d88b-4561-bfe1-af0e4e6f31cc",
      "collectionItem": "courses",
      "itemId": 6,
      "price": 80000,
      "quantity": 2,
      "type": "class",
      "name": "Zumba Extreme"
    },
  ];

  beforeEach(() => {
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem');
    TestBed.configureTestingModule({
      providers: [
        { provide: AlertService, useValue: alertServiceMock },
        {
          provide: HttpClient, useValue: {
            post: (url: string, body: any) => {
              if (url == "/api/users/product") {
                return of([]);
              }
              return of([true]).pipe(delay(125));
            }
          }
        }
      ]
    });
    service = TestBed.inject(CartService);
    service.list = [];
    localStorage.clear();
  });

  it('debe crear el servicio de Cart', () => {
    expect(service).toBeTruthy();
  });

  it('debería inicializar con una lista vacia', () => {
    expect(service.list).toEqual([]);
    expect(service.list.length).toEqual(0);
  })

  it("debería reescribir el contenido con set list", () => {

    service.list = mockCartItems;

    expect(service.list.length).toEqual(2);
    expect(service.list[0].name).toBe("Pilates Core");
  })

  it('debería cargar la lista vacía si el localStorage no tiene data', () => {
    (localStorage.getItem as jasmine.Spy).and.returnValue(null);

    const result = service.list;

    expect(localStorage.getItem).toHaveBeenCalledWith("cart");
    expect(result).toEqual([]);
  })

  it("debería guardar en localStorage al reescribir el contenido", () => {

    service.list = mockCartItems;

    expect(service.list.length).toEqual(2);
    expect(service.list[0].name).toBe("Pilates Core");

    expect(localStorage.setItem).toHaveBeenCalled();

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'cart',
      JSON.stringify(mockCartItems)
    )
  })

  it("debería añadir un item a la lista si se usa addItem", () => {
    service.addItem(mockCartItems[0]);

    expect(service.count).toEqual(1);
    expect(service.list[0].name).toBe("Pilates Core");
  })

  it("debería aumentar la cantidad de un item si ya esta en la lista y se usa addItem", () => {
    service.addItem({ ...mockCartItems[0] });

    expect(service.count).toEqual(1);
    expect(service.list[0].quantity).toEqual(1);

    service.addItem({ ...mockCartItems[0] });
    expect(service.count).toEqual(1);
    console.log("Servicio de salida", service.list);

    expect(service.list[0].quantity).toEqual(2);

  })

  it("debería retornar el total de items del carrito", () => {
    service.list = mockCartItems;
    // Son 3 porque cuenta también los del quantity
    expect(service.count).toEqual(3);
  })

  it("debería retornar el precio total del carrito", () => {
    service.list = mockCartItems;
    expect(service.total).toEqual(290000);
  })


  // it('debe traer la información de localStorage si la hay', () => {
  //   spyOn(localStorage, 'setItem');

  //   const testCartItems = `[{
  //   "id": "56c55b58-d08b-4563-bfe1-af0e4e6f31cc",
  //   "collectionItem": "courses",
  //   "itemId": 4,
  //   "price": 130000,
  //   "quantity": 1,
  //   "type": "class",
  //   "name": "Pilates Core"
  //   }]`

  //   localStorage.setItem('cart', testCartItems);

  //   expect(localStorage.setItem).toHaveBeenCalledWith('cart', testCartItems);

  //   expect(service.count).toBe(1);
  // })

});
